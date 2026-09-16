import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { WardrobeView } from './components/WardrobeView';
import { OutfitGenerator } from './components/OutfitGenerator';
import { LookbookView } from './components/LookbookView';
import { StylePacksView } from './components/StylePacksView';
import { AffiliateShopView } from './components/AffiliateShopView';
import { UploadModal } from './components/UploadModal';
import { VipModal } from './components/VipModal';
import { ItemDetailsModal } from './components/ItemDetailsModal';
import { StylistChatModal } from './components/StylistChatModal';
import { 
  ClothingItem, 
  Outfit, 
  StylePack, 
  WeatherOption, 
  AffiliateItem 
} from './types';
import { 
  WEATHER_OPTIONS, 
  OCCASION_OPTIONS, 
  STYLE_AESTHETICS 
} from './data/presetOptions';
import { INITIAL_WARDROBE } from './data/sampleWardrobe';
import { 
  loadWardrobe, 
  saveWardrobe, 
  loadSavedOutfits, 
  saveOutfits, 
  loadStylePacks, 
  saveStylePacks, 
  loadVipStatus, 
  saveVipStatus 
} from './utils/storage';

export default function App() {
  const [activeTab, setActiveTab] = useState<
    'wardrobe' | 'generator' | 'lookbook' | 'stylepacks' | 'affiliates'
  >('generator');

  // Persistence States
  const [wardrobe, setWardrobe] = useState<ClothingItem[]>(() => loadWardrobe());
  const [selectedItemIds, setSelectedItemIds] = useState<string[]>([]);
  const [savedOutfits, setSavedOutfits] = useState<Outfit[]>(() => loadSavedOutfits());
  const [stylePacks, setStylePacks] = useState<StylePack[]>(() => loadStylePacks());
  const [isVip, setIsVip] = useState<boolean>(() => loadVipStatus());

  // Weather state
  const [currentWeather, setCurrentWeather] = useState<WeatherOption>(WEATHER_OPTIONS[0]);

  // Modals
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isVipModalOpen, setIsVipModalOpen] = useState(false);
  const [isStylistChatOpen, setIsStylistChatOpen] = useState(false);
  const [chatOutfitContext, setChatOutfitContext] = useState<Outfit | null>(null);
  const [detailItem, setDetailItem] = useState<ClothingItem | null>(null);

  // Sync wardrobe
  useEffect(() => {
    saveWardrobe(wardrobe);
  }, [wardrobe]);

  // Sync saved outfits
  useEffect(() => {
    saveOutfits(savedOutfits);
  }, [savedOutfits]);

  // Sync style packs
  useEffect(() => {
    saveStylePacks(stylePacks);
  }, [stylePacks]);

  // Sync VIP status
  useEffect(() => {
    saveVipStatus(isVip);
  }, [isVip]);

  // Garment Management
  const handleSaveItem = (item: ClothingItem) => {
    setWardrobe((prev) => [item, ...prev]);
  };

  const handleDeleteItem = (id: string) => {
    setWardrobe((prev) => prev.filter((item) => item.id !== id));
    setSelectedItemIds((prev) => prev.filter((itemId) => itemId !== id));
  };

  const handleToggleSelectItem = (item: ClothingItem) => {
    setSelectedItemIds((prev) =>
      prev.includes(item.id)
        ? prev.filter((id) => id !== item.id)
        : [...prev, item.id]
    );
  };

  const handleClearSelectedItems = () => {
    setSelectedItemIds([]);
  };

  const handleResetWardrobe = () => {
    setWardrobe(INITIAL_WARDROBE);
    setSelectedItemIds([]);
  };

  // Outfit Management
  const handleSaveOutfit = (outfit: Outfit) => {
    setSavedOutfits((prev) => {
      const exists = prev.some((o) => o.id === outfit.id);
      if (exists) {
        return prev.filter((o) => o.id !== outfit.id);
      }
      return [{ ...outfit, isFavorite: true }, ...prev];
    });
  };

  const handleRemoveSavedOutfit = (id: string) => {
    setSavedOutfits((prev) => prev.filter((o) => o.id !== id));
  };

  // Style Pack Management
  const handleUnlockPack = (packId: string) => {
    setStylePacks((prev) =>
      prev.map((p) => (p.id === packId ? { ...p, isUnlocked: true } : p))
    );
  };

  const handleImportPackItems = (pack: StylePack) => {
    const newItems: ClothingItem[] = pack.capsuleItems.map((c, idx) => ({
      ...c,
      id: `pack-${pack.id}-item-${Date.now()}-${idx}`,
      createdAt: new Date().toISOString(),
      isCustomUpload: false,
    }));

    setWardrobe((prev) => [...newItems, ...prev]);
  };

  const handleSelectPackForStyling = (pack: StylePack) => {
    setActiveTab('generator');
  };

  // Affiliate Click Handler
  const handleAffiliateClick = (item: AffiliateItem) => {
    console.log('Affiliate referral opened:', item.title, item.retailer);
  };

  const handleOpenStylistChat = (outfit: Outfit) => {
    setChatOutfitContext(outfit);
    setIsStylistChatOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-stone-50 text-stone-900 font-sans selection:bg-stone-200">
      
      {/* App Header */}
      <Header
        activeTab={activeTab}
        onTabChange={setActiveTab}
        wardrobeCount={wardrobe.length}
        savedCount={savedOutfits.length}
        isVip={isVip}
        onOpenVipModal={() => setIsVipModalOpen(true)}
        onOpenUploadModal={() => setIsUploadModalOpen(true)}
        currentWeather={currentWeather}
        onSelectWeather={setCurrentWeather}
        weatherOptions={WEATHER_OPTIONS}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        {activeTab === 'generator' && (
          <OutfitGenerator
            wardrobe={wardrobe}
            selectedItemIds={selectedItemIds}
            weatherOptions={WEATHER_OPTIONS}
            occasionOptions={OCCASION_OPTIONS}
            styleAesthetics={STYLE_AESTHETICS}
            currentWeather={currentWeather}
            isVip={isVip}
            onOpenVipModal={() => setIsVipModalOpen(true)}
            onOpenUploadModal={() => setIsUploadModalOpen(true)}
            onSaveOutfit={handleSaveOutfit}
            savedOutfits={savedOutfits}
            onAffiliateClick={handleAffiliateClick}
            onViewItemDetails={(item) => setDetailItem(item)}
            onOpenStylistChat={handleOpenStylistChat}
          />
        )}

        {activeTab === 'wardrobe' && (
          <WardrobeView
            wardrobe={wardrobe}
            selectedItemIds={selectedItemIds}
            onToggleSelectItem={handleToggleSelectItem}
            onClearSelectedItems={handleClearSelectedItems}
            onDeleteItem={handleDeleteItem}
            onOpenUpload={() => setIsUploadModalOpen(true)}
            onGenerateWithSelected={() => setActiveTab('generator')}
            onResetToDefault={handleResetWardrobe}
            onViewItemDetails={(item) => setDetailItem(item)}
          />
        )}

        {activeTab === 'lookbook' && (
          <LookbookView
            savedOutfits={savedOutfits}
            onRemoveOutfit={handleRemoveSavedOutfit}
            onSelectOutfit={(outfit) => {
              setActiveTab('generator');
            }}
            onViewItemDetails={(item) => setDetailItem(item)}
          />
        )}

        {activeTab === 'stylepacks' && (
          <StylePacksView
            stylePacks={stylePacks}
            onUnlockPack={handleUnlockPack}
            onImportPackItems={handleImportPackItems}
            isVip={isVip}
            onOpenVipModal={() => setIsVipModalOpen(true)}
            onSelectPackForStyling={handleSelectPackForStyling}
          />
        )}

        {activeTab === 'affiliates' && (
          <AffiliateShopView
            onAffiliateClick={handleAffiliateClick}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-stone-200 bg-white py-8 text-xs text-stone-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-editorial text-base font-bold text-stone-900">AuraFit</span>
            <span>•</span>
            <span>AI Outfit Planner & Capsule Stylist</span>
          </div>
          <div className="flex items-center gap-4 text-[11px] text-stone-400">
            <span>Server-Side Gemini 3.8 Flash Vision</span>
            <span>•</span>
            <span>Verified Affiliate Network</span>
            <span>•</span>
            <span>Private Local Storage Persistence</span>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <UploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onSaveItem={handleSaveItem}
      />

      <VipModal
        isOpen={isVipModalOpen}
        onClose={() => setIsVipModalOpen(false)}
        isVip={isVip}
        onToggleVip={(status) => setIsVip(status)}
      />

      <ItemDetailsModal
        item={detailItem}
        onClose={() => setDetailItem(null)}
        onDelete={handleDeleteItem}
        onWearInOutfit={(item) => {
          if (!selectedItemIds.includes(item.id)) {
            setSelectedItemIds((prev) => [...prev, item.id]);
          }
          setActiveTab('generator');
        }}
      />

      <StylistChatModal
        isOpen={isStylistChatOpen}
        onClose={() => setIsStylistChatOpen(false)}
        currentOutfit={chatOutfitContext}
        wardrobe={wardrobe}
      />

    </div>
  );
}
