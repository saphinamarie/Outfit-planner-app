import React, { useState } from 'react';
import { 
  X, 
  Crown, 
  Sparkles, 
  Check, 
  Layers, 
  Palette, 
  Luggage, 
  ShieldCheck,
  Zap
} from 'lucide-react';

interface VipModalProps {
  isOpen: boolean;
  onClose: () => void;
  isVip: boolean;
  onToggleVip: (status: boolean) => void;
}

export const VipModal: React.FC<VipModalProps> = ({
  isOpen,
  onClose,
  isVip,
  onToggleVip,
}) => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('annual');

  if (!isOpen) return null;

  const handleActivate = () => {
    onToggleVip(true);
    alert('VIP Stylist status activated! You now have full access to Haute Couture generation, color analysis, and style packs.');
    onClose();
  };

  const handleDeactivate = () => {
    onToggleVip(false);
    alert('VIP Stylist status switched off for testing.');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-xl bg-stone-900 text-stone-100 rounded-3xl shadow-2xl border border-stone-800 overflow-hidden my-8">
        
        {/* Close Button */}
        <button
          type="button"
          id="close-vip-modal-btn"
          onClick={onClose}
          className="absolute top-5 right-5 text-stone-400 hover:text-white p-2 rounded-full hover:bg-stone-800 transition-colors z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Hero Banner */}
        <div className="p-8 pb-6 bg-gradient-to-b from-amber-500/15 via-stone-900 to-stone-900 border-b border-stone-800">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-amber-400 text-stone-950 mb-3 shadow-md">
            <Crown className="w-3.5 h-3.5" />
            <span>VIP Styling Tier</span>
          </div>

          <h3 className="font-editorial text-3xl sm:text-4xl font-bold text-white tracking-tight">
            Elevate to Haute Couture
          </h3>
          <p className="text-xs sm:text-sm text-stone-400 mt-2 leading-relaxed">
            Unlock editorial-grade AI personal styling, personal color analysis, travel packing matrixes, and instant access to every signature style pack.
          </p>
        </div>

        {/* Feature List */}
        <div className="p-8 py-6 space-y-4">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-xl bg-amber-400/10 text-amber-300 flex-shrink-0">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white">
                VIP Haute Couture & Red Carpet Engine
              </h4>
              <p className="text-xs text-stone-400 mt-0.5">
                Formulate high-stakes evening wear, gala black-tie, and executive boardroom ensembles with bespoke layering instructions.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2 rounded-xl bg-amber-400/10 text-amber-300 flex-shrink-0">
              <Palette className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white">
                Personal Color & Contrast Harmony
              </h4>
              <p className="text-xs text-stone-400 mt-0.5">
                Deep color grading ensuring every top, blazer, and scarf complements your undertone and natural contrast ratio.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2 rounded-xl bg-amber-400/10 text-amber-300 flex-shrink-0">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white">
                All Signature Style Packs Included
              </h4>
              <p className="text-xs text-stone-400 mt-0.5">
                Instant 1-click unlock and closet import for Parisian Autumn, Tokyo Minimalist, Quiet Luxury, and Amalfi Riviera packs.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2 rounded-xl bg-amber-400/10 text-amber-300 flex-shrink-0">
              <Luggage className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white">
                Multi-Day Capsule Packing Matrix
              </h4>
              <p className="text-xs text-stone-400 mt-0.5">
                Generate 10+ outfits from just 7 pieces for carry-on business or vacation travel.
              </p>
            </div>
          </div>
        </div>

        {/* Pricing & Activation Box */}
        <div className="p-8 pt-4 bg-stone-950/60 border-t border-stone-800 space-y-4">
          <div className="flex items-center justify-between p-4 rounded-2xl bg-stone-800/80 border border-stone-700/80">
            <div>
              <span className="text-xs text-stone-400 block font-medium">Full Access Membership</span>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="text-2xl font-bold text-white">$9.99</span>
                <span className="text-xs text-stone-400">/ month or $79/year</span>
              </div>
            </div>
            <span className="text-[10px] font-semibold uppercase tracking-wider text-emerald-400 bg-emerald-950/60 px-2 py-1 rounded border border-emerald-800">
              Cancel Anytime
            </span>
          </div>

          <div className="flex items-center gap-3">
            {isVip ? (
              <button
                type="button"
                id="deactivate-vip-btn"
                onClick={handleDeactivate}
                className="w-full py-3 rounded-full text-xs font-semibold bg-stone-800 hover:bg-stone-750 text-rose-300 border border-rose-900/50 transition-colors"
              >
                Disable VIP Status (Demo Mode)
              </button>
            ) : (
              <button
                type="button"
                id="activate-vip-btn"
                onClick={handleActivate}
                className="w-full py-3.5 rounded-full text-sm font-bold bg-amber-400 hover:bg-amber-300 text-stone-950 shadow-lg shadow-amber-500/20 transition-all cursor-pointer"
              >
                Activate VIP Stylist Pass
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
