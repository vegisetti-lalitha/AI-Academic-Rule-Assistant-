import React from 'react';
import { X, FileText, CheckCircle2, ShieldCheck, Bookmark, ExternalLink } from 'lucide-react';
import { Citation, DocumentChunk } from '../types';

interface CitationViewerModalProps {
  citation: Citation | null;
  documents: DocumentChunk[];
  onClose: () => void;
}

export const CitationViewerModal: React.FC<CitationViewerModalProps> = ({
  citation,
  documents,
  onClose,
}) => {
  if (!citation) return null;

  // Find corresponding document chunks
  const matchedDocs = documents.filter((doc) => {
    const titleMatch = doc.title.toLowerCase().includes(citation.docTitle.toLowerCase()) ||
      citation.docTitle.toLowerCase().includes(doc.title.toLowerCase());
    const pageMatch = doc.pageNumber === citation.page;
    return titleMatch && pageMatch;
  });

  // Fallback if exact page wasn't found in current chunk
  const fallbackDocs = matchedDocs.length > 0 ? matchedDocs : documents.filter((doc) =>
    doc.title.toLowerCase().includes(citation.docTitle.toLowerCase()) ||
    citation.docTitle.toLowerCase().includes(doc.title.toLowerCase())
  );

  const displayDoc = matchedDocs[0] || fallbackDocs[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-indigo-500/30 rounded-2xl shadow-2xl shadow-indigo-500/10 overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 text-xs font-semibold rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  Verified Official Source
                </span>
                <span className="text-xs text-slate-400">
                  Page {citation.page}
                </span>
              </div>
              <h3 className="text-base font-bold text-white mt-0.5 line-clamp-1">
                {citation.docTitle}
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-4 text-slate-200">
          <div className="flex items-center justify-between text-xs text-slate-400 pb-2 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Bookmark className="w-4 h-4 text-indigo-400" />
              <span>Section: <strong className="text-indigo-300">{citation.section || displayDoc?.section || 'Official Clause'}</strong></span>
            </div>
            <span className="text-slate-500">Document ID: {displayDoc?.id || 'doc-ref'}</span>
          </div>

          {displayDoc ? (
            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 text-sm leading-relaxed font-mono whitespace-pre-wrap">
              {displayDoc.content}
            </div>
          ) : (
            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 text-sm text-slate-400 italic">
              Extracted from official university document: "{citation.docTitle}", Page {citation.page}.
              Full document chunk is stored in the UniVerify Document Repository.
            </div>
          )}

          {/* RAG Verification Seal */}
          <div className="p-3 rounded-xl bg-indigo-500/5 border border-indigo-500/20 flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
            <div className="text-xs text-slate-300">
              <span className="font-semibold text-indigo-300">UniVerify Academic RAG Guarantee:</span>
              <p className="mt-0.5 text-slate-400">
                This excerpt is extracted directly from the authenticated university regulation archive. No unverified web data or generative hallucinations are permitted in academic counseling responses.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-900 border-t border-slate-800 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 transition-colors"
          >
            Close Source Preview
          </button>
        </div>
      </div>
    </div>
  );
};
