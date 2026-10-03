import os
import re
import json
from typing import Dict, Any
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

GEMINI_API_KEY = os.getenv('GEMINI_API_KEY', '')
if GEMINI_API_KEY:
    try:
        genai.configure(api_key=GEMINI_API_KEY)
    except Exception:
        pass

BULLET_SYSTEM_PROMPT = """You are an expert resume writer and ATS optimization specialist.
Your goal is to improve an individual resume bullet point.
CRITICAL RULES:
1. Never invent experience, achievements, metrics, certifications, or skills not mentioned by the candidate.
2. If a metric is unavailable, suggest adding a metric placeholder like '[Add metric: e.g., improved load time by X%]' rather than fabricating fake numbers.
3. Start with a strong action verb (e.g., Developed, Architected, Engineered, Optimized, Orchestrated, Spearheaded).
4. Frame the bullet in the Google XYZ formula: 'Accomplished [X], as measured by [Y], by doing [Z]'.

Return ONLY a valid JSON object with:
{
  "improved": "Strong improved version of bullet point with metric prompt if applicable",
  "rationale": "Why this version is stronger for ATS and recruiters",
  "action_verb": "The primary strong verb used",
  "metric_suggestion": "Guidance on what real metric the user can insert from their own project/job"
}
"""

def mock_improve_bullet(bullet: str, target_role: str = "Software Developer") -> Dict[str, Any]:
    """Local intelligent fallback for improving resume bullet points."""
    cleaned = bullet.strip()
    
    weak_verbs = {
        "made": "Developed",
        "worked on": "Engineered",
        "helped": "Collaborated to build",
        "did": "Executed",
        "handled": "Managed and optimized",
        "responsible for": "Spearheaded"
    }
    
    improved_text = cleaned
    chosen_verb = "Developed"
    for weak, strong in weak_verbs.items():
        if re.search(rf'\b{weak}\b', cleaned, re.IGNORECASE):
            improved_text = re.sub(rf'\b{weak}\b', strong, cleaned, flags=re.IGNORECASE)
            chosen_verb = strong
            break

    if not any(token in improved_text for token in ["%", "x", "users", "latency", "seconds", "hours"]):
        improved_text = f"{improved_text} [Add metric: e.g. reducing latency by X% or serving Y active users]"

    return {
        "improved": improved_text,
        "rationale": f"Replaced passive language with high-impact verb '{chosen_verb}', refined technical clarity, and added guidance for real quantified business impact.",
        "action_verb": chosen_verb,
        "metric_suggestion": "Insert a real metric: e.g., query execution time, daily active users, deployment frequency, or test coverage %."
    }

async def improve_bullet_point(bullet: str, target_role: str = "Software Developer") -> Dict[str, Any]:
    """Improves bullet point using Gemini 3.6 Flash or local fallback."""
    if not GEMINI_API_KEY:
        return mock_improve_bullet(bullet, target_role)

    try:
        model = genai.GenerativeModel('models/gemini-3.6-flash')
        prompt = f"""{BULLET_SYSTEM_PROMPT}

TARGET ROLE: {target_role}
CURRENT BULLET POINT: "{bullet}"
"""
        response = await model.generate_content_async(prompt)
        text_resp = response.text.strip()
        if text_resp.startswith("```"):
            text_resp = re.sub(r"^```(?:json)?\n?", "", text_resp)
            text_resp = re.sub(r"\n?```$", "", text_resp)
        return json.loads(text_resp)
    except Exception as e:
        print(f"Gemini bullet improvement failed ({e}). Using rule-based generator.")
        return mock_improve_bullet(bullet, target_role)
