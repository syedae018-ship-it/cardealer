import { supabase, isSupabaseConfigured } from './supabase';
import { Car, DealershipSettings, Enquiry, FilterState, AnalyticsStats } from './types';
import { INITIAL_INVENTORY, INITIAL_ENQUIRIES, INITIAL_SETTINGS } from './mockData';

const STORAGE_KEYS = {
  CARS: 'quality_used_cars_inventory_v5_six_cars',
  ENQUIRIES: 'quality_used_cars_enquiries_v5_clean',
  SETTINGS: 'quality_used_cars_settings_v5_clean',
  ANALYTICS: 'quality_used_cars_analytics_v5_clean',
};

// --- Local Storage Helpers ---
function getLocalCars(): Car[] {
  if (typeof window === 'undefined') return INITIAL_INVENTORY;
  try {
    const data = localStorage.getItem(STORAGE_KEYS.CARS);
    if (!data) {
      localStorage.setItem(STORAGE_KEYS.CARS, JSON.stringify(INITIAL_INVENTORY));
      return INITIAL_INVENTORY;
    }
    const parsed = JSON.parse(data);
    return Array.isArray(parsed) ? parsed : INITIAL_INVENTORY;
  } catch {
    return INITIAL_INVENTORY;
  }
}

function saveLocalCars(cars: Car[]) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEYS.CARS, JSON.stringify(cars));
  } catch (e) {
    console.error('Error saving local cars', e);
  }
}

function getLocalEnquiries(): Enquiry[] {
  if (typeof window === 'undefined') return INITIAL_ENQUIRIES;
  try {
    const data = localStorage.getItem(STORAGE_KEYS.ENQUIRIES);
    if (!data) {
      localStorage.setItem(STORAGE_KEYS.ENQUIRIES, JSON.stringify(INITIAL_ENQUIRIES));
      return INITIAL_ENQUIRIES;
    }
    return JSON.parse(data);
  } catch {
    return INITIAL_ENQUIRIES;
  }
}

function saveLocalEnquiries(enquiries: Enquiry[]) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEYS.ENQUIRIES, JSON.stringify(enquiries));
  } catch (e) {
    console.error('Error saving local enquiries', e);
  }
}

function getLocalSettings(): DealershipSettings {
  if (typeof window === 'undefined') return INITIAL_SETTINGS;
  try {
    const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (!data) return INITIAL_SETTINGS;
    return JSON.parse(data);
  } catch {
    return INITIAL_SETTINGS;
  }
}

function saveLocalSettings(settings: DealershipSettings) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  } catch (e) {
    console.error('Error saving local settings', e);
  }
}

interface LocalAnalytics {
  visits: { timestamp: string; path: string }[];
  carViews: { carId: string; timestamp: string }[];
  whatsappClicks: { carId?: string; timestamp: string }[];
}

function getLocalAnalytics(): LocalAnalytics {
  if (typeof window === 'undefined') return { visits: [], carViews: [], whatsappClicks: [] };
  try {
    const data = localStorage.getItem(STORAGE_KEYS.ANALYTICS);
    if (!data) {
      const fresh: LocalAnalytics = {
        visits: [],
        carViews: [],
        whatsappClicks: []
      };
      localStorage.setItem(STORAGE_KEYS.ANALYTICS, JSON.stringify(fresh));
      return fresh;
    }
    return JSON.parse(data);
  } catch {
    return { visits: [], carViews: [], whatsappClicks: [] };
  }
}

function saveLocalAnalytics(data: LocalAnalytics) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEYS.ANALYTICS, JSON.stringify(data));
  } catch (e) {
    console.error('Error saving local analytics', e);
  }
}

// --- Image Upload to Supabase Storage ---

export async function uploadCarImage(file: File): Promise<string> {
  // 1. Try server-side upload API first
  try {
    const formData = new FormData();
    formData.append('file', file);

    const res = await fetch('/api/upload', {
      method: 'POST',
      body: formData
    });

    if (res.ok) {
      const result = await res.json();
      if (result.success && result.url) {
        return result.url;
      }
    }
  } catch (err) {
    console.warn('API upload error, trying client Supabase fallback:', err);
  }

  // 2. Try direct Supabase client upload
  if (isSupabaseConfigured() && supabase) {
    try {
      const ext = file.name.split('.').pop() || 'jpg';
      const fileName = `car_${Date.now()}_${Math.random().toString(36).substring(2, 8)}.${ext}`;
      const { data, error } = await supabase.storage.from('car-images').upload(fileName, file, {
        cacheControl: '3600',
        upsert: true
      });

      if (!error && data) {
        const { data: publicUrlData } = supabase.storage.from('car-images').getPublicUrl(fileName);
        if (publicUrlData?.publicUrl) {
          return publicUrlData.publicUrl;
        }
      }
    } catch (err) {
      console.warn('Supabase storage upload failed, falling back to base64:', err);
    }
  }

  // 3. Fallback: Convert file directly to Base64 data URL for local storage
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// --- Analytics Tracking ---

export async function recordPageView(path: string = '/'): Promise<void> {
  if (isSupabaseConfigured() && supabase) {
    try {
      await supabase.from('analytics_events').insert([{
        event_type: 'page_view',
        page_path: path
      }]);
    } catch (err) {
      // ignore
    }
  }

  const local = getLocalAnalytics();
  local.visits.push({ timestamp: new Date().toISOString(), path });
  saveLocalAnalytics(local);
}

export async function recordCarView(carId: string): Promise<void> {
  if (isSupabaseConfigured() && supabase) {
    try {
      await supabase.rpc('increment_car_view', { car_id_param: carId });
    } catch (err) {
      // ignore
    }
  }

  // Local sync
  const local = getLocalAnalytics();
  local.carViews.push({ carId, timestamp: new Date().toISOString() });
  saveLocalAnalytics(local);

  const cars = getLocalCars();
  const target = cars.find(c => c.id === carId);
  if (target) {
    target.viewsCount = (target.viewsCount || 0) + 1;
    saveLocalCars(cars);
  }
}

export async function recordWhatsAppClick(carId?: string, carName?: string): Promise<void> {
  if (isSupabaseConfigured() && supabase) {
    try {
      await supabase.rpc('increment_whatsapp_click', {
        car_id_param: carId || null,
        car_name_param: carName || null
      });
    } catch (err) {
      // ignore
    }
  }

  const local = getLocalAnalytics();
  local.whatsappClicks.push({ carId, timestamp: new Date().toISOString() });
  saveLocalAnalytics(local);

  if (carId) {
    const cars = getLocalCars();
    const target = cars.find(c => c.id === carId);
    if (target) {
      target.whatsappClicks = (target.whatsappClicks || 0) + 1;
      saveLocalCars(cars);
    }
  }
}

export async function fetchAnalyticsStats(): Promise<AnalyticsStats> {
  const cars = await fetchCars();
  const local = getLocalAnalytics();

  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();

  let totalVisits = local.visits.length;
  let todayVisits = local.visits.filter(v => new Date(v.timestamp).getTime() >= startOfToday).length;
  let totalCarViews = local.carViews.length;
  let totalWhatsAppClicks = local.whatsappClicks.length;

  if (isSupabaseConfigured() && supabase) {
    try {
      const { data: events } = await supabase.from('analytics_events').select('*');
      if (events && events.length > 0) {
        totalVisits = events.filter(e => e.event_type === 'page_view').length;
        todayVisits = events.filter(e => e.event_type === 'page_view' && new Date(e.created_at).getTime() >= startOfToday).length;
        totalCarViews = events.filter(e => e.event_type === 'car_view').length;
        totalWhatsAppClicks = events.filter(e => e.event_type === 'whatsapp_click').length;
      }
    } catch (e) {
      // fallback
    }
  }

  // Calculate views per car
  const carViewCounts: Record<string, { views: number; clicks: number }> = {};
  cars.forEach(c => {
    carViewCounts[c.id] = { views: c.viewsCount || 0, clicks: c.whatsappClicks || 0 };
  });

  local.carViews.forEach(cv => {
    if (carViewCounts[cv.carId]) {
      carViewCounts[cv.carId].views += 1;
    }
  });

  local.whatsappClicks.forEach(wc => {
    if (wc.carId && carViewCounts[wc.carId]) {
      carViewCounts[wc.carId].clicks += 1;
    }
  });

  const rankedCars = cars.map(car => ({
    id: car.id,
    name: car.name,
    views: carViewCounts[car.id]?.views || 0,
    clicks: carViewCounts[car.id]?.clicks || 0,
    price: car.price,
    image: car.image,
    status: car.status
  }));

  const mostViewedCars = [...rankedCars].sort((a, b) => b.views - a.views);
  const lowViewedCars = [...rankedCars].filter(c => c.status === 'AVAILABLE').sort((a, b) => a.views - b.views);

  return {
    totalVisits,
    todayVisits,
    totalCarViews,
    totalWhatsAppClicks,
    mostViewedCars,
    lowViewedCars
  };
}

// --- Service API ---

export async function fetchCars(filters?: Partial<FilterState>): Promise<Car[]> {
  // 1. Try server-side API first (guaranteed cloud sync on mobile & desktop)
  try {
    const res = await fetch('/api/cars', { cache: 'no-store' });
    if (res.ok) {
      const result = await res.json();
      if (result.success && Array.isArray(result.data)) {
        if (result.data.length > 0) {
          return result.data.map((item: any) => ({
            id: item.id,
            name: item.name,
            brand: item.brand,
            model: item.model,
            variant: item.variant,
            category: item.category,
            price: item.price,
            priceValue: Number(item.price_value),
            year: item.year,
            fuel: item.fuel,
            transmission: item.transmission,
            owners: item.owners,
            kmDriven: item.km_driven,
            colour: item.colour,
            insurance: item.insurance,
            fc: item.fc,
            serviceHistory: item.service_history,
            keys: item.keys,
            manual: item.manual,
            description: item.description,
            status: item.status,
            image: item.image,
            images: item.images || [item.image],
            isFeatured: item.is_featured,
            viewsCount: item.views_count || 0,
            whatsappClicks: item.whatsapp_clicks || 0,
            createdAt: item.created_at,
            updatedAt: item.updated_at
          }));
        }
      }
    }
  } catch (apiErr) {
    console.warn('API fetch failed, falling back to direct Supabase:', apiErr);
  }

  // 2. Direct Supabase client fallback
  if (isSupabaseConfigured() && supabase) {
    try {
      let query = supabase.from('cars').select('*').order('created_at', { ascending: false });
      const { data, error } = await query;
      if (error) throw error;
      if (data && data.length > 0) {
        return data.map(item => ({
          id: item.id,
          name: item.name,
          brand: item.brand,
          model: item.model,
          variant: item.variant,
          category: item.category,
          price: item.price,
          priceValue: Number(item.price_value),
          year: item.year,
          fuel: item.fuel,
          transmission: item.transmission,
          owners: item.owners,
          kmDriven: item.km_driven,
          colour: item.colour,
          insurance: item.insurance,
          fc: item.fc,
          serviceHistory: item.service_history,
          keys: item.keys,
          manual: item.manual,
          description: item.description,
          status: item.status,
          image: item.image,
          images: item.images || [item.image],
          isFeatured: item.is_featured,
          viewsCount: item.views_count || 0,
          whatsappClicks: item.whatsapp_clicks || 0,
          createdAt: item.created_at,
          updatedAt: item.updated_at
        }));
      }
    } catch (err) {
      console.warn('Supabase fetch failed, falling back to local store:', err);
    }
  }

  // Fallback to local store
  let cars = getLocalCars();

  if (filters) {
    if (filters.search) {
      const q = filters.search.toLowerCase();
      cars = cars.filter(c => 
        c.name.toLowerCase().includes(q) ||
        c.brand.toLowerCase().includes(q) ||
        c.model.toLowerCase().includes(q) ||
        (c.variant && c.variant.toLowerCase().includes(q))
      );
    }
    if (filters.category && filters.category !== 'All') {
      if (filters.category === 'Under ₹3L') {
        cars = cars.filter(c => c.priceValue < 300000);
      } else {
        cars = cars.filter(c => c.category.toLowerCase() === filters.category!.toLowerCase());
      }
    }
    if (filters.brand && filters.brand !== 'All') {
      cars = cars.filter(c => c.brand.toLowerCase() === filters.brand!.toLowerCase());
    }
    if (filters.fuel && filters.fuel !== 'All') {
      cars = cars.filter(c => c.fuel.toLowerCase() === filters.fuel!.toLowerCase());
    }
    if (filters.transmission && filters.transmission !== 'All') {
      cars = cars.filter(c => c.transmission.toLowerCase() === filters.transmission!.toLowerCase());
    }
    if (filters.budget && filters.budget !== 'All') {
      if (filters.budget === 'under3') cars = cars.filter(c => c.priceValue < 300000);
      if (filters.budget === '3to6') cars = cars.filter(c => c.priceValue >= 300000 && c.priceValue <= 600000);
      if (filters.budget === 'over6') cars = cars.filter(c => c.priceValue > 600000);
    }

    if (filters.sort) {
      cars.sort((a, b) => {
        if (filters.sort === 'price-low') return a.priceValue - b.priceValue;
        if (filters.sort === 'price-high') return b.priceValue - a.priceValue;
        if (filters.sort === 'year-newest') return b.year - a.year;
        return 0;
      });
    }
  }

  return cars;
}

export async function fetchCarById(id: string): Promise<Car | null> {
  if (isSupabaseConfigured() && supabase) {
    try {
      const { data, error } = await supabase.from('cars').select('*').eq('id', id).single();
      if (!error && data) {
        return {
          id: data.id,
          name: data.name,
          brand: data.brand,
          model: data.model,
          variant: data.variant,
          category: data.category,
          price: data.price,
          priceValue: Number(data.price_value),
          year: data.year,
          fuel: data.fuel,
          transmission: data.transmission,
          owners: data.owners,
          kmDriven: data.km_driven,
          colour: data.colour,
          insurance: data.insurance,
          fc: data.fc,
          serviceHistory: data.service_history,
          keys: data.keys,
          manual: data.manual,
          description: data.description,
          status: data.status,
          image: data.image,
          images: data.images || [data.image],
          isFeatured: data.is_featured,
          viewsCount: data.views_count || 0,
          whatsappClicks: data.whatsapp_clicks || 0
        };
      }
    } catch (err) {
      console.warn('Supabase get car failed, falling back:', err);
    }
  }

  const cars = getLocalCars();
  return cars.find(c => c.id === id) || null;
}

export async function createCar(carData: Omit<Car, 'id'>): Promise<Car> {
  const newId = Date.now().toString();
  const newCar: Car = {
    ...carData,
    id: newId,
    viewsCount: 0,
    whatsappClicks: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  const payload = {
    name: newCar.name,
    brand: newCar.brand,
    model: newCar.model,
    variant: newCar.variant,
    category: newCar.category,
    price: newCar.price,
    price_value: newCar.priceValue,
    year: newCar.year,
    fuel: newCar.fuel,
    transmission: newCar.transmission,
    owners: newCar.owners,
    km_driven: newCar.kmDriven,
    colour: newCar.colour,
    insurance: newCar.insurance,
    fc: newCar.fc,
    service_history: newCar.serviceHistory,
    keys: newCar.keys,
    manual: newCar.manual,
    description: newCar.description,
    status: newCar.status,
    image: newCar.image,
    images: newCar.images,
    is_featured: newCar.isFeatured || false
  };

  // 1. Try server-side API first
  try {
    const res = await fetch('/api/cars', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (res.ok) {
      const result = await res.json();
      if (result.success && result.data) {
        newCar.id = result.data.id;
      }
    }
  } catch (apiErr) {
    console.warn('API create failed, trying client Supabase fallback:', apiErr);

    // 2. Client fallback
    if (isSupabaseConfigured() && supabase) {
      try {
        const { data, error } = await supabase.from('cars').insert([payload]).select().single();
        if (!error && data) {
          newCar.id = data.id;
        }
      } catch (err) {
        console.warn('Supabase create failed:', err);
      }
    }
  }

  // 3. Update local store
  const local = getLocalCars();
  local.unshift(newCar);
  saveLocalCars(local);
  return newCar;
}

export async function updateCar(id: string, updates: Partial<Car>): Promise<Car | null> {
  const dbUpdates: any = {};
  if (updates.name !== undefined) dbUpdates.name = updates.name;
  if (updates.brand !== undefined) dbUpdates.brand = updates.brand;
  if (updates.model !== undefined) dbUpdates.model = updates.model;
  if (updates.variant !== undefined) dbUpdates.variant = updates.variant;
  if (updates.category !== undefined) dbUpdates.category = updates.category;
  if (updates.price !== undefined) dbUpdates.price = updates.price;
  if (updates.priceValue !== undefined) dbUpdates.price_value = updates.priceValue;
  if (updates.year !== undefined) dbUpdates.year = updates.year;
  if (updates.fuel !== undefined) dbUpdates.fuel = updates.fuel;
  if (updates.transmission !== undefined) dbUpdates.transmission = updates.transmission;
  if (updates.owners !== undefined) dbUpdates.owners = updates.owners;
  if (updates.kmDriven !== undefined) dbUpdates.km_driven = updates.kmDriven;
  if (updates.colour !== undefined) dbUpdates.colour = updates.colour;
  if (updates.insurance !== undefined) dbUpdates.insurance = updates.insurance;
  if (updates.fc !== undefined) dbUpdates.fc = updates.fc;
  if (updates.serviceHistory !== undefined) dbUpdates.service_history = updates.serviceHistory;
  if (updates.keys !== undefined) dbUpdates.keys = updates.keys;
  if (updates.manual !== undefined) dbUpdates.manual = updates.manual;
  if (updates.description !== undefined) dbUpdates.description = updates.description;
  if (updates.status !== undefined) dbUpdates.status = updates.status;
  if (updates.image !== undefined) dbUpdates.image = updates.image;
  if (updates.images !== undefined) dbUpdates.images = updates.images;

  // 1. Try server-side API
  try {
    await fetch('/api/cars', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, ...dbUpdates })
    });
  } catch (apiErr) {
    if (isSupabaseConfigured() && supabase) {
      try {
        await supabase.from('cars').update(dbUpdates).eq('id', id);
      } catch (err) {
        console.warn('Supabase update failed:', err);
      }
    }
  }

  const local = getLocalCars();
  const index = local.findIndex(c => c.id === id);
  if (index === -1) return null;
  local[index] = { ...local[index], ...updates, updatedAt: new Date().toISOString() };
  saveLocalCars(local);
  return local[index];
}

export async function deleteCar(id: string): Promise<boolean> {
  // 1. Try server-side API
  try {
    await fetch(`/api/cars?id=${encodeURIComponent(id)}`, {
      method: 'DELETE'
    });
  } catch (apiErr) {
    if (isSupabaseConfigured() && supabase) {
      try {
        await supabase.from('cars').delete().eq('id', id);
      } catch (err) {
        console.warn('Supabase delete failed:', err);
      }
    }
  }

  const local = getLocalCars();
  const filtered = local.filter(c => c.id !== id);
  saveLocalCars(filtered);
  return true;
}

// --- Enquiries Service ---

export async function fetchEnquiries(): Promise<Enquiry[]> {
  if (isSupabaseConfigured() && supabase) {
    try {
      const { data, error } = await supabase.from('enquiries').select('*').order('created_at', { ascending: false });
      if (!error && data) {
        return data.map(item => ({
          id: item.id,
          customerName: item.customer_name,
          customerPhone: item.customer_phone,
          carId: item.car_id,
          carName: item.car_name,
          message: item.message,
          status: item.status,
          timestamp: item.created_at
        }));
      }
    } catch (err) {
      console.warn('Supabase fetch enquiries failed:', err);
    }
  }
  return getLocalEnquiries();
}

export async function createEnquiry(enquiry: Omit<Enquiry, 'id' | 'timestamp'>): Promise<Enquiry> {
  const newEnq: Enquiry = {
    ...enquiry,
    id: 'e_' + Date.now(),
    timestamp: new Date().toISOString()
  };

  if (isSupabaseConfigured() && supabase) {
    try {
      await supabase.from('enquiries').insert([{
        customer_name: newEnq.customerName,
        customer_phone: newEnq.customerPhone,
        car_id: newEnq.carId,
        car_name: newEnq.carName,
        message: newEnq.message,
        status: newEnq.status
      }]);
    } catch (err) {
      console.warn('Supabase submit enquiry failed:', err);
    }
  }

  const list = getLocalEnquiries();
  list.unshift(newEnq);
  saveLocalEnquiries(list);
  return newEnq;
}

export async function updateEnquiryStatus(id: string, status: 'New' | 'Contacted' | 'Closed'): Promise<void> {
  if (isSupabaseConfigured() && supabase) {
    try {
      await supabase.from('enquiries').update({ status }).eq('id', id);
    } catch (err) {
      console.warn('Supabase update enquiry status failed:', err);
    }
  }

  const list = getLocalEnquiries();
  const item = list.find(e => e.id === id);
  if (item) {
    item.status = status;
    saveLocalEnquiries(list);
  }
}

// --- Settings Service ---

export async function fetchSettings(): Promise<DealershipSettings> {
  if (isSupabaseConfigured() && supabase) {
    try {
      const { data, error } = await supabase.from('settings').select('*').eq('id', 'main').single();
      if (!error && data) {
        return {
          dealershipName: data.dealership_name,
          ownerName: data.owner_name,
          phone: data.phone,
          whatsapp: data.whatsapp,
          email: data.email,
          location: data.location,
          about: data.about
        };
      }
    } catch (err) {
      console.warn('Supabase fetch settings failed:', err);
    }
  }
  return getLocalSettings();
}

export async function updateSettings(updates: Partial<DealershipSettings>): Promise<DealershipSettings> {
  if (isSupabaseConfigured() && supabase) {
    try {
      await supabase.from('settings').update({
        dealership_name: updates.dealershipName,
        owner_name: updates.ownerName,
        phone: updates.phone,
        whatsapp: updates.whatsapp,
        email: updates.email,
        location: updates.location,
        about: updates.about,
        updated_at: new Date().toISOString()
      }).eq('id', 'main');
    } catch (err) {
      console.warn('Supabase update settings failed:', err);
    }
  }

  const current = getLocalSettings();
  const updated = { ...current, ...updates };
  saveLocalSettings(updated);
  return updated;
}
