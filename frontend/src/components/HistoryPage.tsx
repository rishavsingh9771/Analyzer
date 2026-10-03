import React, { useState, useEffect } from 'react';
import { 
  History, 
  Trash2, 
  Eye, 
  Download, 
  ArrowRight, 
  Search, 
  FileText, 
  RotateCcw,
  Sparkles
} from 'lucide-react';
import { HistoryItem, AnalysisResult } from '../types';
import { fetchHistory, fetchHistoryDetail, deleteHistoryRecord } from '../api';

interface HistoryPageProps {
  onViewAnalysis: (data: AnalysisResult) => void;
  onNavigateToAnalyzer: () => void;
}

export const HistoryPage: React.FC<HistoryPageProps> = ({ onViewAnalysis, onNavigateToAnalyzer }) => {
  const [historyItems, setHistoryItems] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const loadHistory = async () => {
    setLoading(true);
    try {
      const items = await fetchHistory();
      setHistoryItems(items);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHistory();
  }, []);

  const handleView = async (id: string) => {
    try {
      const fullData = await fetchHistoryDetail(id);
      onViewAnalysis(fullData);
    } catch (e) {
      alert('Failed to load analysis details');
    }
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm('Are you sure you want to delete this analysis record?')) return;
    setDeletingId(id);
    try {
      await deleteHistoryRecord(id);
      setHistoryItems(prev => prev.filter(item => item.id !== id));
    } catch (e) {
      alert('Failed to delete item');
    } finally {
      setDeletingId(null);
    }
  };

  const filteredItems = historyItems.filter(item => 
    item.resume_filename.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.job_title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 sm:py-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-50 border border-brand-200 text-brand-700 text-xs font-semibold mb-2">
            <History className="w-3.5 h-3.5 text-brand-600" />
            <span>Audit History & Archives</span>
          </div>
          <h1 className="text-3xl font-extrabold text-navy-900 tracking-tight">
            Analysis History
          </h1>
          <p className="text-slate-600 text-sm mt-1">
            Review past resume evaluations, track score improvements, and export audit reports.
          </p>
        </div>

        <button
          onClick={onNavigateToAnalyzer}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-brand-600 to-navy-900 hover:from-brand-500 hover:to-navy-800 text-white text-sm font-semibold shadow-xs transition-colors self-start sm:self-auto"
        >
          <Sparkles className="w-4 h-4" />
          <span>New Analysis</span>
        </button>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs mb-6 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 flex-1">
          <Search className="w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by resume name or target job role..."
            className="w-full text-xs sm:text-sm text-slate-800 placeholder-slate-400 outline-none"
          />
        </div>
        <span className="text-xs text-slate-400 shrink-0">
          {filteredItems.length} records found
        </span>
      </div>

      {/* History Table Card */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-16 text-center text-slate-400 text-sm flex flex-col items-center justify-center">
            <RotateCcw className="w-6 h-6 animate-spin mb-3 text-brand-600" />
            <span>Loading analysis history...</span>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="p-16 text-center flex flex-col items-center justify-center">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mb-4">
              <FileText className="w-6 h-6" />
            </div>
            <h4 className="text-base font-bold text-navy-900 mb-1">No analysis records yet</h4>
            <p className="text-xs text-slate-500 max-w-sm mb-6">
              Run your first resume optimization to see historical ATS performance comparisons here.
            </p>
            <button
              onClick={onNavigateToAnalyzer}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-600 text-white text-xs font-semibold hover:bg-brand-700 transition-colors"
            >
              <span>Analyze a Resume Now</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-bold text-xs uppercase tracking-wider">
                  <th className="py-4 px-6">Resume</th>
                  <th className="py-4 px-6">Job Role</th>
                  <th className="py-4 px-6 text-center">ATS Score</th>
                  <th className="py-4 px-6 text-center">Match</th>
                  <th className="py-4 px-6">Date</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredItems.map((item) => (
                  <tr 
                    key={item.id}
                    onClick={() => handleView(item.id)}
                    className="hover:bg-slate-50/70 transition-colors cursor-pointer group"
                  >
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2.5">
                        <FileText className="w-4 h-4 text-brand-600 shrink-0" />
                        <span className="font-semibold text-navy-900 group-hover:text-brand-600 transition-colors truncate max-w-xs">
                          {item.resume_filename}
                        </span>
                      </div>
                    </td>

                    <td className="py-4 px-6 text-slate-700 font-medium">
                      {item.job_title}
                    </td>

                    <td className="py-4 px-6 text-center">
                      <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-bold ${
                        item.ats_score >= 85 ? 'bg-emerald-100 text-emerald-800' :
                        item.ats_score >= 70 ? 'bg-amber-100 text-amber-800' :
                        'bg-rose-100 text-rose-800'
                      }`}>
                        {item.ats_score} / 100
                      </span>
                    </td>

                    <td className="py-4 px-6 text-center">
                      <span className="text-xs font-bold text-slate-700">
                        {item.job_match}%
                      </span>
                    </td>

                    <td className="py-4 px-6 text-xs text-slate-500">
                      {item.created_at}
                    </td>

                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => handleView(item.id)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-brand-600 hover:bg-slate-100 transition-colors"
                          title="View analysis"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={(e) => handleDelete(item.id, e)}
                          disabled={deletingId === item.id}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors disabled:opacity-50"
                          title="Delete record"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
