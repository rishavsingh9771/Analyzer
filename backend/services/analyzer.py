import os
import json
import re
from typing import Dict, Any, List, Optional
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

GEMINI_API_KEY = os.getenv('GEMINI_API_KEY', '')
if GEMINI_API_KEY:
    try:
        genai.configure(api_key=GEMINI_API_KEY)
    except Exception as e:
        print('Warning: Gemini configure error:', e)

SYSTEM_PROMPT_WITH_JD = """You are ResumeIQ, an elite AI Resume and ATS Coach used by top career experts.
Analyze the provided Resume against the target Job Description.
Scoring rules:
- ATS Compatibility Score (0-100 total):
  * Keyword Match: 25% (scored /20)
  * Skills Match: 25% (scored /20)
  * Experience Relevance: 20% (scored /20)
  * Resume Structure: 15% (scored /20)
  * ATS Formatting: 15% (scored /20)
  * Total ATS Score is weighted 0-100.
- Job Match Percentage (0-100%): Direct alignment with JD responsibilities and requirements.
- CRITICAL ANTI-HALLUCINATION RULE: Never invent experience, achievements, metrics, certifications, or skills not supported by the candidate's resume. If a metric is missing in a bullet, use placeholders or instructions like '[Insert % latency reduction]' or '[Add team size]' rather than fabricating fake numbers.

Return ONLY a valid, parseable JSON object with this EXACT structure (no markdown formatting, no other text):
{
  "ats_score": 87,
  "job_match": 89,
  "status": "Excellent",
  "has_custom_jd": true,
  "score_summary": "Your resume is likely to perform well with ATS systems.",
  "score_breakdown": {
    "keywords": {"score": 18, "max": 20, "status": "Good", "feedback": "Strong presence of essential technical terminology."},
    "skills": {"score": 17, "max": 20, "status": "Good", "feedback": "Core tech stack aligns well, missing a few secondary tools."},
    "experience": {"score": 16, "max": 20, "status": "Needs Improvement", "feedback": "Action verbs are good, but bullet points could highlight quantified business outcomes."},
    "structure": {"score": 19, "max": 20, "status": "Excellent", "feedback": "Clear reverse-chronological layout with standard section headers."},
    "formatting": {"score": 17, "max": 20, "status": "Good", "feedback": "Text parser read cleanly. Avoid multi-column grids and complex graphics."}
  },
  "job_match_details": {
    "match_percentage": 89,
    "matched_skills": ["C++", "Java", "SQL", "Git", "REST API", "React"],
    "missing_skills": ["Docker", "AWS", "Microservices"],
    "relevant_experience": ["Backend development", "API development", "Database query optimization"]
  },
  "keyword_analysis": {
    "matched": ["C++", "Java", "SQL", "Git", "REST API", "OOP", "PostgreSQL", "React"],
    "missing": ["Docker", "AWS", "Microservices", "CI/CD"],
    "overused": [
      {"word": "Developed", "count": 4, "suggestion": "Replace with specialized verbs like 'Engineered', 'Architected', or 'Implemented'"},
      {"word": "Responsible", "count": 3, "suggestion": "Replace passive phrases with outcome-focused verbs like 'Spearheaded' or 'Orchestrated'"}
    ],
    "explanation": "Consider replacing repeated words with stronger action verbs to keep recruiter and ATS interest high."
  },
  "section_analysis": {
    "summary": {
      "score": 72,
      "status": "Needs improvement",
      "feedback": "Your summary is generic. Mention your target role, strongest technical skills, and measurable achievements.",
      "suggestion": "Results-driven Software Developer with 2+ years of experience specializing in high-throughput REST APIs and React frontends. Proven track record of optimizing database performance and building responsive web apps."
    },
    "skills": {
      "score": 91,
      "status": "Strong",
      "feedback": "Your technical skills align well with the job description."
    },
    "experience": {
      "score": 76,
      "status": "Needs improvement",
      "feedback": "Several bullet points describe duties rather than measurable results. Use the Action + Context + Quantified Result framework."
    },
    "projects": {
      "score": 84,
      "status": "Good",
      "feedback": "Projects demonstrate relevant technology stack. Adding live demo links and test coverage metrics will further elevate them."
    },
    "education": {
      "score": 95,
      "status": "Excellent",
      "feedback": "Degree, graduation year, and GPA are formatted cleanly and detected without issue."
    }
  },
  "bullet_improvements": [
    {
      "original": "Made a website using React.",
      "improved": "Developed a responsive React-based web application with reusable components and optimized user experience across mobile and desktop devices [Add metric: e.g. improving page load speed by X%].",
      "rationale": "Replaced weak verb 'Made' with 'Developed', added architectural context (reusable components, responsive), and inserted a metric placeholder."
    },
    {
      "original": "Developed and maintained scalable RESTful APIs in Node.js and Java.",
      "improved": "Architected and maintained high-throughput RESTful APIs in Node.js and Java, serving over 150,000 monthly active users with 99.9% uptime.",
      "rationale": "Elevated verb to 'Architected' and emphasized scale and reliability."
    }
  ],
  "ats_formatting_health": {
    "passes": [
      "Standard section headings (Summary, Skills, Experience, Education)",
      "Readable standard typography",
      "Proper contact information (Email, Phone, LinkedIn, GitHub)",
      "Clean document hierarchy without unparseable text boxes"
    ],
    "warnings": [
      {
        "title": "Multi-column layout risk",
        "description": "Some legacy ATS software parses multi-column resumes left-to-right across columns, mixing up job titles and dates."
      },
      {
        "title": "Icon & symbol fonts",
        "description": "Decorative icons used for phone or email bullets may be converted into garbage characters by older parser engines."
      }
    ]
  },
  "top_recommendations": [
    {"priority": "High", "title": "Add Docker and AWS to skills", "description": "The job description explicitly mentions containerization and cloud infrastructure. If you have coursework or side-project experience, highlight it."},
    {"priority": "High", "title": "Rewrite professional summary", "description": "Target the role directly and highlight 2-3 specific technical competencies and career accomplishments."},
    {"priority": "Medium", "title": "Add measurable results to project descriptions", "description": "Incorporate quantified metrics such as request latency, user scale, test coverage, or throughput."},
    {"priority": "Medium", "title": "Replace repeated action verbs", "description": "Diversify verbs like 'Developed' and 'Responsible' with impactful terms like 'Engineered', 'Optimized', and 'Delivered'."},
    {"priority": "Low", "title": "Improve keyword density for Microservices", "description": "Incorporate distributed systems or microservices architecture keywords where relevant in your work experience."}
  ],
  "simulator_items": [
    {"id": "sim_keywords", "title": "Add missing keywords (Docker, AWS, Microservices)", "impact": 5, "default_checked": false},
    {"id": "sim_summary", "title": "Rewrite summary with target role and achievements", "impact": 4, "default_checked": false},
    {"id": "sim_bullets", "title": "Add quantified metrics to 3 project bullets", "impact": 6, "default_checked": false},
    {"id": "sim_format", "title": "Eliminate multi-column and non-standard glyphs", "impact": 3, "default_checked": false}
  ]
}
"""

SYSTEM_PROMPT_STANDALONE = """You are ResumeIQ, an elite AI Resume and ATS Coach used by top career experts.
Analyze the provided Resume independently (no specific Job Description provided).
Perform a General ATS Compatibility & Skills Health Audit:
- Infer the candidate's primary domain/target job title (e.g. Software Developer, Frontend Engineer, Data Analyst, etc.).
- Evaluate whether their listed skills are industry-standard, well-categorized, and modern.
- Identify complementary in-demand skills (recommended skills) that would significantly boost their profile.
- Audit resume structure, contact information completeness, section quality, action verbs, and ATS formatting health.
- Provide Google XYZ improvements for weak bullet points.
- Calculate an overall ATS Compatibility Score (0-100) based on industry best practices.
- CRITICAL ANTI-HALLUCINATION RULE: Never invent experience, achievements, metrics, certifications, or skills not supported by the candidate's resume. Use metric placeholders like '[Add metric: e.g. improved latency by X%]'.

Return ONLY a valid, parseable JSON object matching the exact structure:
{
  "ats_score": 85,
  "job_match": 86,
  "status": "Good",
  "has_custom_jd": false,
  "inferred_role": "Software Developer",
  "score_summary": "Your resume was evaluated against industry ATS benchmarks. Strong technical foundation detected, with clear opportunities to add in-demand industry skills.",
  "score_breakdown": {
    "keywords": {"score": 17, "max": 20, "status": "Good", "feedback": "Good density of primary programming languages and frameworks."},
    "skills": {"score": 18, "max": 20, "status": "Good", "feedback": "Clean categorization of skills across languages, frameworks, and databases."},
    "experience": {"score": 16, "max": 20, "status": "Needs Improvement", "feedback": "Bullet points demonstrate technical work, but could highlight quantified business results."},
    "structure": {"score": 19, "max": 20, "status": "Excellent", "feedback": "Clear section hierarchy and reverse-chronological layout."},
    "formatting": {"score": 17, "max": 20, "status": "Good", "feedback": "Standard document formatting detected with clean parseable headings."}
  },
  "job_match_details": {
    "match_percentage": 86,
    "matched_skills": ["C++", "Java", "SQL", "Git", "REST API", "React"],
    "missing_skills": ["Docker", "AWS", "CI/CD", "Kubernetes"],
    "relevant_experience": ["Full-stack web application development", "RESTful API engineering", "Database indexing and tuning"]
  },
  "keyword_analysis": {
    "matched": ["C++", "Java", "SQL", "Git", "REST API", "OOP", "PostgreSQL", "React"],
    "missing": ["Docker", "AWS", "CI/CD", "Microservices"],
    "overused": [
      {"word": "Developed", "count": 4, "suggestion": "Replace with specialized verbs like 'Engineered', 'Architected', or 'Implemented'"},
      {"word": "Responsible", "count": 3, "suggestion": "Replace passive phrases with outcome-focused verbs like 'Spearheaded' or 'Orchestrated'"}
    ],
    "explanation": "Evaluated against in-demand industry skills. Consider adding cloud infrastructure and containerization skills if you have experience with them."
  },
  "section_analysis": {
    "summary": {
      "score": 74,
      "status": "Needs improvement",
      "feedback": "Your summary is clear but could be more impactful by highlighting your target niche and top 2 accomplishments.",
      "suggestion": "Software Developer with 2+ years of experience delivering scalable web services and responsive React applications. Specialized in database query optimization and RESTful API architecture."
    },
    "skills": {
      "score": 90,
      "status": "Strong",
      "feedback": "Your technical skills are well organized into languages, frameworks, and databases."
    },
    "experience": {
      "score": 78,
      "status": "Needs improvement",
      "feedback": "Several bullet points focus on tasks rather than achievements. Add metrics (e.g. latency, user volume, code coverage)."
    },
    "projects": {
      "score": 85,
      "status": "Good",
      "feedback": "Projects showcase modern full-stack development. Adding live demo links and test coverage metrics will further elevate them."
    },
    "education": {
      "score": 95,
      "status": "Excellent",
      "feedback": "Degree, institution, and graduation timeframe are clearly formatted and parsed flawlessly."
    }
  },
  "bullet_improvements": [
    {
      "original": "Made a website using React.",
      "improved": "Developed a responsive React-based web application with reusable components and optimized user experience across mobile and desktop devices [Add metric: e.g. improving page load speed by 25%].",
      "rationale": "Replaced weak verb 'Made' with 'Developed', added architectural context, and included a quantified outcome placeholder."
    },
    {
      "original": "Developed and maintained scalable RESTful APIs in Node.js and Java.",
      "improved": "Architected and maintained high-throughput RESTful APIs in Node.js and Java, serving over 150,000 monthly active users with high availability.",
      "rationale": "Upgraded to high-impact verb 'Architected' and emphasized scale and reliability."
    }
  ],
  "ats_formatting_health": {
    "passes": [
      "Standard section headings detected",
      "Readable typography and standard font families",
      "Essential contact details found (Email, Phone, Profile links)",
      "Clean chronological document structure"
    ],
    "warnings": [
      {
        "title": "Two-column layout risk",
        "description": "Some older ATS tools scan horizontally across columns, potentially intermingling job titles with dates."
      },
      {
        "title": "Icon and non-standard glyphs",
        "description": "Graphics or icon bullet points can cause parsing degradation in legacy recruitment systems."
      }
    ]
  },
  "top_recommendations": [
    {"priority": "High", "title": "Add modern cloud & DevOps skills", "description": "Adding containerization (Docker) or cloud tools (AWS/GCP) to your projects will make your profile significantly more competitive."},
    {"priority": "High", "title": "Quantify bullet points with metrics", "description": "Include measurable metrics (e.g., % latency reduction, daily active users, code coverage) in project and experience descriptions."},
    {"priority": "Medium", "title": "Refine professional summary", "description": "Highlight 2-3 specific technical competencies and career accomplishments in your opening summary."},
    {"priority": "Medium", "title": "Replace repeated action verbs", "description": "Vary repeated words like 'Developed' with verbs like 'Spearheaded', 'Engineered', and 'Automated'."},
    {"priority": "Low", "title": "Ensure GitHub & live project links are active", "description": "Verify that all portfolio links in your contact information are working and up to date."}
  ],
  "simulator_items": [
    {"id": "sim_keywords", "title": "Add in-demand skills (Docker, AWS, CI/CD)", "impact": 5, "default_checked": false},
    {"id": "sim_summary", "title": "Rewrite summary with target role and achievements", "impact": 4, "default_checked": false},
    {"id": "sim_bullets", "title": "Add quantified metrics to 3 project bullets", "impact": 6, "default_checked": false},
    {"id": "sim_format", "title": "Eliminate multi-column and non-standard glyphs", "impact": 3, "default_checked": false}
  ]
}
"""

def create_mock_analysis(resume_text: str, jd_text: Optional[str] = None, filename: str = "Resume.pdf") -> Dict[str, Any]:
    """Generates a high-quality deterministic ATS analysis based on actual text comparison."""
    resume_lower = resume_text.lower()
    has_custom_jd = bool(jd_text and len(jd_text.strip()) >= 20)

    tech_keywords = [
        "c++", "java", "python", "javascript", "typescript", "react", "node.js",
        "sql", "postgresql", "mysql", "mongodb", "docker", "kubernetes", "aws",
        "azure", "gcp", "rest api", "graphql", "microservices", "git", "ci/cd",
        "oop", "agile", "testing", "redis", "linux"
    ]

    if has_custom_jd and jd_text:
        jd_lower = jd_text.lower()
        target_words = [kw for kw in tech_keywords if kw in jd_lower]
        if not target_words:
            target_words = ["react", "javascript", "sql", "git", "rest api", "docker", "aws", "microservices"]
    else:
        # Standard industry benchmark skills pool
        target_words = ["c++", "java", "python", "javascript", "react", "sql", "git", "rest api", "docker", "aws", "ci/cd"]

    matched_kw = [kw.upper() if len(kw) <= 3 else kw.title() for kw in target_words if kw in resume_lower]
    missing_kw = [kw.upper() if len(kw) <= 3 else kw.title() for kw in target_words if kw not in resume_lower]

    match_ratio = len(matched_kw) / max(1, len(target_words))
    job_match = min(98, max(55, int(match_ratio * 100)))

    kw_score = min(20, max(12, int(match_ratio * 20)))
    skills_score = min(20, max(14, int((len(matched_kw) / max(1, len(matched_kw) + len(missing_kw))) * 20)))
    exp_score = 16
    struct_score = 19
    format_score = 17

    ats_score = int((kw_score * 1.25) + (skills_score * 1.25) + (exp_score * 1.0) + (struct_score * 0.75) + (format_score * 0.75))
    ats_score = min(96, max(65, ats_score))

    status = "Excellent" if ats_score >= 85 else ("Good" if ats_score >= 70 else "Needs Improvement")

    summary_text = (
        "Your resume shows strong alignment with the provided Job Description, with clear opportunities to add remaining target skills."
        if has_custom_jd
        else "Your resume was evaluated against industry ATS benchmarks. Strong technical foundation detected, with clear opportunities to add in-demand industry skills."
    )

    return {
        "ats_score": ats_score,
        "job_match": job_match,
        "status": status,
        "has_custom_jd": has_custom_jd,
        "is_demo": True,
        "demo_reason": "Demo Analysis – intelligent local ATS simulation engine active",
        "score_summary": summary_text,
        "score_breakdown": {
            "keywords": {"score": kw_score, "max": 20, "status": "Good", "feedback": f"Detected {len(matched_kw)} critical keywords aligned with industry requirements."},
            "skills": {"score": skills_score, "max": 20, "status": "Good", "feedback": f"Matches core technical competencies. {len(missing_kw)} recommended skills could strengthen profile."},
            "experience": {"score": exp_score, "max": 20, "status": "Needs Improvement", "feedback": "Bullet points demonstrate functional competency. Boost impact with quantified metrics and business results."},
            "structure": {"score": struct_score, "max": 20, "status": "Excellent", "feedback": "Proper reverse-chronological flow and clear heading hierarchy detected."},
            "formatting": {"score": format_score, "max": 20, "status": "Good", "feedback": "Clean character encoding and parseable layout. Minimal layout risk."}
        },
        "job_match_details": {
            "match_percentage": job_match,
            "matched_skills": matched_kw[:6] if matched_kw else ["C++", "Java", "SQL", "Git", "REST API"],
            "missing_skills": missing_kw[:4] if missing_kw else ["Docker", "AWS", "CI/CD"],
            "relevant_experience": ["Backend development", "API architecture", "Database query optimization"]
        },
        "keyword_analysis": {
            "matched": matched_kw if matched_kw else ["C++", "Java", "SQL", "Git", "REST API", "OOP"],
            "missing": missing_kw if missing_kw else ["Docker", "AWS", "Microservices"],
            "overused": [
                {"word": "Developed", "count": max(1, resume_lower.count("developed")), "suggestion": "Replace with impactful action verbs such as 'Architected', 'Engineered', or 'Deployed'."},
                {"word": "Responsible", "count": max(1, resume_lower.count("responsible")), "suggestion": "Swap out passive framing for leadership-oriented phrasing like 'Spearheaded' or 'Owned'."}
            ],
            "explanation": "Evaluated against industry standards. Consider replacing repeated words with stronger action verbs to stand out to both ATS engines and recruiters."
        },
        "section_analysis": {
            "summary": {
                "score": 74,
                "status": "Needs improvement",
                "feedback": "Your summary is clear but could be more impactful by highlighting your target niche and top 2 accomplishments.",
                "suggestion": "Software Developer with proven experience delivering scalable web services and responsive React applications. Expertise in database tuning and API design with demonstrated reduction in system latency."
            },
            "skills": {
                "score": 91,
                "status": "Strong",
                "feedback": "Your technical skills section is well-organized and aligns well with candidate criteria."
            },
            "experience": {
                "score": 76,
                "status": "Needs improvement",
                "feedback": "Several bullet points focus on tasks rather than achievements. Add metrics (e.g. latency, user volume, code coverage)."
            },
            "projects": {
                "score": 84,
                "status": "Good",
                "feedback": "Projects showcase modern full-stack development. Include live deployment links and system scale details."
            },
            "education": {
                "score": 95,
                "status": "Excellent",
                "feedback": "Degree, institution, and graduation timeframe are clearly formatted and parsed flawlessly."
            }
        },
        "bullet_improvements": [
            {
                "original": "Made a website using React.",
                "improved": "Developed a responsive React-based web application with reusable components and optimized user experience across mobile and desktop devices [Add metric: e.g. improving page load speed by 25%].",
                "rationale": "Replaced weak verb 'Made' with 'Developed', added architectural context, and included a quantified outcome placeholder."
            },
            {
                "original": "Developed and maintained scalable RESTful APIs in Node.js and Java.",
                "improved": "Architected and maintained high-throughput RESTful APIs in Node.js and Java, serving over 150,000 monthly active users with high availability.",
                "rationale": "Upgraded to high-impact verb 'Architected' and emphasized scale and reliability."
            }
        ],
        "ats_formatting_health": {
            "passes": [
                "Standard section headings detected",
                "Readable typography and standard font families",
                "Essential contact details found (Email, Phone, Profile links)",
                "Clean chronological document structure"
            ],
            "warnings": [
                {
                    "title": "Two-column layout risk",
                    "description": "Some older ATS tools scan horizontally across columns, potentially intermingling job titles with dates."
                },
                {
                    "title": "Icon and non-standard glyphs",
                    "description": "Graphics or icon bullet points can cause parsing degradation in legacy recruitment systems."
                }
            ]
        },
        "top_recommendations": [
            {"priority": "High", "title": f"Add {missing_kw[0] if missing_kw else 'Docker'} to your skills", "description": "This is one of the most in-demand competencies in modern engineering. Adding it to projects will elevate your profile."},
            {"priority": "High", "title": "Rewrite professional summary", "description": "Tailor your opening statement specifically to your target domain and highlight your top 2 measurable achievements."},
            {"priority": "Medium", "title": "Add measurable results to project descriptions", "description": "Include quantified metrics (e.g., % performance increase, requests/sec, user growth)."},
            {"priority": "Medium", "title": "Replace repeated action verbs", "description": "Vary repeated words like 'Developed' with verbs like 'Spearheaded', 'Engineered', and 'Automated'."},
            {"priority": "Low", "title": "Improve keyword density for cloud architecture", "description": "Highlight containerization, cloud services, and CI/CD pipelines in your project or experience bullets."}
        ],
        "simulator_items": [
            {"id": "sim_keywords", "title": f"Add in-demand skills ({', '.join(missing_kw[:3]) if missing_kw else 'Docker, AWS'})", "impact": 5, "default_checked": false},
            {"id": "sim_summary", "title": "Rewrite summary with target role and achievements", "impact": 4, "default_checked": false},
            {"id": "sim_bullets", "title": "Add quantified metrics to 3 project bullets", "impact": 6, "default_checked": false},
            {"id": "sim_format", "title": "Eliminate multi-column and non-standard glyphs", "impact": 3, "default_checked": false}
        ]
    }

async def analyze_resume(resume_text: str, jd_text: Optional[str] = None, filename: str = "Resume.pdf") -> Dict[str, Any]:
    """Performs full ATS resume analysis using Gemini 3.6 Flash with fallback to Mock ATS engine."""
    has_custom_jd = bool(jd_text and len(jd_text.strip()) >= 20)

    if not GEMINI_API_KEY:
        print("No GEMINI_API_KEY provided. Using Demo Mode.")
        return create_mock_analysis(resume_text, jd_text, filename)

    try:
        model = genai.GenerativeModel('models/gemini-3.6-flash')
        if has_custom_jd and jd_text:
            prompt = f"""{SYSTEM_PROMPT_WITH_JD}

TARGET JOB DESCRIPTION:
{jd_text[:4000]}

CANDIDATE RESUME:
{resume_text[:6000]}
"""
        else:
            prompt = f"""{SYSTEM_PROMPT_STANDALONE}

CANDIDATE RESUME:
{resume_text[:6000]}
"""
        response = await model.generate_content_async(prompt)
        text_resp = response.text.strip()
        
        if text_resp.startswith("```"):
            text_resp = re.sub(r"^```(?:json)?\n?", "", text_resp)
            text_resp = re.sub(r"\n?```$", "", text_resp)
            
        result = json.loads(text_resp)
        result["is_demo"] = False
        result["has_custom_jd"] = has_custom_jd
        return result
    except Exception as err:
        print(f"Gemini API analysis failed ({type(err).__name__}: {str(err)}). Falling back to Demo Mode.")
        fallback = create_mock_analysis(resume_text, jd_text, filename)
        fallback["is_demo"] = True
        fallback["has_custom_jd"] = has_custom_jd
        fallback["demo_reason"] = f"Gemini API fallback: {str(err)[:80]}"
        return fallback
