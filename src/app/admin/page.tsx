'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Car as CarIcon, 
  PlusCircle, 
  MessageSquare, 
  Clock, 
  TrendingUp, 
  CheckCircle2, 
  Sparkles, 
  ArrowUpRight, 
  MessageCircle,
  ExternalLink,
  ShieldCheck,
  Eye,
  Flame,
  AlertTriangle,
  MousePointerClick,
  Users,
  Activity
} from 'lucide-react';
import { fetchCars, fetchEnquiries, fetchAnalyticsStats } from '@/lib/inventoryService';
import { Car, Enquiry, AnalyticsStats } from '@/lib/types';

export default function AdminDashboardOverview() {
  const [cars, setCars] = useState<Car[]>([]);
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [analytics, setAnalytics] = useState<AnalyticsStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    const [c, e, a] = await Promise.all([
      fetchCars(), 
      fetchEnquiries(), 
      fetchAnalyticsStats()
    ]);
    setCars(c);
    setEnquiries(e);
    setAnalytics(a);
    setLoading(false);
  }

  const activeCars = cars.filter(c => c.status === 'AVAILABLE');
  const totalValue = activeCars.reduce((acc, curr) => acc + (curr.priceValue || 0), 0);
  const totalValueLakhs = (totalValue / 100000).toFixed(1);

  return (
    <div className="space-y-8 pb-12">
      
      {/* Header & Quick Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 dark:text-white">
              Syed Sabeer Riyaz &bull; Dealership Dashboard
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mt-1">
            Real-time showroom analytics, customer interest tracking, and WhatsApp leads.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            href="/admin/inventory/new"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-brand-orange hover:bg-brand-orange-600 text-white shadow-md shadow-brand-orange/20 transition-all active:scale-95"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add New Car</span>
          </Link>

          <Link
            href="/"
            target="_blank"
            className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-bold bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-800 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
          >
            <span>View Public Site</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* 4 Live Analytics Metrics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        
        {/* Total & Today Visits */}
        <div className="p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider">Website Visitors</span>
            <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-950/60 text-blue-600 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-neutral-900 dark:text-white font-poppins">
            {analytics?.totalVisits || 0}
          </div>
          <div className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
            <Activity className="w-3 h-3" />
            <span>+{analytics?.todayVisits || 0} today</span>
          </div>
        </div>

        {/* Total Car Detailed Views */}
        <div className="p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider">Car Inspections</span>
            <div className="w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-950/60 text-purple-600 flex items-center justify-center">
              <Eye className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-neutral-900 dark:text-white font-poppins">
            {analytics?.totalCarViews || 0}
          </div>
          <p className="text-[11px] text-neutral-400 font-medium">Vehicle page opens</p>
        </div>

        {/* WhatsApp Click Conversions */}
        <div className="p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider">WhatsApp Clicks</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center">
              <MousePointerClick className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-neutral-900 dark:text-white font-poppins">
            {analytics?.totalWhatsAppClicks || 0}
          </div>
          <p className="text-[11px] text-neutral-400 font-medium">
            {enquiries.length} logged message leads
          </p>
        </div>

        {/* Active Inventory Value */}
        <div className="p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider">Active Inventory</span>
            <div className="w-8 h-8 rounded-lg bg-orange-100 dark:bg-orange-950/60 text-brand-orange flex items-center justify-center">
              <CarIcon className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-neutral-900 dark:text-white font-poppins">
            {activeCars.length} <span className="text-sm font-normal text-neutral-400">(₹{totalValueLakhs}L)</span>
          </div>
          <p className="text-[11px] text-neutral-400 font-medium">Live on showroom</p>
        </div>

      </div>

      {/* Analytics Insights: Most Viewed vs Ignored Cars */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Most Viewed Cars (Hot Leads) (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Flame className="w-5 h-5 text-brand-orange" />
              <div>
                <h2 className="text-base sm:text-lg font-bold text-neutral-900 dark:text-white">
                  Most Viewed Cars (Highest Customer Interest)
                </h2>
                <p className="text-xs text-neutral-500">Cars attracting the most traffic and WhatsApp bookings</p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 divide-y divide-neutral-100 dark:divide-neutral-800/80 overflow-hidden shadow-sm">
            {analytics?.mostViewedCars && analytics.mostViewedCars.length > 0 ? (
              analytics.mostViewedCars.slice(0, 5).map((carItem, rank) => (
                <div key={carItem.id} className="p-4 flex items-center justify-between gap-4 hover:bg-neutral-50 dark:hover:bg-neutral-800/40 transition-colors">
                  
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black shrink-0 ${
                      rank === 0 ? 'bg-amber-400 text-neutral-950 shadow-sm' : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600'
                    }`}>
                      #{rank + 1}
                    </div>
                    
                    <div className="relative w-12 h-10 rounded-lg overflow-hidden bg-neutral-100 dark:bg-neutral-800 shrink-0">
                      <Image src={carItem.image} alt={carItem.name} fill className="object-cover" />
                    </div>

                    <div className="min-w-0">
                      <div className="font-bold text-xs text-neutral-900 dark:text-white truncate">
                        {carItem.name}
                      </div>
                      <div className="text-[11px] text-neutral-500 font-medium">
                        {carItem.price} &bull; <span className="uppercase text-[10px] font-bold text-emerald-600">{carItem.status}</span>
                      </div>
                    </div>
                  </div>

                  {/* View & Click Badges */}
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 text-xs font-bold">
                      <Eye className="w-3.5 h-3.5 text-neutral-500" />
                      <span>{carItem.views} views</span>
                    </span>
                    
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 text-xs font-bold border border-emerald-200 dark:border-emerald-800">
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>{carItem.clicks} clicks</span>
                    </span>
                  </div>

                </div>
              ))
            ) : (
              <div className="p-8 text-center text-xs text-neutral-500 space-y-2">
                <p className="font-semibold">No cars added to inventory yet.</p>
                <Link href="/admin/inventory/new" className="inline-block text-brand-orange font-bold hover:underline">
                  + Add your first vehicle &rarr;
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Low-Interest / Ignored Cars Alert (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-500" />
            <div>
              <h2 className="text-base sm:text-lg font-bold text-neutral-900 dark:text-white">
                Low-Interest Cars (Action Needed)
              </h2>
              <p className="text-xs text-neutral-500">Active cars with low views</p>
            </div>
          </div>

          <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 divide-y divide-neutral-100 dark:divide-neutral-800/80 overflow-hidden shadow-sm">
            {analytics?.lowViewedCars && analytics.lowViewedCars.length > 0 ? (
              analytics.lowViewedCars.slice(0, 4).map((carItem) => (
                <div key={carItem.id} className="p-3.5 flex items-center justify-between gap-3 hover:bg-neutral-50 dark:hover:bg-neutral-800/40 transition-colors">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="relative w-10 h-8 rounded-lg overflow-hidden bg-neutral-100 dark:bg-neutral-800 shrink-0">
                      <Image src={carItem.image} alt={carItem.name} fill className="object-cover" />
                    </div>
                    <div className="min-w-0">
                      <div className="font-bold text-xs text-neutral-900 dark:text-white truncate">
                        {carItem.name}
                      </div>
                      <div className="text-[11px] text-brand-orange font-bold font-poppins">
                        {carItem.price}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[11px] font-bold text-neutral-400">
                      {carItem.views} views
                    </span>
                    <Link
                      href={`/admin/inventory/${carItem.id}/edit`}
                      className="px-2 py-1 rounded-lg text-[11px] font-bold bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 hover:bg-neutral-200"
                    >
                      Edit
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-xs text-neutral-500">
                All inventory items healthy.
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Customer WhatsApp Inquiries Stream */}
      <div className="space-y-4 pt-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-neutral-900 dark:text-white">
              Recent WhatsApp Inquiries
            </h2>
            <p className="text-xs text-neutral-500">Live lead submissions from customers</p>
          </div>
          <Link
            href="/admin/enquiries"
            className="text-xs font-bold text-brand-orange hover:underline flex items-center gap-1"
          >
            <span>View All ({enquiries.length})</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 divide-y divide-neutral-100 dark:divide-neutral-800/80 overflow-hidden shadow-sm">
          {enquiries.length > 0 ? (
            enquiries.slice(0, 3).map((enq) => {
              const carMatch = cars.find(c => c.id === enq.carId);
              return (
                <div key={enq.id} className="p-4 sm:p-5 flex items-start justify-between gap-4 hover:bg-neutral-50 dark:hover:bg-neutral-800/40 transition-colors">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-neutral-900 dark:text-white">{enq.customerName}</span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        enq.status === 'New'
                          ? 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400'
                          : 'bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400'
                      }`}>
                        {enq.status}
                      </span>
                    </div>
                    <div className="text-xs font-semibold text-brand-orange">
                      Vehicle: {enq.carName || (carMatch ? carMatch.name : 'General Enquiry')}
                    </div>
                    <p className="text-xs text-neutral-600 dark:text-neutral-400 line-clamp-2 mt-1">
                      {enq.message}
                    </p>
                  </div>

                  <a
                    href={`https://wa.me/919999999999?text=${encodeURIComponent(`Hi ${enq.customerName}, this is Syed Sabeer Riyaz from Quality Used Cars following up on your enquiry.`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-600 hover:text-white transition-colors shrink-0"
                    title="Reply on WhatsApp"
                  >
                    <MessageCircle className="w-4 h-4 fill-current" />
                  </a>
                </div>
              );
            })
          ) : (
            <div className="p-8 text-center text-xs text-neutral-500">
              No customer inquiries yet. Leads from website WhatsApp clicks will appear here.
            </div>
          )}
        </div>
      </div>

    </div>
  );
}
