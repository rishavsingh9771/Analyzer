import React, { useState, useRef } from 'react';
import { 
  Upload, 
  FileText, 
  X, 
  CheckCircle2, 
  ArrowRight, 
  Sparkles, 
  AlertCircle, 
  FileUp, 
  RefreshCw,
  FolderOpen
} from 'lucide-react';

interface AnalyzerProps {
  onAnalyze: (formData: FormData) => void;
  isLoading: boolean;
}

export const Analyzer: React.FC<AnalyzerProps> = ({ onAnalyze, isLoading }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isSampleResume, setIsSampleResume] = useState(false);
  const [sampleResumeId, setSampleResumeId] = useState<string>('');
  const [sampleResumeInfo, setSampleResumeInfo] = useState<{ filename: string; size: string } | null>(null);

  const [jobDescription, setJobDescription] = useState<string>('');
  const [jobTitle, setJobTitle] = useState<string>('Software Developer');
  const [dragActive, setDragActive] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const jdFileInputRef = useRef<HTMLInputElement>(null);

  // Handle Drag events
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const processFile = (file: File) => {
    const ext = file.name.split('.').pop()?.toLowerCase();
    if (ext !== 'pdf' && ext !== 'docx') {
      setErrorMessage('Unable to read this file. Please upload a valid PDF or DOCX resume.');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setErrorMessage('File too large. Maximum supported resume size is 10 MB.');
      return;
    }
    setErrorMessage(null);
    setSelectedFile(file);
    setIsSampleResume(false);
    setSampleResumeInfo(null);
  };

  const removeFile = () => {
    setSelectedFile(null);
    setIsSampleResume(false);
    setSampleResumeId('');
    setSampleResumeInfo(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const loadSampleResume = () => {
    setSelectedFile(null);
    setIsSampleResume(true);
    setSampleResumeId('software_developer');
    setSampleResumeInfo({
      filename: 'Rishav_Resume.pdf',
      size: '1.2 MB'
    });
    setErrorMessage(null);
  };

  const loadSampleJobDescription = () => {
    setJobTitle('Software Developer');
    setJobDescription(`Role: Software Developer (Full Stack / Backend)
Location: Remote / Hybrid
Company: CloudScale Innovations

About the Role:
We are seeking an ambitious, high-performing Software Developer to help construct our next-generation cloud analytics platform. In this role, you will design robust web services, build interactive frontends, and optimize high-throughput data pipelines.

Key Responsibilities:
• Design, implement, and maintain scalable REST APIs and microservices.
• Develop responsive, accessible web interfaces using modern React and TypeScript.
• Collaborate with product managers and infrastructure teams to deliver high-impact product features.
• Optimize SQL and NoSQL database queries for high concurrency and ultra-low latency.
• Write comprehensive unit, integration, and end-to-end automated tests.
• Champion continuous integration, containerization, and cloud deployment pipelines.

Requirements & Qualifications:
• 2+ years of professional software engineering experience.
• Strong proficiency in C++, Java, or modern JavaScript/TypeScript.
• Hands-on expertise with relational databases like PostgreSQL or MySQL and SQL query tuning.
• Experience with Git version control, RESTful API architecture, and OOP design patterns.
• Familiarity with containerization (Docker) and cloud infrastructure (AWS or GCP).
• Understanding of Microservices architecture and distributed message queues.
• Strong communication skills and willingness to take ownership of complex technical initiatives.`);
  };

  const handleJdFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        setJobDescription(content);
      }
    };
    reader.readAsText(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!selectedFile && !isSampleResume) {
      setErrorMessage('Please upload your resume in PDF or DOCX format, or load the sample resume.');
      return;
    }

    const formData = new FormData();
    if (selectedFile) {
      formData.append('resume_file', selectedFile);
    } else if (isSampleResume) {
      formData.append('sample_resume_id', sampleResumeId);
    }
    if (jobDescription && jobDescription.trim().length > 0) {
      formData.append('job_description', jobDescription);
    }
    formData.append('job_title', jobTitle);

    onAnalyze(formData);
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes >= 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    return Math.round(bytes / 1024) + ' KB';
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 sm:py-12">
      {/* Page Header */}
      <div className="text-center max-w-2xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-50 border border-brand-200 text-brand-700 text-xs font-semibold mb-3">
          <Sparkles className="w-3.5 h-3.5 text-brand-600" />
          <span>Intelligent Resume Screening Engine</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-navy-900 tracking-tight">
          Analyze Your Resume Against the Job
        </h1>
        <p className="text-slate-600 text-sm sm:text-base mt-2">
          Upload your resume and paste the target job description to reveal your ATS score, matched keywords, and personalized improvements.
        </p>
      </div>

      {/* Error Alert Banner */}
      {errorMessage && (
        <div className="mb-8 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 flex items-center gap-3 animate-shake">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
          <span className="text-sm font-medium">{errorMessage}</span>
          <button 
            onClick={() => setErrorMessage(null)} 
            className="ml-auto text-rose-500 hover:text-rose-700 p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Main 2-Card Layout */}
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          
          {/* LEFT CARD: Resume Upload Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-brand-50 flex items-center justify-center text-brand-600 font-bold">
                    1
                  </div>
                  <h2 className="text-lg font-bold text-navy-900">Upload Your Resume</h2>
                </div>
                
                <button
                  type="button"
                  onClick={loadSampleResume}
                  className="text-xs font-semibold text-brand-600 hover:text-brand-700 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Load Sample Resume</span>
                </button>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.docx"
                onChange={handleFileChange}
                className="hidden"
                id="resume-file-input"
              />

              {/* Upload state or File Preview */}
              {!selectedFile && !isSampleResume ? (
                <div
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-2xl p-8 sm:p-12 text-center cursor-pointer transition-all duration-200 flex flex-col items-center justify-center ${
                    dragActive 
                      ? 'border-brand-500 bg-brand-50/50 scale-[1.01]' 
                      : 'border-slate-300 hover:border-brand-400 bg-slate-50/50 hover:bg-slate-50'
                  }`}
                >
                  <div className="w-14 h-14 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center mb-4 shadow-xs">
                    <Upload className="w-7 h-7" />
                  </div>
                  <h3 className="text-base font-semibold text-navy-900 mb-1">
                    Drop your PDF or DOCX here
                  </h3>
                  <p className="text-xs text-slate-500 mb-4">
                    Supports standard PDF and Word (.docx) documents up to 10MB
                  </p>
                  <button
                    type="button"
                    className="px-4 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 text-xs font-semibold shadow-xs hover:bg-slate-50 transition-colors"
                  >
                    Browse Files
                  </button>
                </div>
              ) : (
                /* Uploaded File Ready State */
                <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-12 h-12 rounded-xl bg-brand-600 text-white flex items-center justify-center font-bold shrink-0 shadow-sm">
                        <FileText className="w-6 h-6" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-navy-900 truncate">
                          📄 {selectedFile ? selectedFile.name : sampleResumeInfo?.filename}
                        </p>
                        <div className="flex items-center gap-3 text-xs text-slate-500 mt-0.5">
                          <span>Size: {selectedFile ? formatFileSize(selectedFile.size) : sampleResumeInfo?.size}</span>
                          {isSampleResume && (
                            <span className="px-1.5 py-0.5 rounded bg-brand-100 text-brand-800 text-[10px] font-semibold">
                              Sample Data
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={removeFile}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                      title="Remove file"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Status Indicator */}
                  <div className="flex items-center justify-between pt-3 border-t border-slate-200 text-xs font-semibold">
                    <span className="text-emerald-700 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      Ready to analyze
                    </span>
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="text-brand-600 hover:text-brand-700 font-medium hover:underline"
                    >
                      Replace File
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span>Privacy protected: No data sold</span>
              <span className="text-slate-400">PDF, DOCX formats</span>
            </div>
          </div>

          {/* RIGHT CARD: Job Description Input Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-purpleAccent-500/10 flex items-center justify-center text-purpleAccent-600 font-bold">
                    2
                  </div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-bold text-navy-900">Job Description</h2>
                    <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-slate-100 text-slate-600 border border-slate-200">
                      Optional
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={loadSampleJobDescription}
                    className="text-xs font-semibold text-purpleAccent-600 hover:text-purpleAccent-700 hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Load Sample JD</span>
                  </button>

                  <input
                    ref={jdFileInputRef}
                    type="file"
                    accept=".txt,.pdf,.docx"
                    onChange={handleJdFileUpload}
                    className="hidden"
                    id="jd-file-input"
                  />
                  <button
                    type="button"
                    onClick={() => jdFileInputRef.current?.click()}
                    className="hidden sm:inline-flex items-center gap-1 text-xs text-slate-600 hover:text-navy-900 bg-slate-100 hover:bg-slate-200 px-2.5 py-1 rounded-lg transition-colors font-medium cursor-pointer"
                  >
                    <FolderOpen className="w-3 h-3" />
                    <span>Upload JD</span>
                  </button>
                </div>
              </div>

              {/* Large Textarea */}
              <div className="relative">
                <textarea
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  placeholder="Optional: Paste a job description here for role-specific alignment... OR leave blank to run a general ATS score and skills audit against industry benchmarks!"
                  rows={10}
                  className="w-full rounded-2xl border border-slate-200 p-4 text-sm text-slate-800 placeholder-slate-400 focus:border-brand-500 focus:ring-2 focus:ring-brand-100 outline-none resize-none transition-all leading-relaxed"
                />

                {/* Character Counter */}
                <div className="absolute bottom-3 right-3 text-[11px] font-medium text-slate-400 bg-white/80 px-2 py-0.5 rounded-md border border-slate-200">
                  {jobDescription.length} characters
                </div>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between text-xs text-slate-500">
              <span>
                {jobDescription.trim().length > 0 ? (
                  <span className="text-purpleAccent-700 font-medium flex items-center gap-1">
                    <Sparkles className="w-3 h-3" /> Role-specific target matching active
                  </span>
                ) : (
                  <span className="text-emerald-700 font-medium flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> General ATS & Skills Audit active (Industry Benchmark)
                  </span>
                )}
              </span>
              {jobDescription.length > 0 && (
                <button
                  type="button"
                  onClick={() => setJobDescription('')}
                  className="text-slate-400 hover:text-rose-600 cursor-pointer"
                >
                  Clear text
                </button>
              )}
            </div>
          </div>

        </div>

        {/* BOTTOM ACTION BAR */}
        <div className="flex flex-col sm:flex-row items-center justify-center pt-4">
          <button
            type="submit"
            disabled={isLoading}
            className={`inline-flex items-center justify-center gap-3 px-10 py-4 rounded-2xl text-base font-bold shadow-xl transition-all duration-200 active:scale-[0.98] ${
              isLoading
                ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                : 'bg-gradient-to-r from-brand-600 via-brand-700 to-navy-900 hover:from-brand-500 hover:to-navy-800 text-white shadow-brand-600/30 hover:shadow-2xl hover:shadow-brand-600/40 hover:-translate-y-0.5 cursor-pointer'
            }`}
          >
            {isLoading ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin" />
                <span>Preparing Analysis...</span>
              </>
            ) : (
              <>
                <span>Analyze Resume</span>
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
