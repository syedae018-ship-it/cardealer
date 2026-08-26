'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  PlusCircle, 
  Search, 
  Edit, 
  Copy, 
  Trash2, 
  ExternalLink, 
  Filter, 
  Check, 
  Car as CarIcon,
  AlertCircle
} from 'lucide-react';
import { fetchCars, updateCar, deleteCar, createCar } from '@/lib/inventoryService';
import { Car, VehicleStatus } from '@/lib/types';

export default function AdminInventoryPage() {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState<'ALL' | VehicleStatus>('ALL');
  const [actionSuccess, setActionSuccess] = useState('');

  useEffect(() => {
    loadCars();
  }, []);

  async function loadCars() {
    setLoading(true);
    const data = await fetchCars();
    setCars(data);
    setLoading(false);
  }

  const showNotification = (msg: string) => {
    setActionSuccess(msg);
    setTimeout(() => setActionSuccess(''), 3000);
  };

  const handleStatusChange = async (carId: string, newStatus: VehicleStatus) => {
    const target = cars.find(c => c.id === carId);
    if (!target) return;

    if (newStatus === 'SOLD') {
      const confirmSold = window.confirm(`Mark ${target.name} as SOLD? It will be removed from active website listings.`);
      if (!confirmSold) return;
    }

    const updated = await updateCar(carId, { status: newStatus });
    if (updated) {
      setCars(prev => prev.map(c => c.id === carId ? { ...c, status: newStatus } : c));
      showNotification(`${target.name} marked as ${newStatus}`);
    }
  };

  const handleDuplicate = async (car: Car) => {
    const duplicateData: Omit<Car, 'id'> = {
      ...car,
      name: `${car.name} (Copy)`,
      status: 'DRAFT',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const created = await createCar(duplicateData);
    if (created) {
      setCars(prev => [created, ...prev]);
      showNotification(`Created draft duplicate of ${car.name}`);
    }
  };

  const handleDelete = async (carId: string, name: string) => {
    const confirmed = window.confirm(`Are you sure you want to permanently delete "${name}" from inventory?`);
    if (!confirmed) return;

    const ok = await deleteCar(carId);
    if (ok) {
      setCars(prev => prev.filter(c => c.id !== carId));
      showNotification(`Deleted ${name}`);
    }
  };

  const filteredCars = cars.filter((car) => {
    if (activeTab !== 'ALL' && car.status !== activeTab) {
      return false;
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        car.name.toLowerCase().includes(q) ||
        car.brand.toLowerCase().includes(q) ||
        car.model.toLowerCase().includes(q) ||
        car.price.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const tabCounts = {
    ALL: cars.length,
    AVAILABLE: cars.filter(c => c.status === 'AVAILABLE').length,
    RESERVED: cars.filter(c => c.status === 'RESERVED').length,
    SOLD: cars.filter(c => c.status === 'SOLD').length,
    DRAFT: cars.filter(c => c.status === 'DRAFT').length,
  };

  return (
    <div className="space-y-6">
      
      {/* Toast Notification */}
      {actionSuccess && (
        <div className="fixed top-6 right-6 z-50 p-4 rounded-xl bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 shadow-2xl border border-neutral-700 text-xs font-bold flex items-center gap-2 animate-in fade-in duration-200">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{actionSuccess}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-neutral-900 dark:text-white">
            Inventory Management
          </h1>
          <p className="text-xs text-neutral-500 mt-0.5">
            Total {cars.length} cars recorded in system
          </p>
        </div>

        <Link
          href="/admin/inventory/new"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-brand-orange hover:bg-brand-orange-600 text-white shadow-md shadow-brand-orange/20 transition-all active:scale-95"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Add New Car</span>
        </Link>
      </div>

      {/* Status Tabs & Search Controls */}
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-4 space-y-4 shadow-sm">
        
        {/* Status Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {(['ALL', 'AVAILABLE', 'RESERVED', 'SOLD', 'DRAFT'] as const).map((tab) => {
            const active = activeTab === tab;
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  active
                    ? 'bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 shadow-sm'
                    : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200'
                }`}
              >
                <span>{tab === 'ALL' ? 'All Cars' : tab}</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded-md bg-neutral-200/60 dark:bg-neutral-700/60 font-semibold">
                  {tabCounts[tab]}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search Input */}
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search inventory by car name, make, model or price..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-brand-orange/30 focus:border-brand-orange"
          />
        </div>

      </div>

      {/* Inventory Table */}
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl overflow-hidden shadow-sm">
        {loading ? (
          <div className="p-12 text-center text-xs font-bold text-neutral-500">Loading cars...</div>
        ) : filteredCars.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-neutral-50 dark:bg-neutral-800/60 border-b border-neutral-200 dark:border-neutral-800 text-[11px] font-bold text-neutral-500 uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-4">Vehicle</th>
                  <th className="py-3.5 px-4">Price</th>
                  <th className="py-3.5 px-4">Specs</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800/80">
                {filteredCars.map((car) => (
                  <tr key={car.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/40 transition-colors">
                    
                    {/* Vehicle Identity */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="relative w-14 h-11 rounded-lg overflow-hidden bg-neutral-100 dark:bg-neutral-800 shrink-0">
                          <Image src={car.image} alt={car.name} fill className="object-cover" />
                        </div>
                        <div>
                          <div className="font-bold text-neutral-900 dark:text-white text-xs">{car.name}</div>
                          <div className="text-[11px] text-neutral-500">{car.brand} &bull; {car.category}</div>
                        </div>
                      </div>
                    </td>

                    {/* Price */}
                    <td className="py-3.5 px-4 font-bold text-brand-orange font-poppins">
                      {car.price}
                    </td>

                    {/* Specs */}
                    <td className="py-3.5 px-4 text-neutral-600 dark:text-neutral-400">
                      <div>{car.year} &bull; {car.fuel}</div>
                      <div className="text-[11px] text-neutral-500">{car.transmission} &bull; {car.owners}</div>
                    </td>

                    {/* Live Status & Quick Visibility Switch */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleStatusChange(car.id, car.status === 'AVAILABLE' ? 'DRAFT' : 'AVAILABLE')}
                          className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                            car.status === 'AVAILABLE' ? 'bg-emerald-500' : 'bg-neutral-300 dark:bg-neutral-700'
                          }`}
                          title={car.status === 'AVAILABLE' ? 'Live on website (Click to Deactivate)' : 'Hidden / Draft (Click to Activate)'}
                          aria-label="Toggle listing status"
                        >
                          <span
                            className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                              car.status === 'AVAILABLE' ? 'translate-x-4' : 'translate-x-0'
                            }`}
                          />
                        </button>

                        <select
                          value={car.status}
                          onChange={(e) => handleStatusChange(car.id, e.target.value as VehicleStatus)}
                          aria-label={`Change status for ${car.name}`}
                          className={`px-2 py-0.5 rounded-md text-[11px] font-bold border focus:outline-none ${
                            car.status === 'AVAILABLE'
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-300 dark:bg-emerald-950 dark:text-emerald-400 dark:border-emerald-800'
                              : car.status === 'RESERVED'
                              ? 'bg-amber-50 text-amber-800 border-amber-300 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-800'
                              : car.status === 'SOLD'
                              ? 'bg-neutral-100 text-neutral-700 border-neutral-300 dark:bg-neutral-800 dark:text-neutral-400 dark:border-neutral-700'
                              : 'bg-neutral-100 text-neutral-500 border-neutral-300 dark:bg-neutral-900 dark:text-neutral-500 dark:border-neutral-800'
                          }`}
                        >
                          <option value="AVAILABLE">AVAILABLE</option>
                          <option value="RESERVED">RESERVED</option>
                          <option value="SOLD">SOLD</option>
                          <option value="DRAFT">DRAFT (OFF)</option>
                        </select>
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="inline-flex items-center gap-1.5">
                        <Link
                          href={`/cars/${car.id}`}
                          target="_blank"
                          className="p-1.5 rounded-lg text-neutral-500 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800"
                          title="View Public Page"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </Link>
                        
                        <Link
                          href={`/admin/inventory/${car.id}/edit`}
                          className="p-1.5 rounded-lg text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                          title="Edit Details"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </Link>

                        <button
                          onClick={() => handleDuplicate(car)}
                          className="p-1.5 rounded-lg text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                          title="Duplicate Car"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => handleDelete(car.id, car.name)}
                          className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-950/50"
                          title="Delete Car"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-16 px-4 text-center text-neutral-500 space-y-3">
            <CarIcon className="w-12 h-12 mx-auto text-neutral-400" />
            <div>
              <p className="text-sm font-bold text-neutral-800 dark:text-neutral-200">
                {cars.length === 0 ? 'Your inventory is currently empty' : 'No cars match your search'}
              </p>
              <p className="text-xs text-neutral-500 mt-1">
                {cars.length === 0
                  ? 'Add your genuine vehicles one-by-one with photos and specs.'
                  : 'Try switching status tabs or clear your search term.'}
              </p>
            </div>
            {cars.length === 0 && (
              <Link
                href="/admin/inventory/new"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-brand-orange hover:bg-brand-orange-600 text-white shadow-md shadow-brand-orange/20 transition-all active:scale-95"
              >
                <PlusCircle className="w-4 h-4" />
                <span>+ Add Your First Car</span>
              </Link>
            )}
          </div>
        )}
      </div>

    </div>
  );
}
