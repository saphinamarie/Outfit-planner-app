import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const app = express();
const PORT = 3000;

// Middleware for parsing JSON with ample limit for image uploads
app.use(express.json({ limit: '25mb' }));

// Lazy GoogleGenAI initialization
let genAIClient: GoogleGenAI | null = null;
function getGenAI(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  if (!genAIClient) {
    genAIClient = new GoogleGenAI({ apiKey });
  }
  return genAIClient;
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    hasGeminiKey: !!process.env.GEMINI_API_KEY,
    timestamp: new Date().toISOString(),
  });
});

// API: Analyze uploaded garment image
app.post('/api/analyze-clothing', async (req, res) => {
  try {
    const { image, fileName } = req.body;

    if (!image) {
      return res.status(400).json({ error: 'Image data is required' });
    }

    const ai = getGenAI();
    let detectedData: any = null;

    if (ai) {
      try {
        let imagePart: any = null;
        if (image.startsWith('data:')) {
          const match = image.match(/^data:([^;]+);base64,(.+)$/);
          if (match) {
            imagePart = {
              inlineData: {
                mimeType: match[1],
                data: match[2],
              },
            };
          }
        }

        const prompt = `You are an elite fashion curator and archivist. Analyze this clothing photo accurately.
Return ONLY a valid JSON object (without markdown code blocks, no backticks, just raw JSON) matching this exact TypeScript structure:
{
  "name": "Descriptive Item Name (e.g. Vintage Double-Breasted Trench, Cream Fisherman Knit Sweater, Raw Indigo Straight Denim)",
  "category": "tops" | "bottoms" | "outerwear" | "footwear" | "accessories" | "bags",
  "subcategory": "e.g. Button-Down, Trousers, Loafers, Blazer, T-Shirt, Coat, Knitwear",
  "color": "Accurate dominant color (e.g. Camel Tan, Forest Green, Ivory, Charcoal)",
  "secondaryColor": "Optional secondary or trim color or empty",
  "material": "Likely fabric (e.g. 100% Cotton Poplin, Cashmere Blend, Rigid Denim, Box Calf Leather)",
  "formality": "Casual" | "Smart Casual" | "Business Formal" | "Evening / Cocktail" | "Athleisure" | "Streetwear",
  "seasonality": ["Spring", "Autumn"] (array from: "Spring", "Summer", "Autumn", "Winter", "All-Season"),
  "brand": "Visible brand or generic styling tier",
  "tags": ["3 to 5 lowercase style tags like minimal, layering, quiet luxury, textured"],
  "notes": "1-2 sentences of professional stylist advice on how to best pair this piece"
}`;

        const contents: any[] = imagePart ? [prompt, imagePart] : [prompt];
        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents,
        });

        const rawText = response.text || '';
        const cleanedJson = rawText.replace(/```json/gi, '').replace(/```/g, '').trim();
        detectedData = JSON.parse(cleanedJson);
      } catch (err) {
        console.warn('Gemini vision analysis failed or fallback required:', err);
      }
    }

    // Heuristic fallback if AI unavailable
    if (!detectedData) {
      const lowerName = (fileName || '').toLowerCase();
      let category = 'tops';
      let subcategory = 'Top';
      let formality = 'Smart Casual';

      if (lowerName.includes('pant') || lowerName.includes('jean') || lowerName.includes('trouser') || lowerName.includes('skirt') || lowerName.includes('short')) {
        category = 'bottoms';
        subcategory = 'Trousers';
      } else if (lowerName.includes('coat') || lowerName.includes('jacket') || lowerName.includes('blazer') || lowerName.includes('trench') || lowerName.includes('parka')) {
        category = 'outerwear';
        subcategory = 'Outerwear';
      } else if (lowerName.includes('shoe') || lowerName.includes('boot') || lowerName.includes('loafer') || lowerName.includes('sneaker') || lowerName.includes('heel')) {
        category = 'footwear';
        subcategory = 'Footwear';
      } else if (lowerName.includes('bag') || lowerName.includes('tote') || lowerName.includes('clutch')) {
        category = 'bags';
        subcategory = 'Bag';
      } else if (lowerName.includes('scarf') || lowerName.includes('hat') || lowerName.includes('watch') || lowerName.includes('sunglass')) {
        category = 'accessories';
        subcategory = 'Accessory';
      }

      detectedData = {
        name: fileName ? fileName.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ') : 'Curated Wardrobe Item',
        category,
        subcategory,
        color: 'Neutral Classic',
        secondaryColor: '',
        material: 'Premium Blend',
        formality,
        seasonality: ['All-Season', 'Spring', 'Autumn'],
        brand: 'Personal Wardrobe',
        tags: ['custom-upload', 'wardrobe-essential', 'versatile'],
        notes: 'Versatile wardrobe building block. Balances beautifully with neutral tailoring.',
      };
    }

    res.json({ success: true, item: detectedData });
  } catch (error: any) {
    console.error('Error analyzing clothing:', error);
    res.status(500).json({ error: error.message || 'Failed to analyze item' });
  }
});

// API: Generate AI Outfit based on user wardrobe, weather, occasion, aesthetic
app.post('/api/generate-outfit', async (req, res) => {
  try {
    const {
      items = [],
      occasion = 'Smart Casual Work',
      weather = '18°C Mild & Breezy',
      styleAesthetic = 'Quiet Luxury',
      isPremium = false,
      customPrompt = '',
      catalogAffiliates = [],
    } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ error: 'At least one wardrobe item is required' });
    }

    const ai = getGenAI();
    let generatedOutfit: any = null;

    if (ai) {
      try {
        const itemSummaryList = items.map((it: any) => ({
          id: it.id,
          name: it.name,
          category: it.category,
          color: it.color,
          material: it.material,
          formality: it.formality,
          brand: it.brand,
          tags: it.tags,
        }));

        const systemPrompt = `You are a world-class celebrity stylist and high-fashion creative director.
Your objective is to curate a flawless, highly wearable, cohesive outfit using the user's REAL wardrobe pieces.

Target Parameters:
- Occasion: "${occasion}"
- Weather Condition: "${weather}"
- Aesthetic Style: "${styleAesthetic}"
- Tier: ${isPremium ? 'VIP Haute Couture / Personal Stylist Masterclass' : 'Standard Curated'}
${customPrompt ? `- Custom User Notes: "${customPrompt}"` : ''}

Available Wardrobe Items to pick from:
${JSON.stringify(itemSummaryList, null, 2)}

Requirements:
1. Select 3 to 6 item IDs from the list that create the most stunning, context-appropriate outfit (ideally a top + bottom or dress + footwear + optional outerwear/bag/accessories).
2. Write deep, insightful "stylistNotes" explaining the visual balance, silhouettes, contrast of textures, and why this look excels for ${occasion} in ${weather}.
3. Write "layeringAdvice" giving precise actionable micro-styling advice (e.g. collar popping, french tucking, sleeve cuffing, draping over shoulders).
4. Provide "colorHarmony" breakdown: dominant color, accent colors, and palette mood.
5. Provide a "confidenceScore" between 85 and 99.
6. Suggest 2 elevated affiliate/shopping recommendations to "Complete The Look" (items that are NOT yet in their closet or elevate the look to 10/10). Include realistic brand names (e.g., The Row, Totême, Khaite, Uniqlo C, Loro Piana, Gucci, Saint Laurent), realistic prices ($80 - $950), and why it complements the look.

OUTPUT FORMAT:
Return ONLY valid JSON (no markdown ticks, no backticks):
{
  "title": "Editorial Outfit Title (e.g. The Monochromatic Architectural Suit, Autumn Riviera Linen Layering, Rainy Gallery Evening)",
  "itemIds": ["id-1", "id-5", ...],
  "stylistNotes": "Stylist editorial rationale...",
  "layeringAdvice": "Specific micro-styling instructions...",
  "colorHarmony": {
    "dominant": "Color name",
    "accents": ["Accent 1", "Accent 2"],
    "mood": "e.g. Understated, Intellectual, Coastal Crisp"
  },
  "confidenceScore": 94,
  "affiliateRecommendations": [
    {
      "title": "Product Title",
      "brand": "Brand",
      "retailer": "SSENSE" | "Nordstrom" | "Net-A-Porter" | "Uniqlo",
      "price": "$290",
      "category": "outerwear" | "footwear" | "bags" | "accessories",
      "whyRecommended": "Styling reason..."
    }
  ]
}`;

        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: [systemPrompt],
        });

        const rawText = response.text || '';
        const cleanedJson = rawText.replace(/```json/gi, '').replace(/```/g, '').trim();
        generatedOutfit = JSON.parse(cleanedJson);
      } catch (err) {
        console.warn('Gemini outfit generation error, switching to algorithmic fallback:', err);
      }
    }

    // Fallback if AI unavailable or parse error
    if (!generatedOutfit || !generatedOutfit.itemIds || generatedOutfit.itemIds.length === 0) {
      // Pick 1 top, 1 bottom, 1 footwear, 1 outerwear/bag if available
      const tops = items.filter((i: any) => i.category === 'tops');
      const bottoms = items.filter((i: any) => i.category === 'bottoms');
      const footwear = items.filter((i: any) => i.category === 'footwear');
      const outerwear = items.filter((i: any) => i.category === 'outerwear');
      const bags = items.filter((i: any) => i.category === 'bags');

      const selectedIds: string[] = [];
      if (tops.length > 0) selectedIds.push(tops[Math.floor(Math.random() * tops.length)].id);
      if (bottoms.length > 0) selectedIds.push(bottoms[Math.floor(Math.random() * bottoms.length)].id);
      if (footwear.length > 0) selectedIds.push(footwear[Math.floor(Math.random() * footwear.length)].id);
      if (outerwear.length > 0 && (weather.includes('Cold') || weather.includes('Chilly') || weather.includes('Rain') || weather.includes('Breezy'))) {
        selectedIds.push(outerwear[0].id);
      } else if (bags.length > 0) {
        selectedIds.push(bags[0].id);
      }

      generatedOutfit = {
        title: `${styleAesthetic} for ${occasion}`,
        itemIds: selectedIds.length > 0 ? selectedIds : [items[0].id],
        stylistNotes: `Carefully balanced for ${occasion} during ${weather}. The proportions create a clean visual flow while prioritizing all-day comfort and effortless sophistication.`,
        layeringAdvice: 'Half-tuck the top into the waistband to lengthen the leg line. Keep outerwear unbuttoned for a relaxed, vertical silhouette.',
        colorHarmony: {
          dominant: 'Neutral Tones',
          accents: ['Warm Earth', 'Subtle Gold'],
          mood: 'Harmonious & Timeless',
        },
        confidenceScore: 92,
        affiliateRecommendations: [
          {
            title: 'Sculptural Minimalist Leather Belt',
            brand: 'Khaite Inspired',
            retailer: 'SSENSE',
            price: '$380',
            category: 'accessories',
            whyRecommended: 'Cinches the waistline and introduces subtle leather grain texture to bind the silhouette together.',
          },
          {
            title: 'Water-Resistant City Chelsea Boots',
            brand: 'Common Projects',
            retailer: 'Nordstrom',
            price: '$525',
            category: 'footwear',
            whyRecommended: 'Protects against unexpected puddles while maintaining sleek minimalist lines.',
          }
        ]
      };
    }

    // Hydrate full item objects
    const fullItems = generatedOutfit.itemIds
      .map((id: string) => items.find((it: any) => it.id === id))
      .filter(Boolean);

    // Hydrate affiliate items
    const affiliateItems = (generatedOutfit.affiliateRecommendations || []).map((rec: any, idx: number) => {
      // Find matching or closest catalog affiliate item if possible
      const catalogMatch = catalogAffiliates.find(
        (c: any) => c.category === rec.category || c.retailer === rec.retailer
      );

      return {
        id: `aff-gen-${Date.now()}-${idx}`,
        title: rec.title || catalogMatch?.title || 'Heritage Leather Accessory',
        brand: rec.brand || catalogMatch?.brand || 'Nordstrom Designer',
        retailer: rec.retailer || catalogMatch?.retailer || 'Nordstrom',
        price: rec.price || catalogMatch?.price || '$320',
        imageUrl: catalogMatch?.imageUrl || 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&auto=format&fit=crop&q=80',
        affiliateUrl: catalogMatch?.affiliateUrl || 'https://www.nordstrom.com',
        commissionBadge: catalogMatch?.commissionBadge || 'Verified Affiliate Partner • 15% Off',
        discountCode: catalogMatch?.discountCode || 'FIT15',
        whyRecommended: rec.whyRecommended || 'Complements the outfit colorway and enhances seasonal weather adaptability.',
        category: rec.category || 'accessories',
      };
    });

    const result = {
      id: `outfit-${Date.now()}`,
      title: generatedOutfit.title,
      occasion,
      weather,
      styleAesthetic,
      itemIds: generatedOutfit.itemIds,
      items: fullItems,
      stylistNotes: generatedOutfit.stylistNotes,
      layeringAdvice: generatedOutfit.layeringAdvice,
      colorHarmony: generatedOutfit.colorHarmony,
      confidenceScore: generatedOutfit.confidenceScore || 95,
      isPremium: !!isPremium,
      affiliateItems,
      createdAt: new Date().toISOString(),
    };

    res.json({ success: true, outfit: result });
  } catch (error: any) {
    console.error('Error generating outfit:', error);
    res.status(500).json({ error: error.message || 'Failed to generate outfit' });
  }
});

// API: Stylist interactive advice chat
app.post('/api/stylist-chat', async (req, res) => {
  try {
    const { question, currentOutfit, wardrobe } = req.body;
    const ai = getGenAI();

    if (!ai) {
      return res.json({
        reply: "To elevate this outfit, make sure to consider footwear texture and hemline breaks. You can swap in loafers for a more formal polish or clean white leather sneakers for an effortless Parisian vibe.",
      });
    }

    const prompt = `You are a personal haute-couture fashion stylist.
The client asks: "${question}"

Current Outfit context:
${currentOutfit ? `Outfit: ${currentOutfit.title}, Items: ${currentOutfit.items?.map((i: any) => i.name).join(', ')}` : 'Browsing wardrobe'}

Provide a 2 to 3 paragraph friendly, ultra-knowledgeable fashion response giving concrete styling advice, fabric care tips, and color combinations.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: [prompt],
    });

    res.json({ reply: response.text || 'Keep your silhouettes proportional: pair relaxed bottoms with a fitted or tucked top.' });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Stylist chat error' });
  }
});

// Vite middleware or production static serving
async function setupVite() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
  });
}

setupVite().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
