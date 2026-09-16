import React, { useState, useMemo } from 'react';
import { 
  Shirt, 
  Search, 
  Plus, 
  Sparkles, 
  RotateCcw, 
  CheckSquare, 
  Square,
  SlidersHorizontal,
  Lightbulb
} from 'lucide-react';
import { ClothingCategory, ClothingItem, FormalityLevel } from '../types';
import { ClothingCard } from './ClothingCard';

interface WardrobeViewProps {
  wardrobe: ClothingItem[];
  selectedItemIds: string[];
  onToggleSelectItem: (item: ClothingItem) => void;
  onClearSelectedItems: () => void;
  onDeleteItem: (id: string) => void;
  onOpenUpload: () => void;
  onGenerateWithSelected: () => void;
  onResetToDefault: () => void;
  onViewItemDetails: (item: ClothingItem) => void;
}

const CATEGORIES: { id: ClothingCategory | 'all'; label: string }[] = [
  { id: 'all', label: 'All Garments' },
  { id: 'tops', label: 'Tops' },
  { id: 'bottoms', label: 'Bottoms' },
  { id: 'outerwear', label: 'Outerwear' },
  { id: 'footwear', label: 'Shoes' },
  { id: 'bags', label: 'Bags' },
  { id: 'accessories', label: 'Accessories' },
];

export const WardrobeView: React.FC<WardrobeViewProps> = ({
  wardrobe,
  selectedItemIds,
  onToggleSelectItem,
  onClearSelectedItems,
  onDeleteItem,
  onOpenUpload,
  onGenerateWithSelected,
  onResetToDefault,
  onViewItemDetails,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<ClothingCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [formalityFilter, setFormalityFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'name' | 'category'>('newest');

  // Filtered Items
  const filteredItems = useMemo(() => {
    return wardrobe
      .filter((item) => {
        if (selectedCategory !== 'all' && item.category !== selectedCategory) {
          return false;
        }
        if (formalityFilter !== 'all' && item.formality !== formalityFilter) {
          return false;
        }
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchName = item.name.toLowerCase().includes(q);
          const matchColor = item.color.toLowerCase().includes(q);
          const matchBrand = item.brand?.toLowerCase().includes(q);
          const matchTags = item.tags.some((t) => t.toLowerCase().includes(q));
          return matchName || matchColor || matchBrand || matchTags;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'name') return a.name.localeCompare(b.name);
        if (sortBy === 'category') return a.category.localeCompare(b.category);
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
  }, [wardrobe, selectedCategory, formalityFilter, searchQuery, sortBy]);

  // Category counts
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: wardrobe.length };
    wardrobe.forEach((it) => {
      counts[it.category] = (counts[it.category] || 0) + 1;
    });
    return counts;
  }, [wardrobe]);

  return (
    <div className="space-y-6">
      
      {/* Top Controls Banner */}
      <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-editorial text-2xl sm:text-3xl font-bold text-stone-900">
                Digital Capsule Wardrobe
              </h2>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-stone-100 text-stone-700">
                {wardrobe.length} Pieces
              </span>
            </div>
            <p className="text-sm text-stone-500 mt-1 max-w-xl">
              Upload real photos of your clothes. The AI tracks palette compatibility, warmth ratings, and silhouettes to compose complete outfits.
            </p>
          </div>

          {/* Action CTAs */}
          <div className="flex items-center gap-2.5 flex-wrap">
            <button
              type="button"
              id="wardrobe-upload-cta"
              onClick={onOpenUpload}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-semibold bg-stone-900 hover:bg-stone-800 text-white shadow-sm transition-all"
            >
              <Plus className="w-4 h-4 text-amber-300" />
              <span>Upload Garment</span>
            </button>

            {selectedItemIds.length > 0 && (
              <button
                type="button"
                id="generate-selected-cta"
                onClick={onGenerateWithSelected}
                className="flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-semibold bg-amber-400 hover:bg-amber-300 text-stone-950 shadow-md transition-all"
              >
                <Sparkles className="w-4 h-4" />
                <span>Style {selectedItemIds.length} Selected</span>
              </button>
            )}

            <button
              type="button"
              id="reset-wardrobe-btn"
              onClick={() => {
                if (confirm('Reset wardrobe back to starter sample pieces?')) {
                  onResetToDefault();
                }
              }}
              title="Reset to starter curated capsule"
              className="p-2.5 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Selected Pieces Floating Subbar */}
        {selectedItemIds.length > 0 && (
          <div className="mt-4 pt-4 border-t border-stone-100 flex items-center justify-between text-xs bg-amber-50/60 p-3 rounded-2xl border-amber-200/60">
            <div className="flex items-center gap-2 text-amber-900 font-medium">
              <CheckSquare className="w-4 h-4 text-amber-600" />
              <span>{selectedItemIds.length} garments currently locked for AI styling</span>
            </div>
            <button
              type="button"
              id="clear-selected-btn"
              onClick={onClearSelectedItems}
              className="text-stone-500 hover:text-stone-800 underline transition-colors"
            >
              Deselect All
            </button>
          </div>
        )}

        {/* Search & Category Filter Row */}
        <div className="mt-6 flex flex-col sm:flex-row gap-3 items-center justify-between">
          {/* Search Bar */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              id="wardrobe-search-input"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by color, fabric, brand..."
              className="w-full pl-9 pr-3.5 py-2 rounded-full border border-stone-200 text-xs bg-stone-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
            />
          </div>

          {/* Formality Dropdown & Sort */}
          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <div className="flex items-center gap-1.5 text-xs text-stone-500">
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <select
                id="formality-filter-select"
                value={formalityFilter}
                onChange={(e) => setFormalityFilter(e.target.value)}
                className="bg-transparent border border-stone-200 rounded-lg px-2.5 py-1.5 text-xs text-stone-700 focus:outline-none"
              >
                <option value="all">All Formalities</option>
                <option value="Casual">Casual</option>
                <option value="Smart Casual">Smart Casual</option>
                <option value="Business Formal">Business Formal</option>
                <option value="Evening / Cocktail">Evening / Cocktail</option>
                <option value="Streetwear">Streetwear</option>
              </select>
            </div>

            <select
              id="sort-wardrobe-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-transparent border border-stone-200 rounded-lg px-2.5 py-1.5 text-xs text-stone-700 focus:outline-none"
            >
              <option value="newest">Newest First</option>
              <option value="name">Alphabetical</option>
              <option value="category">By Category</option>
            </select>
          </div>
        </div>

        {/* Category Pills Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pt-4 scrollbar-none">
          {CATEGORIES.map((cat) => {
            const count = categoryCounts[cat.id] || 0;
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                id={`category-pill-${cat.id}`}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex-shrink-0 flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-stone-900 text-white shadow-xs'
                    : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
                }`}
              >
                <span>{cat.label}</span>
                <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                  isActive ? 'bg-stone-700 text-stone-200' : 'bg-stone-200 text-stone-600'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Wardrobe Completeness Tip */}
      <div className="bg-gradient-to-r from-amber-50 via-stone-50 to-amber-50/30 rounded-2xl p-4 border border-amber-200/70 flex items-start gap-3">
        <Lightbulb className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
        <div className="text-xs text-stone-700">
          <span className="font-semibold text-stone-900 block mb-0.5">
            Stylist Capsule Insight:
          </span>
          With {wardrobe.length} pieces across {Object.keys(categoryCounts).length - 1} categories, you have over{' '}
          <span className="font-bold text-amber-800">
            {Math.max(18, (categoryCounts.tops || 2) * (categoryCounts.bottoms || 2) * Math.max(1, (categoryCounts.outerwear || 1)))}
          </span>{' '}
          potential permutations. Add shoes or statement outerwear to further broaden your formal and rainy-weather options.
        </div>
      </div>

      {/* Garments Grid */}
      {filteredItems.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-stone-200">
          <Shirt className="w-12 h-12 text-stone-300 mx-auto mb-3" />
          <h3 className="font-editorial text-xl font-bold text-stone-800">
            No garments match this filter
          </h3>
          <p className="text-xs text-stone-500 mt-1 max-w-sm mx-auto">
            Try adjusting your search keywords, clear the formality filter, or upload new pieces to your wardrobe.
          </p>
          <button
            type="button"
            id="empty-state-upload-btn"
            onClick={onOpenUpload}
            className="mt-4 inline-flex items-center gap-2 px-5 py-2 rounded-full text-xs font-semibold bg-stone-900 text-white"
          >
            <Plus className="w-4 h-4 text-amber-300" />
            <span>Upload New Piece</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4 sm:gap-6">
          {filteredItems.map((item) => (
            <ClothingCard
              key={item.id}
              item={item}
              isSelected={selectedItemIds.includes(item.id)}
              onToggleSelect={onToggleSelectItem}
              onDelete={onDeleteItem}
              onViewDetails={onViewItemDetails}
            />
          ))}
        </div>
      )}

    </div>
  );
};
