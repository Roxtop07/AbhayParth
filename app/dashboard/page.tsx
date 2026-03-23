"use client";

import { useEffect, useState } from 'react';
import { useStore } from '../../store/useStore';
import { StatCard } from '../../components/ui/StatCard';
import { BrainCircuit, Target, Flame, Database, Plus, PlayCircle } from 'lucide-react';
import { AreaChart, Area, RadialBarChart, RadialBar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import Link from 'next/link';

export default function Dashboard() {
  const { profile, analytics, fetchAnalytics } = useStore();
  const [countdown, setCountdown] = useState<number>(0);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  useEffect(() => {
    if (profile?.examDate) {
      const daysLeft = Math.ceil((new Date(profile.examDate).getTime() - new Date().getTime()) / (1000 * 3600 * 24));
      setCountdown(daysLeft > 0 ? daysLeft : 0);
    }
  }, [profile]);

  if (!profile) return null;

  return (
    <div className="space-y-8 pb-12">
      {/* Hero Section */}
      <div className="flex flex-col md:flex-row gap-6 justify-between items-start md:items-end bg-gradient-to-r from-card-2 to-surface border border-border rounded-3xl p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        
        <div className="relative z-10 space-y-2">
          <h2 className="text-3xl font-sora font-bold text-white">
            Welcome back, <span className="text-primary">{profile.name}</span>
          </h2>
          <p className="text-muted">Targeting {profile.exam} • Engine is ready for your next session.</p>
        </div>

        <div className="relative z-10 flex items-center gap-6 bg-card p-4 rounded-2xl border border-border shadow-2xl">
          <div className="text-center px-4 border-r border-border">
            <p className="text-sm text-muted mb-1 font-medium">Exam In</p>
            <p className="text-3xl font-sora font-bold text-white">{countdown} <span className="text-lg text-muted font-normal">days</span></p>
          </div>
          <div className="text-center px-4">
            <p className="text-sm text-muted mb-1 font-medium">Daily Target</p>
            <p className="text-3xl font-sora font-bold text-white">{profile.dailyHours} <span className="text-lg text-muted font-normal">hrs</span></p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Due for Review" 
          value={analytics?.dueToday || 0} 
          icon={BrainCircuit}
          colorClassName="text-orange-400 bg-orange-400/10"
        />
        <StatCard 
          title="Avg Mastery" 
          value={`${analytics?.avgStrength || 0}%`} 
          icon={Target}
          colorClassName="text-teal-400 bg-teal-400/10"
        />
        <StatCard 
          title="Current Streak" 
          value={`${profile.streak} Days`} 
          icon={Flame}
          colorClassName="text-red-400 bg-red-400/10"
        />
        <StatCard 
          title="Concepts Tracked" 
          value={analytics?.totalConcepts || 0} 
          icon={Database}
          colorClassName="text-violet-400 bg-violet-400/10"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Retention Forgetting Curve */}
        <div className="lg:col-span-2 bg-card rounded-3xl border border-border p-6 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-lg font-sora font-bold text-white">Forgetting Curve</h3>
              <p className="text-sm text-muted">Simulated memory decay for active concepts</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-primary/20 border border-primary/50"></span>
              <span className="text-xs text-muted">Retention %</span>
            </div>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={analytics?.forgettingCurveData || []} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRetention" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="day" stroke="var(--muted)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--muted)" fontSize={12} tickLine={false} axisLine={false} domain={[0, 100]} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'var(--card-2)', borderColor: 'var(--border)', borderRadius: '8px', color: 'var(--text)' }}
                  itemStyle={{ color: 'var(--primary)', fontWeight: 'bold' }}
                />
                <Area type="monotone" dataKey="retention" stroke="var(--primary)" strokeWidth={3} fillOpacity={1} fill="url(#colorRetention)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Quick Actions & Subjects */}
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-primary/10 to-teal/10 rounded-3xl border border-border p-6">
             <h3 className="text-lg font-sora font-bold text-white mb-4">Quick Actions</h3>
             <div className="space-y-3">
               <Link href="/retention" className="flex items-center justify-between p-4 bg-card hover:bg-card-2 border border-border hover:border-primary/50 rounded-xl transition-all group">
                 <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 text-primary rounded-lg group-hover:scale-110 transition-transform">
                      <PlayCircle className="w-5 h-5" />
                    </div>
                    <span className="font-semibold text-white">Start Review ({analytics?.dueToday || 0})</span>
                 </div>
               </Link>
               <Link href="/tutor" className="flex items-center justify-between p-4 bg-card hover:bg-card-2 border border-border hover:border-teal/50 rounded-xl transition-all group">
                 <div className="flex items-center gap-3">
                    <div className="p-2 bg-teal/10 text-teal-400 rounded-lg group-hover:scale-110 transition-transform">
                      <Plus className="w-5 h-5" />
                    </div>
                    <span className="font-semibold text-white">Ask AI Tutor</span>
                 </div>
               </Link>
             </div>
          </div>

          <div className="bg-card rounded-3xl border border-border p-6">
            <h3 className="text-sm font-bold text-muted uppercase tracking-wider mb-4">Subject Mastery</h3>
            <div className="space-y-4">
              {analytics?.subjectBreakdown?.map((sub) => (
                <div key={sub.subject}>
                  <div className="flex justify-between text-sm mb-1.5">
                    <span className="font-medium text-white">{sub.subject}</span>
                    <span className="text-primary font-bold">{sub.avgStrength}%</span>
                  </div>
                  <div className="w-full bg-surface h-2 rounded-full overflow-hidden">
                    <div 
                      className="bg-gradient-to-r from-primary to-teal h-full rounded-full"
                      style={{ width: `${sub.avgStrength}%` }}
                    />
                  </div>
                </div>
              ))}
              {(!analytics?.subjectBreakdown || analytics.subjectBreakdown.length === 0) && (
                <p className="text-sm text-muted text-center py-2">Add concepts to see mastery.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
