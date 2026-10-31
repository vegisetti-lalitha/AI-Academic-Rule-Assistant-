import React from 'react';
import {
  GraduationCap,
  ShieldCheck,
  BookOpen,
  Video,
  Award,
  Bell,
  Settings,
  Languages,
  User,
  Sliders,
  Sparkles,
} from 'lucide-react';
import { Language, UserRole, StudentProfile } from '../types';

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  role: UserRole;
  setRole: (role: UserRole) => void;
  studentProfile: StudentProfile;
  onOpenAuth: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  language,
  setLanguage,
  role,
  setRole,
  studentProfile,
  onOpenAuth,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-slate-900/80 border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setCurrentTab('chat')}>
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 p-0.5 shadow-lg shadow-indigo-500/25">
              <div className="w-full h-full bg-slate-900 rounded-[10px] flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-indigo-400" />
              </div>
              <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-slate-900 flex items-center justify-center">
                <ShieldCheck className="w-2.5 h-2.5 text-white" />
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-white via-slate-100 to-indigo-200 bg-clip-text text-transparent">
                  UniVerify
                </span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/30">
                  RAG 2.0
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium hidden sm:block">
                Academic Regulations & Circulars Assistant
              </p>
            </div>
          </div>

          {/* Center Navigation Tabs */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-950/60 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setCurrentTab('chat')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                currentTab === 'chat'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              Counselor Q&A
            </button>

            <button
              onClick={() => setCurrentTab('vault')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                currentTab === 'vault'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              Document Vault
            </button>

            <button
              onClick={() => setCurrentTab('multimodal')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                currentTab === 'multimodal'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Video className="w-3.5 h-3.5" />
              Video & OCR
            </button>

            <button
              onClick={() => setCurrentTab('quiz')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                currentTab === 'quiz'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Award className="w-3.5 h-3.5" />
              Practice Quiz
            </button>

            <button
              onClick={() => setCurrentTab('circulars')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                currentTab === 'circulars'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Bell className="w-3.5 h-3.5" />
              Circulars
            </button>

            {role === 'admin' && (
              <button
                onClick={() => setCurrentTab('admin')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  currentTab === 'admin'
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <Sliders className="w-3.5 h-3.5" />
                Admin Panel
              </button>
            )}
          </nav>

          {/* Right Action Tools: Language, Role Switcher, Student Info */}
          <div className="flex items-center gap-2.5">
            {/* Language Selector */}
            <div className="flex items-center bg-slate-950/60 rounded-lg p-0.5 border border-slate-800 text-xs">
              <button
                onClick={() => setLanguage('en')}
                className={`px-2 py-1 rounded font-medium transition-colors ${
                  language === 'en'
                    ? 'bg-indigo-600 text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
                title="English"
              >
                EN
              </button>
              <button
                onClick={() => setLanguage('te')}
                className={`px-2 py-1 rounded font-medium transition-colors ${
                  language === 'te'
                    ? 'bg-indigo-600 text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
                title="Telugu (తెలుగు)"
              >
                తెలుగు
              </button>
              <button
                onClick={() => setLanguage('hi')}
                className={`px-2 py-1 rounded font-medium transition-colors ${
                  language === 'hi'
                    ? 'bg-indigo-600 text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
                title="Hindi (हिन्दी)"
              >
                हिन्दी
              </button>
            </div>

            {/* Role Switcher Pill (Student vs Admin) */}
            <button
              onClick={() => {
                const nextRole = role === 'student' ? 'admin' : 'student';
                setRole(nextRole);
                if (nextRole === 'admin') setCurrentTab('admin');
              }}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium border border-slate-700 bg-slate-800/60 hover:bg-slate-800 text-slate-200 transition-colors"
              title="Click to toggle between Student and Admin perspective"
            >
              {role === 'student' ? (
                <>
                  <User className="w-3.5 h-3.5 text-cyan-400" />
                  <span className="hidden sm:inline">Student</span>
                </>
              ) : (
                <>
                  <Settings className="w-3.5 h-3.5 text-amber-400" />
                  <span className="hidden sm:inline">Admin Mode</span>
                </>
              )}
            </button>

            {/* Student mini badge & Firebase Auth trigger */}
            <button
              onClick={onOpenAuth}
              className="flex items-center gap-2 pl-2 border-l border-slate-800 hover:opacity-80 transition-opacity text-left cursor-pointer"
              title="Click to sign in or manage Firebase user profile"
            >
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-inner ${
                role === 'admin'
                  ? 'bg-gradient-to-tr from-amber-500 to-orange-600'
                  : 'bg-gradient-to-tr from-indigo-500 to-pink-500'
              }`}>
                {studentProfile.name.charAt(0)}
              </div>
              <div className="hidden lg:block text-left leading-tight">
                <div className="text-xs font-medium text-slate-200">{studentProfile.name}</div>
                <div className="text-[10px] text-slate-400">
                  {role === 'admin'
                    ? `${studentProfile.designation || 'Administrator'}`
                    : `${studentProfile.rollNumber} • ${studentProfile.currentAttendance ?? 75}% Att`}
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* Mobile Navigation bar */}
        <div className="md:hidden flex items-center justify-around py-2 border-t border-slate-800/60 text-xs text-slate-400">
          <button
            onClick={() => setCurrentTab('chat')}
            className={`p-1.5 ${currentTab === 'chat' ? 'text-indigo-400 font-bold' : ''}`}
          >
            Counselor
          </button>
          <button
            onClick={() => setCurrentTab('vault')}
            className={`p-1.5 ${currentTab === 'vault' ? 'text-indigo-400 font-bold' : ''}`}
          >
            Vault
          </button>
          <button
            onClick={() => setCurrentTab('multimodal')}
            className={`p-1.5 ${currentTab === 'multimodal' ? 'text-indigo-400 font-bold' : ''}`}
          >
            Video/OCR
          </button>
          <button
            onClick={() => setCurrentTab('quiz')}
            className={`p-1.5 ${currentTab === 'quiz' ? 'text-indigo-400 font-bold' : ''}`}
          >
            Quiz
          </button>
          <button
            onClick={() => setCurrentTab('circulars')}
            className={`p-1.5 ${currentTab === 'circulars' ? 'text-indigo-400 font-bold' : ''}`}
          >
            Circulars
          </button>
        </div>
      </div>
    </header>
  );
};
