import React, { useState } from 'react';
import { Sliders, Sparkles, TrendingUp, Info } from 'lucide-react';
import { SimulatorItem } from '../types';

interface ScoreSimulatorProps {
  baseScore: number;
  items: SimulatorItem[];
}

export const ScoreSimulator: React.FC<ScoreSimulatorProps> = ({ baseScore, items }) => {
  const [checkedItems, setCheckedItems] = useState<{ [id: string]: boolean }>({
    sim_keywords: false,
    sim_summary: false,
    sim_bullets: false,
    sim_format: false,
  });

  const toggleItem = (id: string) => {
    setCheckedItems(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // Calculate potential score
  const scoreBoost = items.reduce((acc, item) => {
    return acc + (checkedItems[item.id] ? item.impact : 0);
  }, 0);

  const potentialScore = Math.min(99, baseScore + scoreBoost);

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm relative overflow-hidden">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
            <Sliders className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-navy-900 tracking-tight">
              Resume Score Simulator
            </h3>
            <p className="text-xs sm:text-sm text-slate-500">
              Simulate estimated ATS score improvements by applying targeted fixes.
            </p>
          </div>
        </div>

        {/* Live Potential Score Badge */}
        <div className="flex items-center gap-4 bg-slate-50 border border-slate-200 px-4 py-2.5 rounded-2xl self-start sm:self-auto">
          <div>
            <div className="text-[10px] uppercase font-bold text-slate-400">Current Score</div>
            <div className="text-lg font-extrabold text-slate-700">{baseScore}</div>
          </div>
          <div className="text-slate-300 font-bold">→</div>
          <div>
            <div className="text-[10px] uppercase font-bold text-brand-600">Potential Score</div>
            <div className="text-2xl font-black text-brand-600 flex items-center gap-1">
              <span>{potentialScore}</span>
              <span className="text-xs font-semibold text-slate-400">/ 100</span>
            </div>
          </div>
          {scoreBoost > 0 && (
            <span className="inline-flex items-center gap-0.5 px-2 py-1 rounded-lg bg-emerald-100 text-emerald-800 text-xs font-bold">
              <TrendingUp className="w-3 h-3" />
              +{scoreBoost}
            </span>
          )}
        </div>
      </div>

      {/* Simulator Checklist */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        {items.map((item) => {
          const isChecked = !!checkedItems[item.id];
          return (
            <label
              key={item.id}
              onClick={() => toggleItem(item.id)}
              className={`flex items-start gap-3.5 p-4 rounded-2xl border cursor-pointer transition-all duration-200 select-none ${
                isChecked
                  ? 'bg-brand-50/70 border-brand-300 shadow-xs ring-1 ring-brand-200'
                  : 'bg-slate-50/60 border-slate-200 hover:bg-slate-100/70'
              }`}
            >
              <input
                type="checkbox"
                checked={isChecked}
                onChange={() => {}}
                className="mt-1 w-4 h-4 rounded text-brand-600 border-slate-300 focus:ring-brand-500 cursor-pointer"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className={`text-sm font-semibold ${isChecked ? 'text-navy-900' : 'text-slate-700'}`}>
                    {item.title}
                  </span>
                  <span className={`text-xs font-extrabold px-2 py-0.5 rounded-full shrink-0 ml-2 ${
                    isChecked ? 'bg-brand-600 text-white' : 'bg-slate-200 text-slate-700'
                  }`}>
                    +{item.impact} pts
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Click to toggle this optimization and preview ATS score impact.
                </p>
              </div>
            </label>
          );
        })}
      </div>

      {/* Disclaimer */}
      <div className="mt-6 pt-4 border-t border-slate-100 flex items-center gap-2 text-xs text-slate-400">
        <Info className="w-4 h-4 shrink-0 text-slate-400" />
        <span>
          <strong>Estimated improvements only.</strong> Scores are projected based on standard ATS heuristics and are not guaranteed vendor outcomes.
        </span>
      </div>
    </div>
  );
};
