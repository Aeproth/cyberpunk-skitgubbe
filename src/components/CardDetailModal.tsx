import React, { useState } from 'react';
import { Card } from '../game/rules';
import { SUIT_INFO, getRankLabel, getRankNameSwedish } from '../game/characters';
import { CyberAvatar } from './CyberAvatar';
import { X, ZoomIn, ZoomOut, RotateCcw, ChevronLeft, ChevronRight, Shield, Cpu, Activity, Info, Zap } from 'lucide-react';

interface CardDetailModalProps {
  card: Card | null;
  onClose: () => void;
  onNavigate?: (direction: 'next' | 'prev') => void;
}

export const CardDetailModal: React.FC<CardDetailModalProps> = ({
  card,
  onClose,
  onNavigate,
}) => {
  const [zoomLevel, setZoomLevel] = useState<number>(1.5);
  const [focusArea, setFocusArea] = useState<'center' | 'eyes' | 'bust' | 'implants'>('center');

  if (!card) return null;

  const suit = SUIT_INFO[card.suit];
  const rankLabel = getRankLabel(card.rank);
  const rankName = getRankNameSwedish(card.rank);

  const getTransformOrigin = () => {
    switch (focusArea) {
      case 'eyes': return '50% 30%';
      case 'bust': return '50% 75%';
      case 'implants': return '35% 45%';
      default: return '50% 50%';
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Kortdetaljer för ${card.codename}`}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl bg-gradient-to-b from-[#0a0d16] via-[#0e1220] to-[#07090f] border border-cyan-500/40 rounded-2xl shadow-2xl shadow-cyan-950/60 overflow-hidden flex flex-col md:flex-row max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
        style={{
          boxShadow: `0 0 40px ${suit.themeColor}33, inset 0 0 30px rgba(0, 240, 255, 0.1)`,
        }}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Stäng detaljvy"
          className="absolute top-4 right-4 z-30 p-2 rounded-full bg-black/60 hover:bg-pink-950/80 text-white/80 hover:text-pink-400 border border-white/10 hover:border-pink-500/50 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* LEFT COLUMN: Zoomable Portrait Stage */}
        <div className="w-full md:w-1/2 p-6 flex flex-col items-center justify-between border-b md:border-b-0 md:border-r border-cyan-500/20 bg-black/40 relative overflow-hidden">
          {/* Cyberpunk Top Bar */}
          <div className="w-full flex items-center justify-between mb-3 text-xs font-mono text-cyan-400">
            <span className="flex items-center gap-1.5 font-bold">
              <Activity className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
              NEURAL OPTIC SCANNER
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-950/60 border border-cyan-500/30">
              ZOOM: {zoomLevel.toFixed(1)}x
            </span>
          </div>

          {/* Zoomable Image Container */}
          <div className="relative w-64 h-88 sm:w-72 sm:h-96 rounded-xl border-2 border-cyan-400/50 overflow-hidden bg-black shadow-2xl flex items-center justify-center group">
            {/* Viewport Frame */}
            <div
              className="w-full h-full transition-transform duration-300 ease-out flex items-center justify-center"
              style={{
                transform: `scale(${zoomLevel})`,
                transformOrigin: getTransformOrigin(),
              }}
            >
              <CyberAvatar card={card} size="zoom" />
            </div>

            {/* Crosshair Overlay on Zoom */}
            <div className="absolute inset-0 pointer-events-none border border-cyan-400/20">
              <div className="absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 border-cyan-400" />
              <div className="absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2 border-cyan-400" />
              <div className="absolute bottom-2 left-2 w-3 h-3 border-b-2 border-l-2 border-cyan-400" />
              <div className="absolute bottom-2 right-2 w-3 h-3 border-b-2 border-r-2 border-cyan-400" />
              <div className="absolute inset-1/2 w-4 h-4 -translate-x-1/2 -translate-y-1/2 border border-pink-500/40 rounded-full" />
            </div>

            {/* Reticle Tag */}
            <div className="absolute bottom-2 left-2 text-[9px] font-mono text-cyan-300 bg-black/80 px-2 py-0.5 rounded border border-cyan-500/30">
              ID: {card.id.toUpperCase()} · {card.avatarStyle.implantType}
            </div>
          </div>

          {/* Zoom & Focus Controls */}
          <div className="w-full mt-4 flex flex-col gap-2">
            <div className="flex items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => setZoomLevel((z) => Math.max(1.0, z - 0.25))}
                aria-label="Zooma ut"
                className="p-1.5 rounded bg-slate-900 hover:bg-slate-800 border border-cyan-500/30 text-cyan-300"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <span className="text-xs font-mono text-slate-300 w-12 text-center">
                {Math.round(zoomLevel * 100)}%
              </span>
              <button
                type="button"
                onClick={() => setZoomLevel((z) => Math.min(2.5, z + 0.25))}
                aria-label="Zooma in"
                className="p-1.5 rounded bg-slate-900 hover:bg-slate-800 border border-cyan-500/30 text-cyan-300"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => {
                  setZoomLevel(1.5);
                  setFocusArea('center');
                }}
                title="Återställ zoom"
                aria-label="Återställ zoom"
                className="p-1.5 rounded bg-slate-900 hover:bg-slate-800 border border-cyan-500/30 text-cyan-300 ml-2"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>

            {/* Focus Target Buttons */}
            <div className="flex items-center justify-center gap-1.5 text-[11px] font-mono">
              <span className="text-slate-400 mr-1">Fokus:</span>
              <button
                type="button"
                onClick={() => setFocusArea('center')}
                className={`px-2 py-0.5 rounded border ${
                  focusArea === 'center'
                    ? 'bg-cyan-500/30 border-cyan-400 text-cyan-200'
                    : 'bg-black/40 border-white/10 text-slate-400 hover:text-white'
                }`}
              >
                Helhet
              </button>
              <button
                type="button"
                onClick={() => setFocusArea('eyes')}
                className={`px-2 py-0.5 rounded border ${
                  focusArea === 'eyes'
                    ? 'bg-cyan-500/30 border-cyan-400 text-cyan-200'
                    : 'bg-black/40 border-white/10 text-slate-400 hover:text-white'
                }`}
              >
                Ansikte/Ögon
              </button>
              <button
                type="button"
                onClick={() => setFocusArea('implants')}
                className={`px-2 py-0.5 rounded border ${
                  focusArea === 'implants'
                    ? 'bg-cyan-500/30 border-cyan-400 text-cyan-200'
                    : 'bg-black/40 border-white/10 text-slate-400 hover:text-white'
                }`}
              >
                Cyberware
              </button>
              {card.rank === 12 && (
                <button
                  type="button"
                  onClick={() => setFocusArea('bust')}
                  className={`px-2 py-0.5 rounded border ${
                    focusArea === 'bust'
                      ? 'bg-pink-500/30 border-pink-400 text-pink-200'
                      : 'bg-black/40 border-white/10 text-slate-400 hover:text-white'
                  }`}
                >
                  Profil/Korsett
                </button>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Character Lore & Game Specs */}
        <div className="w-full md:w-1/2 p-6 flex flex-col justify-between overflow-y-auto">
          <div>
            {/* Header: Rank + Faction Badge */}
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span
                  className="text-3xl font-black font-mono"
                  style={{ color: suit.themeColor }}
                >
                  {rankLabel}
                </span>
                <span className="text-2xl" style={{ color: suit.themeColor }}>
                  {suit.symbol}
                </span>
                <span className="text-sm font-bold text-slate-300 font-mono uppercase tracking-wider ml-1">
                  {rankName}
                </span>
              </div>
              <span
                className="px-2.5 py-1 rounded text-xs font-mono font-bold tracking-widest border uppercase"
                style={{
                  backgroundColor: `${suit.themeColor}15`,
                  borderColor: `${suit.themeColor}60`,
                  color: suit.themeColor,
                }}
              >
                {suit.badge}
              </span>
            </div>

            {/* Operative Codename */}
            <h2 className="text-2xl font-black text-white tracking-wide mb-1 font-mono">
              {card.codename}
            </h2>
            <div className="text-xs text-cyan-400 font-mono tracking-wide mb-4">
              {suit.faction} · {card.role}
            </div>

            {/* Skitgubbe Special Ability Highlight */}
            {card.rank === 2 && (
              <div className="p-3 rounded-lg border border-cyan-400/50 bg-cyan-950/40 mb-4 flex items-start gap-2.5">
                <Zap className="w-5 h-5 text-cyan-300 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-cyan-200 font-mono uppercase tracking-wider">
                    SPECIALEFFEKT: NOLLSTÄLLARE (TVÅA)
                  </h4>
                  <p className="text-xs text-slate-300 mt-0.5">
                    Kan spelas när som helst på vilket kort som helst. Nollställer högen till 2 så nästa spelare kan spela valfritt kort!
                  </p>
                </div>
              </div>
            )}
            {card.rank === 10 && (
              <div className="p-3 rounded-lg border border-pink-500/50 bg-pink-950/40 mb-4 flex items-start gap-2.5">
                <Shield className="w-5 h-5 text-pink-300 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-pink-200 font-mono uppercase tracking-wider">
                    SPECIALEFFEKT: BRÄNNARE (TIA)
                  </h4>
                  <p className="text-xs text-slate-300 mt-0.5">
                    Kan spelas på alla kort! Bränner bort hela slänghögen ur spelet och ger dig ett nytt valfritt drag direkt.
                  </p>
                </div>
              </div>
            )}
            {card.rank === 12 && (
              <div className="p-3 rounded-lg border border-purple-500/50 bg-purple-950/40 mb-4 flex items-start gap-2.5">
                <Info className="w-5 h-5 text-purple-300 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-purple-200 font-mono uppercase tracking-wider">
                    SVITENS HÄRSKARE: DROTTNINGEN
                  </h4>
                  <p className="text-xs text-slate-300 mt-0.5">
                    Hög rang (värde 12). Karaktärsporträtt med signatur-estetik i futuristisk cyber-korsett och neonprofil.
                  </p>
                </div>
              </div>
            )}

            {/* Cyberware & Tech specs */}
            <div className="space-y-3 mb-5">
              <div className="p-3 rounded-lg bg-black/50 border border-white/10">
                <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-amber-400 mb-1">
                  <Cpu className="w-3.5 h-3.5" />
                  INSTALLERAD CYBERNETIK
                </div>
                <div className="text-xs text-slate-200 font-mono font-semibold">
                  {card.cyberware}
                </div>
              </div>

              <div className="p-3 rounded-lg bg-black/50 border border-white/10">
                <div className="text-xs font-mono font-bold text-slate-400 mb-1">
                  PROFIL & BIOGRAFI
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {card.lore}
                </p>
              </div>
            </div>
          </div>

          {/* Navigation between cards */}
          {onNavigate && (
            <div className="pt-3 border-t border-white/10 flex items-center justify-between">
              <button
                type="button"
                onClick={() => onNavigate('prev')}
                className="px-3 py-1.5 rounded bg-slate-900 hover:bg-slate-800 text-xs font-mono text-cyan-300 border border-cyan-500/30 flex items-center gap-1 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" /> Föregående kort
              </button>
              <span className="text-[11px] font-mono text-slate-400">
                Bläddra i kortleken
              </span>
              <button
                type="button"
                onClick={() => onNavigate('next')}
                className="px-3 py-1.5 rounded bg-slate-900 hover:bg-slate-800 text-xs font-mono text-cyan-300 border border-cyan-500/30 flex items-center gap-1 transition-colors"
              >
                Nästa kort <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
