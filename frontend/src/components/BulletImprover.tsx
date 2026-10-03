import React, { useState } from 'react';
import { Sparkles, RefreshCw, Check, Copy, Wand2, AlertCircle } from 'lucide-react';
import { BulletImprovement } from '../types';
import { improveBulletRequest } from '../api';

interface BulletImproverProps {
  initialBullets: BulletImprovement[];
  targetRole?: string;
}

export const BulletImprover: React.FC<BulletImproverProps> = ({ initialBullets, targetRole = 'Software Developer' }) => {
  const [bullets, setBullets] = useState<BulletImprovement[]>(
    initialBullets.length > 0
      ? initialBullets
      : [
          {
            original: 'Made a website using React.',
            improved: 'Developed a responsive React-based web application with reusable components and optimized user experience across mobile and desktop devices [Add metric: e.g. improving page load speed by 25%].',
            rationale: "Replaced weak verb 'Made' with 'Developed', added architectural context, and included a quantified outcome placeholder."
          }
        ]
  );

  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [customBulletInput, setCustomBulletInput] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [accepted, setAccepted] = useState<boolean>(false);

  const currentItem = bullets[activeIndex] || bullets[0];

  const handleTryAgain = async () => {
    setLoading(true);
    setAccepted(false);
    try {
      const res = await improveBulletRequest(currentItem.original, targetRole);
      const updated = [...bullets];
      updated[activeIndex] = {
        original: currentItem.original,
        improved: res.improved,
        rationale: res.rationale || 'Enhanced with stronger action verb and Google XYZ impact framing.'
      };
      setBullets(updated);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleImproveCustomBullet = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customBulletInput.trim() || customBulletInput.length < 5) return;

    setLoading(true);
    setAccepted(false);
    try {
      const res = await improveBulletRequest(customBulletInput, targetRole);
      const newEntry: BulletImprovement = {
        original: customBulletInput,
        improved: res.improved,
        rationale: res.rationale || 'Replaced weak framing with high-impact action verbs and quantified impact guidance.'
      };
      setBullets([newEntry, ...bullets]);
      setActiveIndex(0);
      setCustomBulletInput('');
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(currentItem.improved);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleAccept = () => {
    setAccepted(true);
    handleCopy();
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purpleAccent-600 flex items-center justify-center font-bold">
            <Wand2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-navy-900 tracking-tight">
              AI Bullet Point Improver
            </h3>
            <p className="text-xs sm:text-sm text-slate-500">
              Upgrade passive task descriptions into quantified, high-impact XYZ bullet points.
            </p>
          </div>
        </div>

        {/* Anti-hallucination guarantee pill */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-700 text-xs font-medium">
          <Sparkles className="w-3 h-3 text-purpleAccent-600" />
          <span>Strictly Grounded – No Fake Metrics</span>
        </div>
      </div>

      {/* Bullet Selector Tabs */}
      {bullets.length > 1 && (
        <div className="flex items-center gap-2 mt-6 overflow-x-auto pb-2 scrollbar-none">
          {bullets.map((b, idx) => (
            <button
              key={idx}
              onClick={() => {
                setActiveIndex(idx);
                setAccepted(false);
              }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                activeIndex === idx
                  ? 'bg-brand-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Bullet #{idx + 1}
            </button>
          ))}
        </div>
      )}

      {/* Current vs AI Improved Comparison Card */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Current Bullet */}
        <div className="rounded-2xl p-5 bg-slate-50/80 border border-slate-200/80 flex flex-col justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Current Bullet
            </span>
            <p className="mt-3 text-sm text-slate-700 font-normal leading-relaxed italic">
              "{currentItem.original}"
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-200/60 text-xs text-amber-700 font-medium">
            ⚠ Missing strong action verbs and quantified business impact.
          </div>
        </div>

        {/* AI Improved Bullet */}
        <div className="rounded-2xl p-5 bg-purple-50/40 border border-purple-200/80 flex flex-col justify-between relative">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-purpleAccent-600 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" />
                AI Improved
              </span>
              {accepted && (
                <span className="text-xs font-semibold text-emerald-700 flex items-center gap-1 bg-emerald-100 px-2 py-0.5 rounded-full">
                  <Check className="w-3 h-3" /> Accepted
                </span>
              )}
            </div>

            <p className="mt-3 text-sm text-navy-900 font-medium leading-relaxed">
              "{currentItem.improved}"
            </p>

            <p className="mt-2 text-xs text-slate-500">
              <strong>Rationale:</strong> {currentItem.rationale}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="mt-5 pt-3 border-t border-purple-200/50 flex flex-wrap items-center gap-2.5">
            <button
              onClick={handleAccept}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-purpleAccent-600 hover:bg-purpleAccent-700 text-white text-xs font-semibold shadow-xs transition-colors"
            >
              <Check className="w-3.5 h-3.5" />
              <span>{accepted ? 'Copied to Clipboard' : 'Accept Suggestion'}</span>
            </button>

            <button
              onClick={handleTryAgain}
              disabled={loading}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span>{loading ? 'Re-writing...' : 'Try Again'}</span>
            </button>

            <button
              onClick={handleCopy}
              className="inline-flex items-center gap-1 px-3 py-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-medium ml-auto"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Interactive Custom Bullet Form */}
      <div className="mt-8 pt-6 border-t border-slate-100">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
          Test Any Bullet Point from Your Resume
        </h4>
        <form onSubmit={handleImproveCustomBullet} className="flex flex-col sm:flex-row items-center gap-3">
          <input
            type="text"
            value={customBulletInput}
            onChange={(e) => setCustomBulletInput(e.target.value)}
            placeholder="Type or paste any resume bullet point here (e.g. 'Helped backend team with database queries')..."
            className="w-full sm:flex-1 rounded-xl border border-slate-200 px-4 py-2.5 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:border-purpleAccent-500 focus:ring-2 focus:ring-purple-100 outline-none"
          />
          <button
            type="submit"
            disabled={loading || !customBulletInput.trim()}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-navy-900 hover:bg-navy-800 text-white text-xs font-semibold transition-all disabled:opacity-50 shrink-0"
          >
            <Sparkles className="w-3.5 h-3.5 text-purple-300" />
            <span>Improve with AI</span>
          </button>
        </form>
      </div>
    </div>
  );
};
