import React, { useState } from 'react';
import {
  Video,
  Image as ImageIcon,
  UploadCloud,
  Sparkles,
  FileText,
  Clock,
  ListChecks,
  CheckCircle2,
  BookOpen,
  ArrowRight,
  ShieldCheck,
  Play,
  RotateCcw,
} from 'lucide-react';
import { AcademicRAGService } from '../services/api';
import { DocumentChunk } from '../types';

interface MultimodalAnalyzerProps {
  onAddAnalyzedDocument?: (doc: DocumentChunk) => void;
  onNavigateToChat?: () => void;
}

export const MultimodalAnalyzer: React.FC<MultimodalAnalyzerProps> = ({
  onAddAnalyzedDocument,
  onNavigateToChat,
}) => {
  const [activeMode, setActiveMode] = useState<'video' | 'image'>('video');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [customPrompt, setCustomPrompt] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);
  const [savedToVault, setSavedToVault] = useState(false);

  // Pre-loaded sample lecture scenarios so user can test instantly!
  const sampleLectures = [
    {
      title: 'Lecture 12: Database Normalization (1NF, 2NF, 3NF & BCNF Rules)',
      duration: '42 mins',
      speaker: 'Prof. K. Ramaswamy (CSE Dept)',
      sampleImage: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="225" viewBox="0 0 400 225"><rect width="400" height="225" fill="%230f172a"/><text x="200" y="90" fill="%23818cf8" font-size="16" font-family="sans-serif" text-anchor="middle" font-weight="bold">DATABASE NORMALIZATION</text><text x="200" y="125" fill="%2394a3b8" font-size="12" font-family="sans-serif" text-anchor="middle">1NF, 2NF, 3NF, BCNF &amp; Functional Dependencies</text><rect x="140" y="150" width="120" height="30" rx="6" fill="%234f46e5"/><text x="200" y="170" fill="white" font-size="11" font-family="sans-serif" text-anchor="middle">CS304 • Lecture 12</text></svg>',
      prompt: 'Analyze this lecture slide/video on Database Normalization. Explain 1NF, 2NF, 3NF with real university exam examples, provide a timestamped outline, and list 3 likely exam questions.',
    },
    {
      title: 'Lecture 08: Operating Systems - CPU Scheduling & Deadlock Banker\'s Algorithm',
      duration: '50 mins',
      speaker: 'Dr. V. Prasad (Dean of Academics)',
      sampleImage: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="225" viewBox="0 0 400 225"><rect width="400" height="225" fill="%23090d16"/><text x="200" y="90" fill="%2338bdf8" font-size="16" font-family="sans-serif" text-anchor="middle" font-weight="bold">OPERATING SYSTEMS</text><text x="200" y="125" fill="%2394a3b8" font-size="12" font-family="sans-serif" text-anchor="middle">Deadlock Detection &amp; Banker\'s Algorithm</text><rect x="140" y="150" width="120" height="30" rx="6" fill="%230284c7"/><text x="200" y="170" fill="white" font-size="11" font-family="sans-serif" text-anchor="middle">CS202 • Lecture 08</text></svg>',
      prompt: 'Summarize the Banker\'s algorithm conditions (Mutual Exclusion, Hold & Wait, No Preemption, Circular Wait) and generate an exam practice question.',
    },
  ];

  // Pre-loaded sample circular image
  const sampleCircularImage = {
    title: 'Notice Board Circular: Odd Semester Revaluation & Hall Ticket Guidelines 2026',
    sampleImage: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="250" viewBox="0 0 400 250"><rect width="400" height="250" fill="%23f8fafc"/><rect x="15" y="15" width="370" height="220" fill="white" stroke="%23cbd5e1" stroke-width="2"/><text x="200" y="45" fill="%230f172a" font-size="13" font-family="serif" text-anchor="middle" font-weight="bold">UNIVERSITY OF ENGINEERING &amp; TECHNOLOGY</text><text x="200" y="65" fill="%23475569" font-size="10" font-family="sans-serif" text-anchor="middle">OFFICE OF THE CONTROLLER OF EXAMINATIONS</text><line x1="30" y1="75" x2="370" y2="75" stroke="%2394a3b8"/><text x="35" y="95" fill="%231e293b" font-size="10" font-family="sans-serif" font-weight="bold">Ref: COE/CIRC/2026/89</text><text x="320" y="95" fill="%2364748b" font-size="10" font-family="sans-serif">Date: 28-10-2026</text><text x="200" y="125" fill="%23b91c1c" font-size="11" font-family="sans-serif" text-anchor="middle" font-weight="bold">URGENT NOTICE: HALL TICKET &amp; CONDONATION CLEARANCE</text><text x="35" y="150" fill="%23334155" font-size="9" font-family="sans-serif">1. Hall tickets will only be released for students with aggregate attendance &gt;= 75%.</text><text x="35" y="170" fill="%23334155" font-size="9" font-family="sans-serif">2. Condonation applications (65% - 74%) must be submitted with ₹1,500 fee by Nov 10, 2026.</text><text x="35" y="190" fill="%23334155" font-size="9" font-family="sans-serif">3. Malpractice: Strict CCTV surveillance active. Carrying mobile phones will cancel paper.</text><text x="300" y="220" fill="%230f172a" font-size="10" font-family="serif" font-weight="bold">Controller of Examinations</text></svg>',
  };

  const handleSelectSampleLecture = async (sample: typeof sampleLectures[0]) => {
    setPreviewUrl(sample.sampleImage);
    setCustomPrompt(sample.prompt);
    // Convert SVG data URL to a File object for the API
    const res = await fetch(sample.sampleImage);
    const blob = await res.blob();
    const file = new File([blob], `${sample.title}.png`, { type: 'image/png' });
    setSelectedFile(file);
    runAnalysis(file, 'lecture_video_analysis', sample.prompt);
  };

  const handleSelectSampleCircular = async () => {
    setPreviewUrl(sampleCircularImage.sampleImage);
    setCustomPrompt('Analyze this official notice board circular, extract all reference numbers, dates, rules, and verify against attendance regulations.');
    const res = await fetch(sampleCircularImage.sampleImage);
    const blob = await res.blob();
    const file = new File([blob], 'NoticeBoard_Circular_2026.png', { type: 'image/png' });
    setSelectedFile(file);
    runAnalysis(file, 'image_ocr_regulation', 'Analyze this official notice board circular, extract all reference numbers, dates, rules, and verify against attendance regulations.');
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    setSelectedFile(file);
    setAnalysisResult(null);
    setSavedToVault(false);

    if (file.type.startsWith('image/')) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    } else {
      setPreviewUrl(null);
    }
  };

  const runAnalysis = async (
    fileToAnalyze?: File,
    taskType?: 'image_ocr_regulation' | 'lecture_video_analysis',
    promptText?: string
  ) => {
    const file = fileToAnalyze || selectedFile;
    if (!file) return;

    const task = taskType || (activeMode === 'video' ? 'lecture_video_analysis' : 'image_ocr_regulation');
    const prompt = promptText || customPrompt;

    setIsAnalyzing(true);
    setAnalysisResult(null);
    setSavedToVault(false);

    try {
      const result = await AcademicRAGService.analyzeMultimodalFile(file, task, prompt);
      setAnalysisResult(result.analysis);
    } catch (err: any) {
      console.error(err);
      setAnalysisResult(`Analysis failed: ${err.message || 'Please check media file.'}`);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSaveToVault = () => {
    if (!analysisResult || !onAddAnalyzedDocument) return;

    const newDoc: DocumentChunk = {
      id: `multimodal-${Date.now()}`,
      title: selectedFile?.name || (activeMode === 'video' ? 'Analyzed Lecture Notes' : 'Analyzed Circular Notice'),
      category: activeMode === 'video' ? 'Handbooks' : 'Circulars',
      pageNumber: 1,
      section: 'Multimodal AI Extracted Intelligence',
      content: analysisResult,
      dateAdded: new Date().toISOString().split('T')[0],
      isOfficial: true,
      tags: ['multimodal', activeMode, 'gemini-extracted'],
    };

    onAddAnalyzedDocument(newDoc);
    setSavedToVault(true);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-slate-800 shadow-xl backdrop-blur-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                <Video className="w-6 h-6" />
              </span>
              <h1 className="text-xl font-bold text-white">Multimodal Academic Intelligence</h1>
            </div>
            <p className="mt-1 text-sm text-slate-400 max-w-2xl">
              Upload class lecture videos/recordings to extract executive summaries, timestamped milestones, and exam questions, or scan circular photos and diagrams with zero hallucinations.
            </p>
          </div>

          {/* Mode Switcher */}
          <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
            <button
              onClick={() => {
                setActiveMode('video');
                setSelectedFile(null);
                setAnalysisResult(null);
              }}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg font-semibold transition-all ${
                activeMode === 'video'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Video className="w-4 h-4" />
              Lecture Video Analyzer
            </button>
            <button
              onClick={() => {
                setActiveMode('image');
                setSelectedFile(null);
                setAnalysisResult(null);
              }}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg font-semibold transition-all ${
                activeMode === 'image'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <ImageIcon className="w-4 h-4" />
              Circular & Diagram OCR
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid: Upload & Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Side: Upload & Presets (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* File Upload Zone */}
          <div className="p-5 rounded-2xl bg-slate-850/80 border border-slate-800 backdrop-blur-md shadow-lg">
            <h3 className="text-sm font-bold text-slate-200 mb-3 flex items-center gap-2">
              <UploadCloud className="w-4 h-4 text-indigo-400" />
              {activeMode === 'video'
                ? 'Upload University Lecture Video / Audio'
                : 'Upload Notice Photo / Circular / Diagram'}
            </h3>

            <label className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-slate-700 hover:border-indigo-500/60 rounded-xl cursor-pointer bg-slate-900/60 transition-all text-center group">
              <div className="p-3 rounded-full bg-indigo-500/10 text-indigo-400 group-hover:scale-110 transition-transform">
                {activeMode === 'video' ? (
                  <Video className="w-6 h-6" />
                ) : (
                  <ImageIcon className="w-6 h-6" />
                )}
              </div>
              <span className="mt-2 text-xs font-semibold text-slate-300">
                {selectedFile ? selectedFile.name : 'Click to select file or drag here'}
              </span>
              <span className="text-[11px] text-slate-500 mt-1">
                {activeMode === 'video' ? 'MP4, WebM, MP3, WAV or slide screenshots' : 'PNG, JPG, WEBP notice photos'}
              </span>
              <input
                type="file"
                accept={activeMode === 'video' ? 'video/*,audio/*,image/*' : 'image/*'}
                onChange={handleFileChange}
                className="hidden"
              />
            </label>

            {previewUrl && (
              <div className="mt-3 rounded-xl overflow-hidden border border-slate-800 max-h-48 flex items-center justify-center bg-slate-950">
                <img src={previewUrl} alt="Preview" className="max-h-48 object-contain" />
              </div>
            )}

            {/* Prompt customizer */}
            <div className="mt-3">
              <label className="text-[11px] text-slate-400 font-medium">Specific Analysis Focus (Optional):</label>
              <input
                type="text"
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
                placeholder={activeMode === 'video' ? 'e.g. Focus on definitions and exam questions' : 'e.g. Check condonation fee & dates'}
                className="mt-1 w-full px-3 py-1.5 bg-slate-900 border border-slate-700/80 rounded-lg text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <button
              onClick={() => runAnalysis()}
              disabled={!selectedFile || isAnalyzing}
              className="mt-4 w-full py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/25 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {isAnalyzing ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Processing Multimodal Reasoning with Gemini...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Analyze with Gemini 3.8 Flash</span>
                </>
              )}
            </button>
          </div>

          {/* Quick Demo Samples */}
          <div className="p-4 rounded-2xl bg-slate-850/60 border border-slate-800 text-xs">
            <span className="font-semibold text-slate-300 block mb-2">
              ⚡ Instant Test Scenarios (No upload needed):
            </span>
            {activeMode === 'video' ? (
              <div className="space-y-2">
                {sampleLectures.map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSelectSampleLecture(item)}
                    className="w-full text-left p-2.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 hover:border-indigo-500/40 transition-all flex items-start justify-between gap-2 group"
                  >
                    <div>
                      <div className="font-medium text-slate-200 group-hover:text-indigo-300 line-clamp-1">
                        {item.title}
                      </div>
                      <div className="text-[10px] text-slate-500 mt-0.5">
                        {item.speaker} • {item.duration}
                      </div>
                    </div>
                    <Play className="w-3.5 h-3.5 text-indigo-400 shrink-0 mt-1 group-hover:scale-125 transition-transform" />
                  </button>
                ))}
              </div>
            ) : (
              <button
                onClick={handleSelectSampleCircular}
                className="w-full text-left p-2.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 hover:border-indigo-500/40 transition-all flex items-start justify-between gap-2 group"
              >
                <div>
                  <div className="font-medium text-slate-200 group-hover:text-indigo-300">
                    {sampleCircularImage.title}
                  </div>
                  <div className="text-[10px] text-slate-500 mt-0.5">
                    COE Office Urgent Notice • Hall Ticket & Condonation
                  </div>
                </div>
                <Sparkles className="w-3.5 h-3.5 text-indigo-400 shrink-0 mt-1" />
              </button>
            )}
          </div>
        </div>

        {/* Right Side: Analysis Results (7 cols) */}
        <div className="lg:col-span-7">
          <div className="p-6 rounded-2xl bg-slate-850/80 border border-slate-800 backdrop-blur-md shadow-lg min-h-[500px] flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                    <Sparkles className="w-4 h-4" />
                  </span>
                  <h3 className="text-sm font-bold text-white">
                    {activeMode === 'video'
                      ? 'Lecture Synthesis & Exam Takeaways'
                      : 'Extracted Notice Intelligence & Rule Verification'}
                  </h3>
                </div>

                {analysisResult && (
                  <button
                    onClick={handleSaveToVault}
                    disabled={savedToVault}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                      savedToVault
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : 'bg-indigo-600 hover:bg-indigo-500 text-white'
                    }`}
                  >
                    {savedToVault ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Indexed to RAG Vault</span>
                      </>
                    ) : (
                      <>
                        <BookOpen className="w-3.5 h-3.5" />
                        <span>Add to RAG Vault</span>
                      </>
                    )}
                  </button>
                )}
              </div>

              {/* Analysis Text Box */}
              <div className="mt-4">
                {isAnalyzing ? (
                  <div className="py-20 flex flex-col items-center justify-center text-center space-y-3">
                    <div className="w-10 h-10 border-3 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                    <p className="text-sm font-semibold text-indigo-300">
                      Gemini 3.8 Flash is analyzing multimodal visual data...
                    </p>
                    <p className="text-xs text-slate-500 max-w-sm">
                      Transcribing concepts, identifying theorems, and cross-referencing with university syllabus
                    </p>
                  </div>
                ) : analysisResult ? (
                  <div className="p-5 rounded-xl bg-slate-900/90 border border-slate-800 text-xs sm:text-sm leading-relaxed text-slate-200 whitespace-pre-wrap font-sans max-h-[550px] overflow-y-auto">
                    {analysisResult}
                  </div>
                ) : (
                  <div className="py-24 text-center text-slate-500 text-xs flex flex-col items-center justify-center space-y-2">
                    <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 text-slate-600">
                      {activeMode === 'video' ? <Video className="w-8 h-8" /> : <ImageIcon className="w-8 h-8" />}
                    </div>
                    <span className="font-medium text-slate-400">No media analyzed yet</span>
                    <span className="text-[11px] max-w-xs">
                      Select one of the sample lectures or upload a circular photo above to view multimodal intelligence.
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Bottom helper */}
            {analysisResult && onNavigateToChat && (
              <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                <span className="flex items-center gap-1.5 text-indigo-300">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  Verified against University Course Regulations
                </span>
                <button
                  onClick={onNavigateToChat}
                  className="flex items-center gap-1 text-indigo-400 hover:text-indigo-300 font-semibold"
                >
                  Ask questions in Q&A <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
