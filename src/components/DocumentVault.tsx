import React, { useState } from 'react';
import {
  BookOpen,
  Search,
  Filter,
  FileText,
  UploadCloud,
  CheckCircle2,
  Calendar,
  Layers,
  Tag,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  FileCheck,
} from 'lucide-react';
import { DocumentChunk } from '../types';
import { parsePdfFileToChunks } from '../utils/pdfParser';

interface DocumentVaultProps {
  documents: DocumentChunk[];
  onAddDocuments: (newChunks: DocumentChunk[]) => void;
  onOpenCitation: (docTitle: string, page: number, section?: string) => void;
}

export const DocumentVault: React.FC<DocumentVaultProps> = ({
  documents,
  onAddDocuments,
  onOpenCitation,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);
  const [selectedDocChunk, setSelectedDocChunk] = useState<DocumentChunk | null>(null);

  const categories = [
    'All',
    'Regulations',
    'Exam Rules',
    'Circulars',
    'Handbooks',
    'Hostel & Discipline',
  ];

  const filteredDocs = documents.filter((doc) => {
    const matchesCategory =
      selectedCategory === 'All' || doc.category === selectedCategory;
    const matchesSearch =
      doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.section.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.tags.some((t) => t.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    setIsUploading(true);
    setUploadStatus(`Parsing PDF pages from "${file.name}" with PDF.js...`);

    try {
      const parsedChunks = await parsePdfFileToChunks(file, 'Circulars');
      if (parsedChunks.length === 0) {
        setUploadStatus('No readable text found in PDF.');
      } else {
        onAddDocuments(parsedChunks);
        setUploadStatus(`Successfully indexed ${parsedChunks.length} pages into the RAG vector cache!`);
      }
    } catch (err: any) {
      console.error(err);
      setUploadStatus(`PDF parsing failed: ${err.message || 'Check document format'}`);
    } finally {
      setIsUploading(false);
      setTimeout(() => setUploadStatus(null), 5000);
      e.target.value = '';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      {/* Header & Stats Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-slate-800 shadow-xl backdrop-blur-md flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <BookOpen className="w-6 h-6" />
            </span>
            <h1 className="text-xl font-bold text-white">University Document Vault & Circular Index</h1>
          </div>
          <p className="mt-1 text-sm text-slate-400 max-w-2xl">
            Authenticated repository of academic handbooks, examination codes, circulars, and detention regulations that power UniVerify's retrieval-augmented generation.
          </p>
        </div>

        {/* Upload Button */}
        <div>
          <label className="relative inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-lg shadow-indigo-600/25 cursor-pointer transition-all hover:scale-105 active:scale-95">
            <UploadCloud className="w-4 h-4" />
            <span>Ingest New PDF Document</span>
            <input
              type="file"
              accept=".pdf"
              onChange={handleFileUpload}
              disabled={isUploading}
              className="hidden"
            />
          </label>
        </div>
      </div>

      {uploadStatus && (
        <div className="p-3.5 rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs flex items-center justify-between animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{uploadStatus}</span>
          </div>
          {isUploading && (
            <div className="w-4 h-4 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin" />
          )}
        </div>
      )}

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-slate-850/80 border border-slate-800">
          <span className="text-xs text-slate-400">Total Indexed Pages</span>
          <div className="text-2xl font-bold text-white mt-1">{documents.length}</div>
          <span className="text-[10px] text-emerald-400 flex items-center gap-1 mt-0.5">
            <ShieldCheck className="w-3 h-3" /> 100% Vector Cache Ready
          </span>
        </div>
        <div className="p-4 rounded-xl bg-slate-850/80 border border-slate-800">
          <span className="text-xs text-slate-400">Official Regulations</span>
          <div className="text-2xl font-bold text-indigo-400 mt-1">
            {documents.filter((d) => d.category === 'Regulations').length} Pages
          </div>
          <span className="text-[10px] text-slate-500 mt-0.5">R23 / R24 Autonomous</span>
        </div>
        <div className="p-4 rounded-xl bg-slate-850/80 border border-slate-800">
          <span className="text-xs text-slate-400">Active Circulars</span>
          <div className="text-2xl font-bold text-amber-400 mt-1">
            {documents.filter((d) => d.category === 'Circulars').length} Notices
          </div>
          <span className="text-[10px] text-slate-500 mt-0.5">COE 2026-27</span>
        </div>
        <div className="p-4 rounded-xl bg-slate-850/80 border border-slate-800">
          <span className="text-xs text-slate-400">Discipline & Hostel</span>
          <div className="text-2xl font-bold text-cyan-400 mt-1">
            {documents.filter((d) => d.category === 'Hostel & Discipline').length} Clauses
          </div>
          <span className="text-[10px] text-slate-500 mt-0.5">Anti-Ragging / Curfew</span>
        </div>
      </div>

      {/* Search and Category Filters */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search clauses, keywords (e.g. condonation, CGPA, fine)..."
            className="w-full pl-10 pr-4 py-2 bg-slate-850/90 border border-slate-700/80 rounded-xl text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-indigo-500"
          />
        </div>

        {/* Categories */}
        <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                selectedCategory === cat
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'bg-slate-850 text-slate-400 hover:text-slate-200 hover:bg-slate-800 border border-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Documents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredDocs.map((doc) => (
          <div
            key={doc.id}
            onClick={() => setSelectedDocChunk(doc)}
            className="p-5 rounded-2xl bg-slate-850/80 hover:bg-slate-800/90 border border-slate-800 hover:border-indigo-500/40 shadow-lg hover:shadow-indigo-500/10 transition-all flex flex-col justify-between group cursor-pointer"
          >
            <div>
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-semibold text-[11px]">
                  {doc.category}
                </span>
                <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-400 text-[10px] font-mono">
                  Page {doc.pageNumber}
                </span>
              </div>

              <h3 className="font-bold text-sm text-slate-100 group-hover:text-indigo-300 transition-colors line-clamp-1">
                {doc.title}
              </h3>

              <div className="text-xs text-indigo-300/80 font-medium mt-1 line-clamp-1">
                {doc.section}
              </div>

              <p className="mt-2.5 text-xs text-slate-400 leading-relaxed line-clamp-3">
                {doc.content}
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500">
              <div className="flex items-center gap-1.5 flex-wrap">
                {doc.tags.slice(0, 3).map((tag, i) => (
                  <span key={i} className="text-[10px] text-slate-400 bg-slate-900 px-1.5 py-0.5 rounded">
                    #{tag}
                  </span>
                ))}
              </div>
              <span className="text-indigo-400 group-hover:translate-x-1 transition-transform flex items-center gap-0.5 font-medium">
                Read Page <ChevronRight className="w-3 h-3" />
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Document Chunk Reader Modal */}
      {selectedDocChunk && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-6 max-h-[85vh] flex flex-col">
            <div className="flex items-start justify-between pb-4 border-b border-slate-800">
              <div>
                <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  {selectedDocChunk.category} • Page {selectedDocChunk.pageNumber}
                </span>
                <h3 className="text-lg font-bold text-white mt-1">
                  {selectedDocChunk.title}
                </h3>
                <p className="text-xs text-indigo-400 font-medium">
                  {selectedDocChunk.section}
                </p>
              </div>
              <button
                onClick={() => setSelectedDocChunk(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                ✕
              </button>
            </div>

            <div className="py-4 overflow-y-auto flex-1 font-mono text-xs leading-relaxed text-slate-300 whitespace-pre-wrap bg-slate-950 p-4 rounded-xl border border-slate-800">
              {selectedDocChunk.content}
            </div>

            <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
              <span className="text-xs text-slate-500">
                Indexed in UniVerify RAG Cache on {selectedDocChunk.dateAdded}
              </span>
              <button
                onClick={() => setSelectedDocChunk(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white"
              >
                Close Reader
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
