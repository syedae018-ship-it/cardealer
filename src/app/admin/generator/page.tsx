'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { toPng } from 'html-to-image';
import { fetchCars, fetchSettings } from '@/lib/inventoryService';
import { Car, DealershipSettings } from '@/lib/types';
import { 
  Sparkles, 
  Download, 
  Copy, 
  Check, 
  Fuel, 
  Gauge, 
  Calendar, 
  Users, 
  ShieldCheck, 
  Phone, 
  MessageCircle, 
  Car as CarIcon,
  Palette,
  Layers,
  Tag,
  Loader2,
  Share2
} from 'lucide-react';

export default function PosterGeneratorPage() {
  const posterRef = useRef<HTMLDivElement>(null);
  const [cars, setCars] = useState<Car[]>([]);
  const [selectedCarId, setSelectedCarId] = useState<string>('');
  const [settings, setSettings] = useState<DealershipSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  // Customizer options
  const [format, setFormat] = useState<'story' | 'square' | 'flyer'>('story');
  const [posterTheme, setPosterTheme] = useState<'light' | 'dark'>('light');
  const [badgeText, setBadgeText] = useState('VERIFIED USED CAR');
  const [customTag, setCustomTag] = useState('100% RC Verified • Immediate Delivery');
  const [showPhone, setShowPhone] = useState(true);
  const [showSpecs, setShowSpecs] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    const [c, s] = await Promise.all([fetchCars(), fetchSettings()]);
    setCars(c);
    if (c.length > 0) {
      setSelectedCarId(c[0].id);
    }
    setSettings(s);
    setLoading(false);
  }

  const selectedCar = cars.find(c => c.id === selectedCarId) || cars[0];

  const handleDownloadPNG = async () => {
    if (!posterRef.current) return;
    setGenerating(true);

    try {
      // Allow images to be rendered cleanly
      const dataUrl = await toPng(posterRef.current, {
        cacheBust: true,
        pixelRatio: 2, // High resolution 2x export
        quality: 0.95
      });

      const link = document.createElement('a');
      const filename = selectedCar 
        ? `${selectedCar.name.replace(/\s+/g, '_')}_WhatsApp_Poster.png`
        : 'QualityUsedCars_Poster.png';
      link.download = filename;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Error exporting PNG:', err);
      alert('Could not export PNG. Please ensure vehicle photos are loaded.');
    } finally {
      setGenerating(false);
    }
  };

  const handleCopyImage = async () => {
    if (!posterRef.current) return;
    setGenerating(true);

    try {
      const dataUrl = await toPng(posterRef.current, {
        cacheBust: true,
        pixelRatio: 2,
        quality: 0.95
      });

      const res = await fetch(dataUrl);
      const blob = await res.blob();

      await navigator.clipboard.write([
        new ClipboardItem({ 'image/png': blob })
      ]);

      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      console.error('Error copying image:', err);
      // fallback download
      handleDownloadPNG();
    } finally {
      setGenerating(false);
    }
  };

  if (loading) {
    return (
      <div className="py-20 text-center text-xs font-bold text-neutral-500 flex items-center justify-center gap-2">
        <Loader2 className="w-4 h-4 animate-spin text-brand-orange" />
        <span>Loading inventory for poster generator...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-6xl pb-16">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-orange-100 dark:bg-orange-950/60 text-brand-orange mb-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>INSTANT MARKETING STUDIO</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 dark:text-white">
            WhatsApp & Social Poster Maker
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 mt-0.5">
            Generate clean, high-resolution PNG posters from your car catalog with zero AI artifacts.
          </p>
        </div>

        {/* Export Actions */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={handleCopyImage}
            disabled={generating}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-800 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors shadow-sm disabled:opacity-50"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Copied to Clipboard!' : 'Copy Image'}</span>
          </button>

          <button
            onClick={handleDownloadPNG}
            disabled={generating}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-brand-orange hover:bg-brand-orange-600 text-white shadow-md shadow-brand-orange/20 transition-all active:scale-95 disabled:opacity-50"
          >
            {generating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
            <span>{generating ? 'Exporting...' : 'Download PNG Poster'}</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column (5 cols): Customizer Controls */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Select Car */}
          <div className="p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 space-y-3 shadow-sm">
            <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 dark:text-neutral-300">
              Select Vehicle
            </label>
            <select
              value={selectedCarId}
              onChange={(e) => setSelectedCarId(e.target.value)}
              aria-label="Select Car for Poster"
              className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-xs font-bold"
            >
              {cars.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} — {c.price} ({c.year})
                </option>
              ))}
            </select>

            {selectedCar && (
              <div className="flex items-center gap-3 pt-2 text-xs text-neutral-500">
                <div className="relative w-12 h-10 rounded-lg overflow-hidden bg-neutral-100 shrink-0">
                  <Image src={selectedCar.image} alt={selectedCar.name} fill className="object-cover" />
                </div>
                <div>
                  <div className="font-bold text-neutral-900 dark:text-white">{selectedCar.name}</div>
                  <div className="text-brand-orange font-bold font-poppins">{selectedCar.price}</div>
                </div>
              </div>
            )}
          </div>

          {/* Aspect Ratio Format */}
          <div className="p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 space-y-3 shadow-sm">
            <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 dark:text-neutral-300">
              Poster Format
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'story', label: 'WhatsApp Status', ratio: '9:16' },
                { id: 'square', label: 'Square Post', ratio: '1:1' },
                { id: 'flyer', label: 'Catalog Flyer', ratio: '4:3' },
              ].map((f) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setFormat(f.id as any)}
                  className={`p-3 rounded-xl border text-center transition-all ${
                    format === f.id
                      ? 'border-brand-orange bg-orange-50 dark:bg-orange-950/40 text-brand-orange font-bold ring-2 ring-brand-orange/20'
                      : 'border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800'
                  }`}
                >
                  <div className="text-xs font-bold">{f.label}</div>
                  <div className="text-[10px] text-neutral-400 mt-0.5">{f.ratio}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Poster Theme Style */}
          <div className="p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 space-y-3 shadow-sm">
            <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 dark:text-neutral-300">
              Visual Theme
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setPosterTheme('light')}
                className={`p-3 rounded-xl border text-center transition-all flex items-center justify-center gap-2 ${
                  posterTheme === 'light'
                    ? 'border-brand-orange bg-white text-neutral-900 font-bold ring-2 ring-brand-orange/20 shadow-sm'
                    : 'border-neutral-200 text-neutral-500'
                }`}
              >
                <span className="w-3 h-3 rounded-full bg-white border border-neutral-300 shadow-sm" />
                <span className="text-xs">Showroom White</span>
              </button>

              <button
                type="button"
                onClick={() => setPosterTheme('dark')}
                className={`p-3 rounded-xl border text-center transition-all flex items-center justify-center gap-2 ${
                  posterTheme === 'dark'
                    ? 'border-brand-orange bg-neutral-950 text-white font-bold ring-2 ring-brand-orange/20 shadow-sm'
                    : 'border-neutral-800 text-neutral-400 bg-neutral-900'
                }`}
              >
                <span className="w-3 h-3 rounded-full bg-neutral-900 border border-neutral-700 shadow-sm" />
                <span className="text-xs">Matte Black</span>
              </button>
            </div>
          </div>

          {/* Custom Badges & Marketing Notes */}
          <div className="p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 space-y-4 shadow-sm">
            <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 dark:text-neutral-300">
              Poster Tag & Promo Note
            </label>

            <div>
              <span className="text-[11px] font-semibold text-neutral-500 mb-1 block">Top Badge Text:</span>
              <input
                type="text"
                value={badgeText}
                onChange={(e) => setBadgeText(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-xs font-semibold"
                placeholder="e.g. VERIFIED USED CAR"
              />
            </div>

            <div>
              <span className="text-[11px] font-semibold text-neutral-500 mb-1 block">Highlights Line:</span>
              <input
                type="text"
                value={customTag}
                onChange={(e) => setCustomTag(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-xs font-semibold"
                placeholder="e.g. 100% RC Verified • Immediate Delivery"
              />
            </div>
          </div>

        </div>

        {/* Right Column (7 cols): Live Poster Rendering Canvas */}
        <div className="lg:col-span-7 flex flex-col items-center justify-center p-6 bg-neutral-100 dark:bg-neutral-900/60 rounded-3xl border border-neutral-200/80 dark:border-neutral-800/80">
          
          <div className="text-xs font-bold text-neutral-500 mb-4 flex items-center gap-2">
            <span>Live HD Poster Preview</span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-neutral-200 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300">
              {format === 'story' ? '1080 x 1920 (Status)' : format === 'square' ? '1080 x 1080 (Square)' : '1200 x 900 (Flyer)'}
            </span>
          </div>

          {/* Actual Renderable Poster DOM Element */}
          {selectedCar && (
            <div
              ref={posterRef}
              style={{
                width: format === 'story' ? '380px' : format === 'square' ? '420px' : '480px',
                minHeight: format === 'story' ? '640px' : format === 'square' ? '420px' : '360px',
              }}
              className={`p-6 rounded-3xl shadow-2xl transition-all flex flex-col justify-between overflow-hidden relative ${
                posterTheme === 'light'
                  ? 'bg-white text-neutral-900 border border-neutral-200'
                  : 'bg-neutral-950 text-white border border-neutral-800'
              }`}
            >
              
              {/* Top Dealership Brand Bar */}
              <div className="flex items-center justify-between pb-3 border-b border-neutral-100 dark:border-neutral-800/80">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-brand-orange-600 to-amber-500 flex items-center justify-center text-white shadow-md">
                    <CarIcon className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-extrabold text-xs tracking-tight uppercase">
                      QUALITY <span className="text-brand-orange">CARS</span>
                    </div>
                    <div className="text-[9px] font-bold tracking-[0.2em] text-neutral-400 uppercase">
                      BY SYED SABEER RIYAZ
                    </div>
                  </div>
                </div>

                <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-brand-orange text-white uppercase tracking-wide shadow-sm">
                  {badgeText || 'VERIFIED CAR'}
                </span>
              </div>

              {/* Main Vehicle Image */}
              <div className="my-3 relative aspect-[4/3] w-full rounded-2xl overflow-hidden shadow-md bg-neutral-100 dark:bg-neutral-800">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={selectedCar.image}
                  alt={selectedCar.name}
                  crossOrigin="anonymous"
                  className="w-full h-full object-cover"
                />

                <div className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-600 text-white shadow-sm flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                  {selectedCar.status}
                </div>

                <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded text-[9px] font-bold bg-white/95 text-neutral-900 shadow-sm flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-brand-orange" />
                  RC Verified
                </div>
              </div>

              {/* Vehicle Title & Highlight Price */}
              <div className="space-y-2">
                <div className="flex items-baseline justify-between gap-2">
                  <h2 className="font-extrabold text-base sm:text-lg leading-tight line-clamp-1">
                    {selectedCar.name}
                  </h2>
                </div>

                {/* Big Price Tag */}
                <div className={`p-3 rounded-xl flex items-center justify-between ${
                  posterTheme === 'light' ? 'bg-orange-50 border border-orange-200/80' : 'bg-neutral-900 border border-neutral-800'
                }`}>
                  <div>
                    <div className="text-[9px] font-bold uppercase text-neutral-400">Honest Fixed Price</div>
                    <div className="text-xl font-black text-brand-orange font-poppins">{selectedCar.price}</div>
                  </div>
                  <div className="text-[10px] font-bold px-2 py-1 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                    Ready for Delivery
                  </div>
                </div>

                {/* Specs 4-Box Grid */}
                <div className="grid grid-cols-2 gap-2 text-[11px] pt-1">
                  <div className={`p-2 rounded-lg flex items-center gap-2 ${
                    posterTheme === 'light' ? 'bg-neutral-50' : 'bg-neutral-900'
                  }`}>
                    <Calendar className="w-3.5 h-3.5 text-brand-orange shrink-0" />
                    <span className="font-bold">{selectedCar.year} Model</span>
                  </div>
                  <div className={`p-2 rounded-lg flex items-center gap-2 ${
                    posterTheme === 'light' ? 'bg-neutral-50' : 'bg-neutral-900'
                  }`}>
                    <Fuel className="w-3.5 h-3.5 text-brand-orange shrink-0" />
                    <span className="font-bold">{selectedCar.fuel}</span>
                  </div>
                  <div className={`p-2 rounded-lg flex items-center gap-2 ${
                    posterTheme === 'light' ? 'bg-neutral-50' : 'bg-neutral-900'
                  }`}>
                    <Gauge className="w-3.5 h-3.5 text-brand-orange shrink-0" />
                    <span className="font-bold">{selectedCar.transmission}</span>
                  </div>
                  <div className={`p-2 rounded-lg flex items-center gap-2 ${
                    posterTheme === 'light' ? 'bg-neutral-50' : 'bg-neutral-900'
                  }`}>
                    <Users className="w-3.5 h-3.5 text-brand-orange shrink-0" />
                    <span className="font-bold">{selectedCar.owners}</span>
                  </div>
                </div>

                {customTag && (
                  <p className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 text-center pt-1">
                    ✓ {customTag}
                  </p>
                )}
              </div>

              {/* Bottom WhatsApp / Call Footer */}
              <div className="mt-3 pt-3 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5 font-bold text-emerald-600 dark:text-emerald-400">
                  <MessageCircle className="w-4 h-4 fill-current" />
                  <span>WhatsApp: +91 99999 99999</span>
                </div>
                <div className="text-[10px] font-semibold text-neutral-400">
                  Bangalore
                </div>
              </div>

            </div>
          )}

          {/* Quick instructions */}
          <p className="text-[11px] text-neutral-500 mt-4 text-center">
            Click <strong>Download PNG Poster</strong> or <strong>Copy Image</strong> to share immediately on WhatsApp or Instagram!
          </p>

        </div>

      </div>

    </div>
  );
}
