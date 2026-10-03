import React, { useState } from 'react';
import { SplitSquareVertical, CheckCircle2, AlertTriangle, HelpCircle } from 'lucide-react';
import { KeywordAnalysis } from '../types';

interface ResumeVsJDProps {
  resumeText: string;
  jobDescription: string;
  keywordAnalysis: KeywordAnalysis;
  hasCustomJd?: boolean;
}

export const ResumeVsJD: React.FC<ResumeVsJDProps> = ({
  resumeText,
  jobDescription,
  keywordAnalysis,
  hasCustomJd = true,
}) => {
  const [filter, setFilter] = useState<'all' | 'matched' | 'missing'>('all');

  // Simple token highlighter
  const highlightText = (text: string, isJD: boolean) => {
    if (!text) return null;
    const lines = text.split('\n');

    return lines.map((line, lIdx) => {
      if (!line.trim()) return <div key={lIdx} className="h-4" />;

      const words = line.split(/(\s+|[.,;()]+)/);

      return (
        <p key={lIdx} className="my-1 leading-relaxed text-xs sm:text-sm">
          {words.map((chunk, cIdx) => {
            const cleanChunk = chunk.toLowerCase().trim();
            if (!cleanChunk || cleanChunk.length < 2) {
              return <span key={cIdx}>{chunk}</span>;
            }

            // Check matched keywords
            const isMatched = keywordAnalysis.matched.some(
              (m) => m.toLowerCase() === cleanChunk || cleanChunk.includes(m.toLowerCase())
            );

            // Check missing keywords
            const isMissing = keywordAnalysis.missing.some(
              (m) => m.toLowerCase() === cleanChunk || cleanChunk.includes(m.toLowerCase())
            );

            if (isMatched && (filter === 'all' || filter === 'matched')) {
              return (
                <mark
                  key={cIdx}
                  className="bg-emerald-100 text-emerald-900 font-semibold px-1 rounded-sm border border-emerald-200"
                  title="Matched Keyword"
                >
                  {chunk}
                </mark>
              );
            }

            if (isMissing && isJD && (filter === 'all' || filter === 'missing')) {
              return (
                <mark
                  key={cIdx}
                  className="bg-rose-100 text-rose-900 font-semibold px-1 rounded-sm border border-rose-200"
                  title="Missing Keyword in Resume"
                >
                  {chunk}
                </mark>
              );
            }

            return <span key={cIdx}>{chunk}</span>;
          })}
        </p>
      );
    });
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center font-bold">
            <SplitSquareVertical className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-navy-900 tracking-tight">
              {hasCustomJd ? 'Resume vs Job Description' : 'Resume vs Industry Benchmark'}
            </h3>
            <p className="text-xs sm:text-sm text-slate-500">
              {hasCustomJd
                ? 'Visual side-by-side keyword overlap and missing requirement inspection.'
                : 'Visual comparison of your resume against common industry ATS skill benchmarks.'}
            </p>
          </div>
        </div>

        {/* Legend and Filter */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
              filter === 'all' ? 'bg-slate-900 text-white font-semibold' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All Highlights
          </button>
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            Matched Keywords
          </span>
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-rose-50 text-rose-800 border border-rose-200 font-medium">
            <span className="w-2 h-2 rounded-full bg-rose-500"></span>
            Recommended Additions
          </span>
        </div>
      </div>

      {/* Side by side columns */}
      <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Your Resume */}
        <div className="rounded-2xl border border-slate-200 overflow-hidden flex flex-col bg-slate-50/50">
          <div className="bg-slate-100/90 px-4 py-3 border-b border-slate-200 flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-navy-900">
              Your Resume
            </span>
            <span className="text-[11px] text-slate-500">Extracted document text</span>
          </div>
          <div className="p-4 sm:p-5 max-h-96 overflow-y-auto font-mono text-slate-700 select-text">
            {highlightText(resumeText, false)}
          </div>
        </div>

        {/* Right: Job Description / Benchmark */}
        <div className="rounded-2xl border border-slate-200 overflow-hidden flex flex-col bg-slate-50/50">
          <div className="bg-slate-100/90 px-4 py-3 border-b border-slate-200 flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-navy-900">
              {hasCustomJd ? 'Job Description' : 'Industry ATS Benchmark Criteria'}
            </span>
            <span className="text-[11px] text-slate-500">
              {hasCustomJd ? 'Target role criteria' : 'Common role expectations'}
            </span>
          </div>
          {!hasCustomJd && (
            <div className="bg-blue-50/70 border-b border-blue-100 px-4 py-2 text-[11px] text-blue-800">
              💡 No specific Job Description provided. Comparing against standard industry criteria.
            </div>
          )}
          <div className="p-4 sm:p-5 max-h-96 overflow-y-auto font-mono text-slate-700 select-text">
            {highlightText(jobDescription, true)}
          </div>
        </div>
      </div>
    </div>
  );
};
