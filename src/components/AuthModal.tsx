import React, { useState } from 'react';
import {
  X,
  LogIn,
  ShieldCheck,
  GraduationCap,
  Sparkles,
  User,
  Mail,
  Lock,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  Briefcase,
  Building,
} from 'lucide-react';
import {
  loginWithGoogle,
  loginWithEmail,
  registerWithEmail,
  loginAsGuestStudent,
  db,
} from '../firebase/config';
import { doc, setDoc } from 'firebase/firestore';
import { StudentProfile, UserRole } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess: (profile: StudentProfile) => void;
  currentProfile: StudentProfile;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onAuthSuccess,
  currentProfile,
}) => {
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [role, setRole] = useState<UserRole>(currentProfile.role || 'student');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Profile fields
  const [displayName, setDisplayName] = useState(currentProfile.name);
  const [idNumber, setIdNumber] = useState(currentProfile.rollNumber);
  const [department, setDepartment] = useState(currentProfile.department);
  const [designation, setDesignation] = useState(currentProfile.designation || 'Controller of Examinations');
  const [yearSemester, setYearSemester] = useState(currentProfile.yearSemester || '3rd Year - Semester I');

  // Student-only fields
  const [attendance, setAttendance] = useState(
    currentProfile.currentAttendance !== undefined ? currentProfile.currentAttendance.toString() : '71.4'
  );
  const [cgpa, setCgpa] = useState(
    currentProfile.currentCgpa !== undefined ? currentProfile.currentCgpa.toString() : '8.42'
  );

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSaveProfileToFirestore = async (uid: string, userEmail: string, name: string) => {
    let profile: StudentProfile;

    if (role === 'admin') {
      // Admin profile: Never include attendance or CGPA!
      profile = {
        name: name || displayName || 'Dean of Academics',
        rollNumber: idNumber || 'ADM-COE-01',
        department: department || 'Office of the Controller of Examinations',
        designation: designation || 'Controller of Examinations',
        role: 'admin',
      };
    } else {
      // Student profile: Includes academic metrics for condonation checking
      profile = {
        name: name || displayName || 'University Student',
        rollNumber: idNumber || '22B91A0501',
        department: department || 'Computer Science & Engineering',
        yearSemester: yearSemester || '3rd Year - Semester I',
        currentAttendance: parseFloat(attendance) || 71.4,
        currentCgpa: parseFloat(cgpa) || 8.42,
        role: 'student',
      };
    }

    try {
      await setDoc(
        doc(db, 'users', uid),
        {
          ...profile,
          email: userEmail,
          updatedAt: new Date().toISOString(),
        },
        { merge: true }
      );
    } catch (e) {
      console.warn('Could not write profile to Firestore, using session state:', e);
    }

    onAuthSuccess(profile);
    onClose();
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const user = await loginWithGoogle();
      await handleSaveProfileToFirestore(user.uid, user.email || '', user.displayName || '');
    } catch (err: any) {
      console.error('Google Sign-In error:', err);
      if (err.code === 'auth/popup-blocked' || err.code === 'auth/cancelled-popup-request') {
        setErrorMessage('Popup was blocked by the browser. You can use Email or Guest Sign-In below.');
      } else {
        setErrorMessage(err.message || 'Failed to sign in with Google');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    setIsLoading(true);
    setErrorMessage(null);
    try {
      let user;
      if (authMode === 'signup') {
        user = await registerWithEmail(email, password);
      } else {
        user = await loginWithEmail(email, password);
      }
      await handleSaveProfileToFirestore(user.uid, user.email || email, displayName);
    } catch (err: any) {
      console.error('Email Auth Error:', err);
      setErrorMessage(err.message || 'Authentication failed. Please check credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGuestDemoSignIn = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const user = await loginAsGuestStudent();
      await handleSaveProfileToFirestore(
        user.uid,
        role === 'admin' ? 'admin.demo@university.edu' : 'student.guest@univerify.edu',
        displayName
      );
    } catch (err: any) {
      console.warn('Anonymous auth note:', err);
      const fallbackProfile: StudentProfile = role === 'admin'
        ? {
            name: displayName || 'Controller of Examinations',
            rollNumber: idNumber || 'ADM-COE-01',
            department: department || 'Office of COE',
            designation: designation || 'Controller of Examinations',
            role: 'admin',
          }
        : {
            name: displayName || 'Lalitha Devi',
            rollNumber: idNumber || '22B91A0501',
            department: department || 'Computer Science & Engineering',
            yearSemester: yearSemester || '3rd Year - Semester I',
            currentAttendance: parseFloat(attendance) || 71.4,
            currentCgpa: parseFloat(cgpa) || 8.42,
            role: 'student',
          };
      onAuthSuccess(fallbackProfile);
      onClose();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-slate-900 via-indigo-950/50 to-slate-900 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-xl border ${
              role === 'admin'
                ? 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                : 'bg-indigo-500/10 border-indigo-500/30 text-indigo-400'
            }`}>
              {role === 'admin' ? <ShieldCheck className="w-6 h-6" /> : <GraduationCap className="w-6 h-6" />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className={`text-xs font-semibold px-2 py-0.5 rounded border ${
                  role === 'admin'
                    ? 'bg-amber-500/10 text-amber-300 border-amber-500/30'
                    : 'bg-indigo-500/10 text-indigo-300 border-indigo-500/30'
                }`}>
                  {role === 'admin' ? 'University Administration Portal' : 'Student Academic Portal'}
                </span>
              </div>
              <h3 className="text-lg font-bold text-white mt-0.5">
                {authMode === 'signin'
                  ? (role === 'admin' ? 'Administrator Sign In' : 'Student Sign In')
                  : (role === 'admin' ? 'Register University Administrator' : 'Create Student Account')}
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

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-5">
          {errorMessage && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Role Switcher Selector at Top */}
          <div>
            <label className="text-xs text-slate-300 font-semibold block mb-1.5">
              Select Your University Role:
            </label>
            <div className="grid grid-cols-2 gap-2 p-1 bg-slate-950 rounded-xl border border-slate-800">
              <button
                type="button"
                onClick={() => setRole('student')}
                className={`py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                  role === 'student'
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <GraduationCap className="w-4 h-4" />
                <span>Student</span>
              </button>
              <button
                type="button"
                onClick={() => setRole('admin')}
                className={`py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                  role === 'admin'
                    ? 'bg-amber-600 text-white shadow-md shadow-amber-600/30'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Administrator</span>
              </button>
            </div>
          </div>

          {/* Google Sign-In Button */}
          <div>
            <button
              onClick={handleGoogleSignIn}
              disabled={isLoading}
              className="w-full py-3 px-4 rounded-xl bg-white hover:bg-slate-100 text-slate-900 font-bold text-xs flex items-center justify-center gap-3 shadow-md hover:shadow-lg transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Continue with Google Sign-In as {role === 'admin' ? 'Admin' : 'Student'}</span>
            </button>
          </div>

          <div className="relative flex items-center justify-center">
            <div className="border-t border-slate-800 w-full" />
            <span className="bg-slate-900 px-3 text-[11px] text-slate-500 uppercase tracking-wider font-semibold">
              Or with University Credentials
            </span>
          </div>

          {/* Email / Password Form */}
          <form onSubmit={handleEmailAuth} className="space-y-3.5">
            <div>
              <label className="text-xs text-slate-300 font-semibold flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-indigo-400" />
                {role === 'admin' ? 'Institutional / Official Email' : 'Student University Email'}
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={role === 'admin' ? 'admin.coe@university.edu' : 'student@university.edu'}
                className="mt-1 w-full px-3.5 py-2 bg-slate-950 border border-slate-700/80 rounded-xl text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="text-xs text-slate-300 font-semibold flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-indigo-400" />
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="mt-1 w-full px-3.5 py-2 bg-slate-950 border border-slate-700/80 rounded-xl text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>

            {/* Profile Config Row: Dynamic based on role */}
            <div className="grid grid-cols-2 gap-3 pt-1">
              <div>
                <label className="text-[11px] text-slate-400 font-medium">
                  {role === 'admin' ? 'Official / Faculty Name' : 'Student Full Name'}
                </label>
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder={role === 'admin' ? 'e.g. Dr. K. Ramaswamy' : 'e.g. Lalitha Devi'}
                  className="mt-1 w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="text-[11px] text-slate-400 font-medium">
                  {role === 'admin' ? 'Employee / Staff ID' : 'Roll Number / ID'}
                </label>
                <input
                  type="text"
                  value={idNumber}
                  onChange={(e) => setIdNumber(e.target.value)}
                  placeholder={role === 'admin' ? 'e.g. EMP-1042' : 'e.g. 22B91A0501'}
                  className="mt-1 w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            {/* Admin-Specific Fields */}
            {role === 'admin' && (
              <div className="grid grid-cols-2 gap-3 p-3 rounded-xl bg-amber-500/5 border border-amber-500/20">
                <div>
                  <label className="text-[11px] text-amber-300 font-semibold flex items-center gap-1">
                    <Briefcase className="w-3 h-3" />
                    Designation / Title
                  </label>
                  <input
                    type="text"
                    value={designation}
                    onChange={(e) => setDesignation(e.target.value)}
                    placeholder="e.g. Controller of Examinations"
                    className="mt-1 w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="text-[11px] text-amber-300 font-semibold flex items-center gap-1">
                    <Building className="w-3 h-3" />
                    Office / Department
                  </label>
                  <input
                    type="text"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    placeholder="e.g. Examination Cell"
                    className="mt-1 w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>
            )}

            {/* Student-Specific Fields: Year, Attendance, CGPA */}
            {role === 'student' && (
              <div className="space-y-3 p-3 rounded-xl bg-indigo-500/5 border border-indigo-500/20">
                <div>
                  <label className="text-[11px] text-indigo-300 font-semibold">
                    Department & Semester
                  </label>
                  <input
                    type="text"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    placeholder="e.g. Computer Science & Engineering (3rd Year)"
                    className="mt-1 w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] text-slate-400 font-medium">Recorded Attendance (%)</label>
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      max="100"
                      value={attendance}
                      onChange={(e) => setAttendance(e.target.value)}
                      placeholder="e.g. 71.4"
                      className="mt-1 w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-indigo-500 font-mono"
                    />
                    <span className="text-[10px] text-slate-500 mt-0.5 block">Used for condonation verification</span>
                  </div>

                  <div>
                    <label className="text-[11px] text-slate-400 font-medium">Current CGPA (out of 10)</label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      max="10"
                      value={cgpa}
                      onChange={(e) => setCgpa(e.target.value)}
                      placeholder="e.g. 8.42"
                      className="mt-1 w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-indigo-500 font-mono"
                    />
                    <span className="text-[10px] text-slate-500 mt-0.5 block">Used for percentage conversion</span>
                  </div>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-2.5 rounded-xl text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-lg transition-all ${
                role === 'admin'
                  ? 'bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 shadow-amber-600/25'
                  : 'bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 shadow-indigo-600/25'
              }`}
            >
              <LogIn className="w-4 h-4" />
              <span>
                {authMode === 'signin'
                  ? `Sign In as ${role === 'admin' ? 'Administrator' : 'Student'}`
                  : `Register ${role === 'admin' ? 'Administrator' : 'Student'}`}
              </span>
            </button>
          </form>

          {/* Quick Demo Guest Button */}
          <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
            <button
              onClick={() => setAuthMode((prev) => (prev === 'signin' ? 'signup' : 'signin'))}
              className="text-indigo-400 hover:text-indigo-300 font-medium"
            >
              {authMode === 'signin'
                ? "Don't have an account? Sign up"
                : 'Already have an account? Sign in'}
            </button>

            <button
              onClick={handleGuestDemoSignIn}
              disabled={isLoading}
              className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium text-[11px] transition-colors"
            >
              Demo {role === 'admin' ? 'Admin' : 'Student'} Login →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
