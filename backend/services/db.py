import aiosqlite
import json
import os
from typing import List, Dict, Any, Optional
from datetime import datetime

DB_PATH = os.path.join(os.path.dirname(os.path.dirname(__file__)), "resumeiq.db")

async def init_db():
    async with aiosqlite.connect(DB_PATH) as db:
        await db.execute("""
            CREATE TABLE IF NOT EXISTS analyses (
                id TEXT PRIMARY KEY,
                resume_filename TEXT NOT NULL,
                job_title TEXT NOT NULL,
                ats_score INTEGER NOT NULL,
                job_match INTEGER NOT NULL,
                created_at TEXT NOT NULL,
                data TEXT NOT NULL
            )
        """)
        await db.execute("""
            CREATE TABLE IF NOT EXISTS profile (
                id INTEGER PRIMARY KEY DEFAULT 1,
                name TEXT NOT NULL,
                email TEXT NOT NULL,
                target_role TEXT NOT NULL,
                updated_at TEXT NOT NULL
            )
        """)
        cursor = await db.execute("SELECT id FROM profile WHERE id = 1")
        row = await cursor.fetchone()
        if not row:
            await db.execute("""
                INSERT INTO profile (id, name, email, target_role, updated_at)
                VALUES (1, 'Rishav Kumar', 'rishav.kumar@example.com', 'Software Developer', ?)
            """, (datetime.now().strftime("%Y-%m-%d %H:%M"),))
        await db.commit()

async def save_analysis(analysis_id: str, resume_filename: str, job_title: str, ats_score: int, job_match: int, full_data: Dict[str, Any]):
    async with aiosqlite.connect(DB_PATH) as db:
        now_str = datetime.now().strftime("%b %d, %Y")
        await db.execute("""
            INSERT OR REPLACE INTO analyses (id, resume_filename, job_title, ats_score, job_match, created_at, data)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        """, (analysis_id, resume_filename, job_title, ats_score, job_match, now_str, json.dumps(full_data)))
        await db.commit()

async def get_all_analyses() -> List[Dict[str, Any]]:
    async with aiosqlite.connect(DB_PATH) as db:
        db.row_factory = aiosqlite.Row
        cursor = await db.execute("SELECT id, resume_filename, job_title, ats_score, job_match, created_at FROM analyses ORDER BY rowid DESC")
        rows = await cursor.fetchall()
        return [dict(r) for r in rows]

async def get_analysis_by_id(analysis_id: str) -> Optional[Dict[str, Any]]:
    async with aiosqlite.connect(DB_PATH) as db:
        db.row_factory = aiosqlite.Row
        cursor = await db.execute("SELECT data FROM analyses WHERE id = ?", (analysis_id,))
        row = await cursor.fetchone()
        if row:
            return json.loads(row["data"])
        return None

async def delete_analysis_by_id(analysis_id: str) -> bool:
    async with aiosqlite.connect(DB_PATH) as db:
        cursor = await db.execute("DELETE FROM analyses WHERE id = ?", (analysis_id,))
        await db.commit()
        return cursor.rowcount > 0

async def get_user_profile() -> Dict[str, Any]:
    async with aiosqlite.connect(DB_PATH) as db:
        db.row_factory = aiosqlite.Row
        cursor = await db.execute("SELECT name, email, target_role, updated_at FROM profile WHERE id = 1")
        prof = await cursor.fetchone()
        
        cursor = await db.execute("SELECT COUNT(*), AVG(ats_score), MAX(ats_score) FROM analyses")
        stats = await cursor.fetchone()
        count = stats[0] or 0
        avg_score = round(stats[1], 1) if stats[1] is not None else 0
        best_score = stats[2] or 0

        return {
            "name": prof["name"] if prof else "Rishav Kumar",
            "email": prof["email"] if prof else "rishav.kumar@example.com",
            "target_role": prof["target_role"] if prof else "Software Developer",
            "total_analyses": count,
            "average_score": avg_score,
            "best_score": best_score,
            "updated_at": prof["updated_at"] if prof else ""
        }

async def update_user_profile(name: str, email: str, target_role: str):
    async with aiosqlite.connect(DB_PATH) as db:
        now_str = datetime.now().strftime("%Y-%m-%d %H:%M")
        await db.execute("""
            UPDATE profile SET name = ?, email = ?, target_role = ?, updated_at = ? WHERE id = 1
        """, (name, email, target_role, now_str))
        await db.commit()
