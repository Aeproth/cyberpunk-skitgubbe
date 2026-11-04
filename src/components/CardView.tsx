import React from 'react';
import { Card } from '../game/rules';
import { SUIT_INFO, getRankLabel } from '../game/characters';
import { CyberAvatar } from './CyberAvatar';
import { Eye, Zap, Flame } from 'lucide-react';

interface CardViewProps {
  card?: Card;
  isFaceDown?: boolean;
  isSelected?: boolean;
  isPlayable?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  onInspect?: () => void;
  size?: 'sm' | 'md' | 'lg';
  animating?: boolean;
  cardIndex?: number;
}

export const CardView: React.FC<CardViewProps> = ({
  card,
  isFaceDown = false,
  isSelected = false,
  isPlayable = true,
  disabled = false,
  onClick,
  onInspect,
  size = 'md',
  animating = false,
}) => {
  // Back of card (face-down)
  if (isFaceDown || !card) {
    return (
      <div
        onClick={disabled ? undefined : onClick}
        role={onClick ? 'button' : undefined}
        aria-label="Dolt cyberpunk-kort"
        className={`relative select-none transition-all duration-300 transform perspective-1000 ${
          disabled ? 'opacity-80 cursor-not-allowed' : onClick ? 'cursor-pointer hover:-translate-y-1 hover:shadow-cyan-500/30' : ''
        } ${
          size === 'sm' ? 'w-16 h-24' : size === 'lg' ? 'w-36 h-52' : 'w-24 h-36'
        } rounded-lg border border-cyan-500/40 bg-gradient-to-br from-neutral-950 via-slate-900 to-cyan-950/70 p-1 shadow-lg shadow-black/80 flex flex-col items-center justify-center overflow-hidden`}
        style={{
          boxShadow: '0 4px 15px rgba(0, 0, 0, 0.7), inset 0 0 12px rgba(0, 240, 255, 0.15)',
        }}
      >
        {/* Holographic Cyberpunk Card Back Design */}
        <div className="w-full h-full rounded border border-cyan-500/30 bg-black/60 flex flex-col items-center justify-center p-1 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-cyan-900/30 via-transparent to-transparent pointer-events-none" />
          
          {/* Circuit pattern overlay */}
          <div
            className="absolute inset-0 opacity-20 pointer-events-none"
            style={{
              backgroundImage: 'radial-gradient(#00f0ff 1px, transparent 1px)',
              backgroundSize: '8px 8px',
            }}
          />

          <div className="w-8 h-8 rounded-full border border-cyan-400/50 flex items-center justify-center relative">
            <div className="w-4 h-4 rotate-45 border border-pink-500/70 bg-cyan-950/40" />
            <div className="absolute w-1 h-1 bg-cyan-400 rounded-full" />
          </div>

          <span className="text-[9px] font-mono tracking-widest text-cyan-400/80 mt-1 uppercase font-bold text-center">
            CYBER·SEC
          </span>
          <span className="text-[7px] font-mono text-pink-500/80 tracking-tighter">
            ENC·256
          </span>
        </div>
      </div>
    );
  }

  const suit = SUIT_INFO[card.suit];
  const rankLabel = getRankLabel(card.rank);
  const isSpecialTwo = card.rank === 2;
  const isSpecialTen = card.rank === 10;
  const isQueen = card.rank === 12;

  const sizeDimensions = {
    sm: 'w-16 h-24 text-xs',
    md: 'w-24 h-36 text-sm',
    lg: 'w-36 h-52 text-base',
  }[size];

  return (
    <div
      onClick={disabled ? undefined : onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      aria-label={`${card.name}, ${card.codename}`}
      onKeyDown={(e) => {
        if ((e.key === 'Enter' || e.key === ' ') && onClick && !disabled) {
          e.preventDefault();
          onClick();
        }
      }}
      className={`group relative select-none rounded-lg border transition-all duration-200 transform ${
        isSelected
          ? '-translate-y-3 ring-2 ring-cyan-400 shadow-xl'
          : isPlayable && onClick && !disabled
          ? 'hover:-translate-y-1.5 cursor-pointer shadow-md'
          : !isPlayable
          ? 'opacity-60 cursor-not-allowed grayscale-[25%]'
          : ''
      } ${sizeDimensions} flex flex-col justify-between p-1 bg-gradient-to-b from-[#0d0f17] via-[#121524] to-[#0a0c14] overflow-hidden ${
        animating ? 'animate-pulse' : ''
      }`}
      style={{
        borderColor: isSelected
          ? '#00f0ff'
          : isPlayable
          ? `${suit.themeColor}99`
          : 'rgba(255,255,255,0.15)',
        boxShadow: isSelected
          ? `0 0 20px ${suit.themeColor}, inset 0 0 10px rgba(0, 240, 255, 0.3)`
          : isPlayable
          ? `0 4px 12px rgba(0, 0, 0, 0.8), 0 0 8px ${suit.themeColor}33`
          : '0 2px 6px rgba(0, 0, 0, 0.6)',
      }}
    >
      {/* Top Header: Rank & Suit */}
      <div className="flex items-center justify-between px-1 z-10 leading-none">
        <div className="flex items-center gap-0.5">
          <span
            className="font-bold font-mono tracking-tighter"
            style={{
              color: suit.themeColor,
              textShadow: `0 0 6px ${suit.themeColor}`,
            }}
          >
            {rankLabel}
          </span>
          <span className="text-xs" style={{ color: suit.themeColor }}>
            {suit.symbol}
          </span>
        </div>

        {/* Special tag (2 = RESET, 10 = BURN, Q = QUEEN) */}
        {isSpecialTwo && (
          <span className="px-1 py-0.2 rounded text-[7px] font-mono bg-cyan-950/80 text-cyan-300 border border-cyan-400/50 flex items-center gap-0.5">
            <Zap className="w-2 h-2 text-cyan-400" /> 0
          </span>
        )}
        {isSpecialTen && (
          <span className="px-1 py-0.2 rounded text-[7px] font-mono bg-red-950/80 text-pink-300 border border-pink-500/60 flex items-center gap-0.5 animate-pulse">
            <Flame className="w-2 h-2 text-pink-400" /> BRÄNN
          </span>
        )}
        {isQueen && (
          <span className="px-1 py-0.2 rounded text-[7px] font-mono bg-purple-950/80 text-purple-300 border border-purple-400/50">
            DAM
          </span>
        )}
      </div>

      {/* Cyberpunk Operative Avatar in Middle */}
      <div className="relative flex-1 my-0.5 rounded overflow-hidden border border-white/5 bg-black/40">
        <CyberAvatar card={card} size={size === 'lg' ? 'lg' : size === 'sm' ? 'sm' : 'md'} />

        {/* Zoom button on hover */}
        {onInspect && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onInspect();
            }}
            title="Inspektera karaktär & zooma"
            aria-label={`Zooma ${card.codename}`}
            className="absolute top-1 right-1 p-1 rounded bg-black/70 hover:bg-cyan-950 text-white/80 hover:text-cyan-300 border border-cyan-500/40 opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm z-20"
          >
            <Eye className="w-2.5 h-2.5" />
          </button>
        )}
      </div>

      {/* Bottom Footer: Operative Codename & Inverted Rank */}
      <div className="flex items-center justify-between px-1 z-10 leading-none">
        <span className="text-[7.5px] font-mono truncate text-slate-300/80 max-w-[70%] tracking-tight">
          {card.codename.split(' ')[0]}
        </span>
        <span
          className="text-[9px] font-bold font-mono opacity-80"
          style={{ color: suit.themeColor }}
        >
          {rankLabel}
        </span>
      </div>

      {/* Active selection glowing pulse overlay */}
      {isSelected && (
        <div
          className="absolute inset-0 pointer-events-none rounded-lg border-2 animate-pulse"
          style={{ borderColor: '#00f0ff' }}
        />
      )}
    </div>
  );
};
