import React from 'react';
import { X, Printer, Download, Check, AlertTriangle, ShieldCheck, Sparkles } from 'lucide-react';
import { AnalysisResult } from '../types';

interface ReportModalProps {
  data: AnalysisResult;
  onClose: () => void;
}

export const ReportModal: React.FC<ReportModalProps> = ({ data, onClose }) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl w-full max-w-3xl shadow-2xl border border-slate-200 overflow-hidden my-8 flex flex-col max-h-[90vh]">
        
        {/* Top Modal Controls (Hidden in Print) */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50 no-print shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center text-white">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-navy-900">ATS Diagnostic Audit Report</h3>
              <p className="text-xs text-slate-500">Ready to save or export as PDF</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold shadow-xs transition-colors"
            >
              <Printer className="w-4 h-4" />
              <span>Print / Save as PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Report Document Body */}
        <div id="printable-report" className="p-8 sm:p-10 overflow-y-auto space-y-8 bg-white text-slate-800 font-sans">
          
          {/* Header */}
          <div className="flex items-start justify-between border-b-2 border-slate-900 pb-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-brand-600">
                ResumeIQ Audit Report
              </span>
              <h1 className="text-2xl font-black text-navy-900 mt-1">
                ATS Compatibility & Job Alignment Assessment
              </h1>
              <p className="text-xs text-slate-500 mt-1">
                Evaluated for: <strong className="text-slate-800">{data.job_title}</strong> | File: {data.resume_filename}
              </p>
            </div>

            <div className="text-right">
              <div className="text-xs text-slate-400">Date Generated</div>
              <div className="text-xs font-semibold text-slate-700">
                {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
              </div>
            </div>
          </div>

          {/* Score Overview Row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <div className="text-center p-2">
              <div className="text-[11px] uppercase font-bold text-slate-400">ATS Score</div>
              <div className="text-3xl font-black text-brand-600 mt-1">{data.ats_score} / 100</div>
              <div className="text-[10px] font-semibold text-emerald-600 mt-0.5">{data.status}</div>
            </div>
            <div className="text-center p-2 border-l border-slate-200">
              <div className="text-[11px] uppercase font-bold text-slate-400">Job Match</div>
              <div className="text-3xl font-black text-navy-900 mt-1">{data.job_match}%</div>
              <div className="text-[10px] text-slate-500 mt-0.5">Alignment</div>
            </div>
            <div className="text-center p-2 border-l border-slate-200">
              <div className="text-[11px] uppercase font-bold text-slate-400">Keywords Match</div>
              <div className="text-3xl font-black text-slate-800 mt-1">
                {data.score_breakdown.keywords.score} / {data.score_breakdown.keywords.max}
              </div>
              <div className="text-[10px] text-slate-500 mt-0.5">Core terms</div>
            </div>
            <div className="text-center p-2 border-l border-slate-200">
              <div className="text-[11px] uppercase font-bold text-slate-400">Formatting</div>
              <div className="text-3xl font-black text-slate-800 mt-1">
                {data.score_breakdown.formatting.score} / {data.score_breakdown.formatting.max}
              </div>
              <div className="text-[10px] text-slate-500 mt-0.5">Parse Health</div>
            </div>
          </div>

          {/* Score Breakdown Table */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-navy-900 mb-3 pb-1 border-b border-slate-200">
              1. Detailed Score Breakdown
            </h3>
            <div className="space-y-2 text-xs">
              {Object.entries(data.score_breakdown).map(([k, v]) => (
                <div key={k} className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50">
                  <span className="font-semibold text-slate-800 capitalize w-48">
                    {k === 'keywords' ? 'Keyword Match (25%)' :
                     k === 'skills' ? 'Skills Match (25%)' :
                     k === 'experience' ? 'Experience Relevance (20%)' :
                     k === 'structure' ? 'Resume Structure (15%)' :
                     'ATS Formatting (15%)'}
                  </span>
                  <span className="text-slate-600 flex-1 px-4">{v.feedback}</span>
                  <span className="font-bold text-navy-900 shrink-0">{v.score} / {v.max} pts</span>
                </div>
              ))}
            </div>
          </div>

          {/* Keywords & Missing Skills */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-navy-900 mb-3 pb-1 border-b border-slate-200">
              2. Keyword & Competency Alignment
            </h3>
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="p-3 rounded-xl border border-emerald-200 bg-emerald-50/50">
                <span className="font-bold text-emerald-800 block mb-2">✓ Matched Keywords</span>
                <p className="text-slate-700 leading-relaxed">
                  {data.keyword_analysis.matched.join(', ')}
                </p>
              </div>
              <div className="p-3 rounded-xl border border-rose-200 bg-rose-50/50">
                <span className="font-bold text-rose-800 block mb-2">⚠ Missing Keywords</span>
                <p className="text-slate-700 leading-relaxed">
                  {data.keyword_analysis.missing.join(', ')}
                </p>
              </div>
            </div>
          </div>

          {/* Top 5 AI Recommendations */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-navy-900 mb-3 pb-1 border-b border-slate-200">
              3. Top 5 Actionable Recommendations
            </h3>
            <ol className="list-decimal pl-5 space-y-2 text-xs text-slate-700">
              {data.top_recommendations.map((rec, i) => (
                <li key={i} className="pl-1">
                  <strong className="text-navy-900">[{rec.priority} Priority] {rec.title}:</strong> {rec.description}
                </li>
              ))}
            </ol>
          </div>

          {/* Disclaimer */}
          <div className="pt-4 border-t border-slate-200 text-[10px] text-slate-400 leading-relaxed">
            Note: This audit is an AI-assisted diagnostic evaluation based on parsing algorithms and common ATS patterns. ResumeIQ does not guarantee interview invitations or employment outcomes.
          </div>

        </div>

      </div>
    </div>
  );
};
