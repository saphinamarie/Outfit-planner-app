import React, { useState } from 'react';
import { 
  Layers, 
  Sparkles, 
  Check, 
  Lock, 
  Unlock, 
  Download, 
  ArrowRight, 
  Tag, 
  ShoppingBag,
  ExternalLink
} from 'lucide-react';
import { StylePack, ClothingItem } from '../types';

interface StylePacksViewProps {
  stylePacks: StylePack[];
  onUnlockPack: (packId: string) => void;
  onImportPackItems: (pack: StylePack) => void;
  isVip: boolean;
  onOpenVipModal: () => void;
  onSelectPackForStyling: (pack: StylePack) => void;
}

export const StylePacksView: React.FC<StylePacksViewProps> = ({
  stylePacks,
  onUnlockPack,
  onImportPackItems,
  isVip,
  onOpenVipModal,
  onSelectPackForStyling,
}) => {
  const [selectedPack, setSelectedPack] = useState<StylePack>(stylePacks[0]);
  const [importedPackIds, setImportedPackIds] = useState<string[]>([]);

  const handleImport = (pack: StylePack) => {
    onImportPackItems(pack);
    setImportedPackIds((prev) => [...prev, pack.id]);
    alert(`Imported ${pack.capsuleItems.length} capsule garments into your closet! You can now style outfits with them.`);
  };

  return (
    <div className="space-y-8">
      
      {/* Editorial Header Banner */}
      <div className="bg-stone-900 text-stone-100 rounded-3xl p-6 sm:p-10 border border-stone-800 shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-amber-400 text-stone-950">
                Curated Capsules
              </span>
              <span className="text-xs text-stone-400 uppercase tracking-widest font-medium">
                Style Packs & Modular Wardrobes
              </span>
            </div>
            <h2 className="font-editorial text-3xl sm:text-5xl font-bold tracking-tight text-white">
              Signature Style Packs
            </h2>
            <p className="text-xs sm:text-sm text-stone-300 mt-2 leading-relaxed">
              Professionally engineered mini-capsules with mathematically balanced color palettes and mix-and-match formulas. Unlock complete packs or import pieces directly into your digital closet.
            </p>
          </div>

          <div className="bg-stone-800/80 p-5 rounded-2xl border border-stone-700/80 flex flex-col justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 text-amber-300 font-semibold">
              <Sparkles className="w-4 h-4" />
              <span>VIP All-Access Pass</span>
            </div>
            <p className="text-stone-400">
              VIP Stylist members get unlimited instant unlocks on all current and upcoming seasonal packs.
            </p>
            {!isVip && (
              <button
                type="button"
                id="unlock-all-packs-btn"
                onClick={onOpenVipModal}
                className="w-full py-2 rounded-full font-bold bg-amber-400 text-stone-950 hover:bg-amber-300 transition-colors text-center"
              >
                Unlock All Style Packs
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Style Pack Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stylePacks.map((pack) => {
          const isUnlocked = pack.isUnlocked || isVip;
          const isSelected = selectedPack.id === pack.id;
          const isImported = importedPackIds.includes(pack.id);

          return (
            <div
              key={pack.id}
              onClick={() => setSelectedPack(pack)}
              className={`flex flex-col bg-white rounded-3xl overflow-hidden border transition-all cursor-pointer ${
                isSelected
                  ? 'border-stone-900 ring-2 ring-stone-900/10 shadow-lg'
                  : 'border-stone-200 hover:border-stone-400 shadow-xs'
              }`}
            >
              {/* Cover Image */}
              <div className="relative aspect-[4/5] w-full overflow-hidden bg-stone-100">
                <img
                  src={pack.coverImage}
                  alt={pack.name}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-stone-950/20 to-transparent" />

                {/* Status Badge */}
                <div className="absolute top-3 right-3">
                  {isUnlocked ? (
                    <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/90 text-white backdrop-blur-xs">
                      <Unlock className="w-3 h-3" />
                      <span>Unlocked</span>
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-stone-900/80 text-amber-300 border border-amber-400/40 backdrop-blur-xs">
                      <Lock className="w-3 h-3" />
                      <span>{pack.price}</span>
                    </span>
                  )}
                </div>

                {/* Cover Title Info */}
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <span className="text-[10px] uppercase font-bold tracking-widest text-amber-300 block mb-1">
                    {pack.aestheticVibe}
                  </span>
                  <h3 className="font-editorial text-xl font-bold leading-tight">
                    {pack.name}
                  </h3>
                </div>
              </div>

              {/* Body */}
              <div className="p-4 flex flex-col justify-between flex-1 gap-3">
                <p className="text-xs text-stone-600 line-clamp-2">
                  {pack.tagline}
                </p>

                <div className="flex items-center justify-between text-[11px] text-stone-500 pt-2 border-t border-stone-100">
                  <span>{pack.sampleItemsCount} Capsule Pieces</span>
                  <span className="font-medium text-stone-800">
                    {isUnlocked ? 'Ready to Import' : `One-Time ${pack.price}`}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Style Pack Detail Inspector */}
      {selectedPack && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm space-y-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-stone-100">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-stone-100 text-stone-700">
                  {selectedPack.aestheticVibe}
                </span>
                <span className="text-xs text-stone-400">
                  {selectedPack.sampleItemsCount} curated pieces
                </span>
              </div>
              <h3 className="font-editorial text-2xl sm:text-3xl font-bold text-stone-900">
                {selectedPack.name}
              </h3>
              <p className="text-xs sm:text-sm text-stone-600 mt-1 max-w-xl">
                {selectedPack.description}
              </p>
            </div>

            {/* Pack Action Button */}
            <div className="flex items-center gap-3 flex-wrap">
              {selectedPack.isUnlocked || isVip ? (
                <>
                  <button
                    type="button"
                    id="import-pack-btn"
                    onClick={() => handleImport(selectedPack)}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold bg-stone-900 hover:bg-stone-800 text-white shadow-sm transition-all"
                  >
                    <Download className="w-4 h-4 text-amber-300" />
                    <span>Import Pieces into My Closet</span>
                  </button>
                  <button
                    type="button"
                    id="style-with-pack-btn"
                    onClick={() => onSelectPackForStyling(selectedPack)}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold bg-amber-400 hover:bg-amber-300 text-stone-950 shadow-sm transition-all"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>Style Looks in Studio</span>
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  id="unlock-selected-pack-btn"
                  onClick={() => {
                    onUnlockPack(selectedPack.id);
                    alert(`Unlocked ${selectedPack.name}! The capsule pieces are now ready to import.`);
                  }}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-full text-xs font-bold bg-amber-400 hover:bg-amber-300 text-stone-950 shadow-md transition-all"
                >
                  <Unlock className="w-4 h-4" />
                  <span>Unlock Pack ({selectedPack.price})</span>
                </button>
              )}
            </div>
          </div>

          {/* Capsule Pieces Preview Gallery */}
          <div>
            <h4 className="font-semibold text-xs uppercase tracking-wider text-stone-700 mb-3">
              Included Capsule Garments ({selectedPack.capsuleItems.length} Featured)
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {selectedPack.capsuleItems.map((item, idx) => (
                <div
                  key={idx}
                  className="flex gap-3 p-3 rounded-2xl bg-stone-50 border border-stone-200"
                >
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="w-16 h-20 rounded-xl object-cover flex-shrink-0"
                  />
                  <div className="flex flex-col justify-between flex-1 text-xs">
                    <div>
                      <span className="text-[10px] font-semibold text-amber-800 uppercase">
                        {item.category} • {item.subcategory || 'Essential'}
                      </span>
                      <h5 className="font-medium text-stone-900 line-clamp-1 mt-0.5">
                        {item.name}
                      </h5>
                      <p className="text-[11px] text-stone-500">{item.material || item.color}</p>
                    </div>
                    <span className="text-[10px] text-stone-400">{item.notes}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Key Features / Formulas */}
          <div className="bg-stone-50 rounded-2xl p-5 border border-stone-200">
            <h4 className="font-semibold text-xs uppercase tracking-wider text-stone-800 mb-2">
              Capsule Styling Masterclass Features
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-stone-600">
              {selectedPack.features.map((feat, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                  <span>{feat}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

    </div>
  );
};
