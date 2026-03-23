"use client";

import { useStore } from '../../store/useStore';
import { Menu, Flame } from 'lucide-react';

export function TopBar() {
  const { toggleSidebar, currentModule, profile } = useStore();

  const getTitle = () => {
    switch(true) {
        case currentModule.startsWith('/dashboard'): return 'Command Center';
        case currentModule.startsWith('/retention'): return 'Retention Engine';
        case currentModule.startsWith('/planner'): return 'Study Planner';
        case currentModule.startsWith('/practice'): return 'Adaptive Practice';
        case currentModule.startsWith('/tutor'): return 'AI Tutor';
        case currentModule.startsWith('/lab'): return 'Content Lab';
        default: return 'Abhay Parth';
    }
  };

  return (
    <header className="h-16 flex items-center justify-between px-6 border-b border-border bg-surface/50 backdrop-blur-md sticky top-0 z-40">
      <div className="flex items-center gap-4">
        <button 
          onClick={toggleSidebar}
          className="p-2 -ml-2 rounded-lg text-muted hover:text-white hover:bg-card-2 transition-colors md:hidden"
        >
          <Menu className="w-5 h-5" />
        </button>
        <h1 className="font-sora text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
          {getTitle()}
        </h1>
      </div>

      <div className="flex items-center gap-4">
        {profile && (
          <div className="flex items-center gap-2 bg-gradient-to-r from-orange-500/10 to-red-500/10 border border-orange-500/20 px-3 py-1.5 rounded-full">
            <Flame className="w-4 h-4 text-orange-500 animate-pulse" />
            <span className="text-sm font-semibold text-orange-500">{profile.streak} Day Streak</span>
          </div>
        )}
      </div>
    </header>
  );
}
