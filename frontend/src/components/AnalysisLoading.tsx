import React, { useState, useEffect } from 'react';
import { Check, Loader2, Sparkles, BrainCircuit } from 'lucide-react';

interface AnalysisLoadingProps {
  onComplete?: () => void;
}

const STEPS = [
  { id: 1, label: 'Reading resume & formatting' },
  { id: 2, label: 'Extracting technical & soft skills' },
  { id: 3, label: 'Comparing keywords with Job Description' },
  { id: 4, label: 'Checking ATS compatibility rules' },
  { id: 5, label: 'Generating personalized AI recommendations' },
];

export const AnalysisLoading: React.FC<AnalysisLoadingProps> = () => {
  const [currentStep, setCurrentStep] = useState(1);

  useEffect(() => {
    const timer1 = setTimeout(() => setCurrentStep(2), 600);
    const timer2 = setTimeout(() => setCurrentStep(3), 1200);
    const timer3 = setTimeout(() => setCurrentStep(4), 1800);
    const timer4 = setTimeout(() => setCurrentStep(5), 2400);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
    };
  }, []);

  return (
    <div className="min-h-[70vh] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-3xl p-8 border border-slate-200 shadow-2xl shadow-slate-200/80 text-center relative overflow-hidden">
        
        {/* Animated ambient background ring */}
        <div className="absolute -top-20 -right-20 w-48 h-48 bg-brand-200/40 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-48 h-48 bg-purpleAccent-500/20 rounded-full blur-3xl pointer-events-none" />

        {/* Central Pulse Icon */}
        <div className="relative mx-auto w-20 h-20 mb-6 flex items-center justify-center">
          <div className="absolute inset-0 rounded-2xl bg-brand-500/10 animate-ping" />
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-brand-600 via-brand-500 to-purpleAccent-600 text-white flex items-center justify-center shadow-lg shadow-brand-500/30">
            <BrainCircuit className="w-8 h-8 animate-pulse" />
          </div>
        </div>

        <h3 className="text-xl font-bold text-navy-900 tracking-tight mb-2">
          AI is analyzing your resume...
        </h3>
        <p className="text-xs text-slate-500 mb-8">
          Comparing requirements, detecting ATS parse bottlenecks, and benchmarking match scores.
        </p>

        {/* Multi-step progress checklist */}
        <div className="space-y-3.5 text-left text-sm font-medium">
          {STEPS.map((step) => {
            const isCompleted = currentStep > step.id;
            const isCurrent = currentStep === step.id;
            const isPending = currentStep < step.id;

            return (
              <div 
                key={step.id} 
                className={`flex items-center gap-3 p-2.5 rounded-xl transition-all duration-300 ${
                  isCurrent 
                    ? 'bg-brand-50/90 text-brand-900 font-semibold border border-brand-200/70 shadow-xs' 
                    : isCompleted 
                      ? 'text-slate-700 bg-slate-50/50' 
                      : 'text-slate-400'
                }`}
              >
                <div className="shrink-0">
                  {isCompleted ? (
                    <div className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-xs">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                  ) : isCurrent ? (
                    <div className="w-6 h-6 rounded-full bg-brand-600 text-white flex items-center justify-center shadow-xs">
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    </div>
                  ) : (
                    <div className="w-6 h-6 rounded-full border-2 border-slate-300 flex items-center justify-center text-[11px] text-slate-400 font-bold">
                      {step.id}
                    </div>
                  )}
                </div>

                <span className="text-xs sm:text-sm">{step.label}</span>
              </div>
            );
          })}
        </div>

        {/* Subtle Footer */}
        <div className="mt-8 pt-4 border-t border-slate-100 flex items-center justify-center gap-1.5 text-[11px] text-slate-400">
          <Sparkles className="w-3 h-3 text-brand-500" />
          <span>Powered by Gemini 3.6 Flash & ATS Parser</span>
        </div>
      </div>
    </div>
  );
};
