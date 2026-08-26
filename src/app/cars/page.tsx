'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { CarCard } from '@/components/CarCard';
import { fetchCars } from '@/lib/inventoryService';
import { Car } from '@/lib/types';
import { Search, RotateCcw, Car as CarIcon, Sparkles } from 'lucide-react';

const CATEGORIES = ['All', 'Under ₹3L', 'Hatchbacks', 'Sedans', 'SUVs'];

function CarsCatalogContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('category') || 'All';
  const initialBudget = searchParams.get('budget') || 'All';

  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedBudget, setSelectedBudget] = useState(initialBudget);
  const [selectedFuel, setSelectedFuel] = useState('All');
  const [selectedTransmission, setSelectedTransmission] = useState('All');
  const [sortBy, setSortBy] = useState<'newest' | 'price-low' | 'price-high' | 'year-newest'>('newest');

  useEffect(() => {
    loadInventory();
  }, []);

  async function loadInventory() {
    setLoading(true);
    const data = await fetchCars();
    setCars(data);
    setLoading(false);
  }

  const publicCars = cars.filter(c => c.status === 'AVAILABLE' || c.status === 'RESERVED');

  const filteredCars = publicCars.filter((car) => {
    if (search.trim()) {
      const q = search.toLowerCase();
      const match =
        car.name.toLowerCase().includes(q) ||
        car.brand.toLowerCase().includes(q) ||
        car.model.toLowerCase().includes(q) ||
        (car.variant && car.variant.toLowerCase().includes(q));
      if (!match) return false;
    }

    if (selectedCategory !== 'All') {
      if (selectedCategory === 'Under ₹3L') {
        if (car.priceValue >= 300000) return false;
      } else if (car.category.toLowerCase() !== selectedCategory.toLowerCase()) {
        return false;
      }
    }

    if (selectedBudget !== 'All') {
      if (selectedBudget === 'under3' && car.priceValue >= 300000) return false;
      if (selectedBudget === '3to6' && (car.priceValue < 300000 || car.priceValue > 600000)) return false;
      if (selectedBudget === 'over6' && car.priceValue <= 600000) return false;
    }

    if (selectedFuel !== 'All' && car.fuel.toLowerCase() !== selectedFuel.toLowerCase()) {
      return false;
    }

    if (selectedTransmission !== 'All' && car.transmission.toLowerCase() !== selectedTransmission.toLowerCase()) {
      return false;
    }

    return true;
  }).sort((a, b) => {
    if (sortBy === 'price-low') return a.priceValue - b.priceValue;
    if (sortBy === 'price-high') return b.priceValue - a.priceValue;
    if (sortBy === 'year-newest') return b.year - a.year;
    return 0;
  });

  const resetFilters = () => {
    setSearch('');
    setSelectedCategory('All');
    setSelectedBudget('All');
    setSelectedFuel('All');
    setSelectedTransmission('All');
    setSortBy('newest');
  };

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14 flex-grow w-full">
      
      {/* Header */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-brand-orange mb-1">
          <Sparkles className="w-3.5 h-3.5" />
          <span>FULL DIGITAL CATALOG</span>
        </div>
        <h1 className="text-3xl font-extrabold text-neutral-900 dark:text-white">
          Used Cars For Sale in Bangalore
        </h1>
        <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
          Browse {publicCars.length} physically inspected, honest condition cars with verified documentation.
        </p>
      </div>

      {/* Filter Box */}
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-4 sm:p-5 shadow-sm space-y-4 mb-8">
        
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by make, model or variant..."
            className="w-full pl-11 pr-4 py-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-brand-orange/30 focus:border-brand-orange"
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

        {/* Categories */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {CATEGORIES.map((cat) => {
            const active = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                  active
                    ? 'bg-brand-orange text-white shadow-sm shadow-brand-orange/30'
                    : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Dropdowns */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-neutral-100 dark:border-neutral-800">
          <div className="flex flex-wrap items-center gap-3">
            
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-neutral-500">Fuel:</span>
              <select
                value={selectedFuel}
                onChange={(e) => setSelectedFuel(e.target.value)}
                aria-label="Filter by Fuel type"
                className="px-3 py-1.5 rounded-lg text-xs font-semibold border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-neutral-800 dark:text-neutral-200"
              >
                <option value="All">All</option>
                <option value="Petrol">Petrol</option>
                <option value="Diesel">Diesel</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-neutral-500">Gear:</span>
              <select
                value={selectedTransmission}
                onChange={(e) => setSelectedTransmission(e.target.value)}
                aria-label="Filter by Transmission type"
                className="px-3 py-1.5 rounded-lg text-xs font-semibold border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-neutral-800 dark:text-neutral-200"
              >
                <option value="All">All</option>
                <option value="Manual">Manual</option>
                <option value="Automatic">Automatic</option>
              </select>
            </div>

            {(search || selectedCategory !== 'All' || selectedFuel !== 'All' || selectedTransmission !== 'All') && (
              <button
                onClick={resetFilters}
                className="inline-flex items-center gap-1 text-xs font-semibold text-brand-orange hover:underline"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 ml-auto">
            <span className="text-xs font-semibold text-neutral-500">Sort:</span>
            <select
              value={sortBy}
              onChange={(e: any) => setSortBy(e.target.value)}
              aria-label="Sort cars by"
              className="px-3 py-1.5 rounded-lg text-xs font-semibold border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-neutral-800 dark:text-neutral-200"
            >
              <option value="newest">Newest Listed</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="year-newest">Year: Latest Model</option>
            </select>
          </div>
        </div>

      </div>

      {/* Grid */}
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
              {cars.length === 0 ? 'Catalog Currently Updating' : 'No vehicles found'}
            </h3>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 leading-relaxed">
              {cars.length === 0
                ? 'Syed Sabeer Riyaz is currently adding verified pre-owned cars to this catalog. Check back shortly or connect directly on WhatsApp.'
                : 'Try clearing your filters to see all available inventory in stock.'}
            </p>
          </div>
          {cars.length === 0 ? (
            <a
              href="https://wa.me/919999999999?text=Hi%20Syed,%20I%20am%20looking%20for%20a%20quality%20used%20car."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-md transition-all active:scale-95"
            >
              <span>WhatsApp Syed Sabeer</span>
            </a>
          ) : (
            <button
              onClick={resetFilters}
              className="px-5 py-2.5 rounded-xl text-xs font-bold bg-neutral-900 dark:bg-white text-white dark:text-neutral-900"
            >
              Show All Cars
            </button>
          )}
        </div>
      )}

    </main>
  );
}

export default function CarsCatalogPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Navbar />
      <Suspense fallback={<div className="p-12 text-center text-sm font-bold">Loading Catalog...</div>}>
        <CarsCatalogContent />
      </Suspense>
      <Footer />
    </div>
  );
}
