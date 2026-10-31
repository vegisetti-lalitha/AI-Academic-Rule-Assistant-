import { Language } from '../types';

export class SpeechAssistant {
  private static synth = typeof window !== 'undefined' ? window.speechSynthesis : null;
  private static currentUtterance: SpeechSynthesisUtterance | null = null;

  static isSpeechSynthesisSupported(): boolean {
    return typeof window !== 'undefined' && 'speechSynthesis' in window;
  }

  static isSpeechRecognitionSupported(): boolean {
    return (
      typeof window !== 'undefined' &&
      ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)
    );
  }

  static speak(
    text: string,
    language: Language = 'en',
    onEnd?: () => void,
    onError?: (err: any) => void
  ): void {
    if (!this.synth) return;

    this.stopSpeaking();

    // Clean markdown symbols for cleaner natural speech
    const cleanText = text
      .replace(/\[Doc:[^\]]+\]/g, '')
      .replace(/[*#_`>]/g, '')
      .replace(/\n+/g, '. ')
      .trim();

    const utterance = new SpeechSynthesisUtterance(cleanText);

    const langCodes: Record<Language, string> = {
      en: 'en-US',
      te: 'te-IN',
      hi: 'hi-IN',
    };

    utterance.lang = langCodes[language] || 'en-US';
    utterance.rate = 1.0;
    utterance.pitch = 1.0;

    // Try finding matching voice
    const voices = this.synth.getVoices();
    const matchingVoice = voices.find(
      (v) => v.lang.startsWith(langCodes[language]) || v.lang.includes(language)
    );
    if (matchingVoice) {
      utterance.voice = matchingVoice;
    }

    utterance.onend = () => {
      this.currentUtterance = null;
      if (onEnd) onEnd();
    };

    utterance.onerror = (e) => {
      this.currentUtterance = null;
      if (onError) onError(e);
    };

    this.currentUtterance = utterance;
    this.synth.speak(utterance);
  }

  static stopSpeaking(): void {
    if (this.synth && this.synth.speaking) {
      this.synth.cancel();
      this.currentUtterance = null;
    }
  }

  static isSpeaking(): boolean {
    return Boolean(this.synth && this.synth.speaking);
  }

  static startListening(
    language: Language = 'en',
    onResult: (transcript: string) => void,
    onError: (err: string) => void,
    onEnd: () => void
  ): any {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      onError('Speech recognition not supported in this browser.');
      return null;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;

    const langCodes: Record<Language, string> = {
      en: 'en-US',
      te: 'te-IN',
      hi: 'hi-IN',
    };
    recognition.lang = langCodes[language] || 'en-US';

    recognition.onresult = (event: any) => {
      if (event.results && event.results[0] && event.results[0][0]) {
        const transcript = event.results[0][0].transcript;
        onResult(transcript);
      }
    };

    recognition.onerror = (event: any) => {
      console.warn('Speech recognition error:', event.error);
      onError(event.error || 'Failed to capture voice.');
    };

    recognition.onend = () => {
      onEnd();
    };

    recognition.start();
    return recognition;
  }
}
