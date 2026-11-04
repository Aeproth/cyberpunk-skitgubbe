import test from 'node:test';
import assert from 'node:assert/strict';
import {
  isValidPlay,
  checkFourOfAKind,
  swapHandAndFaceUp,
  getNextPlayerIndex,
  isPlayerOut,
  Player,
} from './rules';
import { createDeck, shuffleDeck, getRankLabel } from './characters';

test('createDeck creates 52 unique cards with 4 suits and 13 ranks each', () => {
  const deck = createDeck();
  assert.equal(deck.length, 52);

  const suits = new Set(deck.map(c => c.suit));
  assert.equal(suits.size, 4);

  const ids = new Set(deck.map(c => c.id));
  assert.equal(ids.size, 52);

  // Check that all Queens (rank 12) have customImage defined
  const queens = deck.filter(c => c.rank === 12);
  assert.equal(queens.length, 4);
  for (const q of queens) {
    assert.ok(q.customImage, `Queen ${q.suit} must have customImage`);
  }
});

test('shuffleDeck preserves all cards and order changes', () => {
  const deck = createDeck();
  const shuffled = shuffleDeck(deck);
  assert.equal(shuffled.length, 52);
  const shuffledIds = new Set(shuffled.map(c => c.id));
  assert.equal(shuffledIds.size, 52);
});

test('isValidPlay respects Skitgubbe rules', () => {
  // On empty pile
  assert.equal(isValidPlay(3, null), true);

  // On top rank 7
  assert.equal(isValidPlay(7, 7), true, 'equal rank is valid');
  assert.equal(isValidPlay(8, 7), true, 'higher rank is valid');
  assert.equal(isValidPlay(6, 7), false, 'lower rank is invalid');

  // Special card 2: resets, valid on anything
  assert.equal(isValidPlay(2, 14), true, '2 is valid on Ace');
  assert.equal(isValidPlay(2, 3), true, '2 is valid on 3');
  assert.equal(isValidPlay(2, null), true, '2 is valid on empty');

  // Anything is valid on 2
  assert.equal(isValidPlay(3, 2), true, '3 is valid on 2');
  assert.equal(isValidPlay(14, 2), true, 'Ace is valid on 2');

  // Special card 10: burns, valid on anything
  assert.equal(isValidPlay(10, 14), true, '10 is valid on Ace');
  assert.equal(isValidPlay(10, 4), true, '10 is valid on 4');
  assert.equal(isValidPlay(10, null), true, '10 is valid on empty');
});

test('checkFourOfAKind triggers on 4 consecutive cards of same rank', () => {
  const deck = createDeck();
  const sevens = deck.filter(c => c.rank === 7);
  const six = deck.find(c => c.rank === 6)!;

  assert.equal(checkFourOfAKind([]), false);
  assert.equal(checkFourOfAKind([sevens[0], sevens[1], sevens[2]]), false);
  assert.equal(checkFourOfAKind([sevens[0], sevens[1], sevens[2], sevens[3]]), true);
  assert.equal(checkFourOfAKind([six, sevens[0], sevens[1], sevens[2], sevens[3]]), true);
  assert.equal(checkFourOfAKind([sevens[0], sevens[1], six, sevens[3]]), false);
});

test('swapHandAndFaceUp correctly exchanges cards', () => {
  const deck = createDeck();
  const player: Player = {
    id: 'p1',
    name: 'Player 1',
    isBot: false,
    hand: [deck[0], deck[1], deck[2]],
    faceUp: [deck[3], deck[4], deck[5]],
    faceDown: [deck[6], deck[7], deck[8]],
  };

  const swapped = swapHandAndFaceUp(player, deck[0].id, deck[3].id);
  assert.equal(swapped.hand[0].id, deck[3].id);
  assert.equal(swapped.faceUp[0].id, deck[0].id);
  assert.equal(swapped.hand.length, 3);
  assert.equal(swapped.faceUp.length, 3);
});

test('getNextPlayerIndex correctly skips finished players', () => {
  const deck = createDeck();
  const p1: Player = { id: 'p1', name: '1', isBot: false, hand: [deck[0]], faceUp: [], faceDown: [] };
  const p2: Player = { id: 'p2', name: '2', isBot: true, hand: [], faceUp: [], faceDown: [] }; // Out!
  const p3: Player = { id: 'p3', name: '3', isBot: true, hand: [deck[1]], faceUp: [], faceDown: [] };

  const players = [p1, p2, p3];
  assert.equal(isPlayerOut(p2), true);
  assert.equal(isPlayerOut(p1), false);

  // Turn was p1 (index 0). Next should be p3 (index 2) since p2 is out.
  const next = getNextPlayerIndex(0, players);
  assert.equal(next, 2);
});
