import React from 'react';
import { 
  Sparkles, 
  Bookmark, 
  BookmarkCheck, 
  MessageSquare, 
  RefreshCw, 
  ExternalLink, 
  Percent, 
  ShieldCheck, 
  Tag, 
  Layers, 
  Palette, 
  Thermometer, 
  Share2 
} from 'lucide-react';
import { Outfit, ClothingItem } from '../types';

interface OutfitDisplayProps {
  outfit: Outfit;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  onRegenerate: () => void;
  onAskStylist: () => void;
  onAffiliateClick: (item: any) => void;
  onViewItemDetails: (item: ClothingItem) => void;
}

export const OutfitDisplay: React.FC<OutfitDisplayProps> = ({
  outfit,
  isFavorite,
  onToggleFavorite,
  onRegenerate,
  onAskStylist,
  onAffiliateClick,
  onViewItemDetails,
}) => {
  const handleCopyLink = () => {
    navigator.clipboard?.writeText(window.location.href);
    alert('Outfit link copied to clipboard!');
  };

  return (
    <div className="bg-white rounded-3xl border border-stone-200 shadow-xl overflow-hidden">
      
      {/* Top Editorial Banner */}
      <div className="bg-stone-900 text-stone-100 p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-400 text-stone-950 shadow-xs">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{outfit.confidenceScore}% Cohesion Score</span>
              </span>

              {outfit.isPremium && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-500/20 text-purple-300 border border-purple-400/30">
                  VIP Haute Couture
                </span>
              )}

              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs bg-stone-800 text-stone-300">
                <Thermometer className="w-3 h-3 text-amber-400" />
                <span>{outfit.weather}</span>
              </span>

              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs bg-stone-800 text-stone-300">
                {outfit.occasion}
              </span>
            </div>

            <h2 className="font-editorial text-2xl sm:text-4xl font-bold tracking-tight text-white mt-1">
              {outfit.title}
            </h2>
            <p className="text-xs sm:text-sm text-stone-400 mt-1">
              Aesthetic Direction: <span className="text-stone-200 font-medium">{outfit.styleAesthetic}</span>
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              id="favorite-outfit-btn"
              onClick={onToggleFavorite}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold transition-all ${
                isFavorite
                  ? 'bg-rose-500 text-white shadow-md'
                  : 'bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-700'
              }`}
            >
              {isFavorite ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
              <span>{isFavorite ? 'Saved' : 'Save Look'}</span>
            </button>

            <button
              type="button"
              id="ask-stylist-btn"
              onClick={onAskStylist}
              className="flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold bg-stone-800 hover:bg-stone-700 text-amber-300 border border-amber-500/30 transition-all"
            >
              <MessageSquare className="w-4 h-4 text-amber-300" />
              <span>Ask Stylist</span>
            </button>

            <button
              type="button"
              id="share-outfit-btn"
              onClick={handleCopyLink}
              title="Share outfit"
              className="p-2 rounded-full bg-stone-800 hover:bg-stone-700 text-stone-300 border border-stone-700 transition-colors"
            >
              <Share2 className="w-4 h-4" />
            </button>

            <button
              type="button"
              id="re-roll-outfit-btn"
              onClick={onRegenerate}
              title="Generate fresh alternative"
              className="p-2 rounded-full bg-stone-800 hover:bg-stone-700 text-stone-300 border border-stone-700 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Outfit Garment Collage */}
      <div className="p-6 sm:p-8 border-b border-stone-100">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-editorial text-lg font-bold text-stone-900">
            Selected Wardrobe Elements ({outfit.items.length})
          </h3>
          <span className="text-xs text-stone-500">
            Curated from your active closet
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {outfit.items.map((item) => (
            <div
              key={item.id}
              onClick={() => onViewItemDetails(item)}
              className="group flex flex-col bg-stone-50 rounded-2xl overflow-hidden border border-stone-200 hover:border-amber-400 transition-all cursor-pointer shadow-2xs"
            >
              <div className="relative aspect-[3/4] w-full overflow-hidden bg-stone-200">
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                />
                <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full text-[9px] font-semibold uppercase tracking-wider bg-stone-900/80 text-white backdrop-blur-xs">
                  {item.category}
                </span>
              </div>
              <div className="p-2.5">
                <p className="text-xs font-medium text-stone-900 line-clamp-1 group-hover:text-amber-700 transition-colors">
                  {item.name}
                </p>
                <div className="flex items-center justify-between text-[10px] text-stone-500 mt-1">
                  <span>{item.color}</span>
                  {item.brand && <span className="truncate max-w-[70px]">{item.brand}</span>}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Stylist Editorial Insights & Layering Matrix */}
      <div className="p-6 sm:p-8 bg-stone-50/50 grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Editorial Notes */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs">
            <div className="flex items-center gap-2 mb-2 text-amber-700">
              <Sparkles className="w-4 h-4" />
              <h4 className="font-semibold text-xs uppercase tracking-wider text-stone-900">
                Editorial Styling Rationale
              </h4>
            </div>
            <p className="text-sm text-stone-700 leading-relaxed font-sans">
              {outfit.stylistNotes}
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs">
            <div className="flex items-center gap-2 mb-2 text-stone-800">
              <Layers className="w-4 h-4 text-stone-600" />
              <h4 className="font-semibold text-xs uppercase tracking-wider text-stone-900">
                Layering & Silhouette Execution
              </h4>
            </div>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
              {outfit.layeringAdvice}
            </p>
          </div>
        </div>

        {/* Color Harmony & Mood Panel */}
        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3 text-stone-800">
              <Palette className="w-4 h-4 text-stone-600" />
              <h4 className="font-semibold text-xs uppercase tracking-wider text-stone-900">
                Color Harmony Breakdown
              </h4>
            </div>

            <div className="space-y-3">
              <div>
                <span className="text-[11px] text-stone-500 uppercase tracking-wider block mb-1 font-medium">
                  Dominant Palette
                </span>
                <span className="inline-block text-xs font-semibold px-2.5 py-1 rounded-lg bg-stone-100 text-stone-800">
                  {outfit.colorHarmony?.dominant || 'Classic Neutrals'}
                </span>
              </div>

              {outfit.colorHarmony?.accents && outfit.colorHarmony.accents.length > 0 && (
                <div>
                  <span className="text-[11px] text-stone-500 uppercase tracking-wider block mb-1 font-medium">
                    Accent Tones
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {outfit.colorHarmony.accents.map((acc, idx) => (
                      <span key={idx} className="text-xs px-2.5 py-1 rounded-lg bg-amber-50 text-amber-900 border border-amber-200/60 font-medium">
                        {acc}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <span className="text-[11px] text-stone-500 uppercase tracking-wider block mb-1 font-medium">
                  Palette Mood
                </span>
                <p className="text-xs text-stone-600 italic">
                  "{outfit.colorHarmony?.mood || 'Refined & Harmonious'}"
                </p>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
            <span>Verified Weather Adapted</span>
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
          </div>
        </div>

      </div>

      {/* "Complete the Look" Monetization & Affiliate Links Section */}
      {outfit.affiliateItems && outfit.affiliateItems.length > 0 && (
        <div className="p-6 sm:p-8 bg-gradient-to-b from-stone-50 to-amber-50/20 border-t border-stone-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest bg-stone-900 text-amber-300">
                  Affiliate Curations
                </span>
                <h3 className="font-editorial text-xl font-bold text-stone-900">
                  Complete The Look
                </h3>
              </div>
              <p className="text-xs text-stone-500 mt-0.5">
                Elevate this ensemble with missing investment pieces recommended by our AI stylist. Exclusive partner codes included.
              </p>
            </div>
            <span className="text-[11px] text-stone-400 self-start sm:self-auto">
              Affiliate link disclosures apply
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {outfit.affiliateItems.map((aff) => (
              <div
                key={aff.id}
                className="flex flex-col sm:flex-row gap-4 p-4 rounded-2xl bg-white border border-stone-200 hover:border-amber-400 shadow-2xs hover:shadow-md transition-all"
              >
                {/* Product Image */}
                <div className="w-full sm:w-28 h-32 sm:h-auto rounded-xl overflow-hidden bg-stone-100 flex-shrink-0 relative">
                  <img
                    src={aff.imageUrl}
                    alt={aff.title}
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute bottom-1.5 left-1.5 text-[9px] font-semibold uppercase px-1.5 py-0.5 bg-black/70 text-white rounded">
                    {aff.retailer}
                  </span>
                </div>

                {/* Details */}
                <div className="flex flex-col justify-between flex-1 gap-2">
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-[11px] font-semibold text-amber-800 uppercase tracking-wider">
                        {aff.brand}
                      </span>
                      <span className="font-bold text-sm text-stone-900">
                        {aff.price}
                      </span>
                    </div>

                    <h4 className="font-medium text-xs sm:text-sm text-stone-900 line-clamp-1 mt-0.5">
                      {aff.title}
                    </h4>

                    <p className="text-xs text-stone-600 mt-1 leading-snug">
                      {aff.whyRecommended}
                    </p>
                  </div>

                  {/* Coupon & CTA */}
                  <div className="flex items-center justify-between gap-2 pt-2 border-t border-stone-100 flex-wrap">
                    {aff.discountCode && (
                      <div className="flex items-center gap-1 text-[11px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        <Percent className="w-3 h-3" />
                        <span>Code: {aff.discountCode}</span>
                      </div>
                    )}

                    <a
                      href={aff.affiliateUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => onAffiliateClick(aff)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-stone-900 hover:bg-stone-800 text-white transition-colors cursor-pointer ml-auto"
                    >
                      <span>Shop at {aff.retailer}</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
