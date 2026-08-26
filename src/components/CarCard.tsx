'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Fuel, Gauge, Calendar, Users, MessageCircle, ArrowRight, ShieldCheck } from 'lucide-react';
import { Car } from '@/lib/types';
import { recordWhatsAppClick } from '@/lib/inventoryService';

interface CarCardProps {
  car: Car;
}

export function CarCard({ car }: CarCardProps) {
  const isAvailable = car.status === 'AVAILABLE';
  const isReserved = car.status === 'RESERVED';

  const waMessage = `Hi Syed, I'm interested in the ${car.name} listed at ${car.price}.\n\nYear: ${car.year} | Fuel: ${car.fuel} | Transmission: ${car.transmission} | KM: ${car.kmDriven || 'N/A'}\nIs this car available for viewing in Bangalore?`;
  const waUrl = `https://wa.me/919999999999?text=${encodeURIComponent(waMessage)}`;

  return (
    <div className="group rounded-3xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 overflow-hidden shadow-sm hover:shadow-xl dark:hover:shadow-black/50 transition-all duration-300 flex flex-col justify-between">
      
      {/* Image Area with Badges */}
      <Link href={`/cars/${car.id}`} className="relative block aspect-[16/10] w-full overflow-hidden bg-neutral-100 dark:bg-neutral-800">
        <Image
          src={car.image || 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=800&q=80'}
          alt={car.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Status Badge */}
        <div className="absolute top-3 left-3 z-10 flex items-center gap-1.5">
          {isAvailable && (
            <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-600/90 text-white backdrop-blur-sm shadow-sm flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
              AVAILABLE
            </span>
          )}
          {isReserved && (
            <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-500/95 text-neutral-900 backdrop-blur-sm shadow-sm">
              RESERVED
            </span>
          )}
        </div>

        {/* Verified Badge */}
        <div className="absolute top-3 right-3 z-10">
          <span className="px-2 py-1 rounded-md text-[10px] font-bold bg-white/95 dark:bg-neutral-950/95 text-neutral-800 dark:text-neutral-200 backdrop-blur-sm border border-neutral-200/60 dark:border-neutral-800 flex items-center gap-1 shadow-sm">
            <ShieldCheck className="w-3 h-3 text-brand-orange" />
            Verified
          </span>
        </div>
      </Link>

      {/* Content Area */}
      <div className="p-5 flex flex-col flex-grow justify-between space-y-4">
        
        {/* Title & Category */}
        <div>
          <div className="flex items-center justify-between text-xs font-semibold text-neutral-500 dark:text-neutral-400 mb-1">
            <span>{car.brand}</span>
            <span>{car.category}</span>
          </div>
          <Link href={`/cars/${car.id}`} className="block">
            <h3 className="font-bold text-base text-neutral-900 dark:text-white line-clamp-1 group-hover:text-brand-orange transition-colors">
              {car.name}
            </h3>
          </Link>
          <div className="mt-1.5 flex items-baseline gap-2">
            <span className="text-xl font-extrabold text-neutral-900 dark:text-white font-poppins">
              {car.price}
            </span>
            <span className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
              Fixed Honest Price
            </span>
          </div>
        </div>

        {/* Specs Pill Matrix */}
        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-neutral-100 dark:border-neutral-800/80 text-xs text-neutral-600 dark:text-neutral-300">
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
            <span>{car.year} Model</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Fuel className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
            <span>{car.fuel}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Gauge className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
            <span>{car.transmission}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
            <span>{car.owners}</span>
          </div>
        </div>

        {/* Card Actions */}
        <div className="pt-2 flex items-center gap-2">
          <Link
            href={`/cars/${car.id}`}
            className="flex-1 py-2.5 px-3 rounded-xl text-xs font-bold text-center bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors flex items-center justify-center gap-1.5"
          >
            <span>View Details</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>

          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => recordWhatsAppClick(car.id, car.name)}
            className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-600 hover:text-white dark:hover:bg-emerald-600 dark:hover:text-white transition-all duration-200"
            title="Chat on WhatsApp"
            aria-label="Chat on WhatsApp"
          >
            <MessageCircle className="w-4 h-4 fill-current" />
          </a>
        </div>

      </div>

    </div>
  );
}
