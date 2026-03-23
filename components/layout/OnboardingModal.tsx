"use client";

import { useState, useEffect } from 'react';
import { useStore } from '../../store/useStore';
import { motion, AnimatePresence } from 'framer-motion';
import { Rocket } from 'lucide-react';
import { usePathname } from 'next/navigation';

export function OnboardingModal() {
  const { profile, setProfile } = useStore();
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState('');
  const [exam, setExam] = useState('');
  const [examDate, setExamDate] = useState('');
  const [hours, setHours] = useState('6');

  useEffect(() => {
    const localProfile = localStorage.getItem('abhaypath_profile');
    if (localProfile) {
      setProfile(JSON.parse(localProfile));
    } else {
      setIsOpen(true);
    }
  }, [setProfile]);

  const pathname = usePathname();
  if (pathname === '/login' || pathname === '/register') return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newProfile = {
      id: 1,
      name: name || 'Aspirant',
      exam,
      examDate: examDate || new Date(new Date().setMonth(new Date().getMonth() + 6)).toISOString().slice(0, 10),
      dailyHours: parseInt(hours) || 6,
      streak: 0,
      lastActive: new Date().toISOString()
    };
    localStorage.setItem('abhaypath_profile', JSON.stringify(newProfile));
    setProfile(newProfile);
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-card w-full max-w-md rounded-2xl border border-border overflow-hidden shadow-2xl"
        >
          <div className="bg-gradient-to-br from-primary/20 to-teal/20 p-6 flex flex-col items-center text-center border-b border-border">
            <div className="w-16 h-16 bg-gradient-to-br from-primary to-teal rounded-2xl flex items-center justify-center mb-4 shadow-lg">
              <Rocket className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-sora font-bold text-white mb-2">Welcome to Abhay Parth</h2>
            <p className="text-sm text-muted">Let's configure your study engine to maximize retention.</p>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-muted mb-1.5">Your Name</label>
              <input 
                type="text" 
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="What should we call you?"
                className="w-full bg-surface border border-border rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-sm"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-muted mb-1.5">Target Exam</label>
              <input 
                type="text" 
                value={exam}
                onChange={e => setExam(e.target.value)}
                placeholder="e.g. UPSC, GATE, CAT, SSC CGL"
                className="w-full bg-surface border border-border rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-sm"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-muted mb-1.5">Exam Date</label>
                  <input 
                    type="date" 
                    value={examDate}
                    onChange={e => setExamDate(e.target.value)}
                    className="w-full bg-surface border border-border rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-muted mb-1.5">Study Hrs / Day</label>
                  <input 
                    type="number" 
                    min="1" max="16"
                    value={hours}
                    onChange={e => setHours(e.target.value)}
                    className="w-full bg-surface border border-border rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-sm"
                    required
                  />
                </div>
            </div>

            <button
              type="submit"
              className="w-full mt-6 bg-gradient-to-r from-primary to-amber-400 text-black font-bold text-sm py-3 rounded-xl hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
            >
              Initialize Engine
              <Rocket className="w-4 h-4" />
            </button>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
