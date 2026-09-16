import React, { useState } from 'react';
import { X, Send, Sparkles, RefreshCw, MessageSquare } from 'lucide-react';
import { Outfit, ClothingItem } from '../types';

interface StylistChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentOutfit: Outfit | null;
  wardrobe: ClothingItem[];
}

interface Message {
  role: 'user' | 'stylist';
  text: string;
}

export const StylistChatModal: React.FC<StylistChatModalProps> = ({
  isOpen,
  onClose,
  currentOutfit,
  wardrobe,
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'stylist',
      text: currentOutfit
        ? `Bonjour! I'm reviewing "${currentOutfit.title}". How would you like to adjust this look? You can ask about footwear swaps, jewelry accents, adapting for rain, or dressing it up/down.`
        : "Hello! I am your AI Haute Couture Stylist. Ask me any question about silhouettes, color harmonies, or pairing pieces from your wardrobe.",
    },
  ]);
  const [inputQuery, setInputQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputQuery.trim() || isLoading) return;

    const userText = inputQuery.trim();
    setInputQuery('');
    setMessages((prev) => [...prev, { role: 'user', text: userText }]);
    setIsLoading(true);

    try {
      const response = await fetch('/api/stylist-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: userText,
          currentOutfit,
          wardrobe,
        }),
      });

      if (!response.ok) throw new Error('Failed to fetch stylist advice');

      const data = await response.json();
      setMessages((prev) => [
        ...prev,
        { role: 'stylist', text: data.reply || 'Balance your proportions carefully: let one statement piece lead the look.' },
      ]);
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'stylist',
          text: 'Pair structured outerwear with fluid trousers to create an effortless French silhouette. Roll the cuffs to expose the ankles for visual lightness.',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const quickPrompts = [
    'How do I dress this down for weekend brunch?',
    'What jewelry or metal finishes match best?',
    'Can I wear white leather sneakers with this?',
    'How do I adapt this if temperature drops 5°C?',
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col h-[600px] max-h-[90vh]">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-stone-100 bg-stone-900 text-stone-100 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-400 text-stone-950 flex items-center justify-center font-bold">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-editorial text-lg font-bold text-white leading-tight">
                AI Personal Stylist Chat
              </h3>
              <p className="text-[11px] text-stone-400">
                {currentOutfit ? `Context: ${currentOutfit.title}` : 'General Wardrobe Advisory'}
              </p>
            </div>
          </div>
          <button
            type="button"
            id="close-stylist-chat-btn"
            onClick={onClose}
            className="text-stone-400 hover:text-white p-1.5 rounded-full hover:bg-stone-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 p-5 overflow-y-auto space-y-3.5 bg-stone-50/50">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-xs sm:text-sm leading-relaxed ${
                  m.role === 'user'
                    ? 'bg-stone-900 text-white rounded-br-none'
                    : 'bg-white text-stone-800 border border-stone-200 shadow-2xs rounded-bl-none'
                }`}
              >
                {m.text}
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-white text-stone-500 border border-stone-200 rounded-2xl rounded-bl-none px-4 py-2.5 text-xs flex items-center gap-2">
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-amber-500" />
                <span>Stylist is reviewing textures & proportions...</span>
              </div>
            </div>
          )}
        </div>

        {/* Quick Prompts */}
        <div className="px-4 py-2 bg-white border-t border-stone-100 overflow-x-auto flex gap-1.5 scrollbar-none flex-shrink-0">
          {quickPrompts.map((q, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setInputQuery(q)}
              className="text-[11px] text-stone-600 bg-stone-100 hover:bg-stone-200 px-2.5 py-1 rounded-full whitespace-nowrap transition-colors flex-shrink-0"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <form onSubmit={handleSend} className="p-3 bg-white border-t border-stone-200 flex items-center gap-2 flex-shrink-0">
          <input
            id="stylist-chat-input"
            type="text"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            placeholder="Ask your stylist a question about this look..."
            className="flex-1 px-4 py-2 rounded-full border border-stone-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
          />
          <button
            type="submit"
            id="send-stylist-chat-btn"
            disabled={!inputQuery.trim() || isLoading}
            className="w-9 h-9 rounded-full bg-amber-400 hover:bg-amber-300 text-stone-950 flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed transition-all"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>

      </div>
    </div>
  );
};
