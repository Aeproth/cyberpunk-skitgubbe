export type Suit = 'hearts' | 'diamonds' | 'clubs' | 'spades';

export interface Card {
  id: string;
  suit: Suit;
  rank: number; // 2 to 14 (11=J, 12=Q, 13=K, 14=A)
  name: string;
  codename: string;
  faction: string;
  role: string;
  cyberware: string;
  lore: string;
  avatarStyle: {
    hairColor: string;
    neonColor: string;
    visorType: string;
    implantType: string;
    bgGradient: string;
  };
  customImage?: string;
}

export type BotDifficulty = 'easy' | 'medium' | 'hard';

export interface Player {
  id: string;
  name: string;
  isBot: boolean;
  difficulty?: BotDifficulty;
  hand: Card[];
  faceUp: Card[];
  faceDown: Card[];
  finishedRank?: number; // 1 = winner, 2 = second, etc.
}

export interface GameState {
  players: Player[];
  deck: Card[];
  pile: Card[];
  burnedCount: number;
  currentTurnIndex: number;
  phase: 'swap' | 'playing' | 'gameover';
  lastAction?: {
    playerId: string;
    text: string;
    type: 'play' | 'burn' | 'reset' | 'pickup' | 'chance_success' | 'chance_fail';
  };
  winners: string[];
  skitgubbeId?: string;
}

/**
 * Check if playing `playedRank` on top of `pileRank` is legal in Skitgubbe / Vändtia.
 * Rules:
 * - 2 can be played on ANY card (nollställare / reset).
 * - 10 can be played on ANY card (brännare / burns the pile).
 * - Any card rank >= pileRank is legal.
 * - If pile is empty or top is 2, any card is legal.
 */
export function isValidPlay(playedRank: number, topRank: number | null): boolean {
  if (topRank === null || topRank === 2) {
    return true;
  }
  if (playedRank === 2 || playedRank === 10) {
    return true;
  }
  return playedRank >= topRank;
}

/**
 * Returns the effective top rank of the pile.
 */
export function getTopCard(pile: Card[]): Card | null {
  if (pile.length === 0) return null;
  return pile[pile.length - 1];
}

/**
 * Check if the top cards form four-of-a-kind, triggering a pile burn.
 */
export function checkFourOfAKind(pile: Card[]): boolean {
  if (pile.length < 4) return false;
  const lastRank = pile[pile.length - 1].rank;
  for (let i = 1; i <= 3; i++) {
    if (pile[pile.length - 1 - i].rank !== lastRank) {
      return false;
    }
  }
  return true;
}

/**
 * Check which cards from a list are currently legal to play.
 */
export function getLegalCards(cards: Card[], topRank: number | null): Card[] {
  return cards.filter(c => isValidPlay(c.rank, topRank));
}

/**
 * Check if a player has finished all their cards.
 */
export function isPlayerOut(player: Player): boolean {
  return player.hand.length === 0 && player.faceUp.length === 0 && player.faceDown.length === 0;
}

/**
 * Find the next active player index.
 */
export function getNextPlayerIndex(currentIndex: number, players: Player[]): number {
  let next = (currentIndex + 1) % players.length;
  let attempts = 0;
  while (isPlayerOut(players[next]) && attempts < players.length) {
    next = (next + 1) % players.length;
    attempts++;
  }
  return next;
}

/**
 * Swap a hand card with a faceUp card during the swap phase.
 */
export function swapHandAndFaceUp(
  player: Player,
  handCardId: string,
  faceUpCardId: string
): Player {
  const handIdx = player.hand.findIndex(c => c.id === handCardId);
  const faceUpIdx = player.faceUp.findIndex(c => c.id === faceUpCardId);
  if (handIdx === -1 || faceUpIdx === -1) return player;

  const newHand = [...player.hand];
  const newFaceUp = [...player.faceUp];
  const temp = newHand[handIdx];
  newHand[handIdx] = newFaceUp[faceUpIdx];
  newFaceUp[faceUpIdx] = temp;

  return {
    ...player,
    hand: newHand,
    faceUp: newFaceUp,
  };
}

/**
 * AI Bot decision logic based on difficulty.
 */
export function decideBotSwap(player: Player): Player {
  // Bots swap to put their highest or special cards (10s, 2s, Aces, Kings) into faceUp
  let updated = { ...player };
  const allCards = [...updated.hand, ...updated.faceUp];
  // Sort descending by value prioritizing 10, 2, Ace, King, Queen
  const rankPriority = (r: number) => {
    if (r === 10) return 100;
    if (r === 2) return 90;
    if (r === 14) return 80;
    if (r === 13) return 70;
    if (r === 12) return 60;
    return r;
  };

  allCards.sort((a, b) => rankPriority(b.rank) - rankPriority(a.rank));
  const bestFaceUp = allCards.slice(0, 3);
  const bestHand = allCards.slice(3);

  return {
    ...updated,
    faceUp: bestFaceUp,
    hand: bestHand,
  };
}

export interface BotMoveResult {
  action: 'play' | 'chance' | 'pickup';
  cardsToPlay?: Card[];
  faceDownIndex?: number;
}

export function decideBotMove(
  player: Player,
  pile: Card[],
  deckCount: number,
  difficulty: BotDifficulty = 'medium'
): BotMoveResult {
  const top = getTopCard(pile);
  const topRank = top ? top.rank : null;

  // 1. If player has hand cards, play from hand
  if (player.hand.length > 0) {
    const legalCards = getLegalCards(player.hand, topRank);
    if (legalCards.length === 0) {
      // No legal hand cards
      if (deckCount > 0) {
        return { action: 'chance' };
      }
      return { action: 'pickup' };
    }

    // Choose card(s)
    let chosenRank: number;

    if (difficulty === 'easy') {
      // Easy bot picks randomly from legal cards
      const randCard = legalCards[Math.floor(Math.random() * legalCards.length)];
      chosenRank = randCard.rank;
    } else if (difficulty === 'medium') {
      // Medium bot avoids playing 10 or 2 unless necessary or pile is large
      const nonSpecials = legalCards.filter(c => c.rank !== 2 && c.rank !== 10);
      if (nonSpecials.length > 0) {
        // Play lowest legal non-special
        nonSpecials.sort((a, b) => a.rank - b.rank);
        chosenRank = nonSpecials[0].rank;
      } else {
        // Only specials left or pile is large
        if (pile.length >= 4 && legalCards.some(c => c.rank === 10)) {
          chosenRank = 10;
        } else {
          legalCards.sort((a, b) => a.rank - b.rank);
          chosenRank = legalCards[0].rank;
        }
      }
    } else {
      // Hard (Cyber-Gud): plays lowest legal cards, saves 10 for huge pile (>=3 cards)
      if (pile.length >= 3 && legalCards.some(c => c.rank === 10)) {
        chosenRank = 10;
      } else {
        const nonSpecials = legalCards.filter(c => c.rank !== 2 && c.rank !== 10);
        if (nonSpecials.length > 0) {
          nonSpecials.sort((a, b) => a.rank - b.rank);
          chosenRank = nonSpecials[0].rank;
        } else if (legalCards.some(c => c.rank === 2)) {
          chosenRank = 2;
        } else {
          chosenRank = 10;
        }
      }
    }

    // Play all cards of the chosen rank that are in hand!
    const cardsToPlay = player.hand.filter(c => c.rank === chosenRank);
    return { action: 'play', cardsToPlay };
  }

  // 2. If hand is empty, play from faceUp
  if (player.faceUp.length > 0) {
    const legalCards = getLegalCards(player.faceUp, topRank);
    if (legalCards.length === 0) {
      if (deckCount > 0) {
        return { action: 'chance' };
      }
      return { action: 'pickup' };
    }

    legalCards.sort((a, b) => a.rank - b.rank);
    const chosenRank = legalCards[0].rank;
    const cardsToPlay = player.faceUp.filter(c => c.rank === chosenRank);
    return { action: 'play', cardsToPlay };
  }

  // 3. If faceUp is empty, blind-flip from faceDown
  if (player.faceDown.length > 0) {
    return {
      action: 'play',
      faceDownIndex: 0,
    };
  }

  return { action: 'pickup' };
}
