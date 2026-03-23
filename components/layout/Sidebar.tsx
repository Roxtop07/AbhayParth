"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useStore } from '../../store/useStore';
import { LayoutDashboard, Brain, CalendarDays, Dumbbell, Bot, Youtube, Menu, X } from 'lucide-react';
import { useEffect } from 'react';

const MODULES = [
  { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { name: 'Retention', path: '/retention', icon: Brain },
  { name: 'Planner', path: '/planner', icon: CalendarDays },
  { name: 'Practice', path: '/practice', icon: Dumbbell },
  { name: 'AI Tutor', path: '/tutor', icon: Bot },
  { name: 'Content Lab', path: '/lab', icon: Youtube },
];

export function Sidebar() {
  const pathname = usePathname();
  const { sidebarCollapsed, toggleSidebar, setCurrentModule, profile } = useStore();

  useEffect(() => {
    setCurrentModule(pathname);
  }, [pathname, setCurrentModule]);

  return (
    <>
      <div className={`fixed inset-y-0 left-0 z-50 transform md:relative md:translate-x-0 transition-all duration-300 ease-in-out bg-surface border-r border-border flex flex-col ${sidebarCollapsed ? 'w-20' : 'w-64'} ${sidebarCollapsed ? '-translate-x-full' : 'translate-x-0'}`}>
        <div className="flex items-center justify-between p-4 h-16 border-b border-border">
          {!sidebarCollapsed && (
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-teal rounded-xl flex items-center justify-center font-sora font-bold text-white text-xl shadow-lg border border-white/10">
                AP
              </div>
              <span className="font-sora font-bold text-xl text-white tracking-wide">
                Abhay Parth
              </span>
            </div>
          )}
          {sidebarCollapsed && (
             <div className="w-8 h-8 mx-auto rounded-lg bg-gradient-to-br from-primary to-teal flex items-center justify-center text-white font-bold text-lg shadow-lg">
                G
             </div>
          )}
        </div>

        <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-2">
          {MODULES.map((mod) => {
            const Icon = mod.icon;
            const isActive = pathname.startsWith(mod.path);
            
            return (
              <Link
                key={mod.name}
                href={mod.path}
                className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group ${
                  isActive
                    ? 'bg-card text-primary shadow-sm border border-border-hover'
                    : 'text-muted hover:text-white hover:bg-card-2 border border-transparent'
                } ${sidebarCollapsed ? 'justify-center' : 'justify-start'}`}
                title={sidebarCollapsed ? mod.name : undefined}
              >
                <Icon className={`w-5 h-5 transition-transform group-hover:scale-110 ${isActive ? 'text-primary' : ''}`} />
                {!sidebarCollapsed && (
                  <span className="font-medium text-[15px]">{mod.name}</span>
                )}
                
                {/* Active Indicator Line */}
                {isActive && !sidebarCollapsed && (
                  <div className="ml-auto w-1 h-5 rounded-full bg-primary" />
                )}
              </Link>
            );
          })}
        </nav>

        <div className={`p-4 border-t border-border mt-auto ${sidebarCollapsed ? 'flex justify-center' : ''}`}>
           <div className={`flex items-center ${sidebarCollapsed ? 'justify-center' : 'gap-3 bg-card p-3 rounded-xl border border-border'} group`}>
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-violet-500 to-fuchsia-500 flex items-center justify-center text-white font-bold shrink-0">
                AP
              </div>
              {!sidebarCollapsed && (
                <div className="overflow-hidden flex-1">
                  <p className="text-sm font-semibold text-white truncate">Target {profile?.exam || 'Exam'}</p>
                  <button 
                    onClick={async () => {
                      await fetch('/api/auth/logout', { method: 'POST' });
                      localStorage.removeItem('abhaypath_profile');
                      useStore.setState({ profile: null });
                      window.location.href = '/login';
                    }}
                    className="text-xs text-red-400 mt-0.5 hover:text-red-300 font-medium transition-colors cursor-pointer text-left"
                  >
                    Sign Out
                  </button>
                </div>
              )}
           </div>
        </div>
      </div>
    </>
  );
}
