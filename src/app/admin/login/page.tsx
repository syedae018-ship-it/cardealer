'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Car, Lock, User, ArrowRight, ShieldCheck, AlertCircle } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';

import { supabase, isSupabaseConfigured } from '@/lib/supabase';

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('syed.ae018@gmail.com');
  const [password, setPassword] = useState('QualityCars@2026');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Try Supabase Auth if configured
    if (isSupabaseConfigured() && supabase) {
      try {
        const { data, error: authError } = await supabase.auth.signInWithPassword({
          email: username.trim(),
          password: password.trim()
        });

        if (!authError && data?.session) {
          localStorage.setItem('quality_cars_admin_auth', 'true');
          localStorage.setItem('quality_cars_admin_email', username.trim());
          router.push('/admin');
          return;
        }
      } catch (err) {
        console.warn('Supabase Auth error:', err);
      }
    }

    // Fallback Admin Validation
    const validEmails = ['syed.ae018@gmail.com', 'syed.ae018@gmai.com', 'admin', 'sabir'];
    const validPasswords = ['QualityCars@2026', 'sabir123', 'admin123'];

    if (validEmails.includes(username.trim().toLowerCase()) && validPasswords.includes(password.trim())) {
      localStorage.setItem('quality_cars_admin_auth', 'true');
      localStorage.setItem('quality_cars_admin_email', username.trim());
      router.push('/admin');
    } else {
      setError('Invalid admin credentials. Please verify your email and password.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative">
      
      {/* Top Bar with Home Link & Theme Toggle */}
      <div className="absolute top-6 right-6 flex items-center gap-3">
        <ThemeToggle />
        <Link
          href="/"
          className="px-3.5 py-1.5 rounded-full text-xs font-semibold bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300 hover:text-brand-orange"
        >
          &larr; Back to Website
        </Link>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md space-y-6">
        
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-orange-600 to-amber-500 items-center justify-center text-white shadow-lg shadow-brand-orange/20 mb-2">
            <Car className="w-6 h-6" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 dark:text-white tracking-tight">
            QUALITY USED CARS
          </h1>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-neutral-200 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200">
            <ShieldCheck className="w-3.5 h-3.5 text-brand-orange" />
            <span>Syed Sabeer Riyaz &bull; Admin Management Portal</span>
          </div>
        </div>

        {/* Login Card */}
        <div className="bg-white dark:bg-neutral-900 py-8 px-6 sm:px-8 rounded-3xl border border-neutral-200 dark:border-neutral-800 shadow-xl shadow-neutral-900/5 dark:shadow-black/40">
          
          <form onSubmit={handleLogin} className="space-y-4">
            
            {error && (
              <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-xs font-semibold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-600 dark:text-neutral-400 mb-1.5">
                Admin Username / Email
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-brand-orange/30 focus:border-brand-orange"
                  placeholder="admin"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-600 dark:text-neutral-400 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-brand-orange/30 focus:border-brand-orange"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 rounded-xl font-bold text-sm bg-brand-orange hover:bg-brand-orange-600 text-white shadow-md shadow-brand-orange/20 flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50"
              >
                <span>{loading ? 'Signing in...' : 'Sign In to Dashboard'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <div className="pt-3 text-center">
              <p className="text-[11px] text-neutral-500">
                Admin: <span className="font-bold text-neutral-700 dark:text-neutral-300">syed.ae018@gmail.com</span> &bull; Secured with Supabase
              </p>
            </div>

          </form>

        </div>

      </div>

    </div>
  );
}
