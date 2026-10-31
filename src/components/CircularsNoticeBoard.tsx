import React, { useState } from 'react';
import {
  Bell,
  Calendar,
  AlertTriangle,
  Clock,
  ArrowRight,
  Sparkles,
  FileText,
  Search,
  ExternalLink,
} from 'lucide-react';
import { DocumentChunk } from '../types';

interface CircularsNoticeBoardProps {
  documents: DocumentChunk[];
  onAskAboutCircular: (query: string) => void;
  onOpenCitation: (docTitle: string, page: number, section?: string) => void;
}

export const CircularsNoticeBoard: React.FC<CircularsNoticeBoardProps> = ({
  documents,
  onAskAboutCircular,
  onOpenCitation,
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  // Sample urgent bulletins & circulars
  const officialBulletins = [
    {
      id: 'circ-1',
      refNo: 'COE/UNIV/2026/CIRC-114',
      title: 'Schedule for Odd Semester End Examinations (SEE) & Supplementary Registration 2026-27',
      issuedBy: 'Office of the Controller of Examinations',
      issueDate: 'October 20, 2026',
      deadline: 'November 15, 2026 (Without Late Fee)',
      isUrgent: true,
      category: 'Exam Rules',
      summary: 'Supplementary exams commencing Dec 01, 2026. Online registration starts Nov 01. Fee: ₹600 for 1 subject, ₹1,000 for 2, ₹1,500 for 3+. Super fine of ₹2,000 after Nov 20.',
      suggestedQuery: 'What is the schedule and fee structure for supplementary exams under circular COE/UNIV/2026/CIRC-114?',
      page: 1,
      docTitle: 'Examination & Evaluation Circular (Ref: COE/2026/SEE-SUPPL)',
    },
    {
      id: 'circ-2',
      refNo: 'REG/UNIV/2026/ATT-042',
      title: 'Mandatory Condonation Clearance & Medical Document Submission Notification',
      issuedBy: 'Dean of Academic Affairs',
      issueDate: 'October 15, 2026',
      deadline: 'November 10, 2026',
      isUrgent: true,
      category: 'Regulations',
      summary: 'Students with attendance between 65% and 74% must submit genuine medical certificates with outpatient/inpatient slips within 3 working days. Condonation fee is ₹1,500.',
      suggestedQuery: 'What is the exact process and fee for attendance condonation between 65% and 74%?',
      page: 2,
      docTitle: 'University Academic Regulations Handbook (R24)',
    },
    {
      id: 'circ-3',
      refNo: 'COE/EVAL/2026/REV-09',
      title: 'Revaluation & Challenge Evaluation Rules for Even Semester Results',
      issuedBy: 'Evaluation Cell',
      issueDate: 'October 05, 2026',
      deadline: 'Within 7 days of result declaration',
      isUrgent: false,
      category: 'Circulars',
      summary: 'Revaluation fee ₹1,200 per script. Challenge evaluation fee ₹10,000 caution deposit. ₹8,000 refunded if marks increase by >= 15%.',
      suggestedQuery: 'What is the challenge evaluation fee and under what condition is the refund granted?',
      page: 2,
      docTitle: 'Examination & Evaluation Circular (Ref: COE/2026/SEE-SUPPL)',
    },
    {
      id: 'circ-4',
      refNo: 'DAAC/INTERN/2026/08',
      title: 'Mandatory Summer Industrial Internship & NPTEL Credit Transfer Deadlines',
      issuedBy: 'Director of Academic Planning',
      issueDate: 'July 15, 2026',
      deadline: 'Prior to 7th Semester Registration',
      isUrgent: false,
      category: 'Handbooks',
      summary: '6 to 8 weeks internship mandatory between 6th & 7th semesters (2 credits). Swayam/NPTEL credit transfer up to 12 credits accepted upon DAAC approval.',
      suggestedQuery: 'How many credits can be transferred through NPTEL or Swayam courses according to university guidelines?',
      page: 1,
      docTitle: 'Mandatory Industrial Internship & MOOCs Credit Transfer Guidelines',
    },
    {
      id: 'circ-5',
      refNo: 'CHIEF-WARDEN/2026/CODE-01',
      title: 'Hostel Curfew Timings & Strict Anti-Ragging Directives',
      issuedBy: 'Office of Chief Warden & Campus Discipline Committee',
      issueDate: 'June 10, 2026',
      deadline: 'Strict Enforcement Daily',
      isUrgent: true,
      category: 'Hostel & Discipline',
      summary: 'In-time strictly 9:30 PM (weekdays) and 10:00 PM (weekends). Zero-tolerance anti-ragging with immediate 24h investigation, hostel expulsion, and police FIR.',
      suggestedQuery: 'What are the hostel in-times and penalties for ragging?',
      page: 1,
      docTitle: 'University Campus & Hostel Code of Conduct',
    },
  ];

  const filteredBulletins = officialBulletins.filter(
    (b) =>
      b.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.refNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.summary.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-slate-800 shadow-xl backdrop-blur-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                <Bell className="w-6 h-6" />
              </span>
              <h1 className="text-xl font-bold text-white">University Official Circulars & Notice Board</h1>
            </div>
            <p className="mt-1 text-sm text-slate-400 max-w-2xl">
              Real-time circular feed from the Controller of Examinations, Dean of Academics, and University Administration. All notices are pre-indexed for instant Q&A retrieval.
            </p>
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Filter circulars..."
              className="w-full pl-10 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>
      </div>

      {/* Circulars List */}
      <div className="space-y-4">
        {filteredBulletins.map((bulletin) => (
          <div
            key={bulletin.id}
            className="p-5 rounded-2xl bg-slate-850/80 border border-slate-800 hover:border-indigo-500/40 shadow-lg backdrop-blur-md transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 group"
          >
            <div className="space-y-2 flex-1">
              <div className="flex flex-wrap items-center gap-2 text-xs">
                {bulletin.isUrgent && (
                  <span className="px-2 py-0.5 rounded bg-rose-500/15 text-rose-300 border border-rose-500/30 font-bold flex items-center gap-1 text-[11px]">
                    <AlertTriangle className="w-3 h-3" />
                    Urgent Notice
                  </span>
                )}
                <span className="px-2 py-0.5 rounded bg-slate-900 text-indigo-400 font-mono text-[11px]">
                  {bulletin.refNo}
                </span>
                <span className="text-slate-500">•</span>
                <span className="text-slate-400 text-[11px] flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {bulletin.issueDate}
                </span>
              </div>

              <h3 className="text-base font-bold text-white group-hover:text-indigo-300 transition-colors">
                {bulletin.title}
              </h3>

              <p className="text-xs text-slate-300 leading-relaxed max-w-3xl">
                {bulletin.summary}
              </p>

              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 pt-1">
                <span>Issuing Body: <strong className="text-slate-300">{bulletin.issuedBy}</strong></span>
                {bulletin.deadline && (
                  <span className="text-amber-400 font-semibold flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    Deadline: {bulletin.deadline}
                  </span>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-row md:flex-col items-center md:items-end gap-2 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-800">
              <button
                onClick={() => onAskAboutCircular(bulletin.suggestedQuery)}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs flex items-center gap-1.5 shadow-md shadow-indigo-600/25 transition-all hover:scale-105 active:scale-95"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Ask AI About This</span>
              </button>

              <button
                onClick={() => onOpenCitation(bulletin.docTitle, bulletin.page)}
                className="px-3 py-1.5 rounded-lg text-slate-400 hover:text-slate-200 bg-slate-900 border border-slate-800 text-[11px] font-medium flex items-center gap-1 transition-colors"
              >
                <FileText className="w-3 h-3 text-indigo-400" />
                <span>Read Full Document</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
