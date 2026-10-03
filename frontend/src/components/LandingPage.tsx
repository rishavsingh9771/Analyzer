import React from 'react';
import { 
  ArrowRight, 
  CheckCircle2, 
  AlertTriangle, 
  Upload, 
  FileText, 
  Sparkles, 
  Cpu, 
  Check, 
  Zap, 
  BarChart3, 
  FileCheck, 
  Target,
  Sliders,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';

interface LandingPageProps {
  onStartAnalysis: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onStartAnalysis }) => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28 bg-gradient-to-b from-brand-50/60 via-slate-50 to-white">
        {/* Subtle background glow */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-gradient-to-tr from-brand-200/40 via-purple-200/30 to-blue-200/40 rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            
            {/* Left Column: Heading & CTAs */}
            <div className="lg:col-span-7 flex flex-col items-start space-y-6 text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-100/80 border border-brand-200 text-brand-800 text-xs font-semibold shadow-xs">
                <Sparkles className="w-3.5 h-3.5 text-brand-600" />
                <span>Next-Gen ATS Parser & AI Career Coach</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-navy-900 tracking-tight leading-[1.12]">
                Turn Your Resume Into an <span className="bg-gradient-to-r from-brand-600 to-purpleAccent-600 bg-clip-text text-transparent">Interview Magnet</span>.
              </h1>

              <p className="text-lg sm:text-xl text-slate-600 max-w-2xl font-normal leading-relaxed">
                AI-powered resume analysis that checks ATS compatibility, matches your resume with job descriptions, and tells you exactly what to improve.
              </p>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2 w-full sm:w-auto">
                <button
                  onClick={onStartAnalysis}
                  className="inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-xl bg-gradient-to-r from-brand-600 to-navy-900 hover:from-brand-500 hover:to-navy-800 text-white font-semibold shadow-lg shadow-brand-600/25 hover:shadow-xl hover:shadow-brand-600/35 transition-all duration-200 group active:scale-[0.98]"
                >
                  <span className="text-base">Analyze My Resume</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>

                <a
                  href="#how-it-works"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white border border-slate-200 text-slate-700 font-semibold hover:bg-slate-50 hover:border-slate-300 shadow-xs transition-all duration-200"
                >
                  <span>See How It Works</span>
                </a>
              </div>

              {/* Social Proof stats */}
              <div className="pt-6 border-t border-slate-200/80 grid grid-cols-3 gap-6 w-full max-w-lg">
                <div>
                  <div className="text-2xl font-extrabold text-navy-900 font-sans">98.4%</div>
                  <div className="text-xs text-slate-500 mt-0.5">ATS Parse Accuracy</div>
                </div>
                <div>
                  <div className="text-2xl font-extrabold text-navy-900 font-sans">3.2x</div>
                  <div className="text-xs text-slate-500 mt-0.5">More Interviews</div>
                </div>
                <div>
                  <div className="text-2xl font-extrabold text-navy-900 font-sans">50k+</div>
                  <div className="text-xs text-slate-500 mt-0.5">Resumes Optimized</div>
                </div>
              </div>
            </div>

            {/* Right Column: Floating Mock ATS Dashboard */}
            <div className="lg:col-span-5 relative flex justify-center">
              {/* Card Outer Container with glowing border */}
              <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl shadow-slate-300/60 border border-slate-200/90 relative">
                
                {/* Header bar */}
                <div className="flex items-center justify-between pb-5 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-brand-50 flex items-center justify-center text-brand-600 font-bold border border-brand-100">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-navy-900">Rishav_Resume.pdf</h4>
                      <p className="text-xs text-slate-400">Target: Software Developer</p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 font-semibold text-xs border border-emerald-200">
                    Live Preview
                  </span>
                </div>

                {/* ATS Score Floating Showcase */}
                <div className="py-6 flex flex-col items-center text-center">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                    ATS Compatibility Score
                  </span>

                  {/* Circular Score Gauge */}
                  <div className="relative w-36 h-36 flex items-center justify-center my-2">
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
                        className="text-brand-600 transition-all duration-1000 ease-out"
                        strokeWidth="10"
                        strokeDasharray={314.159}
                        strokeDashoffset={314.159 * (1 - 0.87)}
                        strokeLinecap="round"
                        stroke="currentColor"
                        fill="transparent"
                      />
                    </svg>
                    <div className="absolute flex flex-col items-center justify-center">
                      <span className="text-3xl font-black text-navy-900 tracking-tight">87</span>
                      <span className="text-[11px] font-semibold text-slate-400 -mt-0.5">/ 100</span>
                    </div>
                  </div>

                  <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100/70 text-emerald-800 text-xs font-bold">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Excellent Compatibility</span>
                  </div>
                </div>

                {/* Score Diagnostic Checklist */}
                <div className="bg-slate-50/80 rounded-2xl p-4 border border-slate-100 space-y-2.5 text-left text-xs font-medium">
                  <div className="flex items-center gap-2.5 text-emerald-700">
                    <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                      <Check className="w-3 h-3 text-emerald-600 font-bold" />
                    </div>
                    <span>Strong keyword match (C++, Java, SQL, REST API)</span>
                  </div>

                  <div className="flex items-center gap-2.5 text-emerald-700">
                    <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                      <Check className="w-3 h-3 text-emerald-600 font-bold" />
                    </div>
                    <span>ATS-friendly format & clean structure</span>
                  </div>

                  <div className="flex items-center gap-2.5 text-amber-700">
                    <div className="w-5 h-5 rounded-full bg-amber-100 flex items-center justify-center shrink-0">
                      <AlertTriangle className="w-3 h-3 text-amber-600" />
                    </div>
                    <span>Missing 3 important skills (Docker, AWS, Microservices)</span>
                  </div>
                </div>

                {/* Quick button */}
                <button
                  onClick={onStartAnalysis}
                  className="w-full mt-4 py-2.5 rounded-xl bg-brand-50 hover:bg-brand-100 text-brand-700 font-semibold text-xs border border-brand-200 transition-colors flex items-center justify-center gap-1.5"
                >
                  <span>Test Your Own Resume</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-white border-y border-slate-200/80 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          
          <div className="max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-brand-600 bg-brand-50 px-3 py-1 rounded-full border border-brand-100">
              Simple 3-Step Process
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-navy-900 tracking-tight mt-3">
              How ResumeIQ Works
            </h2>
            <p className="text-slate-600 text-base sm:text-lg mt-3">
              In less than 30 seconds, get recruiter-grade insights and clear step-by-step improvements.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Step 1 */}
            <div className="bg-slate-50/70 rounded-3xl p-8 border border-slate-200/80 hover:shadow-lg hover:border-brand-300 transition-all duration-300 text-left flex flex-col group">
              <div className="w-12 h-12 rounded-2xl bg-brand-600 text-white flex items-center justify-center font-bold text-lg shadow-md shadow-brand-500/20 mb-6 group-hover:scale-110 transition-transform">
                <Upload className="w-6 h-6" />
              </div>
              <div className="text-xs font-bold uppercase tracking-wider text-brand-600 mb-1">Step 1</div>
              <h3 className="text-xl font-bold text-navy-900 mb-2">Upload Resume</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Upload your PDF or DOCX resume. Our parser extracts raw text, section hierarchies, and layout geometry without losing data.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-slate-50/70 rounded-3xl p-8 border border-slate-200/80 hover:shadow-lg hover:border-brand-300 transition-all duration-300 text-left flex flex-col group">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-600 to-purpleAccent-600 text-white flex items-center justify-center font-bold text-lg shadow-md shadow-purpleAccent-600/20 mb-6 group-hover:scale-110 transition-transform">
                <FileText className="w-6 h-6" />
              </div>
              <div className="text-xs font-bold uppercase tracking-wider text-purpleAccent-600 mb-1">Step 2</div>
              <h3 className="text-xl font-bold text-navy-900 mb-2">Add Job Description</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Paste the job description you're applying for. We extract technical requirements, soft skills, seniority indicators, and required credentials.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-slate-50/70 rounded-3xl p-8 border border-slate-200/80 hover:shadow-lg hover:border-brand-300 transition-all duration-300 text-left flex flex-col group">
              <div className="w-12 h-12 rounded-2xl bg-navy-900 text-white flex items-center justify-center font-bold text-lg shadow-md shadow-navy-900/20 mb-6 group-hover:scale-110 transition-transform">
                <Zap className="w-6 h-6 text-amber-400" />
              </div>
              <div className="text-xs font-bold uppercase tracking-wider text-navy-900 mb-1">Step 3</div>
              <h3 className="text-xl font-bold text-navy-900 mb-2">Get AI Analysis</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Receive your ATS score and personalized recommendations. Inspect missing keywords, improve individual bullet points, and simulate score improvements.
              </p>
            </div>
          </div>

          <div className="mt-12">
            <button
              onClick={onStartAnalysis}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-sm shadow-md transition-all active:scale-95"
            >
              <span>Get Started Now</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* Features Grid Section */}
      <section id="features" className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-brand-600 bg-brand-50 px-3 py-1 rounded-full border border-brand-100">
              Comprehensive Suite
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-navy-900 tracking-tight mt-3">
              Built for Modern ATS Standards
            </h2>
            <p className="text-slate-600 text-base sm:text-lg mt-3">
              Most candidates fail ATS screening before a human recruiter even views their resume. ResumeIQ ensures your credentials shine through.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs hover:shadow-md transition-all">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-brand-600 flex items-center justify-center mb-4">
                <Target className="w-5 h-5" />
              </div>
              <h4 className="text-lg font-bold text-navy-900 mb-2">ATS Compatibility Score</h4>
              <p className="text-slate-600 text-sm">
                Transparent 0-100 scoring based on Keywords, Skills, Experience Relevance, Structure, and Formatting rules.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs hover:shadow-md transition-all">
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-purpleAccent-600 flex items-center justify-center mb-4">
                <BarChart3 className="w-5 h-5" />
              </div>
              <h4 className="text-lg font-bold text-navy-900 mb-2">3-Way Keyword Analyzer</h4>
              <p className="text-slate-600 text-sm">
                Distinguishes between Matched Keywords, Missing Critical Keywords, and Overused generic phrases like "Responsible for".
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs hover:shadow-md transition-all">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
                <Sparkles className="w-5 h-5" />
              </div>
              <h4 className="text-lg font-bold text-navy-900 mb-2">AI Bullet Point Improver</h4>
              <p className="text-slate-600 text-sm">
                Transform weak duty descriptions into high-impact Google XYZ bullet points without fabricating ungrounded experiences.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs hover:shadow-md transition-all">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-4">
                <FileCheck className="w-5 h-5" />
              </div>
              <h4 className="text-lg font-bold text-navy-900 mb-2">Formatting Health Audit</h4>
              <p className="text-slate-600 text-sm">
                Flags multi-column tables, decorative icons, and complex layout elements that confuse legacy recruitment crawlers.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs hover:shadow-md transition-all">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4">
                <Sliders className="w-5 h-5" />
              </div>
              <h4 className="text-lg font-bold text-navy-900 mb-2">Resume Score Simulator</h4>
              <p className="text-slate-600 text-sm">
                Interactive simulator previewing how addressing each diagnostic recommendation lifts your ATS score toward 95+.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs hover:shadow-md transition-all">
              <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center mb-4">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h4 className="text-lg font-bold text-navy-900 mb-2">Side-by-Side Comparison</h4>
              <p className="text-slate-600 text-sm">
                Interactive side-by-side highlighting showing matching skills in green, gaps in red, and partial matches in yellow.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Teaser Section */}
      <section id="pricing" className="py-20 bg-white border-t border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-brand-600 bg-brand-50 px-3 py-1 rounded-full border border-brand-100">
              Transparent Pricing
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-navy-900 tracking-tight mt-3">
              Accessible for Every Job Seeker
            </h2>
            <p className="text-slate-600 text-base mt-2">
              Start free today. No credit card required.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Free Tier */}
            <div className="rounded-3xl p-8 bg-slate-50 border border-slate-200 text-left flex flex-col justify-between">
              <div>
                <div className="inline-block px-3 py-1 rounded-full bg-slate-200 text-slate-700 text-xs font-bold mb-4">
                  Community Plan
                </div>
                <h3 className="text-2xl font-bold text-navy-900">Student & Job Seeker</h3>
                <div className="mt-4 flex items-baseline">
                  <span className="text-4xl font-extrabold text-navy-900">$0</span>
                  <span className="text-slate-500 ml-1 text-sm font-medium">/ forever</span>
                </div>
                <p className="text-slate-600 text-sm mt-3">
                  Everything you need to test and optimize your resume for upcoming applications.
                </p>

                <ul className="mt-6 space-y-3 text-sm text-slate-700">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600" /> Full ATS Compatibility Score
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600" /> Keyword Match & Skill Gap Diagnostics
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600" /> Interactive Bullet Point Improver
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600" /> Downloadable PDF Diagnostic Report
                  </li>
                </ul>
              </div>

              <button
                onClick={onStartAnalysis}
                className="w-full mt-8 py-3 rounded-xl bg-white border border-slate-300 text-slate-800 font-semibold hover:bg-slate-100 transition-colors"
              >
                Start Free Analysis
              </button>
            </div>

            {/* Pro Tier */}
            <div className="rounded-3xl p-8 bg-gradient-to-b from-navy-900 to-navy-950 text-white text-left flex flex-col justify-between shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 transform translate-x-8 -translate-y-8 w-40 h-40 bg-brand-500/20 rounded-full blur-2xl pointer-events-none" />

              <div>
                <div className="inline-block px-3 py-1 rounded-full bg-brand-500/30 text-brand-300 text-xs font-bold mb-4 border border-brand-400/30">
                  Pro Career Booster
                </div>
                <h3 className="text-2xl font-bold text-white">Unlimited Career Pass</h3>
                <div className="mt-4 flex items-baseline">
                  <span className="text-4xl font-extrabold text-white">$12</span>
                  <span className="text-slate-400 ml-1 text-sm font-medium">/ month</span>
                </div>
                <p className="text-slate-300 text-sm mt-3">
                  For active applicants targeting dozens of tech & corporate applications monthly.
                </p>

                <ul className="mt-6 space-y-3 text-sm text-slate-300">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-brand-400" /> Unlimited Real-time Resumes & JDs
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-brand-400" /> Deep Company-Specific ATS Emulation
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-brand-400" /> Unlimited AI Bullet Re-writes
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-brand-400" /> Priority Gemini 3.6 Flash Processing
                  </li>
                </ul>
              </div>

              <button
                onClick={onStartAnalysis}
                className="w-full mt-8 py-3 rounded-xl bg-gradient-to-r from-brand-500 to-brand-600 hover:from-brand-400 hover:to-brand-500 text-white font-semibold shadow-lg shadow-brand-500/25 transition-all"
              >
                Analyze My Resume Now
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 bg-slate-900 text-slate-400 text-sm border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-brand-600 flex items-center justify-center text-white font-bold text-xs">
              <Sparkles className="w-4 h-4" />
            </div>
            <span className="font-bold text-white tracking-tight">ResumeIQ</span>
            <span className="text-xs text-slate-500">© 2026 ResumeIQ Inc. All rights reserved.</span>
          </div>
          <div className="flex items-center gap-6 text-xs">
            <span className="hover:text-white cursor-pointer">Privacy Policy</span>
            <span className="hover:text-white cursor-pointer">Terms of Service</span>
            <span className="hover:text-white cursor-pointer">ATS Compliance Guide</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
