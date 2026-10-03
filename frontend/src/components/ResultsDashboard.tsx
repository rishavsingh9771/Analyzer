import React, { useState } from 'react';
import { 
  Download, 
  RotateCcw, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Check, 
  Sparkles, 
  ChevronDown, 
  ChevronUp, 
  FileText, 
  Target, 
  Zap, 
  Info, 
  Share2, 
  ArrowRight,
  ShieldAlert,
  ShieldCheck,
  Award,
  Layers,
  FileSearch,
  BookOpen
} from 'lucide-react';
import { AnalysisResult, ScoreCategory } from '../types';
import { BulletImprover } from './BulletImprover';
import { ScoreSimulator } from './ScoreSimulator';
import { ResumeVsJD } from './ResumeVsJD';
import { ReportModal } from './ReportModal';

interface ResultsDashboardProps {
  data: AnalysisResult;
  onAnalyzeAgain: () => void;
}

export const ResultsDashboard: React.FC<ResultsDashboardProps> = ({ data, onAnalyzeAgain }) => {
  const [selectedBreakdown, setSelectedBreakdown] = useState<string | null>(null);
  const [showReportModal, setShowReportModal] = useState<boolean>(false);
  const [aiSummaryGenerated, setAiSummaryGenerated] = useState<string | null>(null);
  const [activeSectionTab, setActiveSectionTab] = useState<string>('summary');

  // Semantic color calculation for ATS Score
  const getScoreColor = (score: number) => {
    if (score >= 85) return { stroke: '#0e86eb', text: 'text-brand-600', badge: 'bg-emerald-100 text-emerald-800' };
    if (score >= 70) return { stroke: '#eab308', text: 'text-yellow-600', badge: 'bg-amber-100 text-amber-800' };
    return { stroke: '#ef4444', text: 'text-rose-600', badge: 'bg-rose-100 text-rose-800' };
  };

  const scoreStyle = getScoreColor(data.ats_score);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-10">
      
      {/* Top Header Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5 flex-wrap">
            <h1 className="text-2xl sm:text-3xl font-black text-navy-900 tracking-tight">
              {data.has_custom_jd === false ? 'General Resume & ATS Audit' : 'Resume Analysis'}
            </h1>
            {data.has_custom_jd === false ? (
              <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-900 border border-blue-300 text-xs font-bold flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-blue-600" />
                Industry Benchmark Mode
              </span>
            ) : null}
            {data.is_demo && (
              <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300 text-xs font-bold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-600 animate-pulse"></span>
                Demo Analysis
              </span>
            )}
            <span className="px-2.5 py-0.5 rounded-full bg-brand-50 text-brand-700 border border-brand-200 text-xs font-semibold">
              {data.file_type.toUpperCase()}
            </span>
          </div>

          <p className="text-slate-600 text-sm mt-1">
            {data.has_custom_jd === false ? (
              <>
                Comprehensive skills & ATS health evaluation for <strong className="text-navy-900 font-semibold">{data.job_title}</strong>
              </>
            ) : (
              <>
                Analysis for <strong className="text-navy-900 font-semibold">{data.job_title}</strong> position 
              </>
            )}
            <span className="text-slate-400 mx-2">•</span> 
            File: <span className="font-mono text-slate-700 text-xs">{data.resume_filename}</span> ({data.file_size})
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <button
            onClick={() => setShowReportModal(true)}
            className="flex-1 md:flex-initial inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 text-sm font-semibold shadow-xs transition-colors cursor-pointer"
          >
            <Download className="w-4 h-4 text-slate-500" />
            <span>Download Report</span>
          </button>

          <button
            onClick={onAnalyzeAgain}
            className="flex-1 md:flex-initial inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-brand-600 to-navy-900 hover:from-brand-500 hover:to-navy-800 text-white text-sm font-semibold shadow-sm transition-all cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Analyze Again</span>
          </button>
        </div>
      </div>

      {/* Grid Row 1: Large ATS Score Card & Job Match Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        
        {/* ATS Score Card (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Core Metric
                </span>
                <h2 className="text-xl font-bold text-navy-900 mt-0.5">
                  ATS Compatibility Score
                </h2>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-bold ${scoreStyle.badge}`}>
                {data.status}
              </span>
            </div>

            {/* Circular Progress Gauge */}
            <div className="py-6 flex flex-col sm:flex-row items-center gap-8 justify-center">
              <div className="relative w-44 h-44 flex items-center justify-center shrink-0">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
                  <circle
                    cx="60"
                    cy="60"
                    r="50"
                    className="text-slate-100"
                    strokeWidth="10"
                    stroke="currentColor"
                    fill="transparent"
                  />
                  <circle
                    cx="60"
                    cy="60"
                    r="50"
                    stroke={scoreStyle.stroke}
                    strokeWidth="10"
                    strokeDasharray={314.159}
                    strokeDashoffset={314.159 * (1 - data.ats_score / 100)}
                    strokeLinecap="round"
                    fill="transparent"
                    className="transition-all duration-1000 ease-out"
                  />
                </svg>
                <div className="absolute flex flex-col items-center justify-center">
                  <span className="text-4xl font-black text-navy-900 tracking-tight">
                    {data.ats_score}
                  </span>
                  <span className="text-xs font-bold text-slate-400 -mt-1">/ 100</span>
                </div>
              </div>

              <div className="space-y-3 text-center sm:text-left">
                <p className="text-base font-semibold text-navy-900">
                  {data.score_summary || "Your resume is likely to perform well with ATS systems."}
                </p>
                <p className="text-xs text-slate-500 leading-relaxed max-w-sm">
                  {data.has_custom_jd === false
                    ? "Evaluated against common ATS filters, in-demand technical competencies, and readability guidelines for your domain."
                    : "This estimated compatibility score is computed using semantic analysis of keyword density, role relevance, section clarity, and parsing stability against recruitment filters."}
                </p>
                <div className="flex items-center gap-2 text-xs font-medium text-emerald-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Passes modern ATS syntax and token parsing filters</span>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
            <span>Transparent 5-Pillar ATS Formula</span>
            <span>Benchmark: Top 15% of candidates score 85+</span>
          </div>
        </div>

        {/* Job Match Section (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  {data.has_custom_jd === false ? 'Industry Competency' : 'Role Alignment'}
                </span>
                <h3 className="text-xl font-bold text-navy-900 mt-0.5">
                  {data.has_custom_jd === false ? 'Skill Benchmark Score' : 'Job Match Score'}
                </h3>
              </div>
              <div className="text-3xl font-black text-brand-600">
                {data.job_match}% <span className="text-xs font-bold text-slate-400">Match</span>
              </div>
            </div>

            {/* Matched & Missing Skills Pills */}
            <div className="mt-6 space-y-4">
              <div>
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">
                  {data.has_custom_jd === false ? 'Detected Skills in Resume' : 'Matched Skills'} ({data.job_match_details.matched_skills.length})
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {data.job_match_details.matched_skills.map((skill, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-medium"
                    >
                      <Check className="w-3 h-3 text-emerald-600 font-bold" />
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">
                  {data.has_custom_jd === false ? 'Recommended In-Demand Skills to Add' : 'Missing Skills'} ({data.job_match_details.missing_skills.length})
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {data.job_match_details.missing_skills.map((skill, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-50 text-amber-800 border border-amber-200 text-xs font-medium"
                    >
                      <AlertTriangle className="w-3 h-3 text-amber-600 font-bold" />
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">
                  Relevant Experience Highlights
                </span>
                <div className="space-y-1.5 text-xs text-slate-700">
                  {data.job_match_details.relevant_experience.map((exp, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-brand-600 shrink-0"></div>
                      <span>{exp}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 text-xs text-slate-500 flex items-center justify-between">
            <span>{data.has_custom_jd === false ? 'General ATS & Skills Benchmark' : 'Direct alignment with JD requirements'}</span>
            <span className="text-brand-600 font-semibold cursor-pointer" onClick={() => {
              const el = document.getElementById('keyword-analyzer');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}>
              View Full Keywords →
            </span>
          </div>
        </div>

      </div>

      {/* Grid Row 2: 5 Individual Score Breakdown Cards */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-bold text-navy-900">Score Breakdown</h3>
            <p className="text-xs text-slate-500">Click any pillar card to view detailed diagnostics and criteria.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {Object.entries(data.score_breakdown).map(([category, details]) => {
            const isSelected = selectedBreakdown === category;
            const percentage = Math.round((details.score / details.max) * 100);

            const titles: Record<string, string> = {
              keywords: 'Keywords',
              skills: 'Skills Match',
              experience: 'Experience Relevance',
              structure: 'Resume Structure',
              formatting: 'ATS Formatting'
            };

            return (
              <div
                key={category}
                onClick={() => setSelectedBreakdown(isSelected ? null : category)}
                className={`bg-white rounded-2xl p-5 border cursor-pointer transition-all duration-200 hover:shadow-md ${
                  isSelected 
                    ? 'border-brand-500 ring-2 ring-brand-100 shadow-sm' 
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-500 truncate">
                    {titles[category] || category}
                  </span>
                  <span className="text-sm font-extrabold text-navy-900">
                    {details.score} <span className="text-slate-400 text-xs font-normal">/ {details.max}</span>
                  </span>
                </div>

                {/* Progress bar */}
                <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden my-2">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      percentage >= 85 ? 'bg-brand-600' : percentage >= 70 ? 'bg-amber-500' : 'bg-rose-500'
                    }`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-500 mt-2">
                  <span className="font-semibold text-slate-700">{details.status}</span>
                  <span className="text-brand-600 text-[10px] font-bold">
                    {isSelected ? 'Hide Details' : 'Details →'}
                  </span>
                </div>

                {isSelected && (
                  <div className="mt-3 pt-3 border-t border-slate-100 text-xs text-slate-600 leading-relaxed animate-fadeIn">
                    {details.feedback}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Grid Row 3: Keyword Analyzer Section */}
      <div id="keyword-analyzer" className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div>
            <h3 className="text-xl font-bold text-navy-900 tracking-tight">
              Keyword Analysis
            </h3>
            <p className="text-xs sm:text-sm text-slate-500">
              Keywords are indexed by ATS crawlers to rank applicants.
            </p>
          </div>
          <div className="text-xs text-slate-500 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl">
            {data.keyword_analysis.explanation}
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Matched Keywords */}
          <div className="rounded-2xl p-5 bg-emerald-50/40 border border-emerald-200/80">
            <div className="flex items-center gap-2 mb-3">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <h4 className="text-sm font-bold text-emerald-900">
                Matched Keywords ({data.keyword_analysis.matched.length})
              </h4>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {data.keyword_analysis.matched.map((kw, i) => (
                <span
                  key={i}
                  className="px-2.5 py-1 rounded-lg bg-white border border-emerald-200 text-emerald-800 text-xs font-semibold shadow-2xs"
                >
                  {kw}
                </span>
              ))}
            </div>
          </div>

          {/* Missing Keywords */}
          <div className="rounded-2xl p-5 bg-rose-50/40 border border-rose-200/80">
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle className="w-4 h-4 text-rose-600" />
              <h4 className="text-sm font-bold text-rose-900">
                Missing Keywords ({data.keyword_analysis.missing.length})
              </h4>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {data.keyword_analysis.missing.map((kw, i) => (
                <span
                  key={i}
                  className="px-2.5 py-1 rounded-lg bg-white border border-rose-200 text-rose-800 text-xs font-semibold shadow-2xs"
                >
                  {kw}
                </span>
              ))}
            </div>
          </div>

          {/* Overused Keywords */}
          <div className="rounded-2xl p-5 bg-amber-50/40 border border-amber-200/80">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-4 h-4 text-amber-600" />
              <h4 className="text-sm font-bold text-amber-900">
                Overused Action Verbs
              </h4>
            </div>
            <div className="space-y-2 text-xs">
              {data.keyword_analysis.overused.map((item, i) => (
                <div key={i} className="p-2 rounded-lg bg-white border border-amber-200">
                  <div className="flex items-center justify-between font-bold text-slate-800">
                    <span>"{item.word}"</span>
                    <span className="text-[10px] text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded">
                      Repeated {item.count}x
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">
                    {item.suggestion}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Grid Row 4: Resume Section Analysis */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div>
            <h3 className="text-xl font-bold text-navy-900 tracking-tight">
              Resume Section Analysis
            </h3>
            <p className="text-xs sm:text-sm text-slate-500">
              Detailed audit of each major section with targeted AI improvement suggestions.
            </p>
          </div>
          
          {/* Tabs */}
          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl overflow-x-auto">
            {Object.keys(data.section_analysis).map((secKey) => (
              <button
                key={secKey}
                onClick={() => setActiveSectionTab(secKey)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-colors ${
                  activeSectionTab === secKey
                    ? 'bg-white text-navy-900 shadow-xs'
                    : 'text-slate-600 hover:text-navy-900'
                }`}
              >
                {secKey}
              </button>
            ))}
          </div>
        </div>

        {/* Active Section Content Card */}
        {(() => {
          const sec = data.section_analysis[activeSectionTab as keyof typeof data.section_analysis];
          if (!sec) return null;

          return (
            <div className="mt-6 rounded-2xl p-6 bg-slate-50/70 border border-slate-200/80 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-3">
                  <h4 className="text-lg font-bold text-navy-900 capitalize">
                    {activeSectionTab} Section
                  </h4>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                    sec.score >= 85 ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {sec.status}
                  </span>
                  <span className="text-sm font-extrabold text-brand-600">
                    Score: {sec.score}%
                  </span>
                </div>

                <p className="text-sm text-slate-600 leading-relaxed">
                  {sec.feedback}
                </p>

                {sec.suggestion && (
                  <div className="mt-3 p-3.5 rounded-xl bg-white border border-brand-200 text-xs text-slate-700 leading-relaxed">
                    <strong className="text-brand-700 block mb-1">Recommended AI Rewrite:</strong>
                    "{sec.suggestion}"
                  </div>
                )}
              </div>

              {activeSectionTab === 'summary' && (
                <button
                  onClick={() => setAiSummaryGenerated(sec.suggestion || null)}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-brand-600 to-purpleAccent-600 hover:from-brand-500 hover:to-purpleAccent-500 text-white text-xs font-semibold shadow-xs transition-colors shrink-0"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Improve with AI</span>
                </button>
              )}
            </div>
          );
        })()}
      </div>

      {/* Grid Row 5: AI Bullet Point Improver Section */}
      <BulletImprover 
        initialBullets={data.bullet_improvements} 
        targetRole={data.job_title} 
      />

      {/* Grid Row 6: ATS Formatting Health Checker & AI Top 5 Recommendations */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* ATS Formatting Health (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-navy-900 tracking-tight">
                ATS Formatting Health
              </h3>
              <p className="text-xs text-slate-500">
                Structure checks that prevent parser dropouts.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 block">
              ✓ Passed Checks
            </span>
            {data.ats_formatting_health.passes.map((pass, i) => (
              <div key={i} className="flex items-center gap-2.5 text-xs text-slate-700">
                <Check className="w-4 h-4 text-emerald-600 font-bold shrink-0" />
                <span>{pass}</span>
              </div>
            ))}
          </div>

          <div className="space-y-3 pt-3 border-t border-slate-100">
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-700 block">
              ⚠ Formatting Warnings
            </span>
            {data.ats_formatting_health.warnings.map((warn, i) => (
              <div key={i} className="p-3 rounded-xl bg-amber-50/60 border border-amber-200/80 text-xs">
                <div className="flex items-center gap-1.5 font-bold text-amber-900">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                  <span>{warn.title}</span>
                </div>
                <p className="text-slate-600 mt-1 leading-relaxed">
                  {warn.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Top 5 Things You Should Fix (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center font-bold">
                <Zap className="w-5 h-5 text-amber-500" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-navy-900 tracking-tight">
                  Top 5 Things You Should Fix
                </h3>
                <p className="text-xs text-slate-500">
                  Prioritized fixes to maximize your interview conversion rate.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-3.5">
            {data.top_recommendations.map((rec, idx) => {
              const badgeColor = 
                rec.priority === 'High' ? 'bg-rose-100 text-rose-800' :
                rec.priority === 'Medium' ? 'bg-amber-100 text-amber-800' :
                'bg-blue-100 text-blue-800';

              return (
                <div 
                  key={idx} 
                  className="p-4 rounded-2xl bg-slate-50/70 border border-slate-200/80 hover:bg-slate-50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="flex items-start gap-3 min-w-0">
                    <span className="w-6 h-6 rounded-full bg-navy-900 text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-navy-900">
                          {rec.title}
                        </span>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${badgeColor}`}>
                          {rec.priority}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                        {rec.description}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      const el = document.getElementById('keyword-analyzer');
                      el?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="self-end sm:self-center px-3 py-1.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 text-brand-600 text-xs font-semibold shrink-0 transition-colors"
                  >
                    Fix with AI →
                  </button>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* Grid Row 7: Resume Score Simulator */}
      <ScoreSimulator 
        baseScore={data.ats_score} 
        items={data.simulator_items} 
      />

      {/* Grid Row 8: Resume vs Job Description Visual Side-by-Side Comparison */}
      <ResumeVsJD
        resumeText={data.resume_text}
        jobDescription={data.job_description}
        keywordAnalysis={data.keyword_analysis}
        hasCustomJd={data.has_custom_jd}
      />

      {/* Report Modal */}
      {showReportModal && (
        <ReportModal 
          data={data} 
          onClose={() => setShowReportModal(false)} 
        />
      )}
    </div>
  );
};
