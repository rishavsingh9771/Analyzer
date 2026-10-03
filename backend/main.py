import os
import uuid
import json
from typing import Optional
from fastapi import FastAPI, UploadFile, File, Form, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv

from services.parser import extract_text_from_pdf, extract_text_from_docx, extract_contact_info
from services.analyzer import analyze_resume, GEMINI_API_KEY
from services.bullet_improver import improve_bullet_point
from services.db import (
    init_db,
    save_analysis,
    get_all_analyses,
    get_analysis_by_id,
    delete_analysis_by_id,
    get_user_profile,
    update_user_profile
)
from samples.sample_data import SAMPLE_RESUMES, SAMPLE_JOB_DESCRIPTIONS

load_dotenv()

app = FastAPI(
    title="ResumeIQ API",
    description="AI-powered Resume Analyzer and ATS Coach API",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def on_startup():
    await init_db()

class ImproveBulletRequest(BaseModel):
    bullet: str
    target_role: Optional[str] = "Software Developer"

class UpdateProfileRequest(BaseModel):
    name: str
    email: str
    target_role: str

@app.get("/api/health")
async def health():
    return {
        "status": "healthy",
        "ai_configured": bool(GEMINI_API_KEY),
        "active_model": "gemini-3.6-flash" if GEMINI_API_KEY else "demo-mode"
    }

@app.get("/api/samples")
async def get_samples():
    return {
        "resumes": [
            {
                "id": key,
                "filename": val["filename"],
                "size": val["size"],
                "name": val["name"],
                "preview": val["text"][:300] + "..."
            }
            for key, val in SAMPLE_RESUMES.items()
        ],
        "job_descriptions": [
            {
                "id": key,
                "title": val["title"],
                "company": val["company"],
                "text": val["text"]
            }
            for key, val in SAMPLE_JOB_DESCRIPTIONS.items()
        ]
    }

@app.post("/api/analyze")
async def analyze_endpoint(
    resume_file: Optional[UploadFile] = File(None),
    resume_text: Optional[str] = Form(None),
    sample_resume_id: Optional[str] = Form(None),
    job_description: Optional[str] = Form(None),
    job_title: Optional[str] = Form(None)
):
    cleaned_jd = job_description.strip() if job_description else ""
    has_custom_jd = len(cleaned_jd) >= 20

    filename = "Resume.pdf"
    file_size_str = "1.0 MB"
    raw_text = ""
    file_type = "pdf"

    if sample_resume_id and sample_resume_id in SAMPLE_RESUMES:
        sample = SAMPLE_RESUMES[sample_resume_id]
        raw_text = sample["text"]
        filename = sample["filename"]
        file_size_str = sample["size"]
    elif resume_file:
        filename = resume_file.filename or "Uploaded_Resume.pdf"
        ext = filename.split(".")[-1].lower()
        if ext not in ["pdf", "docx"]:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Unable to read this file. Please upload a valid PDF or DOCX resume."
            )

        content = await resume_file.read()
        if len(content) == 0:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="The uploaded file is empty. Please select a valid resume document."
            )
        if len(content) > 10 * 1024 * 1024:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="File size exceeds 10MB limit. Please upload a smaller document."
            )

        file_size_str = f"{round(len(content) / (1024 * 1024), 1)} MB" if len(content) >= 1024*1024 else f"{round(len(content) / 1024)} KB"

        try:
            if ext == "pdf":
                parsed = extract_text_from_pdf(content)
                raw_text = parsed["text"]
                file_type = "pdf"
            else:
                parsed = extract_text_from_docx(content)
                raw_text = parsed["text"]
                file_type = "docx"
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Unable to parse file: {str(e)}"
            )
    elif resume_text and len(resume_text.strip()) > 30:
        raw_text = resume_text.strip()
        filename = "Pasted_Resume.txt"
        file_size_str = f"{len(raw_text.encode('utf-8')) // 1024} KB"
    else:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Please upload a PDF or DOCX resume, or select a sample resume."
        )

    if not raw_text or len(raw_text.strip()) < 50:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Could not extract sufficient text from your resume. Please ensure it contains readable text."
        )

    contact_info = extract_contact_info(raw_text)

    # Determine role title
    detected_job_title = job_title
    if not detected_job_title:
        if has_custom_jd:
            lines = cleaned_jd.splitlines()
            for line in lines[:5]:
                if any(role_kw in line.lower() for role_kw in ["role:", "title:", "engineer", "developer", "analyst", "manager"]):
                    cleaned = line.replace("Role:", "").replace("Title:", "").strip()
                    if len(cleaned) < 50:
                        detected_job_title = cleaned
                        break
        if not detected_job_title:
            # Infer from resume text
            resume_lower = raw_text.lower()
            if "frontend" in resume_lower or "react" in resume_lower:
                detected_job_title = "Frontend / Full Stack Developer"
            elif "data scientist" in resume_lower or "machine learning" in resume_lower:
                detected_job_title = "Data Scientist"
            elif "backend" in resume_lower or "python" in resume_lower or "java" in resume_lower:
                detected_job_title = "Software Developer"
            else:
                detected_job_title = "Software Developer"

    # Default display JD text for side-by-side benchmark if user left it blank
    effective_jd = cleaned_jd if has_custom_jd else """Industry Benchmark: Software Developer Criteria
• Core technical proficiency in modern programming languages (C++, Java, Python, JavaScript, TypeScript).
• Experience designing and integrating RESTful web APIs and database queries (SQL / NoSQL).
• Familiarity with version control workflows (Git / GitHub) and collaborative engineering practices.
• Practical understanding of containerization (Docker), cloud infrastructure (AWS/GCP), and CI/CD pipelines.
• Clean reverse-chronological layout, readable typography, and quantified impact metrics in bullet points."""

    analysis_result = await analyze_resume(raw_text, cleaned_jd if has_custom_jd else None, filename)

    analysis_id = str(uuid.uuid4())
    payload = {
        "id": analysis_id,
        "resume_filename": filename,
        "file_size": file_size_str,
        "file_type": file_type,
        "candidate_name": contact_info.get("name") or "Candidate",
        "candidate_email": contact_info.get("email"),
        "candidate_phone": contact_info.get("phone"),
        "job_title": detected_job_title,
        "job_description": effective_jd,
        "has_custom_jd": has_custom_jd,
        "resume_text": raw_text,
        **analysis_result
    }

    await save_analysis(
        analysis_id=analysis_id,
        resume_filename=filename,
        job_title=f"{detected_job_title} (General Audit)" if not has_custom_jd else detected_job_title,
        ats_score=payload.get("ats_score", 80),
        job_match=payload.get("job_match", 80),
        full_data=payload
    )

    return payload

@app.post("/api/improve-bullet")
async def improve_bullet_endpoint(req: ImproveBulletRequest):
    if not req.bullet or len(req.bullet.strip()) < 5:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Please enter a valid bullet point to improve."
        )
    result = await improve_bullet_point(req.bullet, req.target_role or "Software Developer")
    return result

@app.get("/api/history")
async def history_list():
    items = await get_all_analyses()
    return {"analyses": items}

@app.get("/api/history/{analysis_id}")
async def history_detail(analysis_id: str):
    data = await get_analysis_by_id(analysis_id)
    if not data:
        raise HTTPException(status_code=404, detail="Analysis record not found.")
    return data

@app.delete("/api/history/{analysis_id}")
async def history_delete(analysis_id: str):
    success = await delete_analysis_by_id(analysis_id)
    if not success:
        raise HTTPException(status_code=404, detail="Record not found or already deleted.")
    return {"status": "deleted", "id": analysis_id}

@app.get("/api/profile")
async def profile_endpoint():
    return await get_user_profile()

@app.put("/api/profile")
async def update_profile_endpoint(req: UpdateProfileRequest):
    await update_user_profile(req.name, req.email, req.target_role)
    return {"status": "updated", "profile": await get_user_profile()}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
