import React, { useState, useEffect } from 'react';
import { User, Mail, Target, Award, BarChart3, Edit3, Check, Sparkles, TrendingUp } from 'lucide-react';
import { UserProfile } from '../types';
import { fetchProfile, updateProfile } from '../api';

interface ProfilePageProps {
  onProfileUpdated?: (prof: UserProfile) => void;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({ onProfileUpdated }) => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);

  // Form states
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [targetRole, setTargetRole] = useState<string>('');

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    setLoading(true);
    try {
      const data = await fetchProfile();
      setProfile(data);
      setName(data.name);
      setEmail(data.email);
      setTargetRole(data.target_role);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const updated = await updateProfile(name, email, targetRole);
      setProfile(updated);
      setIsEditing(false);
      if (onProfileUpdated) onProfileUpdated(updated);
    } catch (e) {
      alert('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12 space-y-8">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-50 border border-brand-200 text-brand-700 text-xs font-semibold mb-2">
          <User className="w-3.5 h-3.5 text-brand-600" />
          <span>Candidate Account</span>
        </div>
        <h1 className="text-3xl font-extrabold text-navy-900 tracking-tight">
          User Profile
        </h1>
        <p className="text-slate-600 text-sm mt-1">
          Manage your career target preferences and track overall ATS optimization statistics.
        </p>
      </div>

      {/* Profile Overview Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pb-8 border-b border-slate-100">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-brand-600 to-purpleAccent-600 text-white flex items-center justify-center font-black text-2xl shadow-md shadow-brand-500/20">
              {profile?.name ? profile.name.charAt(0) : 'R'}
            </div>
            <div>
              <h2 className="text-xl font-bold text-navy-900">
                {profile?.name || 'Rishav Kumar'}
              </h2>
              <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                <span>{profile?.email || 'rishav.kumar@example.com'}</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => setIsEditing(!isEditing)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors"
          >
            <Edit3 className="w-4 h-4 text-slate-500" />
            <span>{isEditing ? 'Cancel' : 'Edit Profile'}</span>
          </button>
        </div>

        {/* Stats Grid */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-slate-50/80 rounded-2xl p-4 border border-slate-100 text-center">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
              Total Analyses
            </div>
            <div className="text-3xl font-black text-navy-900">
              {profile?.total_analyses || 0}
            </div>
            <div className="text-[11px] text-slate-500 mt-1">Resumes screened</div>
          </div>

          <div className="bg-slate-50/80 rounded-2xl p-4 border border-slate-100 text-center">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
              Average ATS Score
            </div>
            <div className="text-3xl font-black text-brand-600">
              {profile?.average_score || 0}
            </div>
            <div className="text-[11px] text-slate-500 mt-1">Overall compatibility</div>
          </div>

          <div className="bg-slate-50/80 rounded-2xl p-4 border border-slate-100 text-center">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
              Best Score
            </div>
            <div className="text-3xl font-black text-emerald-600">
              {profile?.best_score || 0}
            </div>
            <div className="text-[11px] text-slate-500 mt-1">Top evaluation</div>
          </div>
        </div>

        {/* Career Target Banner */}
        <div className="mt-6 p-4 rounded-2xl bg-brand-50/60 border border-brand-200/70 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-brand-600 text-white flex items-center justify-center">
              <Target className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-brand-700">
                Primary Career Target
              </span>
              <p className="text-sm font-bold text-navy-900">
                {profile?.target_role || 'Software Developer'}
              </p>
            </div>
          </div>
          <span className="text-xs font-medium text-brand-700 bg-white px-2.5 py-1 rounded-lg border border-brand-200">
            Active
          </span>
        </div>

        {/* Edit Profile Form */}
        {isEditing && (
          <form onSubmit={handleSave} className="mt-8 pt-6 border-t border-slate-100 space-y-4">
            <h3 className="text-sm font-bold text-navy-900 uppercase tracking-wider">
              Update Information
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full text-xs sm:text-sm p-3 rounded-xl border border-slate-200 focus:border-brand-500 focus:ring-1 focus:ring-brand-100 outline-none"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full text-xs sm:text-sm p-3 rounded-xl border border-slate-200 focus:border-brand-500 focus:ring-1 focus:ring-brand-100 outline-none"
                  required
                />
              </div>

              <div className="sm:col-span-2">
                <label className="text-xs font-semibold text-slate-600 block mb-1">
                  Career Target / Desired Role
                </label>
                <input
                  type="text"
                  value={targetRole}
                  onChange={(e) => setTargetRole(e.target.value)}
                  className="w-full text-xs sm:text-sm p-3 rounded-xl border border-slate-200 focus:border-brand-500 focus:ring-1 focus:ring-brand-100 outline-none"
                  placeholder="e.g. Full Stack Developer, Data Scientist, Product Manager"
                  required
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold shadow-xs disabled:opacity-50"
              >
                <Check className="w-4 h-4" />
                <span>{saving ? 'Saving...' : 'Save Changes'}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
