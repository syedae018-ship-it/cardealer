export type VehicleStatus = 'AVAILABLE' | 'RESERVED' | 'SOLD' | 'DRAFT';

export type VehicleCategory = 'Hatchbacks' | 'Sedans' | 'SUVs' | 'Luxury' | 'All';

export interface Car {
  id: string;
  name: string;
  brand: string;
  model: string;
  variant?: string;
  category: string;
  price: string;
  priceValue: number;
  year: number;
  fuel: 'Petrol' | 'Diesel' | 'CNG' | 'Electric' | string;
  transmission: 'Manual' | 'Automatic' | string;
  owners: string;
  kmDriven?: string;
  colour?: string;
  insurance?: string;
  fc?: string;
  serviceHistory?: string;
  keys?: string;
  manual?: string;
  description?: string;
  status: VehicleStatus;
  image: string;
  images: string[];
  isFeatured?: boolean;
  viewsCount?: number;
  whatsappClicks?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface Enquiry {
  id: string;
  customerName: string;
  customerPhone?: string;
  carId: string;
  carName?: string;
  message: string;
  status: 'New' | 'Contacted' | 'Closed';
  timestamp: string;
}

export interface AnalyticsStats {
  totalVisits: number;
  todayVisits: number;
  totalCarViews: number;
  totalWhatsAppClicks: number;
  mostViewedCars: { id: string; name: string; views: number; clicks: number; price: string; image: string; status: VehicleStatus }[];
  lowViewedCars: { id: string; name: string; views: number; price: string; image: string; status: VehicleStatus }[];
}

export interface DealershipSettings {
  dealershipName: string;
  ownerName: string;
  phone: string;
  whatsapp: string;
  email?: string;
  location?: string;
  about?: string;
}

export interface FilterState {
  search: string;
  category: string;
  brand: string;
  budget: string;
  fuel: string;
  transmission: string;
  sort: 'newest' | 'price-low' | 'price-high' | 'year-newest';
}
