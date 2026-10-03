import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { LandingPage } from './components/LandingPage';
import { Analyzer } from './components/Analyzer';
import { AnalysisLoading } from './components/AnalysisLoading';
import { ResultsDashboard } from './components/ResultsDashboard';
import { HistoryPage } from './components/HistoryPage';
import { ProfilePage } from './components/ProfilePage';
import { AnalysisResult, UserProfile } from './types';
import { analyzeResumeRequest, fetchProfile, checkHealth } from './api';

export function App() {
  const [currentView, setCurrentView] = useState<string>('landing');
  const [activeAnalysis, setActiveAnalysis] = useState<AnalysisResult | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isDemo, setIsDemo] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Initialize data on mount
  useEffect(() => {
    // Check backend health & demo status
    checkHealth().then((h) => {
      if (!h.ai_configured || h.active_model === 'demo-mode') {
        setIsDemo(true);
      }
    });

    // Load initial profile
    fetchProfile().then((p) => setProfile(p)).catch(() => {});
  }, []);

  const handleStartAnalysis = () => {
    setCurrentView('analyzer');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAnalyze = async (formData: FormData) => {
    setIsLoading(true);
    setCurrentView('loading');
    window.scrollTo({ top: 0, behavior: 'smooth' });

    try {
      const result = await analyzeResumeRequest(formData);
      
      // Artificial slight delay so user experiences the multi-step loading animation
      setTimeout(() => {
        setActiveAnalysis(result);
        if (result.is_demo) {
          setIsDemo(true);
        }
        setIsLoading(false);
        setCurrentView('results');
        window.scrollTo({ top: 0, behavior: 'smooth' });

        // Trigger celebratory confetti if score is high
        if (result.ats_score >= 80) {
          try {
            confetti({
              particleCount: 80,
              spread: 60,
              origin: { y: 0.6 }
            });
          } catch (e) {}
        }
      }, 2600);

    } catch (err: any) {
      console.error(err);
      setIsLoading(false);
      setCurrentView('analyzer');
      alert(err.message || 'Analysis failed. Please check your document and try again.');
    }
  };

  const handleViewAnalysis = (data: AnalysisResult) => {
    setActiveAnalysis(data);
    setCurrentView('results');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const isDashboardView = currentView !== 'landing';

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col">
      {/* Top Navbar */}
      <Navbar 
        currentView={currentView} 
        onNavigate={(view) => {
          setCurrentView(view);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        isDemo={isDemo}
      />

      {/* Main Container */}
      <div className="flex-1 flex w-full">
        {/* Sidebar when inside app views */}
        {isDashboardView && (
          <Sidebar
            currentView={currentView}
            onNavigate={(view) => {
              if (view === 'dashboard' || view === 'results') {
                if (activeAnalysis) {
                  setCurrentView('results');
                } else {
                  setCurrentView('analyzer');
                }
              } else if (view === 'resumes' || view === 'matches' || view === 'settings') {
                setCurrentView(view);
              } else {
                setCurrentView(view);
              }
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            profile={profile}
          />
        )}

        {/* Page Views Content */}
        <main className="flex-1 min-w-0">
          {currentView === 'landing' && (
            <LandingPage onStartAnalysis={handleStartAnalysis} />
          )}

          {currentView === 'analyzer' && (
            <Analyzer onAnalyze={handleAnalyze} isLoading={isLoading} />
          )}

          {currentView === 'loading' && (
            <AnalysisLoading />
          )}

          {currentView === 'results' && activeAnalysis && (
            <ResultsDashboard
              data={activeAnalysis}
              onAnalyzeAgain={() => {
                setCurrentView('analyzer');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
          )}

          {currentView === 'history' && (
            <HistoryPage
              onViewAnalysis={handleViewAnalysis}
              onNavigateToAnalyzer={() => {
                setCurrentView('analyzer');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
          )}

          {currentView === 'profile' && (
            <ProfilePage
              onProfileUpdated={(updated) => setProfile(updated)}
            />
          )}

          {/* Placeholders for secondary navigation items */}
          {(currentView === 'resumes' || currentView === 'matches' || currentView === 'settings') && (
            <div className="max-w-4xl mx-auto px-4 py-16 text-center">
              <div className="w-16 h-16 rounded-3xl bg-brand-50 text-brand-600 flex items-center justify-center mx-auto mb-4 font-bold text-xl">
                {currentView.charAt(0).toUpperCase()}
              </div>
              <h2 className="text-2xl font-bold text-navy-900 capitalize mb-2">
                {currentView === 'resumes' ? 'My Resumes Repository' : currentView === 'matches' ? 'Target Job Matches' : 'Account & ATS Preferences'}
              </h2>
              <p className="text-sm text-slate-500 max-w-md mx-auto mb-6">
                Manage your saved resumes, target job descriptions, and custom ATS calibration preferences.
              </p>
              <button
                onClick={() => setCurrentView('analyzer')}
                className="px-5 py-2.5 rounded-xl bg-brand-600 text-white font-semibold text-xs hover:bg-brand-700 transition-colors"
              >
                Launch Analyzer
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default App;
