import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  FileSearch, 
  FileText, 
  History, 
  Target, 
  User, 
  Settings, 
  HelpCircle, 
  ChevronLeft, 
  ChevronRight,
  Sparkles,
  Menu,
  X
} from 'lucide-react';
import { UserProfile } from '../types';

interface SidebarProps {
  currentView: string;
  onNavigate: (view: string) => void;
  profile?: UserProfile | null;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentView, onNavigate, profile }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = [
    { id: 'results', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'analyzer', label: 'Analyze Resume', icon: FileSearch },
    { id: 'resumes', label: 'My Resumes', icon: FileText },
    { id: 'history', label: 'Analysis History', icon: History },
    { id: 'matches', label: 'Job Matches', icon: Target },
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <>
      {/* Mobile Top Bar with Hamburger */}
      <div className="lg:hidden flex items-center justify-between px-4 py-3 bg-white border-b border-slate-200 sticky top-0 z-30">
        <div 
          onClick={() => onNavigate('landing')}
          className="flex items-center gap-2 cursor-pointer"
        >
          <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center text-white">
            <Sparkles className="w-4 h-4" />
          </div>
          <span className="font-bold text-navy-900 text-lg">ResumeIQ</span>
        </div>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2 rounded-lg text-slate-600 hover:bg-slate-100"
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer Overlay */}
      {mobileOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile Drawer Content */}
      <div className={`fixed inset-y-0 left-0 w-72 bg-white z-50 shadow-2xl flex flex-col transition-transform duration-300 ease-in-out lg:hidden ${
        mobileOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="p-5 flex items-center justify-between border-b border-slate-200">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-brand-600 flex items-center justify-center text-white">
              <Sparkles className="w-5 h-5" />
            </div>
            <span className="font-bold text-navy-900 text-lg">ResumeIQ</span>
          </div>
          <button 
            onClick={() => setMobileOpen(false)}
            className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onNavigate(item.id);
                  setMobileOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  active 
                    ? 'bg-brand-50 text-brand-700 font-semibold shadow-xs' 
                    : 'text-slate-600 hover:bg-slate-50 hover:text-navy-900'
                }`}
              >
                <Icon className={`w-5 h-5 ${active ? 'text-brand-600' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

        <div className="p-4 border-t border-slate-200 space-y-3">
          <button 
            onClick={() => {
              onNavigate('settings');
              setMobileOpen(false);
            }}
            className="w-full flex items-center gap-3 px-3.5 py-2 text-sm text-slate-600 hover:text-navy-900"
          >
            <HelpCircle className="w-5 h-5 text-slate-400" />
            <span>Help & Support</span>
          </button>

          <div 
            onClick={() => {
              onNavigate('profile');
              setMobileOpen(false);
            }}
            className="flex items-center gap-3 p-2 rounded-xl bg-slate-50 hover:bg-slate-100 cursor-pointer transition-colors"
          >
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-brand-600 to-purpleAccent-600 flex items-center justify-center text-white font-bold text-sm">
              {profile?.name ? profile.name.charAt(0) : 'R'}
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-sm font-semibold text-navy-900 truncate">
                {profile?.name || 'Rishav Kumar'}
              </span>
              <span className="text-xs text-slate-500 truncate">
                {profile?.target_role || 'Software Developer'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop Persistent Collapsible Sidebar */}
      <aside className={`hidden lg:flex flex-col bg-white border-r border-slate-200/90 transition-all duration-300 relative z-20 shrink-0 ${
        collapsed ? 'w-20' : 'w-64'
      }`}>
        {/* Header */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-slate-200/80">
          {!collapsed ? (
            <div 
              onClick={() => onNavigate('landing')}
              className="flex items-center gap-2.5 cursor-pointer group"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-700 to-brand-500 flex items-center justify-center text-white shadow-sm shadow-brand-500/30">
                <Sparkles className="w-4 h-4" />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-navy-900 text-lg tracking-tight font-sans">
                  Resume<span className="text-brand-600">IQ</span>
                </span>
              </div>
            </div>
          ) : (
            <div 
              onClick={() => onNavigate('landing')}
              className="w-10 h-10 mx-auto rounded-xl bg-gradient-to-tr from-brand-700 to-brand-500 flex items-center justify-center text-white shadow-sm cursor-pointer"
            >
              <Sparkles className="w-5 h-5" />
            </div>
          )}

          <button
            onClick={() => setCollapsed(!collapsed)}
            className={`p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors ${
              collapsed ? 'mx-auto mt-2' : ''
            }`}
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Nav Items */}
        <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
                  active
                    ? 'bg-brand-50 text-brand-700 font-semibold shadow-xs'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-navy-900'
                } ${collapsed ? 'justify-center px-2' : ''}`}
                title={collapsed ? item.label : undefined}
              >
                <Icon className={`w-5 h-5 shrink-0 ${active ? 'text-brand-600' : 'text-slate-400'}`} />
                {!collapsed && <span className="truncate">{item.label}</span>}
              </button>
            );
          })}
        </div>

        {/* Bottom Section */}
        <div className="p-3 border-t border-slate-200/80 space-y-2">
          <button
            onClick={() => onNavigate('settings')}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-slate-600 hover:text-navy-900 hover:bg-slate-50 transition-colors ${
              collapsed ? 'justify-center px-2' : ''
            }`}
            title={collapsed ? 'Help & Support' : undefined}
          >
            <HelpCircle className="w-5 h-5 shrink-0 text-slate-400" />
            {!collapsed && <span className="truncate">Help & Support</span>}
          </button>

          {/* User Profile Card */}
          <div
            onClick={() => onNavigate('profile')}
            className={`flex items-center gap-3 p-2 rounded-xl hover:bg-slate-100 cursor-pointer transition-colors ${
              collapsed ? 'justify-center p-1' : ''
            }`}
            title={collapsed ? profile?.name || 'Rishav Kumar' : undefined}
          >
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-brand-600 to-purpleAccent-600 flex items-center justify-center text-white font-bold text-xs shrink-0 shadow-xs">
              {profile?.name ? profile.name.charAt(0) : 'R'}
            </div>
            {!collapsed && (
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-bold text-navy-900 truncate">
                  {profile?.name || 'Rishav Kumar'}
                </span>
                <span className="text-[11px] text-slate-500 truncate">
                  {profile?.target_role || 'Software Developer'}
                </span>
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
};
