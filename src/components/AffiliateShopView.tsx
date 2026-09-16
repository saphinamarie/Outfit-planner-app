import React, { useState, useMemo } from 'react';
import { 
  ShoppingBag, 
  ExternalLink, 
  Percent, 
  Check, 
  Copy, 
  Filter, 
  ShieldCheck, 
  Sparkles,
  Info
} from 'lucide-react';
import { AffiliateItem, ClothingCategory } from '../types';
import { CURATED_AFFILIATE_CATALOG } from '../data/presetOptions';

interface AffiliateShopViewProps {
  onAffiliateClick: (item: AffiliateItem) => void;
}

export const AffiliateShopView: React.FC<AffiliateShopViewProps> = ({
  onAffiliateClick,
}) => {
  const [selectedRetailer, setSelectedRetailer] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const retailers = ['all', 'SSENSE', 'Nordstrom', 'Net-A-Porter', 'Uniqlo', 'Mejuri Direct'];
  const categories = ['all', 'outerwear', 'footwear', 'bags', 'accessories'];

  const filteredItems = useMemo(() => {
    return CURATED_AFFILIATE_CATALOG.filter((item) => {
      if (selectedRetailer !== 'all' && item.retailer !== selectedRetailer) {
        return false;
      }
      if (selectedCategory !== 'all' && item.category !== selectedCategory) {
        return false;
      }
      return true;
    });
  }, [selectedRetailer, selectedCategory]);

  const handleCopyCode = (code: string) => {
    navigator.clipboard?.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  return (
    <div className="space-y-8">
      
      {/* Header Editorial */}
      <div className="bg-stone-900 text-stone-100 rounded-3xl p-6 sm:p-10 border border-stone-800 shadow-xl">
        <div className="max-w-2xl">
          <div className="flex items-center gap-2 mb-2">
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-amber-400 text-stone-950">
              Partner Network
            </span>
            <span className="text-xs text-stone-400 uppercase tracking-widest font-medium">
              Curated Affiliate Catalog
            </span>
          </div>
          <h2 className="font-editorial text-3xl sm:text-5xl font-bold tracking-tight text-white">
            Curated Partner Wardrobe
          </h2>
          <p className="text-xs sm:text-sm text-stone-300 mt-2 leading-relaxed">
            Investment wardrobe staples and architectural finishing touches curated by our editorial team. Exclusive partner discounts automatically verified.
          </p>
        </div>
      </div>

      {/* Affiliate Transparency Disclosure Box */}
      <div className="p-4 bg-amber-50/70 border border-amber-200/80 rounded-2xl flex items-start gap-3 text-xs text-stone-700">
        <Info className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <span className="font-semibold text-stone-900">Affiliate Link Transparency: </span>
          When you click links to buy garments, AuraFit may earn an affiliate commission from our retail partners (SSENSE, Nordstrom, Net-a-Porter, Uniqlo) at zero additional cost to you. Every product is selected purely for architectural silhouette and fabric longevity.
        </div>
      </div>

      {/* Filter Controls */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-stone-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        
        {/* Retailer filter pills */}
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-none">
          <span className="text-xs font-semibold text-stone-500 uppercase mr-1">Retailer:</span>
          {retailers.map((r) => (
            <button
              key={r}
              type="button"
              id={`filter-retailer-${r}`}
              onClick={() => setSelectedRetailer(r)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                selectedRetailer === r
                  ? 'bg-stone-900 text-white'
                  : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
              }`}
            >
              {r === 'all' ? 'All Retailers' : r}
            </button>
          ))}
        </div>

        {/* Category filter pills */}
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-none">
          <span className="text-xs font-semibold text-stone-500 uppercase mr-1">Category:</span>
          {categories.map((c) => (
            <button
              key={c}
              type="button"
              id={`filter-cat-${c}`}
              onClick={() => setSelectedCategory(c)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                selectedCategory === c
                  ? 'bg-stone-900 text-white'
                  : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
              }`}
            >
              {c === 'all' ? 'All' : c}
            </button>
          ))}
        </div>

      </div>

      {/* Affiliate Product Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className="group flex flex-col bg-white rounded-3xl overflow-hidden border border-stone-200 hover:border-amber-400 hover:shadow-lg transition-all duration-300"
          >
            {/* Image */}
            <div className="relative aspect-[4/5] w-full overflow-hidden bg-stone-100">
              <img
                src={item.imageUrl}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-3 left-3 flex flex-col gap-1 z-10">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-stone-950/80 text-amber-300 backdrop-blur-xs">
                  {item.retailer}
                </span>
              </div>
              <div className="absolute bottom-3 right-3 z-10">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-white text-stone-950 shadow-md">
                  {item.price}
                </span>
              </div>
            </div>

            {/* Metadata */}
            <div className="p-5 flex flex-col justify-between flex-1 gap-3">
              <div>
                <span className="text-xs font-bold text-amber-800 uppercase tracking-wider block">
                  {item.brand}
                </span>
                <h3 className="font-editorial text-lg font-bold text-stone-900 mt-0.5 line-clamp-1">
                  {item.title}
                </h3>
                <p className="text-xs text-stone-600 mt-2 leading-relaxed">
                  {item.whyRecommended}
                </p>
              </div>

              {/* Promo code + Outbound Affiliate Link */}
              <div className="pt-3 border-t border-stone-100 flex items-center justify-between gap-2 flex-wrap">
                {item.discountCode && (
                  <button
                    type="button"
                    onClick={() => handleCopyCode(item.discountCode!)}
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-mono bg-stone-100 text-stone-700 hover:bg-stone-200 transition-colors"
                  >
                    {copiedCode === item.discountCode ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-emerald-700 font-bold">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Percent className="w-3.5 h-3.5 text-stone-500" />
                        <span>Code: {item.discountCode}</span>
                        <Copy className="w-3 h-3 text-stone-400" />
                      </>
                    )}
                  </button>
                )}

                <a
                  href={item.affiliateUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => onAffiliateClick(item)}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold bg-stone-900 hover:bg-stone-800 text-white ml-auto transition-colors cursor-pointer"
                >
                  <span>Shop at {item.retailer}</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
};
