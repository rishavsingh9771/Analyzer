import React from 'react';
import { Sparkles, ArrowRight, ShieldCheck, Activity } from 'lucide-react';

interface NavbarProps {
  currentView: string;
  onNavigate: (view: string) => void;
  isDemo?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ currentView, onNavigate, isDemo }) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <div 
          onClick={() => onNavigate('landing')}
          className="flex items-center gap-2.5 cursor-pointer group select-none"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-700 via-brand-600 to-purpleAccent-600 flex items-center justify-center shadow-md shadow-brand-500/20 group-hover:scale-105 transition-transform duration-200">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="text-xl font-extrabold tracking-tight text-navy-900 font-sans">
                Resume<span className="text-brand-600">IQ</span>
              </span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-brand-50 text-brand-700 border border-brand-200">
                AI Coach
              </span>
            </div>
            <span className="text-[10px] text-slate-500 font-medium -mt-0.5">ATS & Career Optimizer</span>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1 text-sm font-medium text-slate-600">
          <button
            onClick={() => onNavigate('landing')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              currentView === 'landing' ? 'text-brand-600 bg-brand-50/70 font-semibold' : 'hover:text-navy-900 hover:bg-slate-100'
            }`}
          >
            Home
          </button>
          <button
            onClick={() => {
              onNavigate('landing');
              setTimeout(() => {
                const el = document.getElementById('how-it-works');
                el?.scrollIntoView({ behavior: 'smooth' });
              }, 50);
            }}
            className="px-3 py-1.5 rounded-lg transition-colors hover:text-navy-900 hover:bg-slate-100"
          >
            How It Works
          </button>
          <button
            onClick={() => {
              onNavigate('landing');
              setTimeout(() => {
                const el = document.getElementById('features');
                el?.scrollIntoView({ behavior: 'smooth' });
              }, 50);
            }}
            className="px-3 py-1.5 rounded-lg transition-colors hover:text-navy-900 hover:bg-slate-100"
          >
            Features
          </button>
          <button
            onClick={() => onNavigate('history')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              currentView === 'history' ? 'text-brand-600 bg-brand-50/70 font-semibold' : 'hover:text-navy-900 hover:bg-slate-100'
            }`}
          >
            History
          </button>
          <button
            onClick={() => {
              onNavigate('landing');
              setTimeout(() => {
                const el = document.getElementById('pricing');
                el?.scrollIntoView({ behavior: 'smooth' });
              }, 50);
            }}
            className="px-3 py-1.5 rounded-lg transition-colors hover:text-navy-900 hover:bg-slate-100"
          >
            Pricing
          </button>
        </nav>

        {/* Right CTA */}
        <div className="flex items-center gap-3">
          {isDemo && (
            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-medium">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
              Demo Analysis
            </div>
          )}

          <button
            onClick={() => onNavigate('profile')}
            className="hidden sm:flex items-center gap-2 text-sm font-medium text-slate-700 hover:text-brand-600 px-3 py-1.5 rounded-lg hover:bg-slate-100 transition-colors"
          >
            Profile
          </button>

          <button
            onClick={() => onNavigate('analyzer')}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-brand-600 to-navy-900 hover:from-brand-500 hover:to-navy-800 text-white text-sm font-semibold shadow-md shadow-brand-600/20 hover:shadow-lg hover:shadow-brand-600/30 transition-all duration-200 group active:scale-95"
          >
            <span>Analyze My Resume</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </div>
    </header>
  );
};
