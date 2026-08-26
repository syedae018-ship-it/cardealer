'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  Car, 
  LayoutDashboard, 
  ListOrdered, 
  PlusCircle, 
  MessageSquare, 
  Settings, 
  LogOut, 
  ExternalLink, 
  ShieldCheck, 
  Menu, 
  X,
  Database,
  Sparkles
} from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';
import { isSupabaseConfigured } from '@/lib/supabase';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [supabaseActive, setSupabaseActive] = useState(false);

  useEffect(() => {
    // If already on login page, don't check
    if (pathname === '/admin/login') {
      setIsAuthenticated(true);
      return;
    }

    if (typeof window !== 'undefined') {
      const auth = localStorage.getItem('quality_cars_admin_auth');
      if (auth === 'true') {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
        router.replace('/admin/login');
      }
    }

    setSupabaseActive(isSupabaseConfigured());
  }, [pathname, router]);

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('quality_cars_admin_auth');
      localStorage.removeItem('quality_cars_admin_email');
    }
    setIsAuthenticated(false);
    router.replace('/admin/login');
  };

  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 flex flex-col items-center justify-center gap-3">
        <div className="w-8 h-8 border-4 border-brand-orange border-t-transparent rounded-full animate-spin" />
        <p className="text-xs font-bold text-neutral-500">Checking admin session...</p>
      </div>
    );
  }

  const navItems = [
    { label: 'Overview & Analytics', href: '/admin', icon: LayoutDashboard },
    { label: 'Inventory Cars', href: '/admin/inventory', icon: ListOrdered },
    { label: 'Add New Car', href: '/admin/inventory/new', icon: PlusCircle },
    { label: 'WhatsApp Poster Maker', href: '/admin/generator', icon: Sparkles },
    { label: 'Enquiries', href: '/admin/enquiries', icon: MessageSquare },
    { label: 'Dealership Settings', href: '/admin/settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 flex flex-col md:flex-row">
      
      {/* Mobile Top Header */}
      <div className="md:hidden flex items-center justify-between p-4 bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800">
        <div className="flex items-center gap-2 font-bold text-sm">
          <Car className="w-5 h-5 text-brand-orange" />
          <span>Sabir Admin Portal</span>
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-lg text-neutral-700 dark:text-neutral-200"
            aria-label="Toggle menu"
          >
            {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Sidebar Navigation */}
      <aside
        className={`fixed md:sticky top-0 z-40 h-screen w-64 bg-white dark:bg-neutral-900 border-r border-neutral-200 dark:border-neutral-800 flex flex-col justify-between p-5 transition-transform duration-200 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="space-y-6">
          
          {/* Admin Header */}
          <div className="flex items-center justify-between">
            <Link href="/admin" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-orange-600 to-amber-500 flex items-center justify-center text-white shadow-md">
                <Car className="w-5 h-5" />
              </div>
              <div>
                <div className="font-bold text-sm text-neutral-900 dark:text-white leading-none">
                  QUALITY CARS
                </div>
                <div className="text-[10px] font-semibold text-brand-orange uppercase tracking-wider mt-1">
                  Syed Sabeer Riyaz
                </div>
              </div>
            </Link>
          </div>

          {/* Nav Links */}
          <nav className="space-y-1.5">
            {navItems.map((item) => {
              const active = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-colors ${
                    active
                      ? 'bg-brand-orange text-white shadow-sm shadow-brand-orange/30'
                      : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-neutral-900 dark:hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer Actions */}
        <div className="space-y-3 pt-4 border-t border-neutral-100 dark:border-neutral-800">
          
          <div className="hidden md:flex items-center justify-between px-2">
            <span className="text-xs font-semibold text-neutral-500">Theme</span>
            <ThemeToggle />
          </div>

          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800"
          >
            <span>View Public Website</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>

      </aside>

      {/* Main Admin Content Canvas */}
      <main className="flex-1 p-5 sm:p-8 lg:p-10 max-w-6xl w-full overflow-y-auto">
        {children}
      </main>

    </div>
  );
}
