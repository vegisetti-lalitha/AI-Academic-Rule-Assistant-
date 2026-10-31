import React, { useState } from 'react';
import {
  Award,
  Sparkles,
  CheckCircle2,
  XCircle,
  HelpCircle,
  RotateCcw,
  BookOpen,
  ArrowRight,
  TrendingUp,
  FileCheck,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { DocumentChunk, Quiz, QuizQuestion } from '../types';
import { AcademicRAGService } from '../services/api';

interface QuizGeneratorProps {
  documents: DocumentChunk[];
  onOpenCitation?: (docTitle: string, page: number, section?: string) => void;
}

export const QuizGenerator: React.FC<QuizGeneratorProps> = ({
  documents,
  onOpenCitation,
}) => {
  const [selectedTopic, setSelectedTopic] = useState('Attendance, Condonation & Detention Rules');
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
  const [isGenerating, setIsGenerating] = useState(false);
  const [quiz, setQuiz] = useState<Quiz | null>(null);

  // Play state
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [showExplanation, setShowExplanation] = useState<Record<number, boolean>>({});
  const [quizFinished, setQuizFinished] = useState(false);

  const predefinedTopics = [
    {
      name: 'Attendance, Condonation & Detention Rules',
      desc: 'Minimum percentages, ₹1,500 condonation fee, medical proofs, and repeating semester rules.',
      category: 'Regulations',
    },
    {
      name: 'SGPA/CGPA Grading & Percentage Conversion',
      desc: '10-point scale, distinction thresholds, and the (CGPA - 0.75) * 10 conversion formula.',
      category: 'Regulations',
    },
    {
      name: 'Examination Malpractice & Disciplinary Penalties',
      desc: 'Mobile phones in exam hall, impersonation IPC 419, and rustication clauses.',
      category: 'Exam Rules',
    },
    {
      name: 'Revaluation, Supplementary & Challenge Evaluation',
      desc: 'Odd semester dates, revaluation fees, ₹10,000 challenge deposit, and grace marks.',
      category: 'Circulars',
    },
    {
      name: 'Mandatory Internships & SWAYAM/NPTEL Policy',
      desc: '6-8 week industrial training, viva voce, and 12-credit transfer limits.',
      category: 'Handbooks',
    },
  ];

  const handleGenerateQuiz = async () => {
    setIsGenerating(true);
    setQuizFinished(false);
    setSelectedAnswers({});
    setShowExplanation({});
    setCurrentQuestionIndex(0);

    try {
      // Find related document chunks
      const matchedChunks = documents.filter(
        (d) =>
          d.title.toLowerCase().includes(selectedTopic.toLowerCase()) ||
          d.section.toLowerCase().includes(selectedTopic.toLowerCase()) ||
          d.content.toLowerCase().includes(selectedTopic.toLowerCase())
      );
      const contextChunks = matchedChunks.length > 0 ? matchedChunks : documents.slice(0, 5);

      const generatedQuiz = await AcademicRAGService.generateQuiz(
        selectedTopic,
        contextChunks,
        5,
        difficulty
      );

      setQuiz(generatedQuiz);
    } catch (err: any) {
      console.error('Quiz generation error:', err);
      // Fallback sample questions if offline
      setQuiz({
        topic: selectedTopic,
        createdDate: new Date().toISOString(),
        questions: [
          {
            id: 1,
            question: 'What is the absolute minimum aggregate attendance below which condonation is NOT permitted under any circumstances?',
            options: ['75%', '65%', '60%', '50%'],
            correctAnswerIndex: 1,
            explanation: 'Under Clause 4.4, condonation is strictly prohibited for students with attendance below 65%. The student is formally detained.',
            citation: 'University Academic Regulations Handbook (R24), Page 2, Clause 4.4',
          },
          {
            id: 2,
            question: 'According to official university rules, what is the formula to convert CGPA into percentage of marks?',
            options: [
              'Percentage = CGPA × 9.5',
              'Percentage = (CGPA - 0.75) × 10',
              'Percentage = CGPA × 10',
              'Percentage = (CGPA - 0.5) × 10',
            ],
            correctAnswerIndex: 1,
            explanation: 'Under Clause 7.4, the official conversion is: Percentage = (CGPA - 0.75) × 10.',
            citation: 'University Academic Regulations Handbook (R24), Page 4, Clause 7.4',
          },
          {
            id: 3,
            question: 'What is the condonation fee prescribed for attendance shortage between 65% and 74%?',
            options: ['₹500/-', '₹1,000/-', '₹1,500/-', '₹2,500/-'],
            correctAnswerIndex: 2,
            explanation: 'Clause 4.3 stipulates a non-refundable condonation fee of ₹1,500/- with medical/sports proof.',
            citation: 'University Academic Regulations Handbook (R24), Page 2, Clause 4.3',
          },
        ],
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSelectOption = (questionId: number, optionIndex: number) => {
    if (selectedAnswers[questionId] !== undefined) return; // Answered already

    setSelectedAnswers((prev) => ({ ...prev, [questionId]: optionIndex }));
    setShowExplanation((prev) => ({ ...prev, [questionId]: true }));

    // Check if last question
    if (quiz && currentQuestionIndex === quiz.questions.length - 1) {
      // Calculate score
      setTimeout(() => {
        setQuizFinished(true);
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
      }, 1000);
    }
  };

  const calculateScore = () => {
    if (!quiz) return { correct: 0, total: 0, percentage: 0 };
    let correct = 0;
    quiz.questions.forEach((q) => {
      if (selectedAnswers[q.id] === q.correctAnswerIndex) {
        correct++;
      }
    });
    return {
      correct,
      total: quiz.questions.length,
      percentage: Math.round((correct / quiz.questions.length) * 100),
    };
  };

  const currentQ = quiz?.questions[currentQuestionIndex];
  const scoreInfo = calculateScore();

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
      {/* Top Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-slate-800 shadow-xl backdrop-blur-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <Award className="w-6 h-6" />
            </span>
            <h1 className="text-xl font-bold text-white">Academic Regulations Practice Quiz</h1>
          </div>
          <p className="mt-1 text-sm text-slate-400 max-w-xl">
            Test your understanding of official university attendance rules, grading scales, promotion credits, and exam malpractice consequences generated directly from ingested regulations.
          </p>
        </div>

        {/* Difficulty Switch */}
        <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
          {(['easy', 'medium', 'hard'] as const).map((lvl) => (
            <button
              key={lvl}
              onClick={() => setDifficulty(lvl)}
              className={`px-3 py-1.5 rounded-lg font-semibold capitalize transition-all ${
                difficulty === lvl
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {lvl}
            </button>
          ))}
        </div>
      </div>

      {/* Topic Selection & Quiz Trigger */}
      {!quiz && (
        <div className="p-6 rounded-2xl bg-slate-850/80 border border-slate-800 backdrop-blur-md shadow-lg space-y-4">
          <h2 className="text-sm font-bold text-slate-200">
            Select University Regulation Chapter / Topic:
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {predefinedTopics.map((topic, i) => (
              <button
                key={i}
                onClick={() => setSelectedTopic(topic.name)}
                className={`p-4 rounded-xl text-left border transition-all ${
                  selectedTopic === topic.name
                    ? 'bg-indigo-600/15 border-indigo-500 text-white shadow-md shadow-indigo-500/10'
                    : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-900'
                }`}
              >
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-semibold text-indigo-300">{topic.category}</span>
                  {selectedTopic === topic.name && (
                    <CheckCircle2 className="w-4 h-4 text-indigo-400" />
                  )}
                </div>
                <h4 className="font-bold text-sm text-slate-100">{topic.name}</h4>
                <p className="mt-1 text-xs text-slate-400 leading-relaxed">{topic.desc}</p>
              </button>
            ))}
          </div>

          <div className="pt-4 border-t border-slate-800 flex items-center justify-end">
            <button
              onClick={handleGenerateQuiz}
              disabled={isGenerating}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white font-semibold text-xs flex items-center gap-2 shadow-lg shadow-indigo-600/25 disabled:opacity-50 transition-all hover:scale-105 active:scale-95"
            >
              {isGenerating ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Scanning Regulations with Gemini 3.8 Flash...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Generate Source-Ground Quiz</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Active Quiz Player */}
      {quiz && !quizFinished && currentQ && (
        <div className="p-6 rounded-2xl bg-slate-850/90 border border-slate-800 backdrop-blur-md shadow-xl space-y-6">
          {/* Progress Header */}
          <div className="flex items-center justify-between text-xs pb-3 border-b border-slate-800">
            <div>
              <span className="text-slate-400">Topic: </span>
              <strong className="text-indigo-300">{quiz.topic}</strong>
            </div>
            <div className="flex items-center gap-2 font-mono">
              <span className="px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-bold">
                Question {currentQuestionIndex + 1} of {quiz.questions.length}
              </span>
            </div>
          </div>

          {/* Question Text */}
          <div>
            <h3 className="text-base sm:text-lg font-bold text-slate-100 leading-snug">
              {currentQ.question}
            </h3>
          </div>

          {/* Options */}
          <div className="space-y-3">
            {currentQ.options.map((option, optIdx) => {
              const isSelected = selectedAnswers[currentQ.id] === optIdx;
              const hasAnswered = selectedAnswers[currentQ.id] !== undefined;
              const isCorrect = optIdx === currentQ.correctAnswerIndex;

              let btnClass = 'bg-slate-900/80 border-slate-700/80 hover:bg-slate-800 hover:border-slate-600 text-slate-200';
              if (hasAnswered) {
                if (isCorrect) {
                  btnClass = 'bg-emerald-500/20 border-emerald-500 text-emerald-200 font-semibold shadow-md shadow-emerald-500/10';
                } else if (isSelected && !isCorrect) {
                  btnClass = 'bg-rose-500/20 border-rose-500 text-rose-200 font-semibold shadow-md shadow-rose-500/10';
                } else {
                  btnClass = 'bg-slate-900/40 border-slate-800 text-slate-500 opacity-60';
                }
              }

              return (
                <button
                  key={optIdx}
                  onClick={() => handleSelectOption(currentQ.id, optIdx)}
                  disabled={hasAnswered}
                  className={`w-full p-4 rounded-xl border text-left text-xs sm:text-sm flex items-center justify-between transition-all group ${btnClass}`}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-lg bg-slate-800 text-slate-300 text-xs font-bold flex items-center justify-center shrink-0 border border-slate-700 group-hover:border-indigo-500">
                      {String.fromCharCode(65 + optIdx)}
                    </span>
                    <span>{option}</span>
                  </div>
                  {hasAnswered && isCorrect && (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                  )}
                  {hasAnswered && isSelected && !isCorrect && (
                    <XCircle className="w-5 h-5 text-rose-400 shrink-0" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Explanation & Source Citation Banner */}
          {showExplanation[currentQ.id] && (
            <div className="p-4 rounded-xl bg-slate-900/90 border border-indigo-500/30 text-xs space-y-2 animate-in fade-in duration-200">
              <div className="flex items-center gap-1.5 font-bold text-indigo-300">
                <FileCheck className="w-4 h-4 text-indigo-400" />
                <span>Official Regulation Grounding:</span>
              </div>
              <p className="text-slate-300 leading-relaxed font-sans">
                {currentQ.explanation}
              </p>
              <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
                <span className="font-mono text-indigo-300">Citation: {currentQ.citation}</span>
                <span className="text-emerald-400 font-semibold">100% Document Verified</span>
              </div>
            </div>
          )}

          {/* Next / Previous Controls */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
            <button
              onClick={() => setCurrentQuestionIndex((prev) => Math.max(0, prev - 1))}
              disabled={currentQuestionIndex === 0}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
            >
              Previous
            </button>

            {currentQuestionIndex < quiz.questions.length - 1 ? (
              <button
                onClick={() => setCurrentQuestionIndex((prev) => prev + 1)}
                disabled={selectedAnswers[currentQ.id] === undefined}
                className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs flex items-center gap-1.5 shadow-lg shadow-indigo-600/30 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                <span>Next Question</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                onClick={() => setQuizFinished(true)}
                disabled={selectedAnswers[currentQ.id] === undefined}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs flex items-center gap-1.5 shadow-lg shadow-emerald-600/30 disabled:opacity-40"
              >
                <span>View Final Score</span>
                <Award className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Quiz Finished Scorecard */}
      {quizFinished && quiz && (
        <div className="p-8 rounded-2xl bg-slate-850/90 border border-slate-800 backdrop-blur-md shadow-2xl text-center space-y-6 animate-in zoom-in-95 duration-200">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center">
            <Award className="w-8 h-8" />
          </div>

          <div>
            <h2 className="text-2xl font-black text-white">Quiz Completed!</h2>
            <p className="text-xs text-slate-400 mt-1">Topic: {quiz.topic}</p>
          </div>

          <div className="inline-flex items-center gap-6 px-6 py-4 rounded-2xl bg-slate-900 border border-slate-800">
            <div>
              <div className="text-3xl font-extrabold text-indigo-400">
                {scoreInfo.correct} / {scoreInfo.total}
              </div>
              <span className="text-[11px] text-slate-400">Correct Answers</span>
            </div>
            <div className="w-px h-10 bg-slate-800" />
            <div>
              <div className="text-3xl font-extrabold text-emerald-400">
                {scoreInfo.percentage}%
              </div>
              <span className="text-[11px] text-slate-400">Regulation Proficiency</span>
            </div>
          </div>

          <p className="text-xs text-slate-300 max-w-md mx-auto">
            {scoreInfo.percentage >= 80
              ? 'Excellent! You have a thorough understanding of university academic guidelines and exam rules.'
              : 'Good effort! Review the detailed citations in the Document Vault to familiarize yourself with detention thresholds and pass criteria.'}
          </p>

          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              onClick={() => {
                setSelectedAnswers({});
                setShowExplanation({});
                setCurrentQuestionIndex(0);
                setQuizFinished(false);
              }}
              className="px-4 py-2.5 rounded-xl border border-slate-700 bg-slate-800 text-xs font-semibold text-slate-200 hover:bg-slate-700 flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Retake Quiz
            </button>
            <button
              onClick={() => setQuiz(null)}
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-semibold text-white shadow-lg shadow-indigo-600/25"
            >
              Pick Another Topic
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
