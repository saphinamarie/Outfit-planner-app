import React from 'react';
import { Trash2, Sparkles, Tag, Layers } from 'lucide-react';
import { ClothingItem } from '../types';

interface ClothingCardProps {
  item: ClothingItem;
  isSelected?: boolean;
  onToggleSelect?: (item: ClothingItem) => void;
  onDelete?: (id: string) => void;
  onViewDetails?: (item: ClothingItem) => void;
}

export const ClothingCard: React.FC<ClothingCardProps> = ({
  item,
  isSelected,
  onToggleSelect,
  onDelete,
  onViewDetails,
}) => {
  const categoryBadgeColors: Record<string, string> = {
    tops: 'bg-amber-100 text-amber-800 border-amber-200',
    bottoms: 'bg-sky-100 text-sky-800 border-sky-200',
    outerwear: 'bg-stone-200 text-stone-800 border-stone-300',
    footwear: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    bags: 'bg-rose-100 text-rose-800 border-rose-200',
    accessories: 'bg-purple-100 text-purple-800 border-purple-200',
    one_piece: 'bg-indigo-100 text-indigo-800 border-indigo-200',
  };

  return (
    <div
      id={`clothing-card-${item.id}`}
      className={`group relative flex flex-col bg-white rounded-2xl overflow-hidden border transition-all duration-300 hover:shadow-lg ${
        isSelected
          ? 'border-amber-500 ring-2 ring-amber-400/40 shadow-md'
          : 'border-stone-200/90 hover:border-stone-400'
      }`}
    >
      {/* Garment Image Area */}
      <div 
        className="relative aspect-[3/4] w-full overflow-hidden bg-stone-100 cursor-pointer"
        onClick={() => (onViewDetails ? onViewDetails(item) : onToggleSelect?.(item))}
      >
        <img
          src={item.imageUrl}
          alt={item.name}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Gradient Shadow Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

        {/* Category Badge Top Left */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-semibold tracking-wide uppercase border backdrop-blur-md shadow-xs ${categoryBadgeColors[item.category] || 'bg-stone-100 text-stone-700'}`}>
            {item.category}
          </span>
          {item.subcategory && (
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-medium bg-stone-900/70 text-stone-200 backdrop-blur-md">
              {item.subcategory}
            </span>
          )}
        </div>

        {/* Quick Selection Checkbox Top Right */}
        {onToggleSelect && (
          <button
            type="button"
            id={`toggle-select-${item.id}`}
            onClick={(e) => {
              e.stopPropagation();
              onToggleSelect(item);
            }}
            aria-label={isSelected ? 'Deselect garment' : 'Select garment'}
            className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-all z-10 ${
              isSelected
                ? 'bg-amber-400 text-stone-950 shadow-md scale-105'
                : 'bg-white/80 hover:bg-white text-stone-600 backdrop-blur-md shadow-xs'
            }`}
          >
            <Sparkles className="w-4 h-4" />
          </button>
        )}

        {/* Seasonality indicators Bottom */}
        <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-white text-[11px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
          <span className="font-medium truncate max-w-[140px] text-stone-200">
            {item.material || item.brand || 'Versatile Piece'}
          </span>
          <span className="text-[10px] bg-black/40 px-2 py-0.5 rounded backdrop-blur-xs">
            {item.formality}
          </span>
        </div>
      </div>

      {/* Item Metadata */}
      <div className="p-3.5 flex flex-col flex-1 justify-between gap-2">
        <div>
          <div className="flex items-start justify-between gap-1 mb-1">
            <h4 
              onClick={() => onViewDetails?.(item)}
              className="font-medium text-sm text-stone-900 line-clamp-1 hover:text-amber-700 cursor-pointer transition-colors"
              title={item.name}
            >
              {item.name}
            </h4>
          </div>

          <div className="flex items-center gap-2 text-xs text-stone-500">
            <span className="inline-block w-2.5 h-2.5 rounded-full border border-stone-300 bg-stone-400" />
            <span className="truncate">{item.color}</span>
            {item.brand && (
              <>
                <span>•</span>
                <span className="truncate text-stone-600 font-medium">{item.brand}</span>
              </>
            )}
          </div>
        </div>

        {/* Tags or Micro Notes */}
        {item.tags && item.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-1">
            {item.tags.slice(0, 2).map((t, idx) => (
              <span key={idx} className="text-[10px] bg-stone-100 text-stone-600 px-1.5 py-0.5 rounded text-xs font-mono">
                #{t}
              </span>
            ))}
            {item.tags.length > 2 && (
              <span className="text-[10px] text-stone-400 self-center">
                +{item.tags.length - 2}
              </span>
            )}
          </div>
        )}

        {/* Bottom Actions */}
        <div className="pt-2 mt-1 border-t border-stone-100 flex items-center justify-between text-xs">
          <button
            type="button"
            id={`details-btn-${item.id}`}
            onClick={() => onViewDetails?.(item)}
            className="text-stone-500 hover:text-stone-900 font-medium flex items-center gap-1 transition-colors"
          >
            <Tag className="w-3 h-3" />
            <span>Details</span>
          </button>

          {onDelete && (
            <button
              type="button"
              id={`delete-garment-${item.id}`}
              onClick={(e) => {
                e.stopPropagation();
                if (confirm(`Remove "${item.name}" from your wardrobe?`)) {
                  onDelete(item.id);
                }
              }}
              aria-label="Delete garment"
              className="text-stone-400 hover:text-rose-600 p-1 rounded transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
