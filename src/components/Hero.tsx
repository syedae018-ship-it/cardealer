'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  MessageCircle, 
  ShieldCheck, 
  ArrowRight, 
  CheckCircle2, 
  Zap, 
  User, 
  MapPin 
} from 'lucide-react';

interface HeroProps {
  availableCount: number;
}

export function Hero({ availableCount }: HeroProps) {
  const displayCount = availableCount > 0 ? availableCount : 2;

  return (
    <section className="relative overflow-hidden bg-white dark:bg-neutral-950 border-b border-neutral-200 dark:border-neutral-800">
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-0 items-center min-h-[560px] lg:min-h-[620px] py-8 lg:py-0">
          
          {/* Left Column (Content) - 6.5 cols */}
          <div className="lg:col-span-6 xl:col-span-6 z-10 py-6 lg:py-12 pr-0 lg:pr-8 space-y-6">
            
            {/* Top Pill Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 text-[11px] font-bold text-neutral-700 dark:text-neutral-300 shadow-sm">
              <ShieldCheck className="w-3.5 h-3.5 text-brand-orange" />
              <span>SYED SABEER RIYAZ &bull; VERIFIED USED CARS</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-[54px] font-black tracking-tight text-neutral-950 dark:text-white leading-[1.08]">
              Quality Used Cars.<br />
              <span className="text-brand-orange">
                Honest Deals.
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-300 max-w-lg leading-relaxed font-normal">
              A carefully selected collection of verified pre-owned cars in Bangalore. Thoroughly inspected, clear documentation, and direct transparent buying with Syed Sabeer Riyaz.
            </p>

            {/* Trust Highlights */}
            <div className="flex flex-wrap items-center gap-5 pt-1 pb-1">
              <div className="flex items-center gap-1.5 text-xs font-bold text-neutral-800 dark:text-neutral-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>100% RC Verified</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-neutral-800 dark:text-neutral-200">
                <ShieldCheck className="w-4 h-4 text-brand-orange shrink-0" />
                <span>Physical Inspection</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-neutral-800 dark:text-neutral-200">
                <Zap className="w-4 h-4 text-amber-500 shrink-0" />
                <span>Instant Transfer</span>
              </div>
            </div>

            {/* Dual CTAs */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <a
                href="#inventory"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-bold text-xs sm:text-sm bg-neutral-950 hover:bg-neutral-800 dark:bg-white dark:hover:bg-neutral-100 text-white dark:text-neutral-950 shadow-md transition-all active:scale-95"
              >
                <span>Browse Available Cars</span>
                <ArrowRight className="w-4 h-4" />
              </a>

              <a
                href="https://wa.me/919999999999?text=Hi%20Syed,%20I%20am%20looking%20for%20a%20quality%20used%20car."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-bold text-xs sm:text-sm bg-white dark:bg-neutral-900 text-emerald-600 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-700/80 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 shadow-sm transition-all active:scale-95"
              >
                <MessageCircle className="w-4 h-4 fill-current" />
                <span>WhatsApp Syed</span>
              </a>
            </div>

            {/* Live Counter Badge */}
            <div className="flex items-center gap-2 text-xs font-medium text-neutral-500 dark:text-neutral-400 pt-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>
                <strong className="text-neutral-900 dark:text-white font-bold">{displayCount} cars</strong> currently in stock &bull; Updated today
              </span>
            </div>

          </div>

          {/* Right Column (Car Photo + Floating Trust Card) - 6 cols */}
          <div className="lg:col-span-6 xl:col-span-6 relative w-full h-[420px] sm:h-[500px] lg:h-[580px] flex items-end justify-center lg:justify-end">
            
            {/* Background Car Photo with subtle diagonal clip on desktop */}
            <div className="absolute inset-0 w-full h-full rounded-3xl lg:rounded-none overflow-hidden lg:[clip-path:polygon(8%_0,_100%_0,_100%_100%,_0%_100%)]">
              <Image
                src="https://images.unsplash.com/photo-1621007947382-bb3c3994e3fd?auto=format&fit=crop&w=1200&q=85"
                alt="Verified Used Car Bangalore - Syed Sabeer Riyaz"
                fill
                priority
                className="object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent lg:hidden" />
            </div>

            {/* Floating Trust Card Overlay */}
            <div className="relative z-20 w-full max-w-lg bg-white/95 dark:bg-neutral-900/95 backdrop-blur-md rounded-3xl p-5 sm:p-6 shadow-2xl border border-neutral-200/80 dark:border-neutral-800 space-y-3 mb-4 lg:mb-6 lg:mr-4">
              
              {/* Card Top Row */}
              <div className="flex items-center justify-between">
                <div className="inline-flex items-center gap-1.5 text-[11px] font-black text-neutral-800 dark:text-neutral-200 uppercase tracking-wider">
                  <User className="w-3.5 h-3.5 text-brand-orange" />
                  <span>DIRECT FROM SYED SABEER</span>
                </div>
                <span className="text-[11px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                  ZERO COMMISSION
                </span>
              </div>

              {/* Card Headline & Description */}
              <div className="space-y-1">
                <h2 className="text-base sm:text-lg font-extrabold text-neutral-950 dark:text-white tracking-tight">
                  Transparent Buying. Honest Pricing.
                </h2>
                <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                  Every car in our showroom undergoes a rigorous multi-point physical check, full documentation verification (RC, FC, Insurance), and direct negotiation with Syed Sabeer Riyaz.
                </p>
              </div>

              {/* Card Bottom Chips */}
              <div className="grid grid-cols-2 gap-2.5 pt-1">
                <div className="p-2.5 rounded-xl bg-neutral-100/90 dark:bg-neutral-800/90 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-neutral-500 shrink-0" />
                  <div className="min-w-0">
                    <div className="text-[9px] font-bold text-neutral-400 uppercase">LOCATION</div>
                    <div className="text-xs font-bold text-neutral-900 dark:text-white truncate">Bangalore, KA</div>
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-neutral-100/90 dark:bg-neutral-800/90 flex items-center gap-2">
                  <MessageCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 fill-current" />
                  <div className="min-w-0">
                    <div className="text-[9px] font-bold text-neutral-400 uppercase">DIRECT BOOKING</div>
                    <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400 truncate">WhatsApp Connect</div>
                  </div>
                </div>
              </div>

            </div>

          </div>

        </div>
      </div>

    </section>
  );
}
