"use client";

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Mic, MicOff, Loader2 } from 'lucide-react';

export function VoiceNavigator() {
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState<any>(null);
  const [feedback, setFeedback] = useState<string>('');
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const _recognition = new SpeechRecognition();
        _recognition.continuous = false;
        _recognition.interimResults = false;
        _recognition.lang = 'en-US';
        setRecognition(_recognition);
      }
    }
  }, []);

  const handleCommand = (transcript: string) => {
    const text = transcript.toLowerCase();
    
    // Command Routing Dictionary
    const routes = [
      { keywords: ['dashboard', 'home', 'main'], path: '/', name: 'Dashboard' },
      { keywords: ['plan', 'planner', 'schedule'], path: '/planner', name: 'Study Engine' },
      { keywords: ['practice', 'test', 'question', 'mcq'], path: '/practice', name: 'Adaptive Practice' },
      { keywords: ['tutor', 'chat', 'teach', 'ask'], path: '/tutor', name: 'AI Tutor' },
      { keywords: ['lab', 'video', 'extract', 'note'], path: '/lab', name: 'Content Lab' },
      { keywords: ['retention', 'graph', 'memory', 'review'], path: '/retention', name: 'Retention Vault' }
    ];

    let found = false;
    for (const route of routes) {
      if (route.keywords.some(kw => text.includes(kw))) {
        setFeedback(`Opening ${route.name}...`);
        speak(`Navigating to ${route.name}`);
        router.push(route.path);
        found = true;
        break;
      }
    }

    if (!found) {
      setFeedback("Command not recognized.");
      speak("I didn't catch that module name.");
    }

    setTimeout(() => setFeedback(''), 3000);
  };

  const speak = (text: string) => {
    if (!window.speechSynthesis) return;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.1;
    utterance.pitch = 1.05;
    window.speechSynthesis.speak(utterance);
  };

  useEffect(() => {
    if (recognition) {
        recognition.onresult = (event: any) => {
            const transcript = event.results[event.results.length - 1][0].transcript;
            handleCommand(transcript);
        };
        recognition.onend = () => {
            setIsListening(false);
        };
        recognition.onerror = () => {
            setIsListening(false);
            setFeedback("Microphone error");
            setTimeout(() => setFeedback(''), 2000);
        };
    }
  }, [recognition, router]);

  const toggleListen = () => {
    if (!recognition) {
       alert('Voice navigation is not supported in this browser. Please use Chrome.');
       return;
    }
    if (isListening) {
      recognition.stop();
      setIsListening(false);
    } else {
      recognition.start();
      setIsListening(true);
      setFeedback('Listening for command...');
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {feedback && (
        <div className="bg-surface/90 backdrop-blur-md border border-border text-white px-4 py-2 rounded-xl text-sm font-medium shadow-2xl animate-in slide-in-from-bottom-2 fade-in">
          {feedback}
        </div>
      )}
      
      <button
        onClick={toggleListen}
        className={`w-14 h-14 rounded-full flex items-center justify-center shadow-2xl transition-all ${
          isListening 
            ? 'bg-red-500 text-white animate-pulse shadow-[0_0_20px_rgba(239,68,68,0.6)] scale-110' 
            : 'bg-surface border border-border text-white hover:border-primary hover:text-primary'
        }`}
        title="Voice Navigation (e.g. 'Open Practice')"
      >
        {isListening ? <Loader2 className="w-6 h-6 animate-spin" /> : <Mic className="w-6 h-6" />}
      </button>
    </div>
  );
}
