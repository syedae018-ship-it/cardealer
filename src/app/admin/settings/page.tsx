'use client';

import React, { useState, useEffect } from 'react';
import { fetchSettings, updateSettings } from '@/lib/inventoryService';
import { isSupabaseConfigured } from '@/lib/supabase';
import { DealershipSettings } from '@/lib/types';
import { Save, Database, ShieldCheck, Check, Building, Phone, Mail, MapPin, Info } from 'lucide-react';

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<DealershipSettings>({
    dealershipName: 'Quality Used Cars',
    ownerName: 'Syed Sabeer Riyaz',
    phone: '919999999999',
    whatsapp: '919999999999',
    email: 'syed.ae018@gmail.com',
    location: 'Bangalore, Karnataka, India',
    about: 'Direct pre-owned car showroom operated by Syed Sabeer Riyaz. Verified vehicle history, transparent pricing, and honest buying with zero middleman commission.'
  });
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  async function loadSettings() {
    setLoading(true);
    const data = await fetchSettings();
    setSettings(data);
    setLoading(false);
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateSettings(settings);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const supabaseReady = isSupabaseConfigured();

  return (
    <div className="space-y-8 max-w-3xl pb-12">
      
      {/* Toast */}
      {saved && (
        <div className="fixed top-6 right-6 z-50 p-4 rounded-xl bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 shadow-2xl text-xs font-bold flex items-center gap-2 animate-in fade-in">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>Settings successfully saved!</span>
        </div>
      )}

      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-neutral-900 dark:text-white">
          Dealership & System Settings
        </h1>
        <p className="text-xs text-neutral-500 mt-0.5">
          Configure showroom contact details, WhatsApp integration, and Supabase connection.
        </p>
      </div>

      {/* Supabase Status Card */}
      <div className="p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 space-y-4 shadow-sm">
        <div className="flex items-center justify-between border-b border-neutral-100 dark:border-neutral-800 pb-3">
          <div className="flex items-center gap-2">
            <Database className="w-5 h-5 text-brand-orange" />
            <h2 className="font-bold text-sm text-neutral-900 dark:text-white">
              Supabase Database Status
            </h2>
          </div>
          <span className={`px-3 py-1 rounded-full text-xs font-extrabold ${
            supabaseReady
              ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400'
              : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
          }`}>
            {supabaseReady ? 'CONNECTED & ACTIVE' : 'RUNNING OFFLINE STORE'}
          </span>
        </div>

        <div className="text-xs text-neutral-600 dark:text-neutral-400 space-y-2 leading-relaxed">
          {supabaseReady ? (
            <p className="text-emerald-600 dark:text-emerald-400 font-semibold">
              ✓ Connected to your cloud Supabase database. All vehicle changes, status updates, and enquiries are syncing directly to PostgreSQL in real-time.
            </p>
          ) : (
            <div className="space-y-2">
              <p>
                The application is running with high-performance local storage fallback.
              </p>
              <div className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 font-mono text-[11px] space-y-1">
                <div>To link your cloud Supabase account:</div>
                <div className="text-brand-orange">1. Run the SQL schema from <strong>supabase/schema.sql</strong> in your Supabase project.</div>
                <div className="text-brand-orange">2. Paste your project URL & Anon Key into <strong>.env.local</strong>:</div>
                <div className="text-neutral-500">NEXT_PUBLIC_SUPABASE_URL=https://your-id.supabase.co</div>
                <div className="text-neutral-500">NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key</div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Dealership Profile Form */}
      <form onSubmit={handleSave} className="p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 space-y-5 shadow-sm">
        <h2 className="font-bold text-sm uppercase tracking-wider text-neutral-900 dark:text-white border-b border-neutral-100 dark:border-neutral-800 pb-2">
          Showroom & Contact Information
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          
          <div>
            <label className="block text-xs font-bold uppercase text-neutral-600 dark:text-neutral-400 mb-1.5">
              Dealership Name
            </label>
            <input
              type="text"
              value={settings.dealershipName}
              onChange={(e) => setSettings({ ...settings, dealershipName: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-xs font-medium"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-neutral-600 dark:text-neutral-400 mb-1.5">
              Owner / Operator Name
            </label>
            <input
              type="text"
              value={settings.ownerName}
              onChange={(e) => setSettings({ ...settings, ownerName: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-xs font-medium"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-neutral-600 dark:text-neutral-400 mb-1.5">
              WhatsApp Number (e.g. 919999999999)
            </label>
            <input
              type="text"
              value={settings.whatsapp}
              onChange={(e) => setSettings({ ...settings, whatsapp: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-xs font-medium"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-neutral-600 dark:text-neutral-400 mb-1.5">
              Phone Number
            </label>
            <input
              type="text"
              value={settings.phone}
              onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-xs font-medium"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-bold uppercase text-neutral-600 dark:text-neutral-400 mb-1.5">
              Showroom Location / Address
            </label>
            <input
              type="text"
              value={settings.location || ''}
              onChange={(e) => setSettings({ ...settings, location: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-xs font-medium"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-bold uppercase text-neutral-600 dark:text-neutral-400 mb-1.5">
              About Description
            </label>
            <textarea
              rows={3}
              value={settings.about || ''}
              onChange={(e) => setSettings({ ...settings, about: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-xs font-medium"
            />
          </div>

        </div>

        <div className="flex justify-end pt-3">
          <button
            type="submit"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold bg-brand-orange hover:bg-brand-orange-600 text-white shadow-md shadow-brand-orange/20 transition-all active:scale-95"
          >
            <Save className="w-4 h-4" />
            <span>Save Settings</span>
          </button>
        </div>

      </form>

    </div>
  );
}
