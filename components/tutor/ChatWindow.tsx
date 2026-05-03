"use client";

import { useState, useRef, useEffect } from 'react';
import { Message } from '../../types';
import { ChatMessage } from './ChatMessage';
import { VoiceInput } from './VoiceInput';
import { SubjectSelector } from './SubjectSelector';
import { Send, Hash, Loader2 } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { apiFetch } from '../../lib/api';

export function ChatWindow() {
  const { profile } = useStore();
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: `Namaste! I'm Abhay Parth, your personal AI Tutor for ${profile?.exam || 'competitive exams'}. Which subject or concept are you struggling with today?` }
  ]);
  const [input, setInput] = useState('');
  const [subject, setSubject] = useState('General');
  const [language, setLanguage] = useState('English');
  const [isTyping, setIsTyping] = useState(false);
  const [isAutoSpeak, setIsAutoSpeak] = useState(true);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const speakResponse = (text: string) => {
    if (!window.speechSynthesis || !isAutoSpeak) return;
    
    // Brutally strip markdown formatting (*, #, _, `, -, ~, [, ]) so it reads flawlessly like a human
    const cleanText = text
      .replace(/[*#_`~|-]/g, ' ')
      .replace(/\[.*?\]\(.*?\)/g, '')
      .replace(/\s+/g, ' ')
      .trim();

    const utterance = new SpeechSynthesisUtterance(cleanText);
    
    // Find premium human-like English voices
    const voices = window.speechSynthesis.getVoices();
    let selectedVoice = null;
    
    const langMap: Record<string, string> = {
       'Hindi': 'hi', 'Tamil': 'ta', 'Telugu': 'te', 
       'Bengali': 'bn', 'Marathi': 'mr', 'Gujarati': 'gu'
    };
    
    if (language !== 'English' && language !== 'Hinglish') {
       const code = langMap[language];
       selectedVoice = voices.find(v => v.lang.includes(code) && (v.name.includes('Google') || v.name.includes('Natural') || v.name.includes('Premium'))) || voices.find(v => v.lang.includes(code)) || null;
    } else {
       selectedVoice = voices.find(v => v.lang.includes('en-IN') && (v.name.includes('Google') || v.name.includes('Rishi') || v.name.includes('Natural'))) 
                    || voices.find(v => v.lang.includes('en') && (v.name.includes('Google') || v.name.includes('Samantha') || v.name.includes('Daniel')))
                    || voices.find(v => v.lang.includes('en')) || null;
    }
    
    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }
    
    // Human-like cadence tuning
    utterance.pitch = 1.05; 
    utterance.rate = 0.95;  
    
    window.speechSynthesis.speak(utterance);
  };

  const handleSubmit = async (e?: React.FormEvent, overrideInput?: string) => {
    if (e) e.preventDefault();
    const textToSubmit = overrideInput !== undefined ? overrideInput : input;
    if (!textToSubmit.trim() || isTyping) return;

    const userMsg: Message = { role: 'user', content: textToSubmit };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      const res = await apiFetch('/api/tutor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject,
          language,
          exam: profile?.exam || 'General Competitive Exams',
          messages: [...messages, userMsg].map(m => ({ role: m.role, content: m.content }))
        })
      });

      if (!res.body) throw new Error("No response body");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      
      let done = false;
      let assistantMsgContent = '';
      
      setMessages(prev => [...prev, { role: 'assistant', content: '' }]);

      while (!done) {
        const { value, done: doneReading } = await reader.read();
        done = doneReading;
        if (value) {
          const chunk = decoder.decode(value, { stream: true });
          assistantMsgContent += chunk;
          
          setMessages(prev => {
             const newMsgs = [...prev];
             newMsgs[newMsgs.length - 1].content = assistantMsgContent;
             return newMsgs;
          });
        }
      }
      
      // Auto-TTS after stream is complete
      speakResponse(assistantMsgContent);

    } catch (e) {
      console.error(e);
      setMessages(prev => [...prev, { role: 'assistant', content: "Connection error. Please try asking again." }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleVoiceInput = (text: string) => {
      setInput(text);
  };

  const handleVoiceEnd = (finalText: string) => {
      handleSubmit(undefined, finalText);
  };

  const quickChips = {
     'Physics': ['Explain Faraday Law', 'Kinematics formulas', 'Draw FBD'],
     'Chemistry': ['SN1 vs SN2', 'Periodic Trends', 'VSEPR Theory'],
     'General': ['Make a study plan', 'How to reduce silly mistakes', 'Best way to revise']
  };
  const currentChips = (quickChips as any)[subject] || quickChips['General'];

  return (
    <div className="flex flex-col h-full bg-card border border-border rounded-3xl overflow-hidden shadow-2xl relative">
       {/* Header */}
       <div className="bg-surface border-b border-border p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 z-10 shrink-0">
          <SubjectSelector subject={subject} setSubject={setSubject} />
          
          <div className="flex items-center gap-4">
             <button 
                onClick={() => setIsAutoSpeak(!isAutoSpeak)}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg border transition-all ${isAutoSpeak ? 'bg-primary/20 border-primary text-primary' : 'bg-background border-border text-muted hover:text-white'}`}
             >
                {isAutoSpeak ? '🗣 Auto' : '🗣 Off'}
             </button>

             <select 
                value={language}
                onChange={e => setLanguage(e.target.value)}
                className="bg-background border border-border text-muted hover:text-white text-xs font-bold rounded-lg px-2 py-1.5 focus:outline-none focus:border-primary cursor-pointer appearance-none transition-colors"
                title="Select Tutor Language"
             >
                {['English', 'Hindi', 'Hinglish', 'Tamil', 'Telugu', 'Bengali', 'Marathi', 'Gujarati'].map(l => (
                   <option key={l} value={l} className="bg-surface text-white">{l}</option>
                ))}
             </select>
          </div>
       </div>

       {/* Chat Area */}
       <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-6 relative z-10 min-h-0">
          {messages.map((m, i) => (
             <ChatMessage key={i} message={m} language={language} />
          ))}
          {isTyping && messages[messages.length - 1].role === 'user' && (
             <div className="flex items-center gap-3 text-teal-400 p-4 bg-surface/50 border border-border rounded-2xl w-fit">
                <Loader2 className="w-5 h-5 animate-spin" />
                <span className="text-sm font-semibold animate-pulse">Thinking...</span>
             </div>
          )}
          <div ref={bottomRef} className="h-4 w-full" />
       </div>

       {/* Quick Chips & Input */}
       <div className="p-4 bg-surface border-t border-border z-10 shrink-0">
          <div className="flex gap-2 overflow-x-auto custom-scrollbar pb-3 mb-1">
             {currentChips.map((chip: string) => (
                <button
                  key={chip}
                  onClick={() => setInput(chip)}
                  className="px-3 py-1.5 bg-card border border-border rounded-full text-xs text-muted hover:text-white hover:border-primary transition-colors whitespace-nowrap flex items-center gap-1.5 shrink-0"
                >
                  <Hash className="w-3 h-3" /> {chip}
                </button>
             ))}
          </div>

          <form onSubmit={e => handleSubmit(e)} className="flex gap-3 items-end">
             <VoiceInput language={language} onTranscript={handleVoiceInput} onVoiceEnd={handleVoiceEnd} />
             <div className="flex-1 relative">
                <textarea
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => {
                     if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSubmit();
                     }
                  }}
                  placeholder="Ask any concept, formula, or exam doubt..."
                  className="w-full bg-background border border-border rounded-2xl pl-4 pr-12 py-3.5 text-white focus:outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-400 resize-none min-h-[56px] max-h-32 custom-scrollbar transition-all text-sm leading-relaxed"
                  rows={input.split('\n').length > 1 ? Math.min(input.split('\n').length, 4) : 1}
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isTyping}
                  className="absolute right-2 bottom-2 p-2 bg-gradient-to-br from-teal-400 to-emerald-500 rounded-xl text-black hover:opacity-90 transition-opacity disabled:opacity-50 disabled:grayscale disabled:cursor-not-allowed shadow-lg"
                >
                  <Send className="w-4 h-4" />
                </button>
             </div>
          </form>
       </div>
    </div>
  );
}
