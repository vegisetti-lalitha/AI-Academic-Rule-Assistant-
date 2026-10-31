import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  FileCheck,
  ShieldAlert,
  Sparkles,
  HelpCircle,
  Copy,
  Check,
  Languages,
  BookOpen,
  ArrowRight,
  Info,
  ExternalLink,
} from 'lucide-react';
import { ChatMessage, Citation, DocumentChunk, Language } from '../types';
import { SAMPLE_QUESTIONS } from '../data/initialDocuments';
import { AcademicRAGService } from '../services/api';
import { SpeechAssistant } from '../utils/speech';

interface RagChatProps {
  documents: DocumentChunk[];
  language: Language;
  setLanguage: (lang: Language) => void;
  onOpenCitation: (citation: Citation) => void;
  onNavigateToVault: () => void;
}

export const RagChat: React.FC<RagChatProps> = ({
  documents,
  language,
  setLanguage,
  onOpenCitation,
  onNavigateToVault,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-msg',
      role: 'assistant',
      text: `Hello! I am your official **UniVerify Academic Regulations Counselor**.

I have ingested the university's academic handbooks, circulars, examination rules, and detention policies.

**My Anti-Hallucination Guarantee:**
* I answer **STRICTLY** from the authenticated university documents.
* Every single rule includes an exact page number and clause citation.
* If a policy is not contained in the official documents, I will honestly say: **"Information not found in official university documents."**

Ask me any question below, or pick a sample question to test my verification engine!`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      citations: [
        {
          docTitle: 'University Academic Regulations Handbook (R24)',
          page: 1,
          section: 'Academic Program Guidelines',
        },
      ],
      language: 'en',
    },
  ]);

  const [inputQuery, setInputQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [currentlySpeakingId, setCurrentlySpeakingId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const speechRecognitionRef = useRef<any>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Handle Voice Dictation
  const toggleSpeechRecognition = () => {
    if (isListening) {
      if (speechRecognitionRef.current) {
        speechRecognitionRef.current.stop();
      }
      setIsListening(false);
      return;
    }

    try {
      setIsListening(true);
      speechRecognitionRef.current = SpeechAssistant.startListening(
        language,
        (transcript) => {
          setInputQuery(transcript);
          setIsListening(false);
        },
        (error) => {
          console.warn('Voice error:', error);
          setIsListening(false);
        },
        () => {
          setIsListening(false);
        }
      );
    } catch (e) {
      console.error(e);
      setIsListening(false);
    }
  };

  // Handle Text-to-Speech Playback
  const handleSpeak = (msgId: string, text: string, msgLang?: Language) => {
    if (currentlySpeakingId === msgId) {
      SpeechAssistant.stopSpeaking();
      setCurrentlySpeakingId(null);
      return;
    }

    setCurrentlySpeakingId(msgId);
    SpeechAssistant.speak(
      text,
      msgLang || language,
      () => setCurrentlySpeakingId(null),
      () => setCurrentlySpeakingId(null)
    );
  };

  // Copy message to clipboard
  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Translate specific message to another language
  const handleTranslateMessage = async (msgId: string, text: string, targetLang: Language) => {
    try {
      setLoadingStep('Translating academic regulation...');
      const translated = await AcademicRAGService.translateText(text, targetLang);
      setMessages((prev) =>
        prev.map((m) =>
          m.id === msgId ? { ...m, text: translated, language: targetLang } : m
        )
      );
    } catch (err) {
      console.error('Translation error:', err);
    } finally {
      setLoadingStep('');
    }
  };

  // Submit Query to RAG Engine
  const handleSubmitQuery = async (queryText?: string) => {
    const q = (queryText || inputQuery).trim();
    if (!q || isLoading) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      text: q,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      language,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputQuery('');
    setIsLoading(true);
    setLoadingStep('Ingesting & scanning university regulation index...');

    try {
      setTimeout(() => {
        setLoadingStep('Matching clauses and verifying page citations...');
      }, 700);

      const convHistory = messages.map((m) => ({ role: m.role, text: m.text }));
      const response = await AcademicRAGService.askCounselor(
        q,
        documents,
        language,
        convHistory
      );

      const assistantMessage: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        text: response.answer,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        citations: response.citations,
        language,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err: any) {
      console.error('RAG Error:', err);
      const errorMessage: ChatMessage = {
        id: `err-${Date.now()}`,
        role: 'assistant',
        text: `⚠️ **Error Processing Query**: ${err.message || 'Unable to retrieve regulations.'}\n\nPlease verify your query or try rephrasing with specific regulation keywords.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      setLoadingStep('');
    }
  };

  // Parse text into readable nodes with clickable citation badges
  const renderMessageText = (text: string) => {
    // Regex matches [Doc: "...", Page: X, Section: "..."]
    const citationPattern = /\[Doc:\s*"([^"]+)",\s*Page:\s*(\d+)(?:,\s*Section:\s*"([^"]+)")?\]/g;

    const parts: React.ReactNode[] = [];
    let lastIndex = 0;
    let match;

    while ((match = citationPattern.exec(text)) !== null) {
      const preceding = text.substring(lastIndex, match.index);
      if (preceding) {
        parts.push(
          <span key={`text-${lastIndex}`} className="whitespace-pre-wrap">
            {preceding}
          </span>
        );
      }

      const docTitle = match[1];
      const pageNum = parseInt(match[2], 10);
      const section = match[3];

      parts.push(
        <button
          key={`cite-${match.index}`}
          onClick={() => onOpenCitation({ docTitle, page: pageNum, section })}
          className="inline-flex items-center gap-1 mx-1 px-2 py-0.5 rounded-md bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 hover:text-indigo-200 border border-indigo-500/30 text-xs font-semibold tracking-wide transition-all align-middle group cursor-pointer shadow-sm hover:scale-105 active:scale-95"
          title="Click to view verified document excerpt"
        >
          <FileCheck className="w-3.5 h-3.5 text-indigo-400 group-hover:text-cyan-300" />
          <span>Page {pageNum}</span>
          <span className="opacity-70 text-[10px] hidden sm:inline">({docTitle.split(' ')[0]})</span>
        </button>
      );

      lastIndex = citationPattern.lastIndex;
    }

    const remaining = text.substring(lastIndex);
    if (remaining) {
      parts.push(
        <span key={`text-end`} className="whitespace-pre-wrap">
          {remaining}
        </span>
      );
    }

    return parts;
  };

  return (
    <div className="flex flex-col h-[calc(100vh-5rem)] max-w-5xl mx-auto px-2 sm:px-4">
      {/* Top Guarantee Banner */}
      <div className="my-2 p-2.5 sm:p-3 rounded-xl bg-gradient-to-r from-indigo-950/40 via-slate-900 to-indigo-950/40 border border-indigo-500/20 backdrop-blur-md flex items-center justify-between gap-3 text-xs shadow-sm">
        <div className="flex items-center gap-2 text-slate-300">
          <span className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <FileCheck className="w-4 h-4" />
          </span>
          <div>
            <span className="font-bold text-white">Strict Source Grounding Active</span>: Answers are extracted exclusively from {documents.length} verified university document pages.
          </div>
        </div>
        <button
          onClick={onNavigateToVault}
          className="shrink-0 flex items-center gap-1 text-[11px] font-semibold text-indigo-400 hover:text-indigo-300 underline"
        >
          View Indexed Vault ({documents.length})
          <ArrowRight className="w-3 h-3" />
        </button>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-1 sm:pr-2 py-2">
        {messages.map((msg) => {
          const isUser = msg.role === 'user';
          return (
            <div
              key={msg.id}
              className={`flex ${isUser ? 'justify-end' : 'justify-start'} animate-in fade-in duration-200`}
            >
              <div
                className={`max-w-[92%] sm:max-w-[85%] rounded-2xl p-4 sm:p-5 shadow-lg ${
                  isUser
                    ? 'bg-gradient-to-br from-indigo-600 to-indigo-700 text-white rounded-br-none shadow-indigo-500/15'
                    : 'bg-slate-800/80 backdrop-blur-md border border-slate-700/80 text-slate-100 rounded-bl-none shadow-slate-950/40'
                }`}
              >
                {/* Assistant Header */}
                {!isUser && (
                  <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-700/60 text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded-md bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-[10px]">
                        AI
                      </div>
                      <span className="font-semibold text-indigo-300">Academic Regulations Counselor</span>
                      {msg.language && msg.language !== 'en' && (
                        <span className="px-1.5 py-0.2 rounded bg-indigo-500/20 text-indigo-300 text-[10px] font-medium uppercase">
                          {msg.language}
                        </span>
                      )}
                    </div>
                    <span className="text-slate-400 text-[11px]">{msg.timestamp}</span>
                  </div>
                )}

                {/* Message Body */}
                <div className="text-sm leading-relaxed prose prose-invert max-w-none">
                  {isUser ? msg.text : renderMessageText(msg.text)}
                </div>

                {/* Assistant Footer Controls: Citations, Audio, Translation, Copy */}
                {!isUser && (
                  <div className="mt-4 pt-3 border-t border-slate-700/60 flex flex-wrap items-center justify-between gap-2 text-xs">
                    {/* Citations Preview pills */}
                    <div className="flex flex-wrap items-center gap-1.5">
                      {msg.citations && msg.citations.length > 0 ? (
                        <>
                          <span className="text-[11px] text-slate-400 flex items-center gap-1 font-medium">
                            <BookOpen className="w-3 h-3 text-indigo-400" />
                            Sources:
                          </span>
                          {msg.citations.map((cite, idx) => (
                            <button
                              key={`cite-pill-${idx}`}
                              onClick={() => onOpenCitation(cite)}
                              className="px-2 py-0.5 rounded-full bg-slate-900/80 hover:bg-slate-900 text-indigo-300 hover:text-white border border-indigo-500/30 text-[11px] font-medium flex items-center gap-1 transition-all"
                            >
                              <span>p.{cite.page}</span>
                              <ExternalLink className="w-2.5 h-2.5 opacity-60" />
                            </button>
                          ))}
                        </>
                      ) : (
                        <span className="text-[11px] text-slate-400 italic">No document citation found</span>
                      )}
                    </div>

                    {/* Actions: Speak, Translate, Copy */}
                    <div className="flex items-center gap-1">
                      {/* Text-to-Speech Button */}
                      <button
                        onClick={() => handleSpeak(msg.id, msg.text, msg.language)}
                        className={`p-1.5 rounded-lg border transition-all ${
                          currentlySpeakingId === msg.id
                            ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 animate-pulse'
                            : 'bg-slate-900/60 text-slate-300 border-slate-700 hover:text-white hover:bg-slate-700'
                        }`}
                        title={currentlySpeakingId === msg.id ? 'Stop Voice' : 'Listen to Answer'}
                      >
                        {currentlySpeakingId === msg.id ? (
                          <VolumeX className="w-3.5 h-3.5" />
                        ) : (
                          <Volume2 className="w-3.5 h-3.5" />
                        )}
                      </button>

                      {/* Multilingual Quick Switch */}
                      <div className="flex items-center bg-slate-900/60 rounded-lg border border-slate-700 p-0.5">
                        <button
                          onClick={() => handleTranslateMessage(msg.id, msg.text, 'en')}
                          className="px-1.5 py-0.5 text-[10px] text-slate-400 hover:text-white rounded"
                          title="Translate to English"
                        >
                          EN
                        </button>
                        <button
                          onClick={() => handleTranslateMessage(msg.id, msg.text, 'te')}
                          className="px-1.5 py-0.5 text-[10px] text-slate-400 hover:text-white rounded"
                          title="Translate to Telugu (తెలుగు)"
                        >
                          తెలుగు
                        </button>
                        <button
                          onClick={() => handleTranslateMessage(msg.id, msg.text, 'hi')}
                          className="px-1.5 py-0.5 text-[10px] text-slate-400 hover:text-white rounded"
                          title="Translate to Hindi (हिन्दी)"
                        >
                          हिन्दी
                        </button>
                      </div>

                      {/* Copy Button */}
                      <button
                        onClick={() => handleCopy(msg.id, msg.text)}
                        className="p-1.5 rounded-lg bg-slate-900/60 border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
                        title="Copy Answer"
                      >
                        {copiedId === msg.id ? (
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {/* Loading Indicator */}
        {isLoading && (
          <div className="flex justify-start animate-in fade-in duration-150">
            <div className="max-w-[85%] rounded-2xl rounded-bl-none p-4 bg-slate-800/80 backdrop-blur-md border border-indigo-500/30 text-slate-200 shadow-xl flex items-center gap-3">
              <div className="relative flex items-center justify-center w-6 h-6">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                <Sparkles className="w-4 h-4 text-indigo-400 relative" />
              </div>
              <div className="text-xs">
                <p className="font-semibold text-indigo-300">{loadingStep || 'Evaluating University Regulations...'}</p>
                <p className="text-[11px] text-slate-400">Filtering pages • Verifying clauses • Enforcing zero-hallucination constraint</p>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Questions Starter Carousel */}
      {messages.length <= 2 && (
        <div className="py-2">
          <div className="flex items-center gap-1.5 text-xs text-slate-400 font-semibold mb-2">
            <HelpCircle className="w-3.5 h-3.5 text-indigo-400" />
            <span>Frequently Asked Student Regulation Queries:</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
            {SAMPLE_QUESTIONS.slice(0, 4).map((sample) => (
              <button
                key={sample.id}
                onClick={() => handleSubmitQuery(sample.question)}
                className="text-left p-2.5 rounded-xl bg-slate-850/80 hover:bg-slate-800 border border-slate-800 hover:border-indigo-500/40 text-xs text-slate-300 hover:text-white transition-all shadow-sm group cursor-pointer"
              >
                <div className="font-medium text-slate-200 group-hover:text-indigo-300 line-clamp-2">
                  "{sample.question}"
                </div>
                <div className="mt-1 flex items-center justify-between text-[10px] text-slate-500">
                  <span>{sample.category}</span>
                  <span className="text-indigo-400 group-hover:translate-x-0.5 transition-transform">Ask →</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input Box with Voice & Send */}
      <div className="pt-2 pb-3">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmitQuery();
          }}
          className="relative flex items-center gap-2 p-2 rounded-2xl bg-slate-850/90 backdrop-blur-xl border border-slate-700/80 focus-within:border-indigo-500/80 shadow-2xl transition-all"
        >
          {/* Speech-to-Text Button */}
          <button
            type="button"
            onClick={toggleSpeechRecognition}
            className={`p-2.5 rounded-xl border transition-all ${
              isListening
                ? 'bg-rose-500 text-white border-rose-400 shadow-lg shadow-rose-500/30 animate-pulse'
                : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white hover:bg-slate-700'
            }`}
            title={isListening ? 'Listening... click to stop' : 'Voice Query (Speech-to-Text)'}
          >
            {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
          </button>

          {/* Text Input */}
          <input
            type="text"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            placeholder={
              isListening
                ? 'Listening to your voice...'
                : language === 'te'
                ? 'మీ ప్రశ్నను అడగండి (ఉదా: 68% హాజరుతో పరీక్ష రాయవచ్చా?)...'
                : language === 'hi'
                ? 'अपना प्रश्न पूछें (उदा: 68% उपस्थिति के साथ परीक्षा दे सकते हैं?)...'
                : 'Ask about attendance condonation, detention, CGPA conversion, exam rules...'
            }
            disabled={isLoading}
            className="flex-1 bg-transparent border-none text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none px-2"
          />

          {/* Send Button */}
          <button
            type="submit"
            disabled={isLoading || !inputQuery.trim()}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white font-semibold text-xs flex items-center gap-1.5 shadow-lg shadow-indigo-600/30 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
          >
            <span>Ask</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>

        <div className="mt-1.5 flex items-center justify-between px-2 text-[11px] text-slate-500">
          <span>Powered by Google Gemini RAG • Exact page citations guaranteed</span>
          <span>Language: <strong className="text-slate-400 uppercase">{language}</strong></span>
        </div>
      </div>
    </div>
  );
};
