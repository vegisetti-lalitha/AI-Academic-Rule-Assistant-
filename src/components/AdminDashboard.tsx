import React, { useState } from 'react';
import {
  Sliders,
  UploadCloud,
  FileText,
  PlusCircle,
  Trash2,
  RotateCcw,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Database,
  Megaphone,
  Eye,
} from 'lucide-react';
import { DocumentChunk } from '../types';
import { parsePdfFileToChunks } from '../utils/pdfParser';

interface AdminDashboardProps {
  documents: DocumentChunk[];
  onAddDocuments: (chunks: DocumentChunk[]) => void;
  onDeleteDocument: (id: string) => void;
  onResetDocuments: () => void;
  broadcastMessage: string;
  setBroadcastMessage: (msg: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  documents,
  onAddDocuments,
  onDeleteDocument,
  onResetDocuments,
  broadcastMessage,
  setBroadcastMessage,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'upload' | 'manual' | 'manage' | 'broadcast'>('upload');
  const [isUploading, setIsUploading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  // Manual entry form state
  const [formTitle, setFormTitle] = useState('');
  const [formCategory, setFormCategory] = useState<DocumentChunk['category']>('Circulars');
  const [formPage, setFormPage] = useState('1');
  const [formSection, setFormSection] = useState('');
  const [formContent, setFormContent] = useState('');
  const [formTags, setFormTags] = useState('');

  // Handle Drag-and-Drop or File Pick
  const handlePdfUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const file = files[0];

    setIsUploading(true);
    setStatusMessage(`Processing "${file.name}" with PDF.js client-side extractor...`);

    try {
      const parsedChunks = await parsePdfFileToChunks(file, 'Regulations');
      if (parsedChunks.length === 0) {
        setStatusMessage('No text found in PDF. Make sure it is not a scanned image PDF.');
      } else {
        onAddDocuments(parsedChunks);
        setStatusMessage(`Successfully extracted and indexed ${parsedChunks.length} pages into the official RAG cache!`);
      }
    } catch (err: any) {
      console.error(err);
      setStatusMessage(`Error parsing PDF: ${err.message || 'Unknown format'}`);
    } finally {
      setIsUploading(false);
      setTimeout(() => setStatusMessage(null), 6000);
    }
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle || !formContent) return;

    const newDoc: DocumentChunk = {
      id: `admin-manual-${Date.now()}`,
      title: formTitle,
      category: formCategory,
      pageNumber: parseInt(formPage, 10) || 1,
      section: formSection || 'General Clause',
      content: formContent,
      dateAdded: new Date().toISOString().split('T')[0],
      isOfficial: true,
      tags: formTags.split(',').map((t) => t.trim().toLowerCase()).filter(Boolean),
    };

    onAddDocuments([newDoc]);
    setStatusMessage(`Manual regulation clause "${formTitle}" added to index!`);
    setFormTitle('');
    setFormSection('');
    setFormContent('');
    setFormTags('');
    setTimeout(() => setStatusMessage(null), 4000);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-slate-800 shadow-xl backdrop-blur-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Sliders className="w-6 h-6" />
            </span>
            <h1 className="text-xl font-bold text-white">University Academic Administration Console</h1>
          </div>
          <p className="mt-1 text-sm text-slate-400 max-w-2xl">
            Manage official regulation PDFs, circular circulars, and live broadcast banners. Ingested documents become instantly accessible to the Gemini RAG Counselor.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              if (window.confirm('Reset document library to default university regulations?')) {
                onResetDocuments();
                setStatusMessage('Reset knowledge base to factory university regulations.');
                setTimeout(() => setStatusMessage(null), 3000);
              }
            }}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 hover:text-white border border-slate-700 flex items-center gap-1.5 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
            <span>Reset to Official Defaults</span>
          </button>
        </div>
      </div>

      {statusMessage && (
        <div className="p-3.5 rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{statusMessage}</span>
        </div>
      )}

      {/* Sub Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
        <button
          onClick={() => setActiveSubTab('upload')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            activeSubTab === 'upload'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <UploadCloud className="w-4 h-4" />
          Drag & Drop PDF Ingestion
        </button>

        <button
          onClick={() => setActiveSubTab('manual')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            activeSubTab === 'manual'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <PlusCircle className="w-4 h-4" />
          Publish Circular / Clause
        </button>

        <button
          onClick={() => setActiveSubTab('manage')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            activeSubTab === 'manage'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <Database className="w-4 h-4" />
          Manage Documents ({documents.length})
        </button>

        <button
          onClick={() => setActiveSubTab('broadcast')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            activeSubTab === 'broadcast'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <Megaphone className="w-4 h-4" />
          Emergency Ticker Banner
        </button>
      </div>

      {/* Tab 1: Drag & Drop PDF */}
      {activeSubTab === 'upload' && (
        <div className="p-8 rounded-2xl bg-slate-850/80 border border-slate-800 backdrop-blur-md shadow-lg space-y-6">
          <div className="text-center max-w-lg mx-auto">
            <h2 className="text-base font-bold text-white">Ingest University Handbook or Circular PDF</h2>
            <p className="text-xs text-slate-400 mt-1">
              Upload any university circular or academic regulations PDF. PDF.js will automatically extract text page-by-page and index citations for the RAG engine.
            </p>
          </div>

          <label
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              handlePdfUpload(e.dataTransfer.files);
            }}
            className="flex flex-col items-center justify-center p-12 border-2 border-dashed border-indigo-500/40 hover:border-indigo-500 rounded-2xl cursor-pointer bg-slate-900/60 transition-all text-center group"
          >
            <div className="p-4 rounded-2xl bg-indigo-500/10 text-indigo-400 group-hover:scale-110 transition-transform">
              <UploadCloud className="w-10 h-10" />
            </div>
            <span className="mt-4 text-sm font-bold text-white">
              Drag & Drop official university PDF here
            </span>
            <span className="mt-1 text-xs text-slate-400">
              or click to browse from your device (.pdf)
            </span>
            <input
              type="file"
              accept=".pdf"
              onChange={(e) => handlePdfUpload(e.target.files)}
              className="hidden"
              disabled={isUploading}
            />
          </label>

          {isUploading && (
            <div className="p-4 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center gap-3 text-xs text-indigo-300">
              <div className="w-4 h-4 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin" />
              <span>Extracting and indexing text chunks...</span>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Manual Form Entry */}
      {activeSubTab === 'manual' && (
        <div className="p-6 rounded-2xl bg-slate-850/80 border border-slate-800 backdrop-blur-md shadow-lg">
          <h2 className="text-base font-bold text-white mb-4">Publish Direct Regulation Clause / Circular</h2>

          <form onSubmit={handleManualSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2">
                <label className="text-xs text-slate-300 font-semibold">Document Title:</label>
                <input
                  type="text"
                  required
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="e.g. Special Circular on Condonation Deadline Extension"
                  className="mt-1 w-full px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="text-xs text-slate-300 font-semibold">Category:</label>
                <select
                  value={formCategory}
                  onChange={(e) => setFormCategory(e.target.value as any)}
                  className="mt-1 w-full px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
                >
                  <option value="Regulations">Regulations</option>
                  <option value="Exam Rules">Exam Rules</option>
                  <option value="Circulars">Circulars</option>
                  <option value="Handbooks">Handbooks</option>
                  <option value="Hostel & Discipline">Hostel & Discipline</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-xs text-slate-300 font-semibold">Page Number:</label>
                <input
                  type="number"
                  min="1"
                  required
                  value={formPage}
                  onChange={(e) => setFormPage(e.target.value)}
                  className="mt-1 w-full px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="text-xs text-slate-300 font-semibold">Section / Clause Name:</label>
                <input
                  type="text"
                  value={formSection}
                  onChange={(e) => setFormSection(e.target.value)}
                  placeholder="e.g. Clause 4.3 - Fee Concession & Relaxation"
                  className="mt-1 w-full px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="text-xs text-slate-300 font-semibold">Clause Text Content (Ground Truth):</label>
              <textarea
                required
                rows={5}
                value={formContent}
                onChange={(e) => setFormContent(e.target.value)}
                placeholder="Paste official regulation text verbatim here..."
                className="mt-1 w-full p-3.5 bg-slate-900 border border-slate-700 rounded-xl text-xs font-mono text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="text-xs text-slate-300 font-semibold">Metadata Tags (comma separated):</label>
              <input
                type="text"
                value={formTags}
                onChange={(e) => setFormTags(e.target.value)}
                placeholder="e.g. condonation, extension, fee, 2026"
                className="mt-1 w-full px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-lg shadow-indigo-600/30"
              >
                Publish & Index Clause
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Tab 3: Manage Document Chunks */}
      {activeSubTab === 'manage' && (
        <div className="p-6 rounded-2xl bg-slate-850/80 border border-slate-800 backdrop-blur-md shadow-lg space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-white">Indexed Knowledge Chunks ({documents.length})</h2>
            <span className="text-xs text-slate-400">RAG Ready</span>
          </div>

          <div className="divide-y divide-slate-800 max-h-[550px] overflow-y-auto">
            {documents.map((doc) => (
              <div key={doc.id} className="py-3.5 flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400">
                      {doc.category}
                    </span>
                    <span className="text-xs text-slate-400">Page {doc.pageNumber}</span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-100 mt-1">{doc.title}</h4>
                  <p className="text-xs text-indigo-300 font-medium">{doc.section}</p>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-2">{doc.content}</p>
                </div>

                <button
                  onClick={() => onDeleteDocument(doc.id)}
                  className="p-2 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                  title="Remove clause from index"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: Emergency Broadcast Ticker */}
      {activeSubTab === 'broadcast' && (
        <div className="p-6 rounded-2xl bg-slate-850/80 border border-slate-800 backdrop-blur-md shadow-lg space-y-4">
          <div className="flex items-center gap-2">
            <Megaphone className="w-5 h-5 text-amber-400" />
            <h2 className="text-base font-bold text-white">Emergency University Broadcast Banner</h2>
          </div>
          <p className="text-xs text-slate-400">
            Configure an urgent alert message that will be shown across the top of the student portal in real time.
          </p>

          <div>
            <label className="text-xs text-slate-300 font-semibold">Active Broadcast Message:</label>
            <input
              type="text"
              value={broadcastMessage}
              onChange={(e) => setBroadcastMessage(e.target.value)}
              placeholder="e.g. 📢 Odd Semester End Examinations (SEE) Hall Tickets will be released on Nov 27, 2026. Clear all dues!"
              className="mt-1 w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="flex items-center gap-2 pt-2">
            <button
              onClick={() => {
                setStatusMessage('Broadcast banner updated across student portals!');
                setTimeout(() => setStatusMessage(null), 3000);
              }}
              className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-md shadow-indigo-600/25"
            >
              Save & Broadcast
            </button>
            <button
              onClick={() => setBroadcastMessage('')}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300"
            >
              Clear Banner
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
