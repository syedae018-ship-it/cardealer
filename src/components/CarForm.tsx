'use client';

import React, { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Car, VehicleStatus } from '@/lib/types';
import { createCar, updateCar, uploadCarImage } from '@/lib/inventoryService';
import { 
  ArrowLeft, 
  Save, 
  Upload, 
  Trash2, 
  Plus, 
  Check, 
  Car as CarIcon,
  Image as ImageIcon,
  Loader2,
  Camera
} from 'lucide-react';

interface CarFormProps {
  initialData?: Car | null;
  isEdit?: boolean;
}

export function CarForm({ initialData, isEdit = false }: CarFormProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [error, setError] = useState('');

  // Form State
  const [name, setName] = useState(initialData?.name || '');
  const [brand, setBrand] = useState(initialData?.brand || 'Hyundai');
  const [model, setModel] = useState(initialData?.model || '');
  const [variant, setVariant] = useState(initialData?.variant || '');
  const [category, setCategory] = useState(initialData?.category || 'Hatchbacks');
  const [priceNum, setPriceNum] = useState<number>(initialData?.priceValue || 250000);
  const [year, setYear] = useState<number>(initialData?.year || 2014);
  const [fuel, setFuel] = useState(initialData?.fuel || 'Petrol');
  const [transmission, setTransmission] = useState(initialData?.transmission || 'Manual');
  const [owners, setOwners] = useState(initialData?.owners || '1st Owner');
  const [kmDriven, setKmDriven] = useState(initialData?.kmDriven || '60,000 km');
  const [colour, setColour] = useState(initialData?.colour || 'Silver');
  
  // Documents / FC
  const [insurance, setInsurance] = useState(initialData?.insurance || 'Comprehensive');
  const [fc, setFc] = useState(initialData?.fc || 'Valid');
  const [serviceHistory, setServiceHistory] = useState(initialData?.serviceHistory || 'Authorized Dealer History');
  const [keys, setKeys] = useState(initialData?.keys || '2 Keys');
  const [manual, setManual] = useState(initialData?.manual || 'Available');
  const [description, setDescription] = useState(initialData?.description || '');
  const [status, setStatus] = useState<VehicleStatus>(initialData?.status || 'AVAILABLE');
  
  // Images
  const [images, setImages] = useState<string[]>(
    initialData?.images && initialData.images.length > 0 
      ? initialData.images 
      : initialData?.image 
      ? [initialData.image] 
      : []
  );

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadingImage(true);
    setError('');

    try {
      const uploadPromises = Array.from(files).map(file => uploadCarImage(file));
      const uploadedUrls = await Promise.all(uploadPromises);
      setImages(prev => [...prev, ...uploadedUrls]);
    } catch (err: any) {
      setError('Failed to upload image. Please try again.');
    } finally {
      setUploadingImage(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemoveImage = (index: number) => {
    setImages(prev => prev.filter((_, idx) => idx !== index));
  };

  const handleSetPrimary = (index: number) => {
    if (index === 0) return;
    setImages(prev => {
      const copy = [...prev];
      const selected = copy.splice(index, 1)[0];
      return [selected, ...copy];
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Please provide a vehicle display title.');
      return;
    }
    if (images.length === 0) {
      setError('Please add at least one vehicle photograph using the upload button below.');
      return;
    }

    setLoading(true);
    setError('');

    const formattedPrice = `₹${priceNum.toLocaleString('en-IN')}`;

    const carPayload = {
      name,
      brand,
      model: model || name,
      variant,
      category,
      price: formattedPrice,
      priceValue: priceNum,
      year: Number(year),
      fuel,
      transmission,
      owners,
      kmDriven,
      colour,
      insurance,
      fc,
      serviceHistory,
      keys,
      manual,
      description,
      status,
      image: images[0],
      images: images,
      isFeatured: false
    };

    try {
      if (isEdit && initialData) {
        await updateCar(initialData.id, carPayload);
      } else {
        await createCar(carPayload);
      }
      router.push('/admin/inventory');
    } catch (err: any) {
      setError(err?.message || 'Failed to save car. Please try again.');
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl pb-16">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => router.back()}
            className="p-2 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 hover:bg-neutral-100 dark:hover:bg-neutral-800"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="text-2xl font-extrabold text-neutral-900 dark:text-white">
              {isEdit ? `Edit ${initialData?.name}` : 'Add New Showroom Car'}
            </h1>
            <p className="text-xs text-neutral-500">
              Fill in the vehicle specifications, price, and upload photos directly.
            </p>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading || uploadingImage}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-brand-orange hover:bg-brand-orange-600 text-white shadow-md shadow-brand-orange/20 transition-all active:scale-95 disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          <span>{loading ? 'Saving Car...' : isEdit ? 'Save Changes' : 'Publish to Showroom'}</span>
        </button>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-xs font-semibold">
          {error}
        </div>
      )}

      {/* Section 1: Basic Identity & Price */}
      <div className="p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 space-y-5 shadow-sm">
        <h2 className="text-sm font-bold uppercase tracking-wider text-neutral-900 dark:text-white border-b border-neutral-100 dark:border-neutral-800 pb-2">
          1. Vehicle Identity & Pricing
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          
          <div className="sm:col-span-2">
            <label className="block text-xs font-bold uppercase text-neutral-600 dark:text-neutral-400 mb-1.5">
              Full Display Name *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Hyundai i20 Sportz (O) 1.2"
              className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-brand-orange/30 focus:border-brand-orange"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-neutral-600 dark:text-neutral-400 mb-1.5">
              Brand / Make *
            </label>
            <select
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
              aria-label="Brand or Make"
              className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-xs font-medium"
            >
              <option value="Hyundai">Hyundai</option>
              <option value="Maruti Suzuki">Maruti Suzuki</option>
              <option value="Toyota">Toyota</option>
              <option value="Honda">Honda</option>
              <option value="Volkswagen">Volkswagen</option>
              <option value="Mahindra">Mahindra</option>
              <option value="Tata">Tata</option>
              <option value="Renault">Renault</option>
              <option value="Ford">Ford</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-neutral-600 dark:text-neutral-400 mb-1.5">
              Model
            </label>
            <input
              type="text"
              value={model}
              onChange={(e) => setModel(e.target.value)}
              placeholder="e.g. i20, Swift, Innova"
              className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-xs font-medium"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-neutral-600 dark:text-neutral-400 mb-1.5">
              Variant
            </label>
            <input
              type="text"
              value={variant}
              onChange={(e) => setVariant(e.target.value)}
              placeholder="e.g. Sportz 1.2 / VXi / Titanium"
              className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-xs font-medium"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-neutral-600 dark:text-neutral-400 mb-1.5">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              aria-label="Vehicle Category"
              className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-xs font-medium"
            >
              <option value="Hatchbacks">Hatchback</option>
              <option value="Sedans">Sedan</option>
              <option value="SUVs">SUV / MUV</option>
              <option value="Luxury">Luxury</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-neutral-600 dark:text-neutral-400 mb-1.5">
              Price in INR (₹) *
            </label>
            <input
              type="number"
              required
              step="5000"
              value={priceNum}
              onChange={(e) => setPriceNum(Number(e.target.value))}
              className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-xs font-bold text-brand-orange"
            />
            <span className="text-[11px] text-neutral-400 mt-1 block">
              Formatted: <strong className="text-neutral-700 dark:text-neutral-200">₹{priceNum.toLocaleString('en-IN')}</strong>
            </span>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-neutral-600 dark:text-neutral-400 mb-1.5">
              Listing Status *
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as VehicleStatus)}
              aria-label="Listing Status"
              className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-xs font-bold"
            >
              <option value="AVAILABLE">AVAILABLE (Shown on website)</option>
              <option value="RESERVED">RESERVED (Booking token held)</option>
              <option value="SOLD">SOLD (Hidden from public catalog)</option>
              <option value="DRAFT">DRAFT (Inactive / Hidden)</option>
            </select>
          </div>

        </div>
      </div>

      {/* Section 2: Mechanical Specs */}
      <div className="p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 space-y-5 shadow-sm">
        <h2 className="text-sm font-bold uppercase tracking-wider text-neutral-900 dark:text-white border-b border-neutral-100 dark:border-neutral-800 pb-2">
          2. Mechanical & Usage Specifications
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          
          <div>
            <label className="block text-xs font-bold uppercase text-neutral-600 dark:text-neutral-400 mb-1.5">
              Model Year *
            </label>
            <input
              type="number"
              min="2005"
              max="2026"
              value={year}
              onChange={(e) => setYear(Number(e.target.value))}
              className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-xs font-medium"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-neutral-600 dark:text-neutral-400 mb-1.5">
              Fuel Type *
            </label>
            <select
              value={fuel}
              onChange={(e) => setFuel(e.target.value)}
              aria-label="Fuel Type"
              className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-xs font-medium"
            >
              <option value="Petrol">Petrol</option>
              <option value="Diesel">Diesel</option>
              <option value="CNG">CNG</option>
              <option value="Electric">Electric</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-neutral-600 dark:text-neutral-400 mb-1.5">
              Transmission *
            </label>
            <select
              value={transmission}
              onChange={(e) => setTransmission(e.target.value)}
              aria-label="Transmission"
              className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-xs font-medium"
            >
              <option value="Manual">Manual</option>
              <option value="Automatic">Automatic</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-neutral-600 dark:text-neutral-400 mb-1.5">
              Ownership *
            </label>
            <select
              value={owners}
              onChange={(e) => setOwners(e.target.value)}
              aria-label="Ownership count"
              className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-xs font-medium"
            >
              <option value="1st Owner">1st Owner</option>
              <option value="2nd Owner">2nd Owner</option>
              <option value="3rd Owner">3rd Owner</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-neutral-600 dark:text-neutral-400 mb-1.5">
              Kilometers Driven
            </label>
            <input
              type="text"
              value={kmDriven}
              onChange={(e) => setKmDriven(e.target.value)}
              placeholder="e.g. 64,000 km"
              className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-xs font-medium"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-neutral-600 dark:text-neutral-400 mb-1.5">
              Exterior Colour
            </label>
            <input
              type="text"
              value={colour}
              onChange={(e) => setColour(e.target.value)}
              placeholder="e.g. Silver, White, Black"
              className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-xs font-medium"
            />
          </div>

        </div>
      </div>

      {/* Section 3: Documents & Condition */}
      <div className="p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 space-y-5 shadow-sm">
        <h2 className="text-sm font-bold uppercase tracking-wider text-neutral-900 dark:text-white border-b border-neutral-100 dark:border-neutral-800 pb-2">
          3. Documentation & Verification Checklist
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          
          <div>
            <label className="block text-xs font-bold uppercase text-neutral-600 dark:text-neutral-400 mb-1.5">
              Insurance Status
            </label>
            <input
              type="text"
              value={insurance}
              onChange={(e) => setInsurance(e.target.value)}
              placeholder="e.g. Comprehensive valid till Nov 2025"
              className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-xs font-medium"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-neutral-600 dark:text-neutral-400 mb-1.5">
              Fitness Certificate (FC)
            </label>
            <input
              type="text"
              value={fc}
              onChange={(e) => setFc(e.target.value)}
              placeholder="e.g. Valid till 2029"
              className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-xs font-medium"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-neutral-600 dark:text-neutral-400 mb-1.5">
              Service History
            </label>
            <input
              type="text"
              value={serviceHistory}
              onChange={(e) => setServiceHistory(e.target.value)}
              placeholder="e.g. Full Authorized Service Records"
              className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-xs font-medium"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-neutral-600 dark:text-neutral-400 mb-1.5">
              Keys
            </label>
            <input
              type="text"
              value={keys}
              onChange={(e) => setKeys(e.target.value)}
              placeholder="e.g. 2 Original Keys"
              className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-xs font-medium"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-bold uppercase text-neutral-600 dark:text-neutral-400 mb-1.5">
              Vehicle Overview & Condition Summary
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the car condition, drive feel, tyres, AC chilling, and overall state for buyers..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-xs font-medium"
            />
          </div>

        </div>
      </div>

      {/* Section 4: Direct Vehicle Photo Upload */}
      <div className="p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 space-y-5 shadow-sm">
        <div className="flex items-center justify-between border-b border-neutral-100 dark:border-neutral-800 pb-2">
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-neutral-900 dark:text-white">
              4. Vehicle Photographs ({images.length})
            </h2>
            <p className="text-xs text-neutral-500">Upload photos directly from your phone camera or laptop storage</p>
          </div>
          <span className="text-xs text-neutral-400">First image will be the primary cover</span>
        </div>

        {/* Hidden File Input */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileUpload}
          accept="image/*"
          multiple
          className="hidden"
        />

        {/* Upload Dropzone */}
        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-neutral-300 dark:border-neutral-700 hover:border-brand-orange dark:hover:border-brand-orange rounded-2xl p-8 text-center cursor-pointer transition-colors bg-neutral-50/50 dark:bg-neutral-950/50 flex flex-col items-center justify-center gap-3"
        >
          <div className="w-12 h-12 rounded-2xl bg-brand-orange-100 dark:bg-brand-orange-950/60 text-brand-orange flex items-center justify-center shadow-sm">
            {uploadingImage ? <Loader2 className="w-6 h-6 animate-spin" /> : <Camera className="w-6 h-6" />}
          </div>
          <div className="space-y-1">
            <p className="text-sm font-bold text-neutral-900 dark:text-white">
              {uploadingImage ? 'Uploading image to Supabase storage...' : 'Click to Upload Photos from Phone / Device'}
            </p>
            <p className="text-xs text-neutral-500">
              Supports JPEG, PNG, WEBP (Multiple files allowed)
            </p>
          </div>
        </div>

        {/* Photo Gallery Grid */}
        {images.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
            {images.map((src, index) => (
              <div
                key={index}
                className="relative aspect-[4/3] rounded-xl overflow-hidden border border-neutral-200 dark:border-neutral-800 group bg-neutral-100 dark:bg-neutral-800"
              >
                <Image src={src} alt="Preview" fill className="object-cover" />
                
                {index === 0 ? (
                  <span className="absolute top-2 left-2 px-2 py-0.5 rounded text-[10px] font-bold bg-brand-orange text-white shadow-sm">
                    COVER IMAGE
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleSetPrimary(index)}
                    className="absolute top-2 left-2 px-2 py-0.5 rounded text-[10px] font-bold bg-black/70 text-white opacity-0 group-hover:opacity-100 hover:bg-brand-orange transition-all"
                  >
                    Set as Cover
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => handleRemoveImage(index)}
                  className="absolute top-2 right-2 p-1.5 rounded-lg bg-black/70 text-white hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100"
                  title="Remove photo"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Bottom Save Action */}
      <div className="flex justify-end gap-3 pt-4">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-5 py-2.5 rounded-xl text-xs font-bold bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading || uploadingImage}
          className="px-6 py-2.5 rounded-xl text-xs font-bold bg-brand-orange hover:bg-brand-orange-600 text-white shadow-md shadow-brand-orange/20 flex items-center gap-2 active:scale-95 disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          <span>{loading ? 'Saving...' : isEdit ? 'Update Vehicle' : 'Save & Publish to Showroom'}</span>
        </button>
      </div>

    </form>
  );
}
