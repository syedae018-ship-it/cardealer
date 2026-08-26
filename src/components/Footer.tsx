import React from 'react';
import Link from 'next/link';
import { Car, Phone, Mail, MapPin, MessageCircle, ShieldCheck, Heart } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-neutral-900 text-neutral-300 border-t border-neutral-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          
          {/* Brand Column */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-orange-600 to-amber-500 flex items-center justify-center text-white shadow-md">
                <Car className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="font-bold tracking-tight text-lg leading-none text-white">
                  QUALITY <span className="text-brand-orange">CARS</span>
                </span>
                <span className="text-[10px] tracking-[0.2em] text-neutral-400 mt-1 uppercase">
                  BY SYED SABEER RIYAZ
                </span>
              </div>
            </div>
            <p className="text-sm text-neutral-400 leading-relaxed">
              Carefully curated pre-owned cars in Bangalore. Every car is physically inspected, document verified, and priced transparently.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://wa.me/919999999999"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-emerald-950/60 border border-emerald-800 text-emerald-400 flex items-center justify-center hover:bg-emerald-900 hover:text-white transition-colors"
                aria-label="WhatsApp"
              >
                <MessageCircle className="w-4 h-4 fill-current" />
              </a>
              <a
                href="tel:919999999999"
                className="w-9 h-9 rounded-full bg-neutral-800 border border-neutral-700 text-neutral-300 flex items-center justify-center hover:bg-neutral-700 hover:text-white transition-colors"
                aria-label="Phone"
              >
                <Phone className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Browse */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-white mb-4">
              Popular Categories
            </h4>
            <ul className="space-y-2.5 text-sm text-neutral-400">
              <li>
                <Link href="/cars?category=Hatchbacks" className="hover:text-brand-orange transition-colors">
                  Used Hatchbacks (i10, i20, Ritz, Swift)
                </Link>
              </li>
              <li>
                <Link href="/cars?category=Sedans" className="hover:text-brand-orange transition-colors">
                  Used Sedans (City, Verna, Ciaz)
                </Link>
              </li>
              <li>
                <Link href="/cars?category=SUVs" className="hover:text-brand-orange transition-colors">
                  Used SUVs & MUVs (Innova, Duster, Fortuner)
                </Link>
              </li>
              <li>
                <Link href="/cars?budget=under3" className="hover:text-brand-orange transition-colors">
                  Budget Cars Under ₹3 Lakhs
                </Link>
              </li>
            </ul>
          </div>

          {/* Direct Contact */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-white mb-4">
              Direct Contact
            </h4>
            <ul className="space-y-3 text-sm text-neutral-400">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-brand-orange mt-0.5 shrink-0" />
                <span>Bangalore, Karnataka, India</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-brand-orange shrink-0" />
                <a href="tel:919999999999" className="hover:text-white transition-colors">
                  +91 99999 99999
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-brand-orange shrink-0" />
                <a href="mailto:syed.ae018@gmail.com" className="hover:text-white transition-colors">
                  syed.ae018@gmail.com
                </a>
              </li>
              <li className="flex items-center gap-2.5 pt-1">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="text-xs text-neutral-300">100% Genuine Car RC & Docs</span>
              </li>
            </ul>
          </div>

          {/* Showroom Hours & Assurance */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-white mb-4">
              Viewing & Test Drives
            </h4>
            <p className="text-xs text-neutral-400 mb-3 leading-relaxed">
              Car inspections and test drives are arranged directly by appointment with Syed Sabeer Riyaz in Bangalore.
            </p>
            <div className="p-3.5 rounded-xl bg-neutral-800/80 border border-neutral-700/80 space-y-1.5 text-xs">
              <div className="text-neutral-200 font-bold">Mon – Sun: 9:30 AM – 8:00 PM</div>
              <div className="text-brand-orange text-[11px] font-semibold">Prior WhatsApp booking recommended</div>
            </div>
          </div>

        </div>

        {/* Copyright */}
        <div className="mt-12 pt-8 border-t border-neutral-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-500">
          <p>© {new Date().getFullYear()} Quality Used Cars — Syed Sabeer Riyaz. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Bangalore Pre-Owned Car Showroom
          </p>
        </div>
      </div>
    </footer>
  );
}
