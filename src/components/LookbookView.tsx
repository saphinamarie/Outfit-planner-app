import React from 'react';
import { 
  BookmarkCheck, 
  Trash2, 
  Sparkles, 
  Thermometer, 
  Calendar, 
  ArrowRight,
  Share2,
  Copy
} from 'lucide-react';
import { Outfit, ClothingItem } from '../types';

interface LookbookViewProps {
  savedOutfits: Outfit[];
  onRemoveOutfit: (id: string) => void;
  onSelectOutfit: (outfit: Outfit) => void;
  onViewItemDetails: (item: ClothingItem) => void;
}

export const LookbookView: React.FC<LookbookViewProps> = ({
  savedOutfits,
  onRemoveOutfit,
  onSelectOutfit,
  onViewItemDetails,
}) => {
  const handleCopySummary = (outfit: Outfit) => {
    const text = `Outfit: ${outfit.title}\nOccasion: ${outfit.occasion}\nWeather: ${outfit.weather}\nItems: ${outfit.items.map((i) => i.name).join(', ')}\nStylist Notes: ${outfit.stylistNotes}`;
    navigator.clipboard?.writeText(text);
    alert('Outfit formula summary copied to clipboard!');
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-rose-100 text-rose-700">
                <BookmarkCheck className="w-5 h-5" />
              </span>
              <h2 className="font-editorial text-2xl sm:text-3xl font-bold text-stone-900">
                Personal Lookbook
              </h2>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-stone-100 text-stone-700">
                {savedOutfits.length} Saved Looks
              </span>
            </div>
            <p className="text-xs sm:text-sm text-stone-500 mt-1">
              Your archive of curated outfits with tailored layering notes, micro-styling instructions, and color harmony breakdowns.
            </p>
          </div>
        </div>
      </div>

      {/* Lookbook Outfits List */}
      {savedOutfits.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-stone-200">
          <BookmarkCheck className="w-12 h-12 text-stone-300 mx-auto mb-3" />
          <h3 className="font-editorial text-xl font-bold text-stone-800">
            No saved outfits yet
          </h3>
          <p className="text-xs text-stone-500 mt-1 max-w-sm mx-auto">
            Generate an ensemble in the Outfit Studio and click "Save Look" to save it here for quick inspiration.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {savedOutfits.map((outfit) => (
            <div
              key={outfit.id}
              className="bg-white rounded-3xl p-6 border border-stone-200 hover:border-stone-400 shadow-xs hover:shadow-md transition-all flex flex-col justify-between gap-4"
            >
              <div>
                {/* Header info */}
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800">
                      {outfit.styleAesthetic}
                    </span>
                    <h3 className="font-editorial text-xl font-bold text-stone-900">
                      {outfit.title}
                    </h3>
                  </div>

                  <div className="flex items-center gap-1">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                      {outfit.confidenceScore}% Match
                    </span>
                    <button
                      type="button"
                      id={`delete-saved-outfit-${outfit.id}`}
                      onClick={() => onRemoveOutfit(outfit.id)}
                      title="Remove from saved"
                      className="text-stone-400 hover:text-rose-600 p-1 rounded transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Weather and Occasion Badges */}
                <div className="flex items-center gap-2 text-xs text-stone-500 mb-4 flex-wrap">
                  <span className="inline-flex items-center gap-1 bg-stone-100 px-2.5 py-0.5 rounded-md">
                    <Thermometer className="w-3 h-3 text-amber-500" />
                    <span>{outfit.weather}</span>
                  </span>
                  <span className="bg-stone-100 px-2.5 py-0.5 rounded-md">
                    {outfit.occasion}
                  </span>
                </div>

                {/* Garments Mini Strip */}
                <div className="grid grid-cols-4 sm:grid-cols-5 gap-2 mb-4">
                  {outfit.items.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => onViewItemDetails(item)}
                      className="group cursor-pointer aspect-[3/4] rounded-xl overflow-hidden bg-stone-100 relative border border-stone-200"
                    >
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                      />
                      <span className="absolute bottom-1 left-1 right-1 text-[8px] font-semibold truncate bg-stone-950/70 text-white px-1 rounded text-center">
                        {item.name.split(' ')[0]}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Stylist Notes Preview */}
                <p className="text-xs text-stone-600 line-clamp-2 italic">
                  "{outfit.stylistNotes}"
                </p>
              </div>

              {/* Action Toolbar */}
              <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => handleCopySummary(outfit)}
                  className="flex items-center gap-1 text-xs text-stone-500 hover:text-stone-900 transition-colors"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Notes</span>
                </button>

                <button
                  type="button"
                  id={`open-look-${outfit.id}`}
                  onClick={() => onSelectOutfit(outfit)}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold bg-stone-900 hover:bg-stone-800 text-white transition-colors"
                >
                  <span>Inspect Outfit</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};
