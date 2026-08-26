'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { CarCard } from '@/components/CarCard';
import { InventoryFilterBar, FilterState } from '@/components/InventoryFilterBar';
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
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    category: initialCategory,
    fuel: 'All',
    transmission: 'All',
    sort: 'newest'
  });

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
    if (filters.search.trim()) {
      const q = filters.search.toLowerCase();
      const match =
        car.name.toLowerCase().includes(q) ||
        car.brand.toLowerCase().includes(q) ||
        car.model.toLowerCase().includes(q) ||
        (car.variant && car.variant.toLowerCase().includes(q));
      if (!match) return false;
    }

    if (filters.category !== 'All') {
      if (filters.category === 'Under ₹3L') {
        if (car.priceValue >= 300000) return false;
      } else if (car.category.toLowerCase() !== filters.category.toLowerCase()) {
        return false;
      }
    }

    if (filters.fuel !== 'All' && car.fuel.toLowerCase() !== filters.fuel.toLowerCase()) {
      return false;
    }

    if (filters.transmission !== 'All' && car.transmission.toLowerCase() !== filters.transmission.toLowerCase()) {
      return false;
    }

    return true;
  }).sort((a, b) => {
    if (filters.sort === 'price-low') return a.priceValue - b.priceValue;
    if (filters.sort === 'price-high') return b.priceValue - a.priceValue;
    if (filters.sort === 'year-newest') return b.year - a.year;
    return 0;
  });

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14 flex-grow w-full">
      
      {/* Header */}
      <div className="mb-6">
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

      {/* Compact & Customizable Filter Bar */}
      <InventoryFilterBar
        filters={filters}
        onFilterChange={setFilters}
        categories={CATEGORIES}
        totalResults={filteredCars.length}
      />

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
              onClick={() => setFilters({ search: '', category: 'All', fuel: 'All', transmission: 'All', sort: 'newest' })}
              className="px-5 py-2.5 rounded-xl text-xs font-bold bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 hover:bg-neutral-800"
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
