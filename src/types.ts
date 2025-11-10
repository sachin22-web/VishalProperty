export type Property = {
  id?: string;
  title: string;
  slug?: string;
  description?: string;
  price?: number;
  city?: string;
  location?: string;
  area?: number;
  bedrooms?: number;
  bathrooms?: number;
  type?: 'Apartment' | 'House' | 'Plot' | 'Commercial' | 'Rent';
  status?: 'active' | 'draft' | 'sold';
  images: string[];
  created_at?: string;
  updated_at?: string;
};
