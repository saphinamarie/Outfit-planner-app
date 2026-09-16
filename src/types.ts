export type ClothingCategory =
  | 'tops'
  | 'bottoms'
  | 'outerwear'
  | 'footwear'
  | 'one_piece'
  | 'accessories'
  | 'bags';

export type FormalityLevel =
  | 'Casual'
  | 'Smart Casual'
  | 'Business Formal'
  | 'Evening / Cocktail'
  | 'Athleisure'
  | 'Streetwear';

export type Season = 'Spring' | 'Summer' | 'Autumn' | 'Winter' | 'All-Season';

export interface ClothingItem {
  id: string;
  name: string;
  category: ClothingCategory;
  subcategory?: string;
  color: string;
  secondaryColor?: string;
  material?: string;
  pattern?: string;
  formality: FormalityLevel;
  seasonality: Season[];
  imageUrl: string;
  brand?: string;
  tags: string[];
  notes?: string;
  createdAt: string;
  isCustomUpload?: boolean;
}

export interface AffiliateItem {
  id: string;
  title: string;
  brand: string;
  retailer: string;
  price: string;
  originalPrice?: string;
  imageUrl: string;
  affiliateUrl: string;
  commissionBadge?: string;
  discountCode?: string;
  whyRecommended: string;
  category: ClothingCategory;
}

export interface Outfit {
  id: string;
  title: string;
  occasion: string;
  weather: string;
  styleAesthetic: string;
  itemIds: string[];
  items: ClothingItem[];
  stylistNotes: string;
  layeringAdvice: string;
  colorHarmony: {
    dominant: string;
    accents: string[];
    mood: string;
  };
  confidenceScore: number; // 0 - 100
  isFavorite?: boolean;
  isPremium?: boolean;
  affiliateItems?: AffiliateItem[];
  createdAt: string;
}

export interface StylePack {
  id: string;
  name: string;
  tagline: string;
  description: string;
  coverImage: string;
  accentColor: string;
  price: string;
  isUnlocked: boolean;
  sampleItemsCount: number;
  capsuleItems: Omit<ClothingItem, 'id' | 'createdAt'>[];
  aestheticVibe: string;
  occasions: string[];
  features: string[];
}

export interface WeatherOption {
  id: string;
  label: string;
  temp: string;
  condition: string;
  iconName: string;
  recommendation: string;
}

export interface OccasionOption {
  id: string;
  label: string;
  vibe: string;
  iconName: string;
  description: string;
}

export interface StyleAestheticOption {
  id: string;
  name: string;
  description: string;
  palette: string[];
  iconName: string;
}
