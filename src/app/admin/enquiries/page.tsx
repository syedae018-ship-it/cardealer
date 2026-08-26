'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  MessageSquare, 
  MessageCircle, 
  Phone, 
  CheckCircle2, 
  Clock, 
  ExternalLink,
  Search,
  Filter
} from 'lucide-react';
import { fetchEnquiries, updateEnquiryStatus } from '@/lib/inventoryService';
import { Enquiry } from '@/lib/types';

export default function AdminEnquiriesPage() {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');

  useEffect(() => {
    loadEnquiries();
  }, []);

  async function loadEnquiries() {
    setLoading(true);
    const data = await fetchEnquiries();
    setEnquiries(data);
    setLoading(false);
  }

  const handleStatusChange = async (id: string, newStatus: 'New' | 'Contacted' | 'Closed') => {
    await updateEnquiryStatus(id, newStatus);
    setEnquiries(prev => prev.map(e => e.id === id ? { ...e, status: newStatus } : e));
  };

  const filtered = enquiries.filter(e => {
    if (filterStatus !== 'ALL' && e.status !== filterStatus) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        e.customerName.toLowerCase().includes(q) ||
        (e.carName && e.carName.toLowerCase().includes(q)) ||
        e.message.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-neutral-900 dark:text-white">
            Customer WhatsApp Enquiries
          </h1>
          <p className="text-xs text-neutral-500 mt-0.5">
            Track customer questions, test drive requests, and token inquiries.
          </p>
        </div>
      </div>

      {/* Filter Controls */}
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
        
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search leads by customer name, car or message..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-brand-orange/30 focus:border-brand-orange"
          />
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-neutral-500">Status:</span>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            aria-label="Filter enquiries by status"
            className="px-3 py-2 rounded-xl text-xs font-bold border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-neutral-800 dark:text-neutral-200"
          >
            <option value="ALL">All Statuses ({enquiries.length})</option>
            <option value="New">New / Pending ({enquiries.filter(e => e.status === 'New').length})</option>
            <option value="Contacted">Contacted ({enquiries.filter(e => e.status === 'Contacted').length})</option>
            <option value="Closed">Closed</option>
          </select>
        </div>

      </div>

      {/* Enquiries List */}
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl overflow-hidden shadow-sm">
        {loading ? (
          <div className="p-12 text-center text-xs font-bold text-neutral-500">Loading enquiries...</div>
        ) : filtered.length > 0 ? (
          <div className="divide-y divide-neutral-100 dark:divide-neutral-800/80">
            {filtered.map((enq) => {
              const date = new Date(enq.timestamp);
              const timeStr = date.toLocaleDateString('en-IN', {
                day: 'numeric',
                month: 'short',
                hour: '2-digit',
                minute: '2-digit'
              });

              return (
                <div key={enq.id} className="p-5 flex flex-col sm:flex-row sm:items-start justify-between gap-4 hover:bg-neutral-50 dark:hover:bg-neutral-800/40 transition-colors">
                  
                  <div className="space-y-2 flex-1">
                    <div className="flex flex-wrap items-center gap-2.5">
                      <span className="font-bold text-sm text-neutral-900 dark:text-white">
                        {enq.customerName}
                      </span>
                      {enq.customerPhone && (
                        <span className="text-xs text-neutral-500 font-medium">
                          {enq.customerPhone}
                        </span>
                      )}
                      <span className="text-[11px] text-neutral-400">
                        &bull; {timeStr}
                      </span>
                    </div>

                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-orange-50 dark:bg-orange-950/60 border border-orange-200 dark:border-orange-900/40 text-brand-orange text-xs font-bold">
                      <span>Vehicle: {enq.carName || 'General Enquiry'}</span>
                    </div>

                    <p className="text-xs text-neutral-700 dark:text-neutral-300 bg-neutral-50 dark:bg-neutral-950 p-3.5 rounded-xl border border-neutral-100 dark:border-neutral-800/60 whitespace-pre-line leading-relaxed">
                      {enq.message}
                    </p>
                  </div>

                  {/* Actions & Status Changer */}
                  <div className="flex sm:flex-col items-center sm:items-end gap-3 shrink-0">
                    <select
                      value={enq.status}
                      onChange={(e) => handleStatusChange(enq.id, e.target.value as any)}
                      aria-label="Change enquiry status"
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold border focus:outline-none ${
                        enq.status === 'New'
                          ? 'bg-red-50 text-red-700 border-red-200 dark:bg-red-950 dark:text-red-400'
                          : enq.status === 'Contacted'
                          ? 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-400'
                          : 'bg-neutral-100 text-neutral-600 border-neutral-200 dark:bg-neutral-800 dark:text-neutral-400'
                      }`}
                    >
                      <option value="New">New</option>
                      <option value="Contacted">Contacted</option>
                      <option value="Closed">Closed</option>
                    </select>

                    <a
                      href={`https://wa.me/919999999999?text=${encodeURIComponent(`Hi ${enq.customerName}, this is Syed Sabeer Riyaz from Quality Used Cars. Regarding your inquiry about the ${enq.carName || 'car'}:`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm transition-all"
                    >
                      <MessageCircle className="w-4 h-4 fill-current" />
                      <span>Reply on WhatsApp</span>
                    </a>
                  </div>

                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-16 text-center text-neutral-500">
            <MessageSquare className="w-10 h-10 mx-auto mb-2 text-neutral-400" />
            <p className="text-sm font-bold text-neutral-800 dark:text-neutral-200">No enquiries found</p>
          </div>
        )}
      </div>

    </div>
  );
}
