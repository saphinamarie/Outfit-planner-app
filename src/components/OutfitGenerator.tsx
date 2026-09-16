import React, { useState } from 'react';
import { 
  Sparkles, 
  Crown, 
  RefreshCw, 
  CloudSun, 
  Sun, 
  CloudRain, 
  Snowflake, 
  Flame,
  Briefcase, 
  Wine, 
  Coffee, 
  Plane, 
  ShoppingBag,
  Sliders,
  Check,
  ChevronRight,
  Shirt,
  AlertTriangle
} from 'lucide-react';
import { 
  ClothingItem, 
  Outfit, 
  WeatherOption, 
  OccasionOption, 
  StyleAestheticOption 
} from '../types';
import { OutfitDisplay } from './OutfitDisplay';

interface OutfitGeneratorProps {
  wardrobe: ClothingItem[];
  selectedItemIds: string[];
  weatherOptions: WeatherOption[];
  occasionOptions: OccasionOption[];
  styleAesthetics: StyleAestheticOption[];
  currentWeather: WeatherOption;
  isVip: boolean;
  onOpenVipModal: () => void;
  onOpenUploadModal: () => void;
  onSaveOutfit: (outfit: Outfit) => void;
  savedOutfits: Outfit[];
  onAffiliateClick: (item: any) => void;
  onViewItemDetails: (item: ClothingItem) => void;
  onOpenStylistChat: (outfit: Outfit) => void;
}

export const OutfitGenerator: React.FC<OutfitGeneratorProps> = ({
  wardrobe,
  selectedItemIds,
  weatherOptions,
  occasionOptions,
  styleAesthetics,
  currentWeather,
  isVip,
  onOpenVipModal,
  onOpenUploadModal,
  onSaveOutfit,
  savedOutfits,
  onAffiliateClick,
  onViewItemDetails,
  onOpenStylistChat,
}) => {
  const [selectedOccasion, setSelectedOccasion] = useState<string>(occasionOptions[0].label);
  const [customOccasion, setCustomOccasion] = useState('');
  const [selectedWeather, setSelectedWeather] = useState<string>(currentWeather.label);
  const [selectedStyle, setSelectedStyle] = useState<string>(styleAesthetics[0].name);
  const [customPrompt, setCustomPrompt] = useState('');
  const [useVipMode, setUseVipMode] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationError, setGenerationError] = useState<string | null>(null);
  const [activeOutfit, setActiveOutfit] = useState<Outfit | null>(null);

  // Weather icons
  const getWeatherIcon = (iconName: string) => {
    switch (iconName) {
      case 'Sun': return <Sun className="w-4 h-4 text-amber-500" />;
      case 'CloudRain': return <CloudRain className="w-4 h-4 text-sky-500" />;
      case 'Snowflake': return <Snowflake className="w-4 h-4 text-indigo-400" />;
      case 'Flame': return <Flame className="w-4 h-4 text-orange-500" />;
      default: return <CloudSun className="w-4 h-4 text-amber-400" />;
    }
  };

  // Occasion icons
  const getOccasionIcon = (iconName: string) => {
    switch (iconName) {
      case 'Sparkles': return <Sparkles className="w-4 h-4 text-purple-500" />;
      case 'Coffee': return <Coffee className="w-4 h-4 text-amber-700" />;
      case 'Plane': return <Plane className="w-4 h-4 text-sky-600" />;
      case 'Wine': return <Wine className="w-4 h-4 text-rose-600" />;
      case 'ShoppingBag': return <ShoppingBag className="w-4 h-4 text-emerald-600" />;
      default: return <Briefcase className="w-4 h-4 text-stone-700" />;
    }
  };

  const handleGenerate = async () => {
    if (wardrobe.length === 0) {
      alert('Please upload or keep at least a few pieces in your closet to generate outfits.');
      return;
    }

    setIsGenerating(true);
    setGenerationError(null);

    const occasionText = customOccasion.trim() ? customOccasion.trim() : selectedOccasion;

    // Filter items: if user specifically selected pieces in closet, prioritize them
    let itemsToConsider = wardrobe;
    if (selectedItemIds.length > 0) {
      const locked = wardrobe.filter((w) => selectedItemIds.includes(w.id));
      if (locked.length > 0) {
        itemsToConsider = locked;
      }
    }

    try {
      const response = await fetch('/api/generate-outfit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: itemsToConsider,
          occasion: occasionText,
          weather: selectedWeather,
          styleAesthetic: selectedStyle,
          isPremium: isVip && useVipMode,
          customPrompt: customPrompt.trim(),
        }),
      });

      if (!response.ok) {
        throw new Error('Outfit generation failed');
      }

      const data = await response.json();
      if (data.outfit) {
        setActiveOutfit(data.outfit);
      } else {
        throw new Error('Invalid outfit data received');
      }
    } catch (err: any) {
      console.error('Generation error:', err);
      setGenerationError('Failed to generate outfit via server. Please retry in a moment.');
    } finally {
      setIsGenerating(false);
    }
  };

  const isFavorite = activeOutfit
    ? savedOutfits.some((s) => s.id === activeOutfit.id)
    : false;

  const handleToggleFavorite = () => {
    if (!activeOutfit) return;
    onSaveOutfit(activeOutfit);
  };

  return (
    <div className="space-y-8">
      
      {/* Configuration Studio Panel */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-stone-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-amber-400 text-stone-950">
                <Sparkles className="w-5 h-5" />
              </span>
              <h2 className="font-editorial text-2xl sm:text-3xl font-bold text-stone-900">
                AI Outfit Studio
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-stone-500 mt-1">
              Select your occasion, forecast, and aesthetic. Gemini AI analyzes your wardrobe to architect an editorial ensemble.
            </p>
          </div>

          {/* VIP Toggle Pill */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              id="vip-mode-toggle"
              onClick={() => {
                if (!isVip) {
                  onOpenVipModal();
                } else {
                  setUseVipMode(!useVipMode);
                }
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold border transition-all ${
                isVip && useVipMode
                  ? 'bg-gradient-to-r from-purple-900 to-stone-900 text-amber-300 border-amber-400/50 shadow-sm'
                  : isVip
                  ? 'bg-stone-100 text-stone-700 border-stone-300 hover:bg-stone-200'
                  : 'bg-stone-100 text-stone-600 border-dashed border-stone-300 hover:border-amber-400'
              }`}
            >
              <Crown className="w-3.5 h-3.5 text-amber-400" />
              <span>
                {isVip
                  ? useVipMode
                    ? 'Haute Couture Mode Active'
                    : 'Enable VIP Styling Tier'
                  : 'Unlock VIP Runway Mode'}
              </span>
            </button>
          </div>
        </div>

        {/* Selected Items Notice if any are locked */}
        {selectedItemIds.length > 0 && (
          <div className="my-4 p-3 bg-stone-50 rounded-2xl border border-stone-200 flex items-center justify-between text-xs text-stone-700">
            <div className="flex items-center gap-2">
              <Shirt className="w-4 h-4 text-amber-600" />
              <span>
                Restricting AI to your <span className="font-bold">{selectedItemIds.length}</span> locked closet pieces.
              </span>
            </div>
            <span className="text-[11px] text-stone-400">
              Deselect in Closet tab to use full wardrobe
            </span>
          </div>
        )}

        {/* Studio Parameters Form */}
        <div className="mt-6 space-y-6">
          
          {/* 1. Occasion Selector */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-2">
              1. Where Are You Headed? (Occasion)
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
              {occasionOptions.map((occ) => {
                const isSelected = selectedOccasion === occ.label && !customOccasion;
                return (
                  <button
                    key={occ.id}
                    type="button"
                    id={`btn-occasion-${occ.id}`}
                    onClick={() => {
                      setSelectedOccasion(occ.label);
                      setCustomOccasion('');
                    }}
                    className={`flex flex-col items-start p-3 rounded-2xl border text-left transition-all ${
                      isSelected
                        ? 'bg-stone-900 text-white border-stone-900 shadow-sm ring-2 ring-stone-900/20'
                        : 'bg-white hover:bg-stone-50 border-stone-200 text-stone-800'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full mb-1.5">
                      {getOccasionIcon(occ.iconName)}
                      {isSelected && <Check className="w-3.5 h-3.5 text-amber-300" />}
                    </div>
                    <span className="font-semibold text-xs leading-tight block mb-0.5">
                      {occ.label.split('&')[0]}
                    </span>
                    <span className={`text-[10px] truncate max-w-full ${isSelected ? 'text-stone-300' : 'text-stone-500'}`}>
                      {occ.vibe}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Custom Occasion Input */}
            <div className="mt-2.5">
              <input
                id="custom-occasion-input"
                type="text"
                value={customOccasion}
                onChange={(e) => setCustomOccasion(e.target.value)}
                placeholder="Or specify custom event (e.g. Modernist Museum Vernissage, Napa Winery Dinner, Rainy Job Interview)..."
                className="w-full px-3.5 py-2 rounded-xl border border-stone-200 text-xs bg-stone-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
              />
            </div>
          </div>

          {/* 2. Weather Condition */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-2">
              2. Weather Forecast & Temperature
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
              {weatherOptions.map((w) => {
                const isSelected = selectedWeather === w.label;
                return (
                  <button
                    key={w.id}
                    type="button"
                    id={`btn-weather-${w.id}`}
                    onClick={() => setSelectedWeather(w.label)}
                    className={`flex flex-col items-start p-3 rounded-2xl border text-left transition-all ${
                      isSelected
                        ? 'bg-amber-50 border-amber-400 text-stone-900 shadow-xs ring-1 ring-amber-400'
                        : 'bg-white hover:bg-stone-50 border-stone-200 text-stone-800'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full mb-1">
                      {getWeatherIcon(w.iconName)}
                      <span className="font-mono text-[10px] font-bold text-stone-600">
                        {w.temp.split('/')[0]}
                      </span>
                    </div>
                    <span className="font-semibold text-xs leading-snug">
                      {w.label}
                    </span>
                    <span className="text-[10px] text-stone-500 line-clamp-1 mt-0.5">
                      {w.condition.split(',')[0]}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3. Style Aesthetic */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-2">
              3. Style Aesthetic Direction
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5">
              {styleAesthetics.map((st) => {
                const isSelected = selectedStyle === st.name;
                return (
                  <button
                    key={st.id}
                    type="button"
                    id={`btn-style-${st.id}`}
                    onClick={() => setSelectedStyle(st.name)}
                    className={`p-3 rounded-2xl border text-left transition-all ${
                      isSelected
                        ? 'bg-stone-900 text-white border-stone-900 shadow-sm'
                        : 'bg-white hover:bg-stone-50 border-stone-200 text-stone-800'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-semibold text-xs">{st.name}</span>
                      {isSelected && <Check className="w-3.5 h-3.5 text-amber-300" />}
                    </div>
                    {/* Palette swatches */}
                    <div className="flex items-center gap-1 mb-1.5">
                      {st.palette.map((hex, idx) => (
                        <span
                          key={idx}
                          className="w-3.5 h-3.5 rounded-full border border-stone-300"
                          style={{ backgroundColor: hex }}
                        />
                      ))}
                    </div>
                    <p className={`text-[10px] line-clamp-2 ${isSelected ? 'text-stone-300' : 'text-stone-500'}`}>
                      {st.description}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Custom Stylist Prompt / Requests */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
              Custom Stylist Directive (Optional)
            </label>
            <input
              id="custom-directive-input"
              type="text"
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
              placeholder="e.g. Include my trench coat, keep it casual enough for walking 10k steps, or prioritize neutral earth tones..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs bg-stone-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
            />
          </div>

          {/* Generate Button & Progress */}
          <div className="pt-4 border-t border-stone-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="text-xs text-stone-500">
              Styling with <span className="font-semibold text-stone-800">{wardrobe.length}</span> pieces in active capsule
            </div>

            <button
              type="button"
              id="generate-outfit-btn"
              disabled={isGenerating || wardrobe.length === 0}
              onClick={handleGenerate}
              className="flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-full text-sm font-bold bg-amber-400 hover:bg-amber-300 text-stone-950 shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-stone-950" />
                  <span>Curating Editorial Outfit with Gemini AI...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-stone-950" />
                  <span>Generate AI Outfit</span>
                </>
              )}
            </button>
          </div>

          {generationError && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 flex-shrink-0" />
              <span>{generationError}</span>
            </div>
          )}

        </div>
      </div>

      {/* Generated Outfit Output Section */}
      {activeOutfit && (
        <div id="active-outfit-container">
          <OutfitDisplay
            outfit={activeOutfit}
            isFavorite={isFavorite}
            onToggleFavorite={handleToggleFavorite}
            onRegenerate={handleGenerate}
            onAskStylist={() => onOpenStylistChat(activeOutfit)}
            onAffiliateClick={onAffiliateClick}
            onViewItemDetails={onViewItemDetails}
          />
        </div>
      )}

      {/* Fallback initial invitation if no outfit generated yet */}
      {!activeOutfit && !isGenerating && (
        <div className="bg-stone-100/70 border border-stone-200 rounded-3xl p-8 text-center">
          <Sparkles className="w-10 h-10 text-amber-500/80 mx-auto mb-3" />
          <h3 className="font-editorial text-xl font-bold text-stone-800">
            Ready to Style
          </h3>
          <p className="text-xs sm:text-sm text-stone-500 mt-1 max-w-md mx-auto">
            Click "Generate AI Outfit" above to formulate an editorial combination tailored to {selectedOccasion} and {selectedWeather}.
          </p>
        </div>
      )}

    </div>
  );
};
