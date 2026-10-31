import { DocumentChunk, Language, Quiz, MultimodalAnalysisResult, Citation } from '../types';
import { INITIAL_UNIVERSITY_DOCUMENTS } from '../data/initialDocuments';

const STORAGE_KEY_DOCS = 'univerify_rag_docs';
const STORAGE_KEY_HISTORY = 'univerify_chat_history';

export class AcademicRAGService {
  // Document Cache Management
  static getStoredDocuments(): DocumentChunk[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_DOCS);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Failed to load documents from local storage:', e);
    }
    return INITIAL_UNIVERSITY_DOCUMENTS;
  }

  static saveDocuments(docs: DocumentChunk[]): void {
    try {
      localStorage.setItem(STORAGE_KEY_DOCS, JSON.stringify(docs));
    } catch (e) {
      console.error('Failed to save documents to local storage:', e);
    }
  }

  static resetToDefaultDocuments(): DocumentChunk[] {
    localStorage.removeItem(STORAGE_KEY_DOCS);
    return INITIAL_UNIVERSITY_DOCUMENTS;
  }

  // Ask Academic Question
  static async askCounselor(
    query: string,
    documents: DocumentChunk[],
    language: Language = 'en',
    conversationHistory: Array<{ role: string; text: string }> = []
  ): Promise<{ answer: string; citations: Citation[] }> {
    const response = await fetch('/api/rag/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query,
        documents,
        language,
        conversationHistory: conversationHistory.slice(-6),
      }),
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData.error || `Server responded with ${response.status}`);
    }

    return await response.json();
  }

  // Generate Interactive Practice Quiz
  static async generateQuiz(
    topic: string,
    contextDocuments: DocumentChunk[],
    numQuestions: number = 5,
    difficulty: 'easy' | 'medium' | 'hard' = 'medium'
  ): Promise<Quiz> {
    const contextText = contextDocuments
      .map(
        (d) =>
          `[Doc: ${d.title}, Page: ${d.pageNumber}, Section: ${d.section}]\n${d.content}`
      )
      .join('\n\n');

    const response = await fetch('/api/rag/generate-quiz', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        topic,
        contextText,
        numQuestions,
        difficulty,
      }),
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData.error || 'Failed to generate quiz');
    }

    const data = await response.json();
    return {
      topic,
      questions: data.quiz || [],
      createdDate: new Date().toISOString(),
    };
  }

  // Multimodal Analysis: Circular Photo or Lecture Video
  static async analyzeMultimodalFile(
    file: File,
    taskType: 'image_ocr_regulation' | 'lecture_video_analysis',
    customPrompt?: string
  ): Promise<MultimodalAnalysisResult> {
    const base64Data = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        // Strip out the data:image/png;base64, prefix
        const base64 = result.split(',')[1];
        resolve(base64);
      };
      reader.onerror = (err) => reject(err);
      reader.readAsDataURL(file);
    });

    const response = await fetch('/api/rag/analyze-multimodal', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        mimeType: file.type || 'image/jpeg',
        base64Data,
        taskType,
        prompt: customPrompt,
      }),
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData.error || 'Failed to analyze multimodal content');
    }

    const data = await response.json();
    return {
      analysis: data.analysis,
      taskType,
      filename: file.name,
      timestamp: new Date().toISOString(),
    };
  }

  // Translation Support
  static async translateText(text: string, targetLanguage: Language): Promise<string> {
    const response = await fetch('/api/rag/translate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text,
        targetLanguage,
      }),
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData.error || 'Failed to translate');
    }

    const data = await response.json();
    return data.translatedText || text;
  }
}
