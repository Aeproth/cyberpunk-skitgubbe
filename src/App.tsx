/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  Card,
  GameState,
  Player,
  BotDifficulty,
  isValidPlay,
  getTopCard,
  checkFourOfAKind,
  getNextPlayerIndex,
  isPlayerOut,
  swapHandAndFaceUp,
  decideBotSwap,
  decideBotMove,
} from './game/rules';
import { createDeck, shuffleDeck } from './game/characters';
import { GameTable } from './components/GameTable';
import { CardDetailModal } from './components/CardDetailModal';
import { DeckBrowserModal } from './components/DeckBrowserModal';
import { SettingsAndRulesModal } from './components/SettingsAndRulesModal';
import { sounds } from './utils/audio';
import { Play, Sparkles, BookOpen, Layers, Trophy, Skull, RotateCcw } from 'lucide-react';

export default function App() {
  const [screen, setScreen] = useState<'title' | 'playing' | 'gameover'>('title');
  const [playerCount, setPlayerCount] = useState<number>(3);
  const [playerName, setPlayerName] = useState<string>('Netrunner');
  const [botDifficulty, setBotDifficulty] = useState<BotDifficulty>('medium');

  // Active game state
  const [gameState, setGameState] = useState<GameState | null>(null);
  const humanIndex = 0;

  // Modals
  const [inspectedCard, setInspectedCard] = useState<Card | null>(null);
  const [isDeckBrowserOpen, setIsDeckBrowserOpen] = useState<boolean>(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);

  // Cached full deck for gallery
  const fullDeckRef = useRef<Card[]>(createDeck());

  // Mirror state to document.body.dataset.state for ultra-mode compliance
  useEffect(() => {
    document.body.dataset.state = screen;
  }, [screen]);

  // Support ?autostart=1
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('autostart') === '1') {
      startNewGame();
    }
  }, []);

  // Keyboard shortcut: Space or Enter on Title screen starts the game
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (screen === 'title' && (e.key === 'Enter' || e.key === ' ')) {
        e.preventDefault();
        startNewGame();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [screen, playerCount, playerName, botDifficulty]);

  // Start new game setup
  const startNewGame = () => {
    const deck = shuffleDeck(createDeck());
    const players: Player[] = [];

    // Human player
    players.push({
      id: 'human-p0',
      name: playerName || 'Netrunner',
      isBot: false,
      hand: [],
      faceUp: [],
      faceDown: [],
    });

    // AI Bots
    const botNames = ['Kira', 'Vesper', 'Nyx'];
    for (let i = 1; i < playerCount; i++) {
      players.push({
        id: `bot-p${i}`,
        name: botNames[i - 1] || `AI Agent ${i}`,
        isBot: true,
        difficulty: botDifficulty,
        hand: [],
        faceUp: [],
        faceDown: [],
      });
    }

    // Deal cards according to Skitgubbe rules:
    // 3 faceDown, 3 faceUp, 3 in hand for each player
    players.forEach((p) => {
      p.faceDown = deck.splice(0, 3);
      p.faceUp = deck.splice(0, 3);
      p.hand = deck.splice(0, 3);

      // If bot, automatically optimize their faceUp cards during deal
      if (p.isBot) {
        const optimized = decideBotSwap(p);
        p.hand = optimized.hand;
        p.faceUp = optimized.faceUp;
      }
    });

    const newGameState: GameState = {
      players,
      deck,
      pile: [],
      burnedCount: 0,
      currentTurnIndex: 0,
      phase: 'swap',
      winners: [],
    };

    setGameState(newGameState);
    setScreen('playing');
    sounds.playCardDeal();
  };

  // Human finishes swap phase
  const handleFinishSwap = () => {
    if (!gameState) return;
    setGameState((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        phase: 'playing',
        lastAction: {
          playerId: prev.players[humanIndex].id,
          text: 'Spelet har börjat! Lägg valfritt startkort.',
          type: 'play',
        },
      };
    });
    sounds.playCardPlay();
  };

  // Swap human card between hand and faceUp
  const handleSwapCards = (handCardId: string, faceUpCardId: string) => {
    if (!gameState || gameState.phase !== 'swap') return;
    setGameState((prev) => {
      if (!prev) return null;
      const updatedHuman = swapHandAndFaceUp(prev.players[humanIndex], handCardId, faceUpCardId);
      const newPlayers = [...prev.players];
      newPlayers[humanIndex] = updatedHuman;
      return {
        ...prev,
        players: newPlayers,
      };
    });
    sounds.playCardDeal();
  };

  // Refill hand up to 3 cards from deck
  const refillHand = (player: Player, currentDeck: Card[]): { player: Player; deck: Card[] } => {
    const updatedPlayer = { ...player, hand: [...player.hand] };
    const updatedDeck = [...currentDeck];
    while (updatedPlayer.hand.length < 3 && updatedDeck.length > 0) {
      updatedPlayer.hand.push(updatedDeck.shift()!);
    }
    return { player: updatedPlayer, deck: updatedDeck };
  };

  // Check if player finished all cards
  const evaluatePlayerWin = (
    player: Player,
    winners: string[]
  ): { player: Player; winners: string[]; isWinnerNow: boolean } => {
    if (isPlayerOut(player) && !winners.includes(player.id)) {
      const newWinners = [...winners, player.id];
      const finishedRank = newWinners.length;
      return {
        player: { ...player, finishedRank },
        winners: newWinners,
        isWinnerNow: true,
      };
    }
    return { player, winners, isWinnerNow: false };
  };

  // Human executes card play
  const handlePlayCards = (cardsToPlay: Card[]) => {
    if (!gameState || gameState.phase !== 'playing') return;
    if (gameState.currentTurnIndex !== humanIndex) return;

    const topCard = getTopCard(gameState.pile);
    const topRank = topCard ? topCard.rank : null;
    const playedRank = cardsToPlay[0].rank;

    if (!isValidPlay(playedRank, topRank)) {
      sounds.playError();
      return;
    }

    executeTurnPlay(humanIndex, cardsToPlay);
  };

  // Human executes chance (dra ett kort från talongen)
  const handleChance = () => {
    if (!gameState || gameState.phase !== 'playing') return;
    if (gameState.currentTurnIndex !== humanIndex) return;
    if (gameState.deck.length === 0) return;

    executeTurnChance(humanIndex);
  };

  // Human executes pickup (tar upp hela slänghögen)
  const handlePickup = () => {
    if (!gameState || gameState.phase !== 'playing') return;
    if (gameState.currentTurnIndex !== humanIndex) return;
    if (gameState.pile.length === 0) return;

    executeTurnPickup(humanIndex);
  };

  // Pure logic execution for a play turn
  const executeTurnPlay = (playerIdx: number, cardsToPlay: Card[]) => {
    setGameState((prev) => {
      if (!prev) return null;
      let newDeck = [...prev.deck];
      let newPile = [...prev.pile, ...cardsToPlay];
      let burned = prev.burnedCount;
      let winners = [...prev.winners];

      const p = prev.players[playerIdx];
      let newHand = [...p.hand];
      let newFaceUp = [...p.faceUp];
      let newFaceDown = [...p.faceDown];

      // Remove played cards from source
      cardsToPlay.forEach((c) => {
        const inHand = newHand.findIndex((card) => card.id === c.id);
        if (inHand !== -1) {
          newHand.splice(inHand, 1);
        } else {
          const inFaceUp = newFaceUp.findIndex((card) => card.id === c.id);
          if (inFaceUp !== -1) {
            newFaceUp.splice(inFaceUp, 1);
          } else {
            const inFaceDown = newFaceDown.findIndex((card) => card.id === c.id);
            if (inFaceDown !== -1) {
              newFaceDown.splice(inFaceDown, 1);
            }
          }
        }
      });

      // Refill hand up to 3 cards if deck has cards
      let updatedPlayer: Player = {
        ...p,
        hand: newHand,
        faceUp: newFaceUp,
        faceDown: newFaceDown,
      };

      const refilled = refillHand(updatedPlayer, newDeck);
      updatedPlayer = refilled.player;
      newDeck = refilled.deck;

      // Check special cards:
      const playedRank = cardsToPlay[0].rank;
      const isTen = playedRank === 10;
      const isTwo = playedRank === 2;
      const isFourOfAKind = checkFourOfAKind(newPile);

      let giveExtraTurn = false;
      let actionType: 'play' | 'burn' | 'reset' = 'play';
      let actionText = `${p.name} spelade ${cardsToPlay.length > 1 ? `${cardsToPlay.length}x ` : ''}${cardsToPlay[0].name}.`;

      if (isTen || isFourOfAKind) {
        burned += newPile.length;
        newPile = [];
        giveExtraTurn = true;
        actionType = 'burn';
        actionText = isTen
          ? `💥 ${p.name} brände högen med en Tia!`
          : `💥 ${p.name} brände högen med fyrtal!`;
        sounds.playBurn();
      } else if (isTwo) {
        actionType = 'reset';
        actionText = `⚡ ${p.name} nollställde högen med en Tvåa!`;
        sounds.playReset();
      } else {
        sounds.playCardPlay();
      }

      // Check if this player finished
      const winCheck = evaluatePlayerWin(updatedPlayer, winners);
      updatedPlayer = winCheck.player;
      winners = winCheck.winners;

      const newPlayers = [...prev.players];
      newPlayers[playerIdx] = updatedPlayer;

      // Check game completion: if all or all but 1 player finished
      const activePlayers = newPlayers.filter((pl) => !isPlayerOut(pl));
      if (activePlayers.length <= 1) {
        const skitgubbe = activePlayers[0];
        setScreen('gameover');
        if (skitgubbe?.id === prev.players[humanIndex].id) {
          sounds.playError();
        } else {
          sounds.playVictory();
        }
        return {
          ...prev,
          players: newPlayers,
          pile: newPile,
          deck: newDeck,
          burnedCount: burned,
          phase: 'gameover',
          winners,
          skitgubbeId: skitgubbe?.id,
          lastAction: {
            playerId: p.id,
            text: actionText,
            type: actionType,
          },
        };
      }

      // Advance turn
      let nextTurn = prev.currentTurnIndex;
      if (!giveExtraTurn || isPlayerOut(updatedPlayer)) {
        nextTurn = getNextPlayerIndex(prev.currentTurnIndex, newPlayers);
      }

      return {
        ...prev,
        players: newPlayers,
        pile: newPile,
        deck: newDeck,
        burnedCount: burned,
        currentTurnIndex: nextTurn,
        winners,
        lastAction: {
          playerId: p.id,
          text: actionText,
          type: actionType,
        },
      };
    });
  };

  // Pure logic execution for chance
  const executeTurnChance = (playerIdx: number) => {
    setGameState((prev) => {
      if (!prev) return null;
      if (prev.deck.length === 0) return prev;

      const newDeck = [...prev.deck];
      const drawnCard = newDeck.shift()!;
      const p = prev.players[playerIdx];

      const topCard = getTopCard(prev.pile);
      const topRank = topCard ? topCard.rank : null;

      if (isValidPlay(drawnCard.rank, topRank)) {
        // Chance succeeded! Play the drawn card
        sounds.playCardPlay();
        // Recurse play through internal state
        let newPile = [...prev.pile, drawnCard];
        let burned = prev.burnedCount;
        let giveExtraTurn = false;
        let actionType: 'play' | 'burn' | 'reset' = 'play';
        let actionText = `🎲 ${p.name} chansade och lyckades lägga ${drawnCard.name}!`;

        if (drawnCard.rank === 10 || checkFourOfAKind(newPile)) {
          burned += newPile.length;
          newPile = [];
          giveExtraTurn = true;
          actionType = 'burn';
          actionText = `🎲💥 ${p.name} chansade och drog en TIA! Högen brändes!`;
          sounds.playBurn();
        } else if (drawnCard.rank === 2) {
          actionType = 'reset';
          actionText = `🎲⚡ ${p.name} chansade och drog en TVÅA! Nollställd!`;
          sounds.playReset();
        }

        const nextTurn = giveExtraTurn ? playerIdx : getNextPlayerIndex(playerIdx, prev.players);

        return {
          ...prev,
          deck: newDeck,
          pile: newPile,
          burnedCount: burned,
          currentTurnIndex: nextTurn,
          lastAction: {
            playerId: p.id,
            text: actionText,
            type: actionType,
          },
        };
      } else {
        // Chance failed! Player must take up drawn card AND entire pile to hand
        sounds.playPickup();
        const newHand = [...p.hand, drawnCard, ...prev.pile];
        const updatedPlayer = { ...p, hand: newHand };
        const newPlayers = [...prev.players];
        newPlayers[playerIdx] = updatedPlayer;

        const nextTurn = getNextPlayerIndex(playerIdx, newPlayers);

        return {
          ...prev,
          deck: newDeck,
          pile: [],
          players: newPlayers,
          currentTurnIndex: nextTurn,
          lastAction: {
            playerId: p.id,
            text: `⚠️ ${p.name} chansade på ${drawnCard.name} (misslyckades) och tog upp slänghögen!`,
            type: 'chance_fail',
          },
        };
      }
    });
  };

  // Pure logic execution for pickup
  const executeTurnPickup = (playerIdx: number) => {
    setGameState((prev) => {
      if (!prev) return null;
      if (prev.pile.length === 0) return prev;

      sounds.playPickup();
      const p = prev.players[playerIdx];
      const newHand = [...p.hand, ...prev.pile];
      const updatedPlayer = { ...p, hand: newHand };
      const newPlayers = [...prev.players];
      newPlayers[playerIdx] = updatedPlayer;

      const nextTurn = getNextPlayerIndex(playerIdx, newPlayers);

      return {
        ...prev,
        pile: [],
        players: newPlayers,
        currentTurnIndex: nextTurn,
        lastAction: {
          playerId: p.id,
          text: `📥 ${p.name} tog upp slänghögen (${prev.pile.length} kort) till handen.`,
          type: 'pickup',
        },
      };
    });
  };

  // AI Bots Turn Scheduler (runs automatically when it's an AI's turn)
  useEffect(() => {
    if (!gameState || gameState.phase !== 'playing' || screen !== 'playing') return;

    const currentPlayer = gameState.players[gameState.currentTurnIndex];
    if (!currentPlayer || !currentPlayer.isBot || isPlayerOut(currentPlayer)) return;

    const timer = setTimeout(() => {
      const decision = decideBotMove(
        currentPlayer,
        gameState.pile,
        gameState.deck.length,
        currentPlayer.difficulty
      );

      if (decision.action === 'play' && decision.cardsToPlay) {
        executeTurnPlay(gameState.currentTurnIndex, decision.cardsToPlay);
      } else if (decision.action === 'play' && decision.faceDownIndex !== undefined) {
        // Blind flip face down
        const card = currentPlayer.faceDown[decision.faceDownIndex];
        const topCard = getTopCard(gameState.pile);
        const topRank = topCard ? topCard.rank : null;

        if (isValidPlay(card.rank, topRank)) {
          executeTurnPlay(gameState.currentTurnIndex, [card]);
        } else {
          // Blind flip failed, pickup pile and that card
          sounds.playPickup();
          setGameState((prev) => {
            if (!prev) return null;
            const newFaceDown = currentPlayer.faceDown.filter((_, i) => i !== decision.faceDownIndex);
            const newHand = [...currentPlayer.hand, card, ...prev.pile];
            const updatedBot: Player = { ...currentPlayer, faceDown: newFaceDown, hand: newHand };
            const newPlayers = [...prev.players];
            newPlayers[gameState.currentTurnIndex] = updatedBot;
            const nextTurn = getNextPlayerIndex(gameState.currentTurnIndex, newPlayers);
            return {
              ...prev,
              pile: [],
              players: newPlayers,
              currentTurnIndex: nextTurn,
              lastAction: {
                playerId: currentPlayer.id,
                text: `💥 ${currentPlayer.name} vände ett dolt ${card.name} (kunde ej läggas) och tog upp slänghögen!`,
                type: 'chance_fail',
              },
            };
          });
        }
      } else if (decision.action === 'chance') {
        executeTurnChance(gameState.currentTurnIndex);
      } else {
        executeTurnPickup(gameState.currentTurnIndex);
      }
    }, 750);

    return () => clearTimeout(timer);
  }, [gameState?.currentTurnIndex, gameState?.phase, screen]);

  // Navigate between cards in inspect modal
  const handleNavigateCard = (direction: 'next' | 'prev') => {
    if (!inspectedCard) return;
    const all = fullDeckRef.current;
    const currentIdx = all.findIndex((c) => c.id === inspectedCard.id);
    if (currentIdx === -1) return;

    const nextIdx =
      direction === 'next'
        ? (currentIdx + 1) % all.length
        : (currentIdx - 1 + all.length) % all.length;
    setInspectedCard(all[nextIdx]);
  };

  return (
    <div className="w-full h-full min-h-screen bg-black text-white font-sans overflow-x-hidden">
      {/* 1. TITLE SCREEN */}
      {screen === 'title' && (
        <div
          className="relative w-full h-full min-h-screen flex flex-col justify-between items-center p-6 bg-cover bg-center overflow-hidden"
          style={{
            backgroundImage: `linear-gradient(rgba(4, 7, 14, 0.75), rgba(2, 4, 10, 0.9)), url('/src/assets/images/cyberpunk_table_bg_1793829110700.jpg')`,
          }}
        >
          {/* Subtle Cyber Grid Animation */}
          <div className="absolute inset-0 bg-[radial-gradient(#00f0ff_1px,_transparent_1px)] opacity-10 [background-size:24px_24px] pointer-events-none" />

          {/* Top Lockup */}
          <div className="relative z-10 w-full max-w-4xl flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-cyan-400 animate-pulse" />
              <span className="text-xs font-mono tracking-widest text-cyan-400 font-bold">
                CYBERPUNK SKITGUBBE · PROTOKOLL 2077
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsSettingsOpen(true)}
                className="px-3 py-1.5 rounded-lg bg-black/60 hover:bg-slate-900 border border-white/10 text-xs font-mono text-slate-300 transition-colors flex items-center gap-1.5"
              >
                <BookOpen className="w-3.5 h-3.5 text-pink-400" /> Regler
              </button>
              <button
                type="button"
                onClick={() => setIsDeckBrowserOpen(true)}
                className="px-3 py-1.5 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-400/50 text-xs font-mono text-cyan-300 font-bold transition-colors flex items-center gap-1.5"
              >
                <Layers className="w-3.5 h-3.5 text-cyan-400" /> Kortex (52 kort)
              </button>
            </div>
          </div>

          {/* Center Title Lockup & Form */}
          <main className="relative z-10 flex flex-col items-center text-center my-auto max-w-xl w-full">
            <div className="mb-2 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-400/50 text-cyan-300 text-xs font-mono uppercase tracking-widest">
              <Sparkles className="w-3.5 h-3.5 text-pink-400" /> Svenskt Kortspelsklassiker i Cyberpunk-Estetik
            </div>

            <h1 className="text-4xl sm:text-6xl font-black font-mono tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-pink-400 to-amber-300 drop-shadow-lg mb-3">
              SKITGUBBE
            </h1>

            <p className="text-sm text-slate-300 font-mono mb-8 max-w-md">
              Bli av med alla dina kort innan motståndarna. Den som blir sist kvar med kort blir bordets <em>Skitgubbe</em>.
            </p>

            {/* Game Setup Box */}
            <div className="w-full bg-[#080d17]/85 border border-cyan-500/40 rounded-2xl p-5 shadow-2xl backdrop-blur-md flex flex-col gap-4 text-left">
              {/* Player Name */}
              <div>
                <label htmlFor="player-name-input" className="block text-xs font-mono text-slate-400 uppercase tracking-wider mb-1.5 font-bold">
                  Ditt Namn / Alias:
                </label>
                <input
                  id="player-name-input"
                  type="text"
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-black/60 border border-cyan-500/40 text-cyan-200 font-mono text-sm focus:outline-none focus:border-cyan-400"
                  placeholder="Netrunner"
                />
              </div>

              {/* Player Count */}
              <div>
                <label className="block text-xs font-mono text-slate-400 uppercase tracking-wider mb-1.5 font-bold">
                  Antal Spelare (1 till 4):
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[2, 3, 4].map((count) => (
                    <button
                      key={count}
                      type="button"
                      onClick={() => setPlayerCount(count)}
                      className={`py-2 rounded-lg font-mono text-xs font-bold border transition-all ${
                        playerCount === count
                          ? 'bg-cyan-500/30 border-cyan-400 text-cyan-200 shadow-sm shadow-cyan-500/40'
                          : 'bg-black/40 border-white/10 text-slate-400 hover:text-white'
                      }`}
                    >
                      {count} Spelare ({count - 1} Bot{count > 2 ? 'ar' : ''})
                    </button>
                  ))}
                </div>
              </div>

              {/* Bot Difficulty */}
              <div>
                <label className="block text-xs font-mono text-slate-400 uppercase tracking-wider mb-1.5 font-bold">
                  AI-Motståndarnas Svårighetsgrad:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['easy', 'medium', 'hard'] as const).map((diff) => (
                    <button
                      key={diff}
                      type="button"
                      onClick={() => setBotDifficulty(diff)}
                      className={`py-2 rounded-lg font-mono text-xs font-bold border transition-all ${
                        botDifficulty === diff
                          ? 'bg-pink-500/30 border-pink-400 text-pink-200 shadow-sm shadow-pink-500/40'
                          : 'bg-black/40 border-white/10 text-slate-400 hover:text-white'
                      }`}
                    >
                      {diff === 'easy' && 'Novis (Lätt)'}
                      {diff === 'medium' && 'Netrunner (Medel)'}
                      {diff === 'hard' && 'Cyber-Gud (Svår)'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Primary Start CTA */}
              <button
                type="button"
                data-start="true"
                onClick={startNewGame}
                className="w-full mt-2 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-pink-500 hover:from-cyan-400 hover:to-pink-400 text-black font-mono font-black text-sm uppercase tracking-widest shadow-xl shadow-cyan-500/30 transition-transform active:scale-95 flex items-center justify-center gap-2"
              >
                <Play className="w-4 h-4 fill-black" />
                STARTA MATCHEN (ENTER / MELLANSLAG)
              </button>
            </div>
          </main>

          {/* Footer control hints */}
          <footer className="relative z-10 text-[11px] font-mono text-slate-500 text-center">
            Mellanslag / Enter Startar · 3 Dolda / 3 Öppna / 3 Handkort · 2 Nollställer · 10 Bränner
          </footer>
        </div>
      )}

      {/* 2. PLAYING HUD / ARENA */}
      {screen === 'playing' && gameState && (
        <GameTable
          gameState={gameState}
          humanPlayerIndex={humanIndex}
          onPlayCards={handlePlayCards}
          onChance={handleChance}
          onPickup={handlePickup}
          onSwapCards={handleSwapCards}
          onFinishSwap={handleFinishSwap}
          onInspectCard={(card) => setInspectedCard(card)}
          onOpenSettings={() => setIsSettingsOpen(true)}
          onOpenDeckBrowser={() => setIsDeckBrowserOpen(true)}
        />
      )}

      {/* 3. GAMEOVER / VICTORY MODAL */}
      {screen === 'gameover' && gameState && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Spelresultat"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md"
        >
          <div
            className="w-full max-w-md bg-gradient-to-b from-[#0a0e19] via-[#090b14] to-black border border-cyan-500/50 rounded-2xl p-6 shadow-2xl text-center"
            style={{
              boxShadow: '0 0 60px rgba(0, 240, 255, 0.3), inset 0 0 30px rgba(0, 0, 0, 0.9)',
            }}
          >
            {gameState.skitgubbeId === gameState.players[humanIndex].id ? (
              <div>
                <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-red-950/80 border-2 border-red-500 flex items-center justify-center animate-pulse">
                  <Skull className="w-8 h-8 text-red-400" />
                </div>
                <h2 className="text-2xl font-black font-mono text-pink-400 mb-1">
                  DU BLEV SKITGUBBEN!
                </h2>
                <p className="text-xs font-mono text-slate-300 mb-4">
                  Alla andra spelare tömde sina kortlekar före dig. Du blev kvar sist med kort på hand!
                </p>
              </div>
            ) : (
              <div>
                <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-cyan-950/80 border-2 border-cyan-400 flex items-center justify-center">
                  <Trophy className="w-8 h-8 text-cyan-300" />
                </div>
                <h2 className="text-2xl font-black font-mono text-cyan-300 mb-1">
                  CYBER-SEGER!
                </h2>
                <p className="text-xs font-mono text-slate-300 mb-4">
                  {gameState.winners[0] === gameState.players[humanIndex].id
                    ? 'Grattis! Du tog 1:a plats och undvek Skitgubben helt!'
                    : `Du klarade dig ut på plats #${gameState.players[humanIndex].finishedRank || 2}!`}
                </p>
              </div>
            )}

            {/* Results Standings */}
            <div className="p-3 rounded-xl bg-black/60 border border-white/10 mb-5 text-xs font-mono text-left space-y-1.5">
              <div className="text-[10px] text-slate-400 uppercase tracking-widest font-bold mb-1">
                Slutplacering:
              </div>
              {gameState.winners.map((winId, idx) => {
                const pl = gameState.players.find((p) => p.id === winId);
                return (
                  <div key={winId} className="flex justify-between items-center text-slate-200">
                    <span className="flex items-center gap-1.5">
                      <span className="font-bold text-cyan-300">#{idx + 1}</span> {pl?.name}
                    </span>
                    <span className="text-[10px] text-emerald-400">Klarade sig</span>
                  </div>
                );
              })}
              {gameState.skitgubbeId && (
                <div className="flex justify-between items-center text-pink-400 font-bold pt-1 border-t border-white/10">
                  <span className="flex items-center gap-1.5">
                    <span>💀</span> {gameState.players.find((p) => p.id === gameState.skitgubbeId)?.name}
                  </span>
                  <span className="text-[10px] uppercase font-bold tracking-widest text-pink-500">
                    SKITGUBBE
                  </span>
                </div>
              )}
            </div>

            {/* Play Again CTA */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                data-start="true"
                onClick={startNewGame}
                className="flex-1 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-mono font-black text-xs uppercase tracking-wider transition-transform active:scale-95 flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-4 h-4" /> Spela Igen
              </button>
              <button
                type="button"
                onClick={() => setScreen('title')}
                className="py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-white/15 font-mono text-xs transition-colors"
              >
                Huvudmeny
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CARD DETAIL / ZOOM MODAL */}
      <CardDetailModal
        card={inspectedCard}
        onClose={() => setInspectedCard(null)}
        onNavigate={handleNavigateCard}
      />

      {/* DECK BROWSER (52 CARDS) */}
      <DeckBrowserModal
        cards={fullDeckRef.current}
        isOpen={isDeckBrowserOpen}
        onClose={() => setIsDeckBrowserOpen(false)}
        onSelectCard={(c) => {
          setIsDeckBrowserOpen(false);
          setInspectedCard(c);
        }}
      />

      {/* SETTINGS AND RULES MODAL */}
      <SettingsAndRulesModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onOpenDeckBrowser={() => {
          setIsSettingsOpen(false);
          setIsDeckBrowserOpen(true);
        }}
      />
    </div>
  );
}
