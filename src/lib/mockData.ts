import { Car, DealershipSettings, Enquiry } from './types';

export const INITIAL_SETTINGS: DealershipSettings = {
  dealershipName: "Quality Used Cars",
  ownerName: "Syed Sabeer Riyaz",
  phone: "919999999999",
  whatsapp: "919999999999",
  email: "syed.ae018@gmail.com",
  location: "Bangalore, Karnataka, India",
  about: "Direct pre-owned car dealership operated by Syed Sabeer Riyaz. Verified vehicle history, transparent pricing, and honest buying with zero middleman commission."
};

// Start with empty real inventory so Syed Sabeer Riyaz can add real cars one-by-one
export const INITIAL_ENQUIRIES: Enquiry[] = [];

export const INITIAL_INVENTORY: Car[] = [];
