import React from 'react';
import { X, Tag, Sparkles, Shirt, Trash2, Calendar, ShieldCheck } from 'lucide-react';
import { ClothingItem } from '../types';

interface ItemDetailsModalProps {
  item: ClothingItem | null;
  onClose: () => void;
  onDelete?: (id: string) => void;
  onWearInOutfit?: (item: ClothingItem) => void;
}

export const ItemDetailsModal: React.FC<ItemDetailsModalProps> = ({
  item,
  onClose,
  onDelete,
  onWearInOutfit,
}) => {
  if (!item) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden my-8">
        
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-stone-500 hover:text-stone-900 p-2 rounded-full hover:bg-stone-100 transition-colors z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Hero Garment Image */}
        <div className="relative aspect-[4/3] w-full bg-stone-100 overflow-hidden">
          <img
            src={item.imageUrl}
            alt={item.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute top-4 left-4 flex gap-1.5">
            <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-stone-950/80 text-white backdrop-blur-xs">
              {item.category}
            </span>
            {item.subcategory && (
              <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-white/90 text-stone-800 backdrop-blur-xs">
                {item.subcategory}
              </span>
            )}
          </div>
        </div>

        {/* Details Container */}
        <div className="p-6 space-y-4">
          <div>
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-editorial text-2xl font-bold text-stone-900">
                {item.name}
              </h3>
              {item.brand && (
                <span className="text-xs font-bold text-amber-800 uppercase tracking-wider">
                  {item.brand}
                </span>
              )}
            </div>

            <div className="flex items-center gap-3 text-xs text-stone-500 mt-1">
              <span>Color: <strong className="text-stone-700">{item.color}</strong></span>
              {item.material && (
                <>
                  <span>•</span>
                  <span>Fabric: <strong className="text-stone-700">{item.material}</strong></span>
                </>
              )}
              <span>•</span>
              <span>Formality: <strong className="text-stone-700">{item.formality}</strong></span>
            </div>
          </div>

          {/* Stylist Notes / Wear Guide */}
          {item.notes && (
            <div className="p-3.5 bg-stone-50 rounded-2xl border border-stone-200 text-xs text-stone-600 leading-relaxed">
              <span className="font-semibold text-stone-900 block mb-0.5">Styling Recommendations:</span>
              {item.notes}
            </div>
          )}

          {/* Seasonality */}
          <div>
            <span className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider block mb-1.5">
              Seasonal Versatility
            </span>
            <div className="flex flex-wrap gap-1.5">
              {item.seasonality.map((s, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-0.5 rounded-lg text-xs font-medium bg-stone-100 text-stone-700"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>

          {/* Tags */}
          {item.tags && item.tags.length > 0 && (
            <div>
              <span className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider block mb-1.5">
                Style Tags
              </span>
              <div className="flex flex-wrap gap-1.5">
                {item.tags.map((t, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-0.5 rounded-full text-xs font-mono bg-amber-50 text-amber-800 border border-amber-200/60"
                  >
                    #{t}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="pt-4 border-t border-stone-100 flex items-center justify-between gap-3">
            {onDelete && (
              <button
                type="button"
                id="delete-garment-modal-btn"
                onClick={() => {
                  if (confirm(`Delete "${item.name}" from your wardrobe?`)) {
                    onDelete(item.id);
                    onClose();
                  }
                }}
                className="flex items-center gap-1.5 text-xs text-stone-400 hover:text-rose-600 transition-colors p-2"
              >
                <Trash2 className="w-4 h-4" />
                <span>Delete</span>
              </button>
            )}

            {onWearInOutfit && (
              <button
                type="button"
                id="lock-wear-btn"
                onClick={() => {
                  onWearInOutfit(item);
                  onClose();
                }}
                className="flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold bg-amber-400 hover:bg-amber-300 text-stone-950 ml-auto shadow-sm transition-colors cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Feature in Next Outfit</span>
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
