import React from 'react';
import { 
  Sparkles, 
  Shirt, 
  BookmarkCheck, 
  Layers, 
  ShoppingBag, 
  Crown, 
  Plus, 
  CloudSun 
} from 'lucide-react';
import { WeatherOption } from '../types';

interface HeaderProps {
  activeTab: 'wardrobe' | 'generator' | 'lookbook' | 'stylepacks' | 'affiliates';
  onTabChange: (tab: 'wardrobe' | 'generator' | 'lookbook' | 'stylepacks' | 'affiliates') => void;
  wardrobeCount: number;
  savedCount: number;
  isVip: boolean;
  onOpenVipModal: () => void;
  onOpenUploadModal: () => void;
  currentWeather: WeatherOption;
  onSelectWeather: (w: WeatherOption) => void;
  weatherOptions: WeatherOption[];
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onTabChange,
  wardrobeCount,
  savedCount,
  isVip,
  onOpenVipModal,
  onOpenUploadModal,
  currentWeather,
  onSelectWeather,
  weatherOptions,
}) => {
  const [showWeatherMenu, setShowWeatherMenu] = React.useState(false);

  return (
    <header className="sticky top-0 z-30 bg-stone-900 text-stone-100 border-b border-stone-800 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Logo / Branding */}
          <div className="flex items-center gap-3">
            <button 
              id="header-logo-btn"
              onClick={() => onTabChange('generator')}
              className="flex items-center gap-2.5 text-left group"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-stone-800 to-stone-700 border border-stone-600 flex items-center justify-center shadow-inner group-hover:border-amber-400/50 transition-all">
                <Sparkles className="w-5 h-5 text-amber-300" />
              </div>
              <div>
                <span className="font-editorial text-xl sm:text-2xl font-bold tracking-tight text-white block leading-none">
                  AuraFit
                </span>
                <span className="text-[11px] uppercase tracking-widest text-stone-400 font-medium">
                  AI Outfit Planner
                </span>
              </div>
            </button>

            {/* Weather Quick Capsule */}
            <div className="relative hidden md:block ml-4">
              <button
                id="header-weather-btn"
                onClick={() => setShowWeatherMenu(!showWeatherMenu)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-stone-800/80 hover:bg-stone-800 border border-stone-700/80 text-xs text-stone-300 transition-colors"
                title="Current weather condition for styling"
              >
                <CloudSun className="w-3.5 h-3.5 text-amber-400" />
                <span className="font-medium text-white">{currentWeather.temp}</span>
                <span className="text-stone-400 truncate max-w-[90px]">{currentWeather.label}</span>
              </button>

              {showWeatherMenu && (
                <div 
                  className="absolute left-0 mt-2 w-64 bg-stone-900 border border-stone-700 rounded-xl shadow-2xl p-2 z-50 text-xs"
                  onClick={() => setShowWeatherMenu(false)}
                >
                  <div className="px-2 py-1.5 font-semibold text-stone-400 uppercase tracking-wider text-[10px]">
                    Select Live Weather Context
                  </div>
                  {weatherOptions.map((w) => (
                    <button
                      key={w.id}
                      id={`weather-option-${w.id}`}
                      onClick={() => onSelectWeather(w)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-left transition-colors ${
                        currentWeather.id === w.id
                          ? 'bg-amber-500/10 text-amber-300 font-medium'
                          : 'text-stone-300 hover:bg-stone-800'
                      }`}
                    >
                      <div className="flex flex-col">
                        <span className="font-medium text-stone-200">{w.label}</span>
                        <span className="text-[10px] text-stone-400">{w.condition}</span>
                      </div>
                      <span className="text-stone-300 font-mono text-[11px]">{w.temp.split('/')[0]}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Center Navigation Tabs */}
          <nav className="hidden lg:flex items-center gap-1 bg-stone-800/60 p-1.5 rounded-full border border-stone-700/60">
            <button
              id="nav-tab-generator"
              onClick={() => onTabChange('generator')}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium transition-all ${
                activeTab === 'generator'
                  ? 'bg-amber-400 text-stone-950 font-semibold shadow-sm'
                  : 'text-stone-300 hover:text-white hover:bg-stone-700/40'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Outfit Studio</span>
            </button>

            <button
              id="nav-tab-wardrobe"
              onClick={() => onTabChange('wardrobe')}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium transition-all ${
                activeTab === 'wardrobe'
                  ? 'bg-stone-100 text-stone-900 font-semibold shadow-sm'
                  : 'text-stone-300 hover:text-white hover:bg-stone-700/40'
              }`}
            >
              <Shirt className="w-3.5 h-3.5" />
              <span>My Closet</span>
              <span className={`px-1.5 py-0.5 rounded-full text-[10px] ${
                activeTab === 'wardrobe' ? 'bg-stone-200 text-stone-800' : 'bg-stone-700 text-stone-300'
              }`}>
                {wardrobeCount}
              </span>
            </button>

            <button
              id="nav-tab-lookbook"
              onClick={() => onTabChange('lookbook')}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium transition-all ${
                activeTab === 'lookbook'
                  ? 'bg-stone-100 text-stone-900 font-semibold shadow-sm'
                  : 'text-stone-300 hover:text-white hover:bg-stone-700/40'
              }`}
            >
              <BookmarkCheck className="w-3.5 h-3.5" />
              <span>Lookbook</span>
              {savedCount > 0 && (
                <span className={`px-1.5 py-0.5 rounded-full text-[10px] ${
                  activeTab === 'lookbook' ? 'bg-stone-200 text-stone-800' : 'bg-stone-700 text-stone-300'
                }`}>
                  {savedCount}
                </span>
              )}
            </button>

            <button
              id="nav-tab-stylepacks"
              onClick={() => onTabChange('stylepacks')}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium transition-all ${
                activeTab === 'stylepacks'
                  ? 'bg-stone-100 text-stone-900 font-semibold shadow-sm'
                  : 'text-stone-300 hover:text-white hover:bg-stone-700/40'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Style Packs</span>
              <span className="px-1.5 py-0.5 rounded-full text-[9px] bg-amber-500/20 text-amber-300 font-bold">
                PRO
              </span>
            </button>

            <button
              id="nav-tab-affiliates"
              onClick={() => onTabChange('affiliates')}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium transition-all ${
                activeTab === 'affiliates'
                  ? 'bg-stone-100 text-stone-900 font-semibold shadow-sm'
                  : 'text-stone-300 hover:text-white hover:bg-stone-700/40'
              }`}
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Partner Shop</span>
            </button>
          </nav>

          {/* Right Action Area */}
          <div className="flex items-center gap-2.5">
            {/* VIP Tier Badge / Button */}
            <button
              id="header-vip-toggle-btn"
              onClick={onOpenVipModal}
              className={`flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-full text-xs font-medium transition-all ${
                isVip
                  ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-stone-950 font-bold shadow-md shadow-amber-500/20'
                  : 'bg-stone-800 hover:bg-stone-750 text-amber-300 border border-amber-500/30'
              }`}
            >
              <Crown className="w-3.5 h-3.5 text-amber-300 fill-amber-300/30" />
              <span className="hidden sm:inline">{isVip ? 'VIP Stylist Active' : 'Upgrade to VIP'}</span>
              <span className="sm:hidden">{isVip ? 'VIP' : 'PRO'}</span>
            </button>

            {/* Upload Garment Button */}
            <button
              id="header-upload-garment-btn"
              onClick={onOpenUploadModal}
              className="flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs font-semibold bg-white text-stone-900 hover:bg-stone-200 transition-colors shadow-sm cursor-pointer"
            >
              <Plus className="w-4 h-4 text-stone-900" />
              <span className="hidden sm:inline">Add Clothes</span>
              <span className="sm:hidden">Add</span>
            </button>
          </div>

        </div>

        {/* Mobile Sub-Navigation Bar */}
        <div className="flex lg:hidden overflow-x-auto py-2.5 gap-2 scrollbar-none border-t border-stone-800 text-xs">
          <button
            id="mobile-nav-generator"
            onClick={() => onTabChange('generator')}
            className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full font-medium ${
              activeTab === 'generator' ? 'bg-amber-400 text-stone-950 font-semibold' : 'text-stone-300 bg-stone-800/80'
            }`}
          >
            <Sparkles className="w-3 h-3" />
            Studio
          </button>
          <button
            id="mobile-nav-wardrobe"
            onClick={() => onTabChange('wardrobe')}
            className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full font-medium ${
              activeTab === 'wardrobe' ? 'bg-white text-stone-900 font-semibold' : 'text-stone-300 bg-stone-800/80'
            }`}
          >
            <Shirt className="w-3 h-3" />
            Closet ({wardrobeCount})
          </button>
          <button
            id="mobile-nav-lookbook"
            onClick={() => onTabChange('lookbook')}
            className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full font-medium ${
              activeTab === 'lookbook' ? 'bg-white text-stone-900 font-semibold' : 'text-stone-300 bg-stone-800/80'
            }`}
          >
            <BookmarkCheck className="w-3 h-3" />
            Lookbook ({savedCount})
          </button>
          <button
            id="mobile-nav-stylepacks"
            onClick={() => onTabChange('stylepacks')}
            className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full font-medium ${
              activeTab === 'stylepacks' ? 'bg-white text-stone-900 font-semibold' : 'text-stone-300 bg-stone-800/80'
            }`}
          >
            <Layers className="w-3 h-3" />
            Capsules
          </button>
          <button
            id="mobile-nav-affiliates"
            onClick={() => onTabChange('affiliates')}
            className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full font-medium ${
              activeTab === 'affiliates' ? 'bg-white text-stone-900 font-semibold' : 'text-stone-300 bg-stone-800/80'
            }`}
          >
            <ShoppingBag className="w-3 h-3" />
            Shop
          </button>
        </div>
      </div>
    </header>
  );
};
