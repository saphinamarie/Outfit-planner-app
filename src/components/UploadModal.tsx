import React, { useState, useRef } from 'react';
import { 
  X, 
  Upload, 
  Camera, 
  Sparkles, 
  Check, 
  Link as LinkIcon, 
  RefreshCw, 
  AlertCircle 
} from 'lucide-react';
import { ClothingCategory, ClothingItem, FormalityLevel, Season } from '../types';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveItem: (item: ClothingItem) => void;
}

const SAMPLE_PRESETS = [
  {
    name: 'Camel Hair Belted Wrap Coat',
    url: 'https://images.unsplash.com/photo-1544441893-675973e31985?w=600&auto=format&fit=crop&q=80',
    category: 'outerwear',
  },
  {
    name: 'Ivory Cable-Knit Fisherman Sweater',
    url: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=600&auto=format&fit=crop&q=80',
    category: 'tops',
  },
  {
    name: 'Cognac Leather Chelsea Boots',
    url: 'https://images.unsplash.com/photo-1608256246200-53e635b5b65f?w=600&auto=format&fit=crop&q=80',
    category: 'footwear',
  },
  {
    name: 'Pleated Charcoal Grey Slacks',
    url: 'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=600&auto=format&fit=crop&q=80',
    category: 'bottoms',
  }
];

export const UploadModal: React.FC<UploadModalProps> = ({
  isOpen,
  onClose,
  onSaveItem,
}) => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const [cameraActive, setCameraActive] = useState(false);

  // Form Fields
  const [name, setName] = useState('');
  const [category, setCategory] = useState<ClothingCategory>('tops');
  const [subcategory, setSubcategory] = useState('');
  const [color, setColor] = useState('');
  const [material, setMaterial] = useState('');
  const [formality, setFormality] = useState<FormalityLevel>('Smart Casual');
  const [seasonality, setSeasonality] = useState<Season[]>(['Spring', 'Autumn']);
  const [brand, setBrand] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [notes, setNotes] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);

  if (!isOpen) return null;

  const resetForm = () => {
    setImagePreview(null);
    setIsAnalyzing(false);
    setAnalysisError(null);
    stopCamera();
    setName('');
    setCategory('tops');
    setSubcategory('');
    setColor('');
    setMaterial('');
    setFormality('Smart Casual');
    setSeasonality(['Spring', 'Autumn']);
    setBrand('');
    setTagsInput('');
    setNotes('');
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const triggerAnalyze = async (imgDataUrl: string, fileName?: string) => {
    setIsAnalyzing(true);
    setAnalysisError(null);
    try {
      const response = await fetch('/api/analyze-clothing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: imgDataUrl, fileName }),
      });

      if (!response.ok) {
        throw new Error('Failed to analyze garment image');
      }

      const data = await response.json();
      if (data.item) {
        setName(data.item.name || 'Garment Item');
        setCategory(data.item.category || 'tops');
        setSubcategory(data.item.subcategory || '');
        setColor(data.item.color || 'Neutral');
        setMaterial(data.item.material || '');
        setFormality(data.item.formality || 'Smart Casual');
        if (Array.isArray(data.item.seasonality) && data.item.seasonality.length > 0) {
          setSeasonality(data.item.seasonality);
        }
        setBrand(data.item.brand || '');
        setTagsInput(Array.isArray(data.item.tags) ? data.item.tags.join(', ') : 'wardrobe, classic');
        setNotes(data.item.notes || 'Versatile piece that layers effortlessly.');
      }
    } catch (err: any) {
      console.error('Analysis error:', err);
      setAnalysisError('AI analysis ran with fallback heuristics. You can edit details below.');
      if (!name) setName(fileName ? fileName.replace(/\.[^/.]+$/, '') : 'Custom Garment');
      if (!color) setColor('Classic Neutral');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      const result = uploadEvent.target?.result as string;
      setImagePreview(result);
      triggerAnalyze(result, file.name);
    };
    reader.readAsDataURL(file);
  };

  const startCamera = async () => {
    setCameraActive(true);
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 } },
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        videoRef.current.play();
      }
    } catch (err) {
      console.error('Camera access error:', err);
      setCameraActive(false);
      alert('Camera access could not be started. Please upload a photo instead.');
    }
  };

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
      setImagePreview(dataUrl);
      stopCamera();
      triggerAnalyze(dataUrl, 'camera-capture.jpg');
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
    setCameraActive(false);
  };

  const handleSelectPreset = (preset: typeof SAMPLE_PRESETS[0]) => {
    setImagePreview(preset.url);
    setName(preset.name);
    setCategory(preset.category as ClothingCategory);
    setColor('Neutral Heritage');
    setMaterial('Premium Blend');
    setFormality('Smart Casual');
    setSeasonality(['Autumn', 'Winter', 'Spring']);
    setTagsInput('timeless, capsule, elevated');
    setNotes('Elevates simple base layers with sophisticated texture.');
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!imagePreview) {
      alert('Please upload or select an image of your garment.');
      return;
    }

    const newItem: ClothingItem = {
      id: `item-${Date.now()}`,
      name: name.trim() || 'Wardrobe Garment',
      category,
      subcategory: subcategory.trim() || undefined,
      color: color.trim() || 'Neutral',
      material: material.trim() || undefined,
      formality,
      seasonality,
      imageUrl: imagePreview,
      brand: brand.trim() || undefined,
      tags: tagsInput
        .split(',')
        .map((t) => t.trim().toLowerCase())
        .filter(Boolean),
      notes: notes.trim() || undefined,
      createdAt: new Date().toISOString(),
      isCustomUpload: true,
    };

    onSaveItem(newItem);
    handleClose();
  };

  const toggleSeason = (s: Season) => {
    if (seasonality.includes(s)) {
      if (seasonality.length > 1) {
        setSeasonality(seasonality.filter((item) => item !== s));
      }
    } else {
      setSeasonality([...seasonality, s]);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden my-8">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-stone-100 bg-stone-50/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-stone-900 text-amber-400 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-editorial text-xl font-bold text-stone-900">
                Upload to Wardrobe
              </h3>
              <p className="text-xs text-stone-500">
                Gemini Vision automatically classifies category, fabric, color & style tags
              </p>
            </div>
          </div>
          <button
            id="close-upload-modal-btn"
            type="button"
            onClick={handleClose}
            className="text-stone-400 hover:text-stone-700 p-2 rounded-full hover:bg-stone-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSave} className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          
          {/* Image Upload / Capture Section */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-2">
              Garment Photo
            </label>

            {!imagePreview && !cameraActive && (
              <div className="space-y-3">
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-stone-300 hover:border-stone-500 rounded-2xl p-6 text-center cursor-pointer bg-stone-50/50 hover:bg-stone-50 transition-colors group"
                >
                  <input
                    ref={fileInputRef}
                    id="garment-file-input"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <div className="w-12 h-12 rounded-full bg-white shadow-xs border border-stone-200 flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                    <Upload className="w-5 h-5 text-stone-700" />
                  </div>
                  <div className="text-sm font-medium text-stone-800">
                    Click to browse or drop your clothing photo
                  </div>
                  <p className="text-xs text-stone-500 mt-1">
                    Supports JPG, PNG, WEBP (flat-lay or on hanger works best)
                  </p>
                </div>

                <div className="flex items-center justify-center gap-3">
                  <span className="text-xs text-stone-400">or</span>
                  <button
                    type="button"
                    id="open-camera-btn"
                    onClick={startCamera}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium bg-stone-100 text-stone-700 hover:bg-stone-200 transition-colors"
                  >
                    <Camera className="w-3.5 h-3.5" />
                    <span>Take Photo with Camera</span>
                  </button>
                </div>

                {/* Quick Presets for instant testing */}
                <div className="pt-2">
                  <div className="text-xs font-medium text-stone-500 mb-2">
                    Quick test with sample designer garments:
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {SAMPLE_PRESETS.map((p, idx) => (
                      <button
                        key={idx}
                        type="button"
                        id={`sample-preset-${idx}`}
                        onClick={() => handleSelectPreset(p)}
                        className="flex items-center gap-2 p-1.5 rounded-xl border border-stone-200 hover:border-amber-400 bg-white hover:bg-amber-50/40 text-left text-xs transition-all"
                      >
                        <img src={p.url} alt={p.name} className="w-8 h-8 rounded-lg object-cover" />
                        <span className="truncate text-[11px] font-medium text-stone-700">{p.name.split(' ')[0]}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Live Camera View */}
            {cameraActive && (
              <div className="relative rounded-2xl overflow-hidden bg-black aspect-video flex flex-col items-center justify-center">
                <video ref={videoRef} className="w-full h-full object-cover" playsInline muted />
                <canvas ref={canvasRef} className="hidden" />
                <div className="absolute bottom-4 flex items-center gap-3">
                  <button
                    type="button"
                    id="capture-photo-btn"
                    onClick={capturePhoto}
                    className="px-5 py-2 rounded-full bg-amber-400 text-stone-950 font-semibold text-xs shadow-lg hover:bg-amber-300"
                  >
                    Capture Garment
                  </button>
                  <button
                    type="button"
                    onClick={stopCamera}
                    className="px-4 py-2 rounded-full bg-stone-800/80 text-white text-xs hover:bg-stone-800"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {/* Image Preview & AI Loading Banner */}
            {imagePreview && (
              <div className="relative rounded-2xl overflow-hidden border border-stone-200 bg-stone-900 flex items-center justify-center max-h-64">
                <img src={imagePreview} alt="Garment preview" className="max-h-64 object-contain" />
                <button
                  type="button"
                  id="change-photo-btn"
                  onClick={() => setImagePreview(null)}
                  className="absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-medium bg-black/70 hover:bg-black text-white backdrop-blur-md transition-colors"
                >
                  Change Photo
                </button>

                {isAnalyzing && (
                  <div className="absolute inset-0 bg-stone-950/80 backdrop-blur-sm flex flex-col items-center justify-center text-center p-4">
                    <RefreshCw className="w-7 h-7 text-amber-400 animate-spin mb-3" />
                    <span className="text-sm font-semibold text-white">
                      Gemini Vision AI is analyzing garment...
                    </span>
                    <span className="text-xs text-stone-300 mt-1">
                      Extracting weave, silhouette, palette & formality tags
                    </span>
                  </div>
                )}
              </div>
            )}

            {analysisError && (
              <div className="mt-2 text-xs text-amber-700 bg-amber-50 p-2.5 rounded-xl border border-amber-200 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{analysisError}</span>
              </div>
            )}
          </div>

          {/* Classification Form Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-stone-700 mb-1">
                Garment Title / Description *
              </label>
              <input
                id="garment-name-input"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Crisp Poplin Button-Down Shirt"
                className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1">
                Category *
              </label>
              <select
                id="garment-category-select"
                value={category}
                onChange={(e) => setCategory(e.target.value as ClothingCategory)}
                className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
              >
                <option value="tops">Tops & Shirts</option>
                <option value="bottoms">Bottoms & Pants</option>
                <option value="outerwear">Jackets & Coats</option>
                <option value="footwear">Footwear & Shoes</option>
                <option value="bags">Bags & Totes</option>
                <option value="accessories">Accessories & Jewelry</option>
                <option value="one_piece">Dresses & Jumpsuits</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1">
                Subcategory
              </label>
              <input
                id="garment-subcategory-input"
                type="text"
                value={subcategory}
                onChange={(e) => setSubcategory(e.target.value)}
                placeholder="e.g. Knitwear, Blazer, Loafers"
                className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1">
                Dominant Color
              </label>
              <input
                id="garment-color-input"
                type="text"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                placeholder="e.g. Oatmeal, Charcoal, Ecru"
                className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1">
                Material / Fabric
              </label>
              <input
                id="garment-material-input"
                type="text"
                value={material}
                onChange={(e) => setMaterial(e.target.value)}
                placeholder="e.g. 100% Cashmere, Raw Denim"
                className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1">
                Formality Tier
              </label>
              <select
                id="garment-formality-select"
                value={formality}
                onChange={(e) => setFormality(e.target.value as FormalityLevel)}
                className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
              >
                <option value="Casual">Casual</option>
                <option value="Smart Casual">Smart Casual</option>
                <option value="Business Formal">Business Formal</option>
                <option value="Evening / Cocktail">Evening / Cocktail</option>
                <option value="Streetwear">Streetwear</option>
                <option value="Athleisure">Athleisure</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1">
                Brand / Label
              </label>
              <input
                id="garment-brand-input"
                type="text"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                placeholder="e.g. Arket, COS, A.P.C., Vintage"
                className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
              />
            </div>

            {/* Seasonality Chips */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-stone-700 mb-1.5">
                Seasonal Compatibility
              </label>
              <div className="flex flex-wrap gap-2">
                {(['Spring', 'Summer', 'Autumn', 'Winter', 'All-Season'] as Season[]).map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => toggleSeason(s)}
                    className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                      seasonality.includes(s)
                        ? 'bg-stone-900 text-white'
                        : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Tags */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-stone-700 mb-1">
                Style Tags (comma separated)
              </label>
              <input
                id="garment-tags-input"
                type="text"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                placeholder="e.g. minimal, layering, quiet luxury, relaxed"
                className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
              />
            </div>

            {/* Stylist Notes */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-stone-700 mb-1">
                Stylist Notes / Fit Details
              </label>
              <textarea
                id="garment-notes-input"
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. Oversized silhouette. Best worn half-tucked with high-waist pants."
                className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
              />
            </div>
          </div>

          {/* Submit Footer */}
          <div className="pt-4 border-t border-stone-100 flex items-center justify-end gap-3">
            <button
              type="button"
              id="cancel-upload-btn"
              onClick={handleClose}
              className="px-5 py-2.5 rounded-full text-sm font-medium text-stone-600 hover:text-stone-900 hover:bg-stone-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              id="save-to-closet-btn"
              disabled={!imagePreview || isAnalyzing}
              className="flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-semibold bg-amber-400 hover:bg-amber-300 text-stone-950 shadow-md hover:shadow transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>Save to My Closet</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
