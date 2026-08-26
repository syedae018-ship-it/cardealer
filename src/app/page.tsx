'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { Hero } from '@/components/Hero';
import { CarCard } from '@/components/CarCard';
import { Footer } from '@/components/Footer';
import { fetchCars, recordPageView } from '@/lib/inventoryService';
import { Car } from '@/lib/types';
import { 
  Search, 
  SlidersHorizontal, 
  RotateCcw, 
  ShieldCheck, 
  Car as CarIcon, 
  CheckCircle2, 
  MessageCircle, 
  PhoneCall, 
  MapPin, 
  Sparkles,
  ArrowRight
} from 'lucide-react';

const CATEGORIES = ['All', 'Under ₹3L', 'Hatchbacks', 'Sedans', 'SUVs'];

export default function HomePage() {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedFuel, setSelectedFuel] = useState('All');
  const [selectedTransmission, setSelectedTransmission] = useState('All');
  const [sortBy, setSortBy] = useState<'newest' | 'price-low' | 'price-high' | 'year-newest'>('newest');

  useEffect(() => {
    recordPageView('/');
    loadInventory();
  }, []);

  async function loadInventory() {
    setLoading(true);
    const data = await fetchCars();
    setCars(data);
    setLoading(false);
  }

  // Filter cars (Only show AVAILABLE and RESERVED on public site)
  const publicCars = cars.filter(c => c.status === 'AVAILABLE' || c.status === 'RESERVED');

  const filteredCars = publicCars.filter((car) => {
    // Search query
    if (search.trim()) {
      const q = search.toLowerCase();
      const match = 
        car.name.toLowerCase().includes(q) ||
        car.brand.toLowerCase().includes(q) ||
        car.model.toLowerCase().includes(q) ||
        (car.variant && car.variant.toLowerCase().includes(q));
      if (!match) return false;
    }

    // Category
    if (selectedCategory !== 'All') {
      if (selectedCategory === 'Under ₹3L') {
        if (car.priceValue >= 300000) return false;
      } else if (car.category.toLowerCase() !== selectedCategory.toLowerCase()) {
        return false;
      }
    }

    // Fuel
    if (selectedFuel !== 'All' && car.fuel.toLowerCase() !== selectedFuel.toLowerCase()) {
      return false;
    }

    // Transmission
    if (selectedTransmission !== 'All' && car.transmission.toLowerCase() !== selectedTransmission.toLowerCase()) {
      return false;
    }

    return true;
  }).sort((a, b) => {
    if (sortBy === 'price-low') return a.priceValue - b.priceValue;
    if (sortBy === 'price-high') return b.priceValue - a.priceValue;
    if (sortBy === 'year-newest') return b.year - a.year;
    return 0; // newest
  });

  const availableCount = publicCars.filter(c => c.status === 'AVAILABLE').length;

  const resetFilters = () => {
    setSearch('');
    setSelectedCategory('All');
    setSelectedFuel('All');
    setSelectedTransmission('All');
    setSortBy('newest');
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Navbar />

      {/* Hero Section */}
      <Hero availableCount={availableCount} />

      {/* Main Inventory Catalog */}
      <main id="inventory" className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16 w-full">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-brand-orange mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>CURRENT SHOWROOM COLLECTION</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-neutral-900 dark:text-white">
              Available Cars in Stock
            </h2>
            <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
              Showing <span className="font-bold text-neutral-900 dark:text-white">{filteredCars.length}</span> verified cars ready for physical inspection
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-medium text-neutral-500">
            <span>Direct WhatsApp booking with Syed Sabeer Riyaz</span>
          </div>
        </div>

        {/* Search & Filter Controls Bar */}
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-4 sm:p-5 shadow-sm space-y-4 mb-8">
          
          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by make, model or variant (e.g. i20, Ritz, Innova, Petrol, Automatic)..."
              className="w-full pl-11 pr-4 py-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-brand-orange/30 focus:border-brand-orange transition-colors"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-neutral-400 hover:text-neutral-700 dark:hover:text-white"
              >
                Clear
              </button>
            )}
          </div>

          {/* Quick Category Chips */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {CATEGORIES.map((cat) => {
              const active = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all duration-150 ${
                    active
                      ? 'bg-brand-orange text-white shadow-sm shadow-brand-orange/30 scale-[1.02]'
                      : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          {/* Advanced Dropdowns & Reset */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-neutral-100 dark:border-neutral-800">
            <div className="flex flex-wrap items-center gap-3">
              
              {/* Fuel Dropdown */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-neutral-500">Fuel:</span>
                <select
                  value={selectedFuel}
                  onChange={(e) => setSelectedFuel(e.target.value)}
                  aria-label="Filter by Fuel type"
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-neutral-800 dark:text-neutral-200 focus:outline-none"
                >
                  <option value="All">All Fuel</option>
                  <option value="Petrol">Petrol</option>
                  <option value="Diesel">Diesel</option>
                </select>
              </div>

              {/* Transmission Dropdown */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-neutral-500">Gear:</span>
                <select
                  value={selectedTransmission}
                  onChange={(e) => setSelectedTransmission(e.target.value)}
                  aria-label="Filter by Transmission type"
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-neutral-800 dark:text-neutral-200 focus:outline-none"
                >
                  <option value="All">All Gears</option>
                  <option value="Manual">Manual</option>
                  <option value="Automatic">Automatic</option>
                </select>
              </div>

              {/* Clear filters */}
              {(search || selectedCategory !== 'All' || selectedFuel !== 'All' || selectedTransmission !== 'All') && (
                <button
                  onClick={resetFilters}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-brand-orange hover:underline"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset filters</span>
                </button>
              )}
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2 ml-auto">
              <span className="text-xs font-semibold text-neutral-500">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e: any) => setSortBy(e.target.value)}
                aria-label="Sort inventory by"
                className="px-3 py-1.5 rounded-lg text-xs font-semibold border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-neutral-800 dark:text-neutral-200 focus:outline-none"
              >
                <option value="newest">Newest Listed</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="year-newest">Year: Latest Model</option>
              </select>
            </div>

          </div>

        </div>

        {/* Vehicles 4-Column Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-pulse">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
              <div key={n} className="h-80 rounded-2xl bg-neutral-200 dark:bg-neutral-800" />
            ))}
          </div>
        ) : filteredCars.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredCars.map((car) => (
              <CarCard key={car.id} car={car} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 px-6 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl max-w-lg mx-auto shadow-sm space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-orange-50 dark:bg-orange-950/60 text-brand-orange flex items-center justify-center mx-auto shadow-sm">
              <CarIcon className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-neutral-900 dark:text-white">
                {cars.length === 0 ? 'Showroom Inventory Updating' : 'No cars match your search'}
              </h3>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 leading-relaxed">
                {cars.length === 0 
                  ? 'Syed Sabeer Riyaz is currently adding new verified pre-owned vehicles. Contact Syed directly on WhatsApp to inquire about current stock or specific models.'
                  : 'Try adjusting your category, fuel, or budget filters to find available cars.'}
              </p>
            </div>
            
            {cars.length === 0 ? (
              <a
                href="https://wa.me/919999999999?text=Hi%20Syed,%20I%20am%20looking%20for%20a%20quality%20used%20car."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-md transition-all active:scale-95"
              >
                <MessageCircle className="w-4 h-4 fill-current" />
                <span>WhatsApp Syed Sabeer Directly</span>
              </a>
            ) : (
              <button
                onClick={resetFilters}
                className="px-5 py-2.5 rounded-xl text-xs font-bold bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 hover:bg-neutral-800 transition-colors"
              >
                Show All Available Cars
              </button>
            )}
          </div>
        )}

      </main>

      {/* Why Buy From Syed Sabeer Riyaz Section */}
      <section id="why-us" className="bg-neutral-50 dark:bg-neutral-900/50 border-t border-b border-neutral-200 dark:border-neutral-800 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-orange">
              THE QUALITY USED CARS PROMISE
            </span>
            <h2 className="text-3xl font-extrabold text-neutral-900 dark:text-white mt-1">
              Why Bangalore Trusts Syed Sabeer Riyaz
            </h2>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-2">
              We skip dealer markups, fake promises, and unverified histories. Every car is hand-selected and backed by direct owner accountability.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm space-y-3">
              <div className="w-12 h-12 rounded-xl bg-orange-100 dark:bg-orange-950/60 text-brand-orange flex items-center justify-center">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-neutral-900 dark:text-white">Strict Document Verification</h3>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
                All vehicles come with verified Registration Certificates (RC), clean insurance status, Fitness Certificates (FC), and zero legal encumbrances.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm space-y-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-neutral-900 dark:text-white">Honest Mechanical Check</h3>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
                Engine health, suspension, transmission smoothness, and AC chilling are physically checked before any car is listed in the showroom.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm space-y-3">
              <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                <MessageCircle className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-neutral-900 dark:text-white">Direct WhatsApp Simplicity</h3>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
                No middlemen or aggressive sales agents. Message Syed directly on WhatsApp to schedule a live test drive or request additional video walk-arounds.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* Direct Contact Banner */}
      <section id="contact" className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="rounded-3xl bg-gradient-to-r from-neutral-900 via-neutral-900 to-neutral-800 text-white p-8 sm:p-12 shadow-xl flex flex-col md:flex-row items-center justify-between gap-8 border border-neutral-800">
          
          <div className="space-y-3 max-w-xl">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-orange">
              HAVE A SPECIFIC CAR IN MIND?
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold">
              Talk directly with Syed Sabeer Riyaz today.
            </h2>
            <p className="text-sm text-neutral-400 leading-relaxed">
              Looking for a specific model or have questions about one of our inventory cars? WhatsApp or call us directly.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
            <a
              href="https://wa.me/919999999999?text=Hi%20Syed,%20I%20am%20looking%20for%20a%20quality%20used%20car."
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-bold text-sm bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-950/40 transition-all active:scale-95"
            >
              <MessageCircle className="w-5 h-5 fill-current" />
              <span>WhatsApp Syed</span>
            </a>
            
            <a
              href="tel:919999999999"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-bold text-sm bg-neutral-800 hover:bg-neutral-700 text-white border border-neutral-700 transition-all active:scale-95"
            >
              <PhoneCall className="w-4 h-4" />
              <span>Call +91 99999 99999</span>
            </a>
          </div>

        </div>
      </section>

      <Footer />
    </div>
  );
}
