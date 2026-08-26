'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { CarCard } from '@/components/CarCard';
import { fetchCarById, fetchCars, createEnquiry, recordCarView, recordWhatsAppClick } from '@/lib/inventoryService';
import { Car } from '@/lib/types';
import { 
  ArrowLeft, 
  MessageCircle, 
  ShieldCheck, 
  CheckCircle2, 
  Calendar, 
  Fuel, 
  Gauge, 
  Users, 
  FileText, 
  KeyRound, 
  BookOpen, 
  Award, 
  Phone, 
  Share2, 
  Check, 
  Car as CarIcon,
  AlertCircle
} from 'lucide-react';

export default function CarDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [car, setCar] = useState<Car | null>(null);
  const [similarCars, setSimilarCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (id) {
      recordCarView(id);
      loadCar(id);
    }
  }, [id]);

  async function loadCar(carId: string) {
    setLoading(true);
    const data = await fetchCarById(carId);
    setCar(data);

    if (data) {
      const all = await fetchCars();
      const similar = all
        .filter(c => c.id !== data.id && (c.category === data.category || c.brand === data.brand) && c.status === 'AVAILABLE')
        .slice(0, 4);
      setSimilarCars(similar);
    }
    setLoading(false);
  }

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleWhatsAppEnquiry = () => {
    if (!car) return;
    recordWhatsAppClick(car.id, car.name);
    const msg = `Hi Syed, I am interested in the ${car.name} (Price: ${car.price}).\n\nDetails:\n- Year: ${car.year}\n- Fuel: ${car.fuel}\n- Transmission: ${car.transmission}\n- KM: ${car.kmDriven || 'N/A'}\n- Owners: ${car.owners}\n\nIs this car available for a test drive / inspection?`;
    
    // Log enquiry
    createEnquiry({
      customerName: 'Website Visitor',
      carId: car.id,
      carName: car.name,
      message: msg,
      status: 'New'
    });

    const url = `https://wa.me/919999999999?text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-16 flex-grow flex items-center justify-center">
          <div className="space-y-4 text-center">
            <div className="w-12 h-12 border-4 border-brand-orange border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-sm font-semibold text-neutral-500">Loading vehicle details...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!car || car.status === 'DRAFT') {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <div className="max-w-xl mx-auto px-4 py-20 flex-grow text-center flex flex-col items-center justify-center">
          <div className="w-16 h-16 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-neutral-500 mb-4">
            <AlertCircle className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-extrabold text-neutral-900 dark:text-white">This vehicle is no longer available</h2>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-2 mb-6">
            The car listing you requested might have been sold or removed from the showroom catalog.
          </p>
          <Link
            href="/#inventory"
            className="px-6 py-3 rounded-xl font-bold text-sm bg-brand-orange text-white hover:bg-brand-orange-600 transition-colors shadow-md"
          >
            Browse Available Inventory &rarr;
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const images = car.images && car.images.length > 0 ? car.images : [car.image];
  const activeImage = images[activeImageIndex] || car.image;

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Navbar />

      {/* Breadcrumb Bar */}
      <div className="border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-950/50 py-3.5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <Link
            href="/#inventory"
            className="inline-flex items-center gap-2 text-xs font-bold text-neutral-600 dark:text-neutral-300 hover:text-brand-orange transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Inventory</span>
          </Link>
          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Share2 className="w-3.5 h-3.5" />}
              <span>{copied ? 'Link Copied' : 'Share Car'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Vehicle Showcase */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12 flex-grow w-full space-y-12">
        
        {/* Top Grid: Gallery + Pricing Box */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          
          {/* Left 7 Columns: Gallery */}
          <div className="lg:col-span-7 space-y-4">
            
            {/* Main Featured View */}
            <div className="relative aspect-[4/3] w-full rounded-2xl overflow-hidden border border-neutral-200 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-900 shadow-md">
              <Image
                src={activeImage}
                alt={car.name}
                fill
                priority
                className="object-cover"
              />
              
              {/* Badges */}
              <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
                <span className={`px-3 py-1 rounded-full text-xs font-bold shadow-sm backdrop-blur-sm ${
                  car.status === 'AVAILABLE'
                    ? 'bg-emerald-600 text-white'
                    : car.status === 'RESERVED'
                    ? 'bg-amber-500 text-neutral-900'
                    : 'bg-neutral-800 text-white'
                }`}>
                  {car.status}
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/95 dark:bg-neutral-900/95 text-neutral-900 dark:text-white border border-neutral-200 dark:border-neutral-800 shadow-sm flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-brand-orange" />
                  Verified RC
                </span>
              </div>
            </div>

            {/* Thumbnail Strip */}
            {images.length > 1 && (
              <div className="flex items-center gap-3 overflow-x-auto pb-2">
                {images.map((src, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`relative w-20 h-16 rounded-xl overflow-hidden border-2 transition-all shrink-0 ${
                      activeImageIndex === idx
                        ? 'border-brand-orange ring-2 ring-brand-orange/30 scale-105'
                        : 'border-neutral-200 dark:border-neutral-800 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <Image src={src} alt="Thumbnail" fill className="object-cover" />
                  </button>
                ))}
              </div>
            )}

          </div>

          {/* Right 5 Columns: Vehicle Identity & Instant WhatsApp Booking */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
            
            <div className="space-y-4">
              
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                <span>{car.brand}</span>
                <span>&bull;</span>
                <span>{car.category}</span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 dark:text-white leading-tight">
                {car.name}
              </h1>

              {/* Price Tag Box */}
              <div className="p-5 rounded-2xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 space-y-1">
                <div className="text-xs font-bold uppercase text-neutral-500 dark:text-neutral-400">
                  Fixed Dealership Price
                </div>
                <div className="flex items-baseline gap-3">
                  <span className="text-3xl sm:text-4xl font-extrabold text-neutral-900 dark:text-white font-poppins">
                    {car.price}
                  </span>
                  <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                    No hidden dealer fee
                  </span>
                </div>
              </div>

              {/* Quick Specs Matrix */}
              <div className="grid grid-cols-2 gap-3 pt-2 text-xs">
                <div className="p-3 rounded-xl bg-white dark:bg-neutral-900/60 border border-neutral-200 dark:border-neutral-800 flex items-center gap-3">
                  <Calendar className="w-4 h-4 text-brand-orange" />
                  <div>
                    <div className="text-neutral-400 text-[10px] uppercase font-bold">Year</div>
                    <div className="font-bold text-neutral-900 dark:text-white">{car.year} Model</div>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-white dark:bg-neutral-900/60 border border-neutral-200 dark:border-neutral-800 flex items-center gap-3">
                  <Fuel className="w-4 h-4 text-brand-orange" />
                  <div>
                    <div className="text-neutral-400 text-[10px] uppercase font-bold">Fuel</div>
                    <div className="font-bold text-neutral-900 dark:text-white">{car.fuel}</div>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-white dark:bg-neutral-900/60 border border-neutral-200 dark:border-neutral-800 flex items-center gap-3">
                  <Gauge className="w-4 h-4 text-brand-orange" />
                  <div>
                    <div className="text-neutral-400 text-[10px] uppercase font-bold">Transmission</div>
                    <div className="font-bold text-neutral-900 dark:text-white">{car.transmission}</div>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-white dark:bg-neutral-900/60 border border-neutral-200 dark:border-neutral-800 flex items-center gap-3">
                  <Users className="w-4 h-4 text-brand-orange" />
                  <div>
                    <div className="text-neutral-400 text-[10px] uppercase font-bold">Ownership</div>
                    <div className="font-bold text-neutral-900 dark:text-white">{car.owners}</div>
                  </div>
                </div>
              </div>

              {/* Description */}
              {car.description && (
                <div className="pt-2 text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed">
                  <p>{car.description}</p>
                </div>
              )}

            </div>

            {/* Conversion CTA Block */}
            <div className="space-y-3 pt-4 border-t border-neutral-200 dark:border-neutral-800">
              <button
                onClick={handleWhatsAppEnquiry}
                className="w-full py-4 px-6 rounded-2xl font-bold text-base bg-emerald-600 hover:bg-emerald-500 text-white shadow-xl shadow-emerald-950/20 flex items-center justify-center gap-3 transition-all duration-200 active:scale-95"
              >
                <MessageCircle className="w-5 h-5 fill-current" />
                <span>I&apos;m Interested &bull; WhatsApp Syed Sabeer</span>
              </button>

              <div className="flex items-center justify-between text-xs text-neutral-500 dark:text-neutral-400 px-1">
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  Physical inspection in Bangalore
                </span>
                <a href="tel:919999999999" className="font-semibold hover:underline">
                  Or Call +91 99999 99999
                </a>
              </div>
            </div>

          </div>

        </div>

        {/* Technical Specifications & Good to Know Table */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 pt-8 border-t border-neutral-200 dark:border-neutral-800">
          
          {/* Detailed Specs (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            <h2 className="text-xl font-extrabold text-neutral-900 dark:text-white">
              Full Specifications & History
            </h2>

            <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 divide-y divide-neutral-100 dark:divide-neutral-800/80 bg-white dark:bg-neutral-900 overflow-hidden text-sm">
              {[
                { label: 'Make / Brand', val: car.brand },
                { label: 'Model', val: car.model },
                { label: 'Variant', val: car.variant || '-' },
                { label: 'Registration Year', val: car.year },
                { label: 'Fuel Type', val: car.fuel },
                { label: 'Transmission', val: car.transmission },
                { label: 'Kilometers Driven', val: car.kmDriven || 'Not recorded' },
                { label: 'Ownership', val: car.owners },
                { label: 'Exterior Colour', val: car.colour || 'Standard' },
                { label: 'Insurance Status', val: car.insurance || 'Valid' },
                { label: 'Fitness Certificate (FC)', val: car.fc || 'Valid' },
                { label: 'Service History', val: car.serviceHistory || 'Available on request' },
              ].map((row, idx) => (
                <div key={idx} className="flex items-center justify-between p-3.5 px-5">
                  <span className="text-neutral-500 dark:text-neutral-400 font-medium">{row.label}</span>
                  <span className="font-bold text-neutral-900 dark:text-white">{row.val}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Good to Know & Trust Checklist (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <h2 className="text-xl font-extrabold text-neutral-900 dark:text-white">
              Inspection & Documents
            </h2>

            <div className="p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 space-y-4 text-sm">
              <div className="flex items-start gap-3">
                <FileText className="w-5 h-5 text-brand-orange shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-neutral-900 dark:text-white">Original RC Book</div>
                  <div className="text-xs text-neutral-500 dark:text-neutral-400">Available and verified for instant ownership transfer</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <KeyRound className="w-5 h-5 text-brand-orange shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-neutral-900 dark:text-white">Keys & Remote</div>
                  <div className="text-xs text-neutral-500 dark:text-neutral-400">{car.keys || 'Original set included'}</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <BookOpen className="w-5 h-5 text-brand-orange shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-neutral-900 dark:text-white">User Manual & Toolkit</div>
                  <div className="text-xs text-neutral-500 dark:text-neutral-400">{car.manual || 'Available in glove compartment'}</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Award className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-neutral-900 dark:text-white">Zero Police Cases / Encumbrances</div>
                  <div className="text-xs text-neutral-500 dark:text-neutral-400">Clean RTO record with no pending challans</div>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Similar Cars Section */}
        {similarCars.length > 0 && (
          <div className="pt-12 border-t border-neutral-200 dark:border-neutral-800 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-extrabold text-neutral-900 dark:text-white">
                  Similar Cars You May Like
                </h2>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                  Other verified cars in the same category or budget
                </p>
              </div>
              <Link href="/#inventory" className="text-xs font-bold text-brand-orange hover:underline">
                View All Cars &rarr;
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {similarCars.map((item) => (
                <CarCard key={item.id} car={item} />
              ))}
            </div>
          </div>
        )}

      </main>

      {/* Mobile Sticky WhatsApp CTA */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-neutral-900/95 backdrop-blur-md p-3.5 border-t border-neutral-200 dark:border-neutral-800 shadow-2xl flex items-center justify-between gap-4">
        <div>
          <div className="text-[10px] font-bold text-neutral-500 dark:text-neutral-400 uppercase">Fixed Price</div>
          <div className="text-lg font-extrabold text-neutral-900 dark:text-white font-poppins">{car.price}</div>
        </div>
        <button
          onClick={handleWhatsAppEnquiry}
          className="flex-1 py-3 px-4 rounded-xl text-xs font-bold bg-emerald-600 text-white flex items-center justify-center gap-2 shadow-md active:scale-95"
        >
          <MessageCircle className="w-4 h-4 fill-current" />
          <span>WhatsApp Syed Sabeer</span>
        </button>
      </div>

      <Footer />
    </div>
  );
}
