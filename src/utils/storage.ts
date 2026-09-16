import { ClothingItem, Outfit, StylePack } from '../types';
import { INITIAL_WARDROBE } from '../data/sampleWardrobe';
import { INITIAL_STYLE_PACKS } from '../data/stylePacks';

const WARDROBE_KEY = 'aura_wardrobe_items_v1';
const OUTFITS_KEY = 'aura_saved_outfits_v1';
const STYLE_PACKS_KEY = 'aura_style_packs_v1';
const VIP_KEY = 'aura_vip_status_v1';

export function loadWardrobe(): ClothingItem[] {
  try {
    const raw = localStorage.getItem(WARDROBE_KEY);
    if (!raw) {
      saveWardrobe(INITIAL_WARDROBE);
      return INITIAL_WARDROBE;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_WARDROBE;
  } catch (err) {
    console.error('Error loading wardrobe from localStorage:', err);
    return INITIAL_WARDROBE;
  }
}

export function saveWardrobe(items: ClothingItem[]): void {
  try {
    localStorage.setItem(WARDROBE_KEY, JSON.stringify(items));
  } catch (err) {
    console.error('Error saving wardrobe:', err);
  }
}

export function loadSavedOutfits(): Outfit[] {
  try {
    const raw = localStorage.getItem(OUTFITS_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error loading saved outfits:', err);
    return [];
  }
}

export function saveOutfits(outfits: Outfit[]): void {
  try {
    localStorage.setItem(OUTFITS_KEY, JSON.stringify(outfits));
  } catch (err) {
    console.error('Error saving outfits:', err);
  }
}

export function loadStylePacks(): StylePack[] {
  try {
    const raw = localStorage.getItem(STYLE_PACKS_KEY);
    if (!raw) {
      saveStylePacks(INITIAL_STYLE_PACKS);
      return INITIAL_STYLE_PACKS;
    }
    return JSON.parse(raw);
  } catch (err) {
    return INITIAL_STYLE_PACKS;
  }
}

export function saveStylePacks(packs: StylePack[]): void {
  try {
    localStorage.setItem(STYLE_PACKS_KEY, JSON.stringify(packs));
  } catch (err) {
    console.error('Error saving style packs:', err);
  }
}

export function loadVipStatus(): boolean {
  try {
    return localStorage.getItem(VIP_KEY) === 'true';
  } catch {
    return false;
  }
}

export function saveVipStatus(isVip: boolean): void {
  try {
    localStorage.setItem(VIP_KEY, isVip ? 'true' : 'false');
  } catch (err) {
    console.error('Error saving VIP status:', err);
  }
}
