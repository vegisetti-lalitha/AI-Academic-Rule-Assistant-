export type Language = 'en' | 'te' | 'hi';

export type UserRole = 'student' | 'admin';

export interface DocumentChunk {
  id: string;
  title: string;
  category: 'Regulations' | 'Exam Rules' | 'Circulars' | 'Handbooks' | 'Hostel & Discipline' | 'Internships';
  pageNumber: number;
  section: string;
  content: string;
  dateAdded: string;
  isOfficial: boolean;
  tags: string[];
}

export interface Citation {
  docTitle: string;
  page: number;
  section?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  timestamp: string;
  citations?: Citation[];
  language?: Language;
  sourceDocHighlights?: Array<{
    title: string;
    page: number;
    text: string;
  }>;
  audioPlaying?: boolean;
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
  citation: string;
}

export interface Quiz {
  topic: string;
  questions: QuizQuestion[];
  createdDate: string;
}

export interface StudentProfile {
  name: string;
  rollNumber: string;
  department: string;
  yearSemester?: string;
  designation?: string;
  currentAttendance?: number;
  currentCgpa?: number;
  role: UserRole;
}

export interface MultimodalAnalysisResult {
  analysis: string;
  taskType: 'image_ocr_regulation' | 'lecture_video_analysis';
  previewUrl?: string;
  filename?: string;
  timestamp: string;
}
