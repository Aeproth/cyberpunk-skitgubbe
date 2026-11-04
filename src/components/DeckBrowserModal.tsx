import React, { useState } from 'react';
import { Card, Suit } from '../game/rules';
import { SUIT_INFO } from '../game/characters';
import { CardView } from './CardView';
import { X, Search, Sparkles } from 'lucide-react';

interface DeckBrowserModalProps {
  cards: Card[];
  isOpen: boolean;
  onClose: () => void;
  onSelectCard: (card: Card) => void;
}

export const DeckBrowserModal: React.FC<DeckBrowserModalProps> = ({
  cards,
  isOpen,
  onClose,
  onSelectCard,
}) => {
  const [selectedSuit, setSelectedSuit] = useState<Suit | 'all' | 'queens' | 'specials'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  if (!isOpen) return null;

  const filteredCards = cards.filter((card) => {
    // Suit / filter match
    if (selectedSuit === 'queens') {
      if (card.rank !== 12) return false;
    } else if (selectedSuit === 'specials') {
      if (card.rank !== 2 && card.rank !== 10) return false;
    } else if (selectedSuit !== 'all') {
      if (card.suit !== selectedSuit) return false;
    }

    // Search query match
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = card.name.toLowerCase().includes(q);
      const matchCode = card.codename.toLowerCase().includes(q);
      const matchRole = card.role.toLowerCase().includes(q);
      const matchCyber = card.cyberware.toLowerCase().includes(q);
      return matchName || matchCode || matchRole || matchCyber;
    }

    return true;
  });

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Kortleks-Databas & Galleri"
      className="fixed inset-0 z-40 flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-md"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-6xl h-[88vh] bg-[#080b12] border border-cyan-500/40 rounded-2xl shadow-2xl flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
        style={{
          boxShadow: '0 0 50px rgba(0, 240, 255, 0.2), inset 0 0 30px rgba(0, 0, 0, 0.9)',
        }}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-cyan-500/20 bg-slate-950/80 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-xl sm:text-2xl font-black font-mono text-cyan-300 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-pink-400" />
              CYBER-KORTEX · 52 UNIKA AGENTER
            </h2>
            <p className="text-xs text-slate-400 font-mono">
              Bläddra igenom alla 52 cyberpunk-tjejer, sviter och deras unika cybernetiska förmågor. Klicka på ett kort för att zooma in!
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Stäng galleri"
            className="p-2 rounded-lg bg-black/60 hover:bg-pink-950/80 text-white/80 hover:text-pink-400 border border-white/10 hover:border-pink-500/40 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter & Search Bar */}
        <div className="p-3 sm:px-5 bg-black/40 border-b border-white/10 flex flex-wrap items-center justify-between gap-3">
          {/* Suit Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 text-xs font-mono">
            <button
              type="button"
              onClick={() => setSelectedSuit('all')}
              className={`px-3 py-1.5 rounded-lg border transition-all ${
                selectedSuit === 'all'
                  ? 'bg-cyan-500/20 border-cyan-400 text-cyan-200 shadow-sm shadow-cyan-500/50'
                  : 'bg-black/30 border-white/10 text-slate-400 hover:text-white'
              }`}
            >
              Alla (52)
            </button>
            <button
              type="button"
              onClick={() => setSelectedSuit('queens')}
              className={`px-3 py-1.5 rounded-lg border transition-all ${
                selectedSuit === 'queens'
                  ? 'bg-purple-500/30 border-purple-400 text-purple-200 shadow-sm shadow-purple-500/50'
                  : 'bg-black/30 border-purple-500/20 text-purple-300/80 hover:text-white'
              }`}
            >
              👑 Drottningar (4)
            </button>
            <button
              type="button"
              onClick={() => setSelectedSuit('specials')}
              className={`px-3 py-1.5 rounded-lg border transition-all ${
                selectedSuit === 'specials'
                  ? 'bg-amber-500/30 border-amber-400 text-amber-200'
                  : 'bg-black/30 border-amber-500/20 text-amber-300/80 hover:text-white'
              }`}
            >
              ⚡ 2:or & 10:or
            </button>
            {(['hearts', 'diamonds', 'clubs', 'spades'] as Suit[]).map((s) => {
              const info = SUIT_INFO[s];
              const isActive = selectedSuit === s;
              return (
                <button
                  key={s}
                  type="button"
                  onClick={() => setSelectedSuit(s)}
                  className={`px-3 py-1.5 rounded-lg border transition-all flex items-center gap-1.5 ${
                    isActive
                      ? 'shadow-sm'
                      : 'bg-black/30 border-white/10 text-slate-400 hover:text-white'
                  }`}
                  style={{
                    borderColor: isActive ? info.themeColor : undefined,
                    backgroundColor: isActive ? `${info.themeColor}22` : undefined,
                    color: isActive ? info.themeColor : undefined,
                  }}
                >
                  <span>{info.symbol}</span>
                  <span>{info.nameSwedish}</span>
                </button>
              );
            })}
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Sök agent, cyberware..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-black/60 border border-white/15 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 font-mono"
            />
          </div>
        </div>

        {/* Card Grid */}
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto">
          {filteredCards.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-500 font-mono">
              <p>Inga agenter matchar sökningen.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4 justify-items-center">
              {filteredCards.map((card) => (
                <div
                  key={card.id}
                  className="flex flex-col items-center group cursor-pointer"
                  onClick={() => onSelectCard(card)}
                >
                  <CardView
                    card={card}
                    size="md"
                    onClick={() => onSelectCard(card)}
                    onInspect={() => onSelectCard(card)}
                  />
                  <div className="text-[10px] font-mono text-cyan-300 mt-1.5 truncate max-w-[100px] text-center opacity-80 group-hover:opacity-100">
                    {card.codename}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
