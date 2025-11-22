import { GameState } from '../types';
import { GAME_CONSTANTS } from './constants';

const STORAGE_KEY = 'goodGoodsGame';

export const saveGameState = (state: Partial<GameState>): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.error('Failed to save game state:', e);
  }
};

export const loadGameState = (): Partial<GameState> | null => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.error('Failed to load game state:', e);
  }
  return null;
};

export const getInitialGameState = (): GameState => {
  const saved = loadGameState();
  return {
    lives: saved?.lives ?? GAME_CONSTANTS.INITIAL_LIVES,
    coins: saved?.coins ?? GAME_CONSTANTS.INITIAL_COINS,
    currentLevel: 1,
    unlockedLevels: saved?.unlockedLevels ?? [1],
    completedLevels: saved?.completedLevels ?? [],
    board: [],
    movesRemaining: null,
    timeRemaining: null,
    clickCounts: {},
    lastLifeTime: saved?.lastLifeTime ?? Date.now(),
  };
};
