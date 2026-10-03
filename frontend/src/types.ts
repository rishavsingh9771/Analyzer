export interface ScoreCategory {
  score: number;
  max: number;
  status: 'Excellent' | 'Good' | 'Needs Improvement' | 'Needs improvement' | string;
  feedback: string;
}

export interface ScoreBreakdown {
  keywords: ScoreCategory;
  skills: ScoreCategory;
  experience: ScoreCategory;
  structure: ScoreCategory;
  formatting: ScoreCategory;
}

export interface OverusedKeyword {
  word: string;
  count: number;
  suggestion: string;
}

export interface KeywordAnalysis {
  matched: string[];
  missing: string[];
  overused: OverusedKeyword[];
  explanation: string;
}

export interface SectionDetail {
  score: number;
  status: string;
  feedback: string;
  suggestion?: string;
}

export interface SectionAnalysis {
  summary: SectionDetail;
  skills: SectionDetail;
  experience: SectionDetail;
  projects: SectionDetail;
  education: SectionDetail;
}

export interface BulletImprovement {
  original: string;
  improved: string;
  rationale: string;
}

export interface FormattingWarning {
  title: string;
  description: string;
}

export interface ATSFormattingHealth {
  passes: string[];
  warnings: FormattingWarning[];
}

export interface Recommendation {
  priority: 'High' | 'Medium' | 'Low';
  title: string;
  description: string;
}

export interface SimulatorItem {
  id: string;
  title: string;
  impact: number;
  default_checked: boolean;
}

export interface JobMatchDetails {
  match_percentage: number;
  matched_skills: string[];
  missing_skills: string[];
  relevant_experience: string[];
}

export interface AnalysisResult {
  id: string;
  resume_filename: string;
  file_size: string;
  file_type: string;
  candidate_name: string;
  candidate_email?: string;
  candidate_phone?: string;
  job_title: string;
  job_description: string;
  resume_text: string;
  ats_score: number;
  job_match: number;
  status: string;
  score_summary: string;
  is_demo?: boolean;
  demo_reason?: string;
  has_custom_jd?: boolean;
  score_breakdown: ScoreBreakdown;
  job_match_details: JobMatchDetails;
  keyword_analysis: KeywordAnalysis;
  section_analysis: SectionAnalysis;
  bullet_improvements: BulletImprovement[];
  ats_formatting_health: ATSFormattingHealth;
  top_recommendations: Recommendation[];
  simulator_items: SimulatorItem[];
}

export interface HistoryItem {
  id: string;
  resume_filename: string;
  job_title: string;
  ats_score: number;
  job_match: number;
  created_at: string;
}

export interface UserProfile {
  name: string;
  email: string;
  target_role: string;
  total_analyses: number;
  average_score: number;
  best_score: number;
  updated_at?: string;
}
