"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Mail, Lock, User, ArrowRight, Loader2 } from 'lucide-react';
import { useStore } from '../../store/useStore';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [exam, setExam] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, exam })
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Failed to register');
      
      // Auto-login
      const loginRes = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, exam })
      });
      const loginData = await loginRes.json();

      if (loginRes.ok) {
        const newProfile = { name: loginData.user.name, exam: loginData.user.exam };
        localStorage.setItem('abhaypath_profile', JSON.stringify(newProfile));
        useStore.getState().setProfile(newProfile as any);
        router.push('/');
        router.refresh();
      } else {
        router.push('/login');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 relative overflow-hidden">
      <div className="absolute top-1/4 -right-32 w-96 h-96 bg-primary/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 -left-32 w-96 h-96 bg-teal/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="w-full max-w-md bg-card/80 backdrop-blur-3xl border border-white/5 p-8 rounded-3xl shadow-2xl z-10">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-sora font-bold text-white mb-2 tracking-tight">Join Abhay Parth</h1>
          <p className="text-muted text-sm">Start your AI-powered preparation today.</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-sm font-medium text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-5">
          <div>
            <label className="text-xs font-bold text-muted uppercase tracking-wider mb-2 block">Full Name</label>
            <div className="relative group">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-teal-400 transition-colors" />
              <input 
                type="text" 
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full bg-surface border border-border rounded-xl pl-12 pr-4 py-3.5 text-white focus:outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-400 transition-all placeholder:text-gray-600"
                placeholder="Dr. APJ Abdul Kalam"
                required
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-muted uppercase tracking-wider mb-2 block">Email Address</label>
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-teal-400 transition-colors" />
              <input 
                type="email" 
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full bg-surface border border-border rounded-xl pl-12 pr-4 py-3.5 text-white focus:outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-400 transition-all placeholder:text-gray-600"
                placeholder="aspirant@exam.com"
                required
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-muted uppercase tracking-wider mb-2 block">Password</label>
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-teal-400 transition-colors" />
              <input 
                type="password" 
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full bg-surface border border-border rounded-xl pl-12 pr-4 py-3.5 text-white focus:outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-400 transition-all placeholder:text-gray-600"
                placeholder="At least 6 characters"
                required
                minLength={6}
              />
            </div>
          </div>
          <div>
            <label className="text-xs font-bold text-muted uppercase tracking-wider mb-2 block">Target Exam</label>
            <div className="relative group">
              <input 
                type="text" 
                value={exam}
                onChange={e => setExam(e.target.value)}
                className="w-full bg-surface border border-border rounded-xl px-4 py-3.5 text-white focus:outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-400 transition-all placeholder:text-gray-600"
                placeholder="What are you preparing for? (e.g. UPSC)"
                required
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-gradient-to-r from-teal-500 to-emerald-600 text-black font-bold py-4 rounded-xl shadow-lg hover:shadow-teal-500/25 transition-all flex items-center justify-center gap-2 mt-4 disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
              <>Create Account <ArrowRight className="w-5 h-5" /></>
            )}
          </button>
        </form>

        <p className="text-center text-muted text-sm mt-8">
          Already have an account?{' '}
          <Link href="/login" className="text-white font-bold hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
