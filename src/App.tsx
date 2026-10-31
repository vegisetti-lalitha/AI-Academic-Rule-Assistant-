/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { RagChat } from './components/RagChat';
import { DocumentVault } from './components/DocumentVault';
import { MultimodalAnalyzer } from './components/MultimodalAnalyzer';
import { QuizGenerator } from './components/QuizGenerator';
import { CircularsNoticeBoard } from './components/CircularsNoticeBoard';
import { AdminDashboard } from './components/AdminDashboard';
import { CitationViewerModal } from './components/CitationViewerModal';
import { AuthModal } from './components/AuthModal';
import { DocumentChunk, Language, UserRole, StudentProfile, Citation } from './types';
import { AcademicRAGService } from './services/api';
import { auth, db, validateFirestoreConnection } from './firebase/config';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { AlertCircle, Megaphone, X, ShieldAlert, CheckCircle2 } from 'lucide-react';

export default function App() {
  const [currentTab, setCurrentTab] = useState<string>('chat');
  const [language, setLanguage] = useState<Language>('en');
  const [role, setRole] = useState<UserRole>('student');
  const [documents, setDocuments] = useState<DocumentChunk[]>(() =>
    AcademicRAGService.getStoredDocuments()
  );
  const [activeCitation, setActiveCitation] = useState<Citation | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [isFirebaseConnected, setIsFirebaseConnected] = useState<boolean>(true);

  // Broadcast alert banner
  const [broadcastMessage, setBroadcastMessage] = useState<string>(
    '📢 URGENT: Odd Semester End Examinations (SEE) Supplementary Registration closes Nov 15, 2026. Students with 65-74% attendance must clear condonation fee of ₹1,500.'
  );
  const [showBroadcast, setShowBroadcast] = useState<boolean>(true);

  // Student profile state
  const [studentProfile, setStudentProfile] = useState<StudentProfile>({
    name: 'Lalitha Devi',
    rollNumber: '22B91A0501',
    department: 'Computer Science & Engineering',
    yearSemester: '3rd Year - Semester I',
    currentAttendance: 71.4, // Between 65% and 74% - prime condonation test case!
    currentCgpa: 8.42,
    role: 'student',
  });

  // Test Firestore Connection on boot
  useEffect(() => {
    validateFirestoreConnection().then((connected) => {
      setIsFirebaseConnected(connected);
    });
  }, []);

  // Listen to Firebase Auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists()) {
            const data = userDoc.data();
            setStudentProfile({
              name: data.displayName || data.name || user.displayName || 'University Student',
              rollNumber: data.rollNumber || '22B91A0501',
              department: data.department || 'Computer Science & Engineering',
              yearSemester: data.yearSemester || '3rd Year - Semester I',
              currentAttendance: data.attendance || 71.4,
              currentCgpa: data.cgpa || 8.42,
              role: (data.role as UserRole) || 'student',
            });
            if (data.role) {
              setRole(data.role as UserRole);
            }
          } else {
            // New Firebase user without profile record yet
            setStudentProfile((prev) => ({
              ...prev,
              name: user.displayName || prev.name,
            }));
          }
        } catch (e) {
          console.warn('Error fetching user profile from Firestore:', e);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  // Sync role with student profile
  useEffect(() => {
    setStudentProfile((prev) => ({ ...prev, role }));
  }, [role]);

  // Save documents to local storage when changed
  useEffect(() => {
    AcademicRAGService.saveDocuments(documents);
  }, [documents]);

  const handleAddDocuments = (newChunks: DocumentChunk[]) => {
    setDocuments((prev) => [...newChunks, ...prev]);
  };

  const handleDeleteDocument = (id: string) => {
    setDocuments((prev) => prev.filter((d) => d.id !== id));
  };

  const handleResetDocuments = () => {
    const defaultDocs = AcademicRAGService.resetToDefaultDocuments();
    setDocuments(defaultDocs);
  };

  const handleOpenCitation = (docTitle: string, page: number, section?: string) => {
    setActiveCitation({ docTitle, page, section });
  };

  const handleAuthSuccess = (newProfile: StudentProfile) => {
    setStudentProfile(newProfile);
    setRole(newProfile.role);
    if (newProfile.role === 'admin') {
      setCurrentTab('admin');
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col relative selection:bg-indigo-500 selection:text-white">
      {/* Ambient background glows */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-indigo-600/10 rounded-full blur-[120px]" />
        <div className="absolute top-1/3 -right-40 w-96 h-96 bg-cyan-600/10 rounded-full blur-[140px]" />
        <div className="absolute -bottom-40 left-1/3 w-96 h-96 bg-purple-600/10 rounded-full blur-[130px]" />
      </div>

      <div className="relative z-10 flex flex-col flex-1">
        {/* Navigation Bar with Auth Trigger */}
        <Navbar
          currentTab={currentTab}
          setCurrentTab={setCurrentTab}
          language={language}
          setLanguage={setLanguage}
          role={role}
          setRole={setRole}
          studentProfile={studentProfile}
          onOpenAuth={() => setIsAuthModalOpen(true)}
        />

        {/* Emergency Broadcast Ticker */}
        {showBroadcast && broadcastMessage && (
          <div className="bg-gradient-to-r from-amber-600/20 via-indigo-600/20 to-amber-600/20 border-b border-amber-500/30 backdrop-blur-md px-4 py-2 text-xs flex items-center justify-between text-amber-200">
            <div className="flex items-center gap-2 max-w-5xl mx-auto overflow-hidden text-ellipsis whitespace-nowrap">
              <Megaphone className="w-4 h-4 text-amber-400 shrink-0 animate-bounce" />
              <span className="font-semibold text-amber-300">University Bulletin:</span>
              <span className="text-slate-200">{broadcastMessage}</span>
            </div>
            <button
              onClick={() => setShowBroadcast(false)}
              className="text-slate-400 hover:text-white p-1 rounded"
              title="Dismiss alert"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Student Condonation Warning Card (If attendance between 65% and 74%) */}
        {role === 'student' && currentTab === 'chat' && studentProfile.currentAttendance !== undefined && studentProfile.currentAttendance < 75 && (
          <div className="max-w-5xl mx-auto px-4 pt-3 w-full">
            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between gap-3 text-xs text-amber-200">
              <div className="flex items-center gap-2.5">
                <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0" />
                <span>
                  <strong>Student Attendance Advisory ({studentProfile.name}):</strong> Your current recorded attendance is{' '}
                  <span className="font-bold underline text-amber-300">{studentProfile.currentAttendance}%</span>{' '}
                  (under the mandatory 75% threshold). Ask the counselor about condonation eligibility under Clause 4.2!
                </span>
              </div>
              <button
                onClick={() => setCurrentTab('chat')}
                className="shrink-0 px-2.5 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 font-semibold text-[11px] transition-colors"
              >
                Verify My Status
              </button>
            </div>
          </div>
        )}

        {/* Main Content Body */}
        <main className="flex-1">
          {currentTab === 'chat' && (
            <RagChat
              documents={documents}
              language={language}
              setLanguage={setLanguage}
              onOpenCitation={(cite) => setActiveCitation(cite)}
              onNavigateToVault={() => setCurrentTab('vault')}
            />
          )}

          {currentTab === 'vault' && (
            <DocumentVault
              documents={documents}
              onAddDocuments={handleAddDocuments}
              onOpenCitation={handleOpenCitation}
            />
          )}

          {currentTab === 'multimodal' && (
            <MultimodalAnalyzer
              onAddAnalyzedDocument={(doc) => handleAddDocuments([doc])}
              onNavigateToChat={() => setCurrentTab('chat')}
            />
          )}

          {currentTab === 'quiz' && (
            <QuizGenerator
              documents={documents}
              onOpenCitation={handleOpenCitation}
            />
          )}

          {currentTab === 'circulars' && (
            <CircularsNoticeBoard
              documents={documents}
              onAskAboutCircular={(_q) => {
                setCurrentTab('chat');
              }}
              onOpenCitation={handleOpenCitation}
            />
          )}

          {currentTab === 'admin' && (
            <AdminDashboard
              documents={documents}
              onAddDocuments={handleAddDocuments}
              onDeleteDocument={handleDeleteDocument}
              onResetDocuments={handleResetDocuments}
              broadcastMessage={broadcastMessage}
              setBroadcastMessage={setBroadcastMessage}
            />
          )}
        </main>
      </div>

      {/* Citation Inspector Modal */}
      <CitationViewerModal
        citation={activeCitation}
        documents={documents}
        onClose={() => setActiveCitation(null)}
      />

      {/* Firebase Authentication & Profile Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onAuthSuccess={handleAuthSuccess}
        currentProfile={studentProfile}
      />
    </div>
  );
}
