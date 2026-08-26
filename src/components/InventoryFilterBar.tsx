'use client';

import React, { useState } from 'react';
import { 
  Search, 
  SlidersHorizontal, 
  X, 
  RotateCcw, 
  Check, 
  Fuel, 
  Gauge, 
  ArrowUpDown,
  Car,
  ChevronDown
} from 'lucide-react';

export interface FilterState {
  search: string;
  category: string;
  fuel: string;
  transmission: string;
  sort: string;
}

interface InventoryFilterBarProps {
  filters: FilterState;
  onFilterChange: (newFilters: FilterState) => void;
  categories: string[];
  totalResults: number;
}

export function InventoryFilterBar({
  filters,
  onFilterChange,
  categories,
  totalResults
}: InventoryFilterBarProps) {
  const [isOpen, setIsOpen] = useState(false);

  const activeCount = [
    filters.category !== 'All',
    filters.fuel !== 'All',
    filters.transmission !== 'All',
    filters.sort !== 'newest',
  ].filter(Boolean).length;

  const handleSearchChange = (val: string) => {
    onFilterChange({ ...filters, search: val });
  };

  const handleCategorySelect = (cat: string) => {
    onFilterChange({ ...filters, category: cat });
  };

  const handleFuelSelect = (fuel: string) => {
    onFilterChange({ ...filters, fuel });
  };

  const handleTransmissionSelect = (trans: string) => {
    onFilterChange({ ...filters, transmission: trans });
  };

  const handleSortSelect = (sort: string) => {
    onFilterChange({ ...filters, sort });
  };

  const resetAll = () => {
    onFilterChange({
      search: '',
      category: 'All',
      fuel: 'All',
      transmission: 'All',
      sort: 'newest'
    });
  };

  return (
    <div className="space-y-3 mb-8">
      
      {/* Compact Main Search & Action Bar */}
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-2.5 sm:p-3 shadow-sm flex flex-col sm:flex-row items-center gap-2.5">
        
        {/* Search Input Box */}
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
          <input
            type="text"
            value={filters.search}
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder="Search by make, model, or variant (e.g. i20, Swift, City, Petrol)..."
            className="w-full pl-10 pr-9 py-2.5 rounded-xl border border-transparent bg-neutral-100/80 dark:bg-neutral-800/80 text-xs sm:text-sm font-medium text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:outline-none focus:bg-white dark:focus:bg-neutral-950 focus:ring-2 focus:ring-brand-orange/30 focus:border-brand-orange transition-all"
          />
          {filters.search && (
            <button
              onClick={() => handleSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-neutral-400 hover:text-neutral-700 dark:hover:text-white"
              title="Clear search"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Right Side Buttons: Sort & Filter Toggle */}
        <div className="flex items-center gap-2 w-full sm:w-auto shrink-0 justify-between sm:justify-end">
          
          {/* Quick Sort Dropdown */}
          <div className="relative flex-1 sm:flex-initial">
            <select
              value={filters.sort}
              onChange={(e) => handleSortSelect(e.target.value)}
              aria-label="Sort cars"
              className="w-full sm:w-auto appearance-none pl-3 pr-8 py-2.5 rounded-xl text-xs font-bold bg-neutral-100/80 dark:bg-neutral-800/80 border border-transparent text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200/80 dark:hover:bg-neutral-700 cursor-pointer focus:outline-none transition-colors"
            >
              <option value="newest">Newest Listed</option>
              <option value="price-low">Price: Low &rarr; High</option>
              <option value="price-high">Price: High &rarr; Low</option>
              <option value="year-newest">Year: Latest Model</option>
            </select>
            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-neutral-400 pointer-events-none" />
          </div>

          {/* Filter Modal / Drawer Toggle Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={`flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
              isOpen || activeCount > 0
                ? 'bg-brand-orange text-white shadow-sm shadow-brand-orange/30'
                : 'bg-neutral-100/80 dark:bg-neutral-800/80 text-neutral-800 dark:text-neutral-200 hover:bg-neutral-200/80 dark:hover:bg-neutral-700'
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Filters</span>
            {activeCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-white text-brand-orange dark:bg-neutral-950 dark:text-brand-orange text-[10px] font-black flex items-center justify-center">
                {activeCount}
              </span>
            )}
          </button>

        </div>

      </div>

      {/* Active Filter Tags Bar (When any filter is active) */}
      {(filters.category !== 'All' || filters.fuel !== 'All' || filters.transmission !== 'All' || filters.search) && (
        <div className="flex flex-wrap items-center gap-2 px-1">
          <span className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider">Active:</span>

          {filters.category !== 'All' && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-brand-orange/10 text-brand-orange dark:bg-brand-orange/20 border border-brand-orange/30">
              <span>{filters.category}</span>
              <button onClick={() => handleCategorySelect('All')} className="hover:text-neutral-900 dark:hover:text-white">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {filters.fuel !== 'All' && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-brand-orange/10 text-brand-orange dark:bg-brand-orange/20 border border-brand-orange/30">
              <span>{filters.fuel}</span>
              <button onClick={() => handleFuelSelect('All')} className="hover:text-neutral-900 dark:hover:text-white">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {filters.transmission !== 'All' && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-brand-orange/10 text-brand-orange dark:bg-brand-orange/20 border border-brand-orange/30">
              <span>{filters.transmission}</span>
              <button onClick={() => handleTransmissionSelect('All')} className="hover:text-neutral-900 dark:hover:text-white">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          <button
            onClick={resetAll}
            className="inline-flex items-center gap-1 text-xs font-bold text-neutral-500 hover:text-brand-orange ml-1"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Clear All</span>
          </button>
        </div>
      )}

      {/* Expandable Customizable Filter Drawer */}
      {isOpen && (
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl p-5 sm:p-6 shadow-xl space-y-6 animate-in fade-in slide-in-from-top-2 duration-200">
          
          <div className="flex items-center justify-between border-b border-neutral-100 dark:border-neutral-800 pb-3">
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-brand-orange" />
              <h3 className="text-sm font-bold text-neutral-900 dark:text-white uppercase tracking-wider">
                Custom Filters
              </h3>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-lg text-neutral-400 hover:text-neutral-700 dark:hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Section 1: Body Type & Price Tier */}
          <div className="space-y-2.5">
            <label className="text-xs font-bold text-neutral-600 dark:text-neutral-400 uppercase tracking-wider flex items-center gap-1.5">
              <Car className="w-3.5 h-3.5 text-neutral-500" />
              <span>Body Type & Budget</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => {
                const isSelected = filters.category === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => handleCategorySelect(cat)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                      isSelected
                        ? 'bg-brand-orange text-white shadow-sm shadow-brand-orange/30'
                        : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700'
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 2: Fuel Type */}
          <div className="space-y-2.5">
            <label className="text-xs font-bold text-neutral-600 dark:text-neutral-400 uppercase tracking-wider flex items-center gap-1.5">
              <Fuel className="w-3.5 h-3.5 text-neutral-500" />
              <span>Fuel Type</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {['All', 'Petrol', 'Diesel', 'CNG/Electric'].map((fuel) => {
                const isSelected = filters.fuel === fuel;
                return (
                  <button
                    key={fuel}
                    onClick={() => handleFuelSelect(fuel)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                      isSelected
                        ? 'bg-brand-orange text-white shadow-sm shadow-brand-orange/30'
                        : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700'
                    }`}
                  >
                    {fuel === 'All' ? 'All Fuel Types' : fuel}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 3: Transmission */}
          <div className="space-y-2.5">
            <label className="text-xs font-bold text-neutral-600 dark:text-neutral-400 uppercase tracking-wider flex items-center gap-1.5">
              <Gauge className="w-3.5 h-3.5 text-neutral-500" />
              <span>Transmission / Gearbox</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {['All', 'Manual', 'Automatic'].map((trans) => {
                const isSelected = filters.transmission === trans;
                return (
                  <button
                    key={trans}
                    onClick={() => handleTransmissionSelect(trans)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                      isSelected
                        ? 'bg-brand-orange text-white shadow-sm shadow-brand-orange/30'
                        : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700'
                    }`}
                  >
                    {trans === 'All' ? 'All Gears' : trans}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Bottom Controls */}
          <div className="flex items-center justify-between pt-4 border-t border-neutral-100 dark:border-neutral-800">
            <button
              onClick={resetAll}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-neutral-500 hover:text-neutral-900 dark:hover:text-white"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset All</span>
            </button>

            <button
              onClick={() => setIsOpen(false)}
              className="px-5 py-2.5 rounded-xl text-xs font-bold bg-neutral-900 dark:bg-white text-white dark:text-neutral-950 hover:bg-neutral-800 dark:hover:bg-neutral-100 shadow-md transition-all active:scale-95"
            >
              Show {totalResults} {totalResults === 1 ? 'Car' : 'Cars'}
            </button>
          </div>

        </div>
      )}

    </div>
  );
}
