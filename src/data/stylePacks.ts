import { StylePack } from '../types';

export const INITIAL_STYLE_PACKS: StylePack[] = [
  {
    id: 'pack-parisian-autumn',
    name: 'Parisian Autumn Capsule',
    tagline: 'Effortless French chic with structured trenching & neutral knits',
    description: 'Master the understated Parisian aesthetic with 8 harmonious pieces designed to create 24+ unique seasonal looks.',
    coverImage: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&auto=format&fit=crop&q=80',
    accentColor: '#B45309',
    price: '$14.99',
    isUnlocked: true, // Available out of the box
    sampleItemsCount: 8,
    aestheticVibe: 'French Classic & Understated',
    occasions: ['Bistro Dinners', 'Art Gallery Walks', 'City Commute', 'Weekend Brunch'],
    features: [
      '24 curated mix-and-match formula cards',
      'French tuck & scarf tying styling video notes',
      'Weather-resistant layering guide (8°C to 18°C)',
      '1-click instant import into your AI Wardrobe'
    ],
    capsuleItems: [
      {
        name: 'Breton Striped Boatneck Top',
        category: 'tops',
        subcategory: 'Long Sleeve',
        color: 'Ecru & Navy',
        material: 'Heavy Jersey Cotton',
        formality: 'Casual',
        seasonality: ['Spring', 'Autumn', 'Summer'],
        imageUrl: 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=600&auto=format&fit=crop&q=80',
        brand: 'Saint James',
        tags: ['french', 'iconic', 'maritime', 'layering'],
        notes: 'Classic nautical stripes, relaxed boatneck cut.',
      },
      {
        name: 'Straight-Leg Ecru Denim',
        category: 'bottoms',
        subcategory: 'Jeans',
        color: 'Natural Ecru',
        material: '100% Rigid Denim',
        formality: 'Smart Casual',
        seasonality: ['All-Season', 'Spring', 'Autumn'],
        imageUrl: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=600&auto=format&fit=crop&q=80',
        brand: 'Rouje',
        tags: ['parisian', 'flattering', 'neutral', 'chic'],
        notes: 'High-waist straight fit that highlights the ankles.',
      },
      {
        name: 'Soft Suede Penny Loafers',
        category: 'footwear',
        subcategory: 'Loafers',
        color: 'Warm Chestnut',
        material: 'Italian Calf Suede',
        formality: 'Smart Casual',
        seasonality: ['Spring', 'Autumn'],
        imageUrl: 'https://images.unsplash.com/photo-1533867617858-e7b97e060509?w=600&auto=format&fit=crop&q=80',
        brand: 'Sézane',
        tags: ['parisian', 'comfortable', 'suede', 'earthy'],
        notes: 'Flexible leather sole with almond toe profile.',
      }
    ]
  },
  {
    id: 'pack-tokyo-minimalist',
    name: 'Tokyo Minimalist Workwear',
    tagline: 'Architectural silhouettes, dropped shoulders & utilitarian precision',
    description: 'Clean geometry meets refined street-tailoring for modern urban professionals.',
    coverImage: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&auto=format&fit=crop&q=80',
    accentColor: '#1E293B',
    price: '$19.99',
    isUnlocked: false,
    sampleItemsCount: 10,
    aestheticVibe: 'Architectural & Utilitarian',
    occasions: ['Tech Conferences', 'Design Studio Work', 'Creative Meetings', 'Late-Night Dining'],
    features: [
      'Proportion balancing guide for wide-leg silhouettes',
      'Monochrome palette grading rules',
      'Wrinkle-free commute travel packing matrix',
      'All 10 items unlockable directly into closet'
    ],
    capsuleItems: [
      {
        name: 'Collarless Kimono-Wrap Cardigan',
        category: 'tops',
        subcategory: 'Knitwear',
        color: 'Anthracite',
        material: 'Merino Wool',
        formality: 'Smart Casual',
        seasonality: ['Autumn', 'Winter', 'Spring'],
        imageUrl: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&auto=format&fit=crop&q=80',
        brand: 'Issey Miyake Homme Plissé',
        tags: ['architectural', 'pleated', 'sculptural', 'tokyo'],
        notes: 'Signature permanent pleats that never lose shape.',
      },
      {
        name: 'Tapered Ankle Crop Cargo Trousers',
        category: 'bottoms',
        subcategory: 'Pants',
        color: 'Matte Olive / Ink',
        material: 'High-Density Cordura Cotton',
        formality: 'Smart Casual',
        seasonality: ['All-Season'],
        imageUrl: 'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=600&auto=format&fit=crop&q=80',
        brand: 'Comme des Garçons',
        tags: ['utilitarian', 'tapered', 'cropped', 'modern'],
        notes: 'Concealed zip pockets and deep darts at knee.',
      }
    ]
  },
  {
    id: 'pack-quiet-luxury',
    name: 'Quiet Luxury Executive',
    tagline: 'Timeless old-money elegance in cashmere, silk and understated tailoring',
    description: 'Understated prestige without loud logos: fine Italian wools, rich neutral tones, and immaculate drape.',
    coverImage: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&auto=format&fit=crop&q=80',
    accentColor: '#78350F',
    price: '$24.99',
    isUnlocked: false,
    sampleItemsCount: 12,
    aestheticVibe: 'Old Money & Heritage Tailoring',
    occasions: ['Executive Boardrooms', 'Private Club Dinners', 'Luxury Travel', 'Investment Summits'],
    features: [
      'High-contrast neutral styling formula',
      'Fabric care & longevity preservation playbook',
      'Elevated jewelry & leather pairing advisory',
      'Priority VIP AI stylist generation model'
    ],
    capsuleItems: [
      {
        name: 'Double-Faced Cashmere Wrap Coat',
        category: 'outerwear',
        subcategory: 'Coat',
        color: 'Bespoke Greige',
        material: '100% Baby Cashmere',
        formality: 'Business Formal',
        seasonality: ['Autumn', 'Winter'],
        imageUrl: 'https://images.unsplash.com/photo-1544441893-675973e31985?w=600&auto=format&fit=crop&q=80',
        brand: 'Loro Piana Inspired',
        tags: ['quiet luxury', 'cashmere', 'draped', 'investment'],
        notes: 'Hand-stitched seams and detachable tie belt.',
      }
    ]
  },
  {
    id: 'pack-amalfi-resort',
    name: 'Amalfi Coast & Riviera',
    tagline: 'Sun-drenched linen, breezy silk skirts & effortless coastal glamour',
    description: 'The ultimate warm-weather vacation packing pack for seaside dining and sunset aperitifs.',
    coverImage: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800&auto=format&fit=crop&q=80',
    accentColor: '#0369A1',
    price: '$12.99',
    isUnlocked: false,
    sampleItemsCount: 8,
    aestheticVibe: 'Coastal European Resort',
    occasions: ['Beachfront Dining', 'Yacht Day', 'Resort Cocktail Hour', 'Summer Honeymoon'],
    features: [
      'Carry-on luggage packing checklist',
      'Wrinkle-management guide for pure linen',
      'Day-to-evening conversion formulas',
      'Full wardrobe capsule assets'
    ],
    capsuleItems: [
      {
        name: 'Relaxed Pure Linen Camp Shirt',
        category: 'tops',
        subcategory: 'Shirt',
        color: 'Sky Blue & White Striped',
        material: '100% Italian Linen',
        formality: 'Casual',
        seasonality: ['Summer', 'Spring'],
        imageUrl: 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=600&auto=format&fit=crop&q=80',
        brand: 'Boglioli',
        tags: ['resort', 'breathable', 'linen', 'coastal'],
        notes: 'Pre-washed for airy softness, relaxed camp collar.',
      }
    ]
  }
];
