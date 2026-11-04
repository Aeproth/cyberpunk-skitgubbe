import React, { useState, useEffect } from 'react';
import { Card, GameState, Player, isPlayerOut, isValidPlay, getTopCard } from '../game/rules';
import { SUIT_INFO } from '../game/characters';
import { CardView } from './CardView';
import { Zap, Flame, ShieldAlert, Award, ArrowDownToLine, Dice5, CheckCircle, Volume2, VolumeX } from 'lucide-react';
import { sounds } from '../utils/audio';

// Table background image generated earlier
const tableBgImg = '/src/assets/images/cyberpunk_table_bg_1793829110700.jpg';

interface GameTableProps {
  gameState: GameState;
  humanPlayerIndex: number;
  onPlayCards: (cards: Card[]) => void;
  onChance: () => void;
  onPickup: () => void;
  onSwapCards: (handCardId: string, faceUpCardId: string) => void;
  onFinishSwap: () => void;
  onInspectCard: (card: Card) => void;
  onOpenSettings: () => void;
  onOpenDeckBrowser: () => void;
}

export const GameTable: React.FC<GameTableProps> = ({
  gameState,
  humanPlayerIndex,
  onPlayCards,
  onChance,
  onPickup,
  onSwapCards,
  onFinishSwap,
  onInspectCard,
  onOpenSettings,
  onOpenDeckBrowser,
}) => {
  const { players, pile, deck, burnedCount, currentTurnIndex, phase, lastAction } = gameState;
  const humanPlayer = players[humanPlayerIndex];
  const isHumanTurn = currentTurnIndex === humanPlayerIndex && phase === 'playing' && !isPlayerOut(humanPlayer);

  // Card selection state for human
  const [selectedCardIds, setSelectedCardIds] = useState<string[]>([]);
  const [selectedHandForSwap, setSelectedHandForSwap] = useState<string | null>(null);
  const [burnAnimation, setBurnAnimation] = useState(false);
  const [resetAnimation, setResetAnimation] = useState(false);
  const [soundOn, setSoundOn] = useState(sounds.isEnabled());

  // Trigger animations on action
  useEffect(() => {
    if (lastAction?.type === 'burn') {
      setBurnAnimation(true);
      const timer = setTimeout(() => setBurnAnimation(false), 1200);
      return () => clearTimeout(timer);
    }
    if (lastAction?.type === 'reset') {
      setResetAnimation(true);
      const timer = setTimeout(() => setResetAnimation(false), 900);
      return () => clearTimeout(timer);
    }
  }, [lastAction]);

  const topCard = getTopCard(pile);
  const topRank = topCard ? topCard.rank : null;

  // Toggle card selection in hand
  const handleCardClick = (card: Card, source: 'hand' | 'faceUp' | 'faceDown', index?: number) => {
    if (phase === 'swap') {
      if (source === 'hand') {
        setSelectedHandForSwap(card.id === selectedHandForSwap ? null : card.id);
      } else if (source === 'faceUp') {
        if (selectedHandForSwap) {
          onSwapCards(selectedHandForSwap, card.id);
          setSelectedHandForSwap(null);
        }
      }
      return;
    }

    if (!isHumanTurn) return;

    // Phase is playing:
    if (source === 'hand') {
      if (selectedCardIds.includes(card.id)) {
        // If clicking on the selected card again and it's valid, play it immediately!
        if (selectedCardIds.length === 1 && isValidPlay(card.rank, topRank)) {
          onPlayCards([card]);
          setSelectedCardIds([]);
          return;
        }
        setSelectedCardIds(selectedCardIds.filter((id) => id !== card.id));
      } else {
        if (selectedCardIds.length === 0) {
          setSelectedCardIds([card.id]);
        } else {
          const firstSelected = humanPlayer.hand.find((c) => c.id === selectedCardIds[0]);
          if (firstSelected && firstSelected.rank === card.rank) {
            setSelectedCardIds([...selectedCardIds, card.id]);
          } else {
            // Replace selection
            setSelectedCardIds([card.id]);
          }
        }
      }
    } else if (source === 'faceUp') {
      // If hand is empty, human plays from faceUp
      if (humanPlayer.hand.length === 0) {
        if (isValidPlay(card.rank, topRank)) {
          onPlayCards([card]);
        } else {
          sounds.playError();
        }
      }
    } else if (source === 'faceDown') {
      // If hand & faceUp empty, human blind flips faceDown
      if (humanPlayer.hand.length === 0 && humanPlayer.faceUp.length === 0 && index !== undefined) {
        onPlayCards([card]);
      }
    }
  };

  const handlePlaySelected = () => {
    if (selectedCardIds.length === 0) return;
    const cardsToPlay = humanPlayer.hand.filter((c) => selectedCardIds.includes(c.id));
    if (cardsToPlay.length > 0) {
      if (isValidPlay(cardsToPlay[0].rank, topRank)) {
        onPlayCards(cardsToPlay);
        setSelectedCardIds([]);
      } else {
        sounds.playError();
      }
    }
  };

  // Check if player has any legal card in current active tier
  const hasLegalHandCards = humanPlayer.hand.some((c) => isValidPlay(c.rank, topRank));
  const hasLegalFaceUp = humanPlayer.faceUp.some((c) => isValidPlay(c.rank, topRank));

  // Determine opponent positioning
  const opponents = players.filter((_, idx) => idx !== humanPlayerIndex);

  return (
    <div
      className="relative w-full h-full min-h-screen flex flex-col justify-between overflow-hidden bg-black select-none"
      style={{
        backgroundImage: `linear-gradient(rgba(5, 7, 13, 0.78), rgba(4, 6, 12, 0.88)), url(${tableBgImg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* TOP HEADER HUD */}
      <header className="relative z-30 flex items-center justify-between px-4 py-2 bg-black/60 border-b border-cyan-500/20 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 font-mono font-black text-cyan-300 tracking-wider text-sm sm:text-base">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping inline-block" />
            SKITGUBBE · CYBER·PUNK
          </div>
          <span className="hidden sm:inline-block px-2 py-0.5 rounded text-[10px] font-mono bg-cyan-950/70 text-cyan-400 border border-cyan-500/30">
            FAS: {phase === 'swap' ? 'FÖRBEREDELSE (BYTE)' : 'SLAGFÄLT'}
          </span>
        </div>

        {/* Action Feed Notification */}
        {lastAction && (
          <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/90 border border-white/10 text-xs font-mono text-slate-200">
            <span className="w-2 h-2 rounded-full bg-pink-500" />
            <span>{lastAction.text}</span>
          </div>
        )}

        {/* Utility Controls */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              const next = !soundOn;
              setSoundOn(next);
              sounds.setEnabled(next);
            }}
            title={soundOn ? 'Tysta ljud' : 'Slå på ljud'}
            aria-label="Växla ljud"
            className="p-1.5 rounded-lg bg-black/50 hover:bg-slate-800 text-slate-300 hover:text-white border border-white/10 transition-colors"
          >
            {soundOn ? <Volume2 className="w-4 h-4 text-cyan-400" /> : <VolumeX className="w-4 h-4" />}
          </button>

          <button
            type="button"
            onClick={onOpenDeckBrowser}
            className="px-2.5 py-1 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-400/50 text-xs font-mono font-bold transition-colors"
          >
            Kortlek (52)
          </button>

          <button
            type="button"
            onClick={onOpenSettings}
            className="px-2.5 py-1 rounded-lg bg-pink-500/20 hover:bg-pink-500/30 text-pink-300 border border-pink-400/50 text-xs font-mono font-bold transition-colors"
          >
            Regler & Val
          </button>
        </div>
      </header>

      {/* OPPONENTS AREA (TOP / SIDES) */}
      <div className="relative z-20 flex items-start justify-around px-4 pt-2 gap-4">
        {opponents.map((bot, botIdx) => {
          const isTurn = currentTurnIndex === players.indexOf(bot) && phase === 'playing';
          const isOut = isPlayerOut(bot);

          return (
            <div
              key={bot.id}
              className={`relative flex flex-col items-center p-2.5 rounded-xl border transition-all duration-300 backdrop-blur-sm max-w-[280px] ${
                isTurn
                  ? 'border-pink-500 bg-pink-950/40 shadow-lg shadow-pink-500/20 scale-105'
                  : 'border-white/10 bg-black/50'
              }`}
            >
              {/* Bot Info Tag */}
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-xs font-mono font-bold text-white flex items-center gap-1">
                  {bot.name}
                  {isOut && (
                    <span className="text-[10px] text-emerald-400 font-bold ml-1 flex items-center gap-0.5">
                      <Award className="w-3 h-3" /> Klart! (#{bot.finishedRank})
                    </span>
                  )}
                </span>
                <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-white/10 text-slate-300 uppercase">
                  {bot.difficulty || 'BOT'}
                </span>
              </div>

              {/* Bot Card Status Rows */}
              <div className="flex items-center gap-4 text-xs font-mono">
                {/* Hand cards count */}
                <div className="flex items-center gap-1 text-slate-300">
                  <span className="text-[10px] text-slate-400">Hand:</span>
                  <span className="font-bold text-cyan-300 bg-cyan-950/80 px-1.5 py-0.2 rounded border border-cyan-500/30">
                    {bot.hand.length}
                  </span>
                </div>

                {/* Table cards (Face-up & Face-down mini display) */}
                <div className="flex items-center gap-1">
                  {bot.faceDown.map((_, i) => (
                    <div
                      key={`bot-down-${i}`}
                      className="w-4 h-6 rounded bg-slate-800 border border-cyan-500/30 relative"
                      title="Dolt kort på bordet"
                    />
                  ))}
                  {bot.faceUp.map((c) => (
                    <div
                      key={`bot-up-${c.id}`}
                      className="w-5 h-7 rounded border flex items-center justify-center font-mono font-bold text-[9px] bg-slate-900 cursor-pointer hover:scale-110 transition-transform"
                      style={{
                        borderColor: SUIT_INFO[c.suit].themeColor,
                        color: SUIT_INFO[c.suit].themeColor,
                      }}
                      onClick={() => onInspectCard(c)}
                      title={`Öppet kort: ${c.codename} (klicka för att zooma)`}
                    >
                      {c.rank === 14 ? 'A' : c.rank === 13 ? 'K' : c.rank === 12 ? 'Q' : c.rank === 11 ? 'J' : c.rank}
                    </div>
                  ))}
                </div>
              </div>

              {/* Thinking / Turn Aura */}
              {isTurn && (
                <div className="mt-1 flex items-center gap-1 text-[10px] font-mono text-pink-400 animate-pulse font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-pink-400 inline-block animate-ping" />
                  BERÄKNAR DRAG...
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* CENTER ARENA: SLÄNGHÖG, TALONG & BRÄNDA KORT */}
      <div className="relative z-20 flex-1 flex flex-col items-center justify-center px-4 py-2">
        {/* Animated Burn & Reset Overlays */}
        {burnAnimation && (
          <div className="absolute inset-0 z-40 pointer-events-none flex flex-col items-center justify-center animate-bounce">
            <div className="px-6 py-3 rounded-2xl bg-gradient-to-r from-red-600 via-pink-600 to-amber-500 text-white font-black text-2xl sm:text-3xl font-mono tracking-widest shadow-2xl border-2 border-white flex items-center gap-3">
              <Flame className="w-8 h-8 text-yellow-300 animate-spin" />
              BRÄND HÖG! NYTT DRAG!
            </div>
          </div>
        )}

        {resetAnimation && (
          <div className="absolute inset-0 z-40 pointer-events-none flex flex-col items-center justify-center animate-pulse">
            <div className="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-black text-xl sm:text-2xl font-mono tracking-widest shadow-2xl border-2 border-cyan-300 flex items-center gap-2">
              <Zap className="w-7 h-7 text-cyan-200 animate-pulse" />
              SYSTEM NOLLSTÄLLT (TVÅA)!
            </div>
          </div>
        )}

        {/* Central Deck & Discard Play Mat */}
        <div className="flex items-center gap-6 sm:gap-10 p-4 sm:p-6 rounded-2xl bg-black/60 border border-cyan-500/30 backdrop-blur-md shadow-2xl">
          {/* DRAW PILE (TALONG) */}
          <div className="flex flex-col items-center">
            <div className="text-[10px] font-mono text-cyan-400 tracking-wider mb-1.5 uppercase font-bold flex items-center gap-1">
              <ArrowDownToLine className="w-3 h-3" /> Talong ({deck.length})
            </div>

            <div className="relative">
              {deck.length > 0 ? (
                <div
                  className="relative cursor-pointer transition-transform hover:scale-105"
                  onClick={isHumanTurn ? onChance : undefined}
                  title={isHumanTurn ? 'Chansa: dra översta kortet' : 'Talong'}
                >
                  {/* Visual 3D Stack layers */}
                  {deck.length > 3 && (
                    <div className="absolute -top-1.5 -left-1.5 w-24 h-36 rounded-lg bg-slate-900 border border-cyan-600/30 pointer-events-none" />
                  )}
                  {deck.length > 1 && (
                    <div className="absolute -top-0.5 -left-0.5 w-24 h-36 rounded-lg bg-slate-900 border border-cyan-600/40 pointer-events-none" />
                  )}
                  <CardView isFaceDown size="md" />
                </div>
              ) : (
                <div className="w-24 h-36 rounded-lg border-2 border-dashed border-slate-700 bg-black/40 flex flex-col items-center justify-center p-2 text-center text-slate-500 font-mono text-xs">
                  <span>TOM TALONG</span>
                </div>
              )}
            </div>
          </div>

          {/* DISCARD PILE (SLÄNGHÖG) */}
          <div className="flex flex-col items-center">
            <div className="text-[10px] font-mono text-pink-400 tracking-wider mb-1.5 uppercase font-bold flex items-center gap-1">
              <Flame className="w-3 h-3" /> Slänghög ({pile.length} kort)
            </div>

            <div className="relative min-w-[96px] min-h-[144px] flex items-center justify-center">
              {pile.length > 0 && topCard ? (
                <div className="relative">
                  {/* Pile depth indicators */}
                  {pile.length > 2 && (
                    <div className="absolute -top-1 -right-1 w-24 h-36 rounded-lg bg-black/70 border border-white/10 rotate-3 pointer-events-none" />
                  )}
                  <CardView
                    card={topCard}
                    size="md"
                    onInspect={() => onInspectCard(topCard)}
                  />
                  {/* Top card glowing requirement badge */}
                  <div className="absolute -bottom-2 inset-x-0 mx-auto w-max px-2 py-0.5 rounded-full bg-black/90 border border-cyan-400 text-[10px] font-mono text-cyan-300 font-bold shadow-lg">
                    LÄGG: {topRank === 2 ? 'Valfritt' : `≥ ${topRank}`}
                  </div>
                </div>
              ) : (
                <div className="w-24 h-36 rounded-lg border-2 border-dashed border-pink-500/40 bg-pink-950/20 flex flex-col items-center justify-center p-2 text-center text-pink-400/80 font-mono text-xs">
                  <span>TOM HÖG</span>
                  <span className="text-[10px] text-slate-400 mt-1">Lägg valfritt kort</span>
                </div>
              )}
            </div>
          </div>

          {/* BURNED PILE COUNTER (SKROTAT) */}
          <div className="hidden sm:flex flex-col items-center">
            <div className="text-[10px] font-mono text-slate-400 tracking-wider mb-1.5 uppercase font-bold">
              Brända ({burnedCount})
            </div>
            <div className="w-16 h-24 rounded-lg border border-slate-700/60 bg-black/40 flex flex-col items-center justify-center text-slate-500 font-mono text-xs">
              <ShieldAlert className="w-5 h-5 text-slate-600 mb-1" />
              <span className="font-bold text-slate-400">{burnedCount}</span>
            </div>
          </div>
        </div>

        {/* Turn Guidance Banner */}
        <div className="mt-3">
          {phase === 'swap' ? (
            <div className="px-4 py-2 rounded-xl bg-cyan-950/80 border border-cyan-400/60 text-cyan-200 font-mono text-xs sm:text-sm flex items-center gap-3">
              <span>💡 Klicka på ett handkort och ett öppet kort för att byta plats.</span>
              <button
                type="button"
                onClick={onFinishSwap}
                className="px-3 py-1 rounded bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs uppercase tracking-wider transition-colors flex items-center gap-1"
              >
                <CheckCircle className="w-3.5 h-3.5" /> Klar med byten
              </button>
            </div>
          ) : isHumanTurn ? (
            <div className="px-4 py-1.5 rounded-xl bg-pink-950/80 border border-pink-400 text-pink-200 font-mono text-xs sm:text-sm font-bold animate-pulse flex items-center gap-2">
              <Zap className="w-4 h-4 text-pink-400" />
              <span>DIN TUR! Välj kort att spela, eller chansa/ta upp högen.</span>
            </div>
          ) : (
            <div className="px-4 py-1.5 rounded-xl bg-black/50 border border-white/10 text-slate-400 font-mono text-xs">
              Väntar på motståndarens drag...
            </div>
          )}
        </div>
      </div>

      {/* HUMAN PLAYER ZONE (BOTTOM) */}
      <div className="relative z-30 pb-4 pt-2 px-3 sm:px-6 bg-gradient-to-t from-black via-black/90 to-transparent flex flex-col items-center border-t border-cyan-500/20">
        {/* Table Cards row (3 face-down with 3 face-up on top) */}
        <div className="mb-2 flex flex-col items-center">
          <div className="text-[10px] font-mono text-cyan-300 uppercase tracking-widest font-bold mb-1">
            Dina Bordskort (3 dolda + 3 öppna)
          </div>

          <div className="flex items-center gap-3 sm:gap-6">
            {[0, 1, 2].map((idx) => {
              const downCard = humanPlayer.faceDown[idx];
              const upCard = humanPlayer.faceUp[idx];

              return (
                <div key={`table-slot-${idx}`} className="relative flex flex-col items-center">
                  {/* Face down base */}
                  {downCard && (
                    <div className="relative">
                      <CardView
                        card={downCard}
                        isFaceDown
                        size="sm"
                        onClick={
                          humanPlayer.hand.length === 0 && humanPlayer.faceUp.length === 0 && isHumanTurn
                            ? () => handleCardClick(downCard, 'faceDown', idx)
                            : undefined
                        }
                      />
                    </div>
                  )}

                  {/* Face up card placed on top */}
                  {upCard && (
                    <div className="absolute -top-1.5 inset-x-0 mx-auto">
                      <CardView
                        card={upCard}
                        size="sm"
                        isPlayable={isHumanTurn && humanPlayer.hand.length === 0 ? isValidPlay(upCard.rank, topRank) : true}
                        onClick={() => handleCardClick(upCard, 'faceUp')}
                        onInspect={() => onInspectCard(upCard)}
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Action Buttons row (for playing cards, chance, pickup) */}
        {phase === 'playing' && isHumanTurn && (
          <div className="flex items-center gap-2 mb-2 flex-wrap justify-center">
            {selectedCardIds.length > 0 && (
              <button
                type="button"
                onClick={handlePlaySelected}
                className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-mono font-black text-xs uppercase tracking-wider shadow-lg shadow-cyan-500/40 transition-transform active:scale-95 flex items-center gap-1.5"
              >
                <Zap className="w-4 h-4" /> Spela valda ({selectedCardIds.length} kort)
              </button>
            )}

            {deck.length > 0 && (
              <button
                type="button"
                onClick={onChance}
                className="px-3.5 py-2 rounded-xl bg-purple-950/80 hover:bg-purple-900 border border-purple-400 text-purple-200 font-mono text-xs font-bold transition-transform active:scale-95 flex items-center gap-1.5"
                title="Dra ett chans-kort från talongen"
              >
                <Dice5 className="w-4 h-4 text-purple-300" /> Chansa (Dra)
              </button>
            )}

            {pile.length > 0 && (
              <button
                type="button"
                onClick={onPickup}
                className="px-3.5 py-2 rounded-xl bg-red-950/80 hover:bg-red-900 border border-pink-500/50 text-pink-200 font-mono text-xs font-bold transition-transform active:scale-95 flex items-center gap-1.5"
                title="Ta upp hela slänghögen till handen"
              >
                <ArrowDownToLine className="w-4 h-4 text-pink-400" /> Ta upp högen ({pile.length})
              </button>
            )}
          </div>
        )}

        {/* Hand Cards fanned out */}
        <div className="w-full max-w-4xl flex flex-col items-center">
          <div className="text-[10px] font-mono text-slate-400 uppercase tracking-widest font-bold mb-1 flex items-center gap-2">
            <span>Dina Handkort ({humanPlayer.hand.length})</span>
            {selectedCardIds.length > 0 && (
              <span className="text-cyan-300 font-mono">
                · {selectedCardIds.length} valda
              </span>
            )}
          </div>

          {humanPlayer.hand.length === 0 ? (
            <div className="py-3 px-6 rounded-xl border border-cyan-500/30 bg-cyan-950/30 text-cyan-300 font-mono text-xs">
              Handen är tom! Spela nu från dina öppna bordskort.
            </div>
          ) : (
            <div className="flex items-center justify-center gap-1.5 sm:gap-2.5 overflow-x-auto max-w-full py-1 px-2 scrollbar-none">
              {humanPlayer.hand.map((card) => {
                const isSelected = selectedCardIds.includes(card.id) || selectedHandForSwap === card.id;
                const isPlayable = phase === 'swap' ? true : isValidPlay(card.rank, topRank);

                return (
                  <div key={card.id} className="relative transition-transform shrink-0" data-hand-card="true">
                    <CardView
                      card={card}
                      size="md"
                      isSelected={isSelected}
                      isPlayable={isPlayable}
                      onClick={() => handleCardClick(card, 'hand')}
                      onInspect={() => onInspectCard(card)}
                    />
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
