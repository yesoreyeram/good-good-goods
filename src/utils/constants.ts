import { GameConstants, LevelConfig } from '../types';

export const GAME_CONSTANTS: GameConstants = {
  INITIAL_LIVES: 10,
  MAX_LIVES: 10,
  INITIAL_COINS: 1000,
  LIFE_REGEN_TIME_MS: 5 * 60 * 1000, // 5 minutes
  BOMB_ITEM: '💣',
  BOMB_COUNTDOWN_SECONDS: 12,
  SECRET_UNLOCK_CLICKS: 5,
  ROWS: 4,
  COLS: 2,
  TOTAL_SLOTS: 8,
  EMPTY_SLOTS: 3,
};

export const LEVEL_CONFIGS: LevelConfig[] = [
  // Level 1-5: Basic levels
  { level: 1, items: ['🍎', '🍊', '🍋'], constraint: 'moves', value: 25, advanced: null },
  { level: 2, items: ['🍎', '🍊', '🍋', '🍇'], constraint: 'time', value: 60, advanced: null },
  { level: 3, items: ['🍎', '🍊', '🍋', '🍇', '🍓'], constraint: 'moves', value: 22, advanced: null },
  { level: 4, items: ['🍎', '🍊', '🍋', '🍇', '🍓', '🍌'], constraint: 'time', value: 55, advanced: null },
  { level: 5, items: ['🍎', '🍊', '🍋', '🍇', '🍓', '🍌', '🍉'], constraint: 'moves', value: 20, advanced: null },
  // Level 6+: Bomb levels
  { level: 6, items: ['🍎', '🍊', '🍋', '🍇', '🍓', '🍌', '🍉', '🥝'], constraint: 'time', value: 50, advanced: 'bomb' },
  { level: 7, items: ['🍎', '🍊', '🍋', '🍇', '🍓', '🍌', '🍉', '🥝', '🍑'], constraint: 'moves', value: 18, advanced: 'bomb' },
  { level: 8, items: ['🍎', '🍊', '🍋', '🍇', '🍓', '🍌', '🍉', '🥝', '🍑', '🥭'], constraint: 'time', value: 45, advanced: 'bomb' },
  { level: 9, items: ['🍎', '🍊', '🍋', '🍇', '🍓', '🍌', '🍉', '🥝', '🍑', '🥭', '🍍'], constraint: 'moves', value: 16, advanced: 'bomb' },
  { level: 10, items: ['🍎', '🍊', '🍋', '🍇', '🍓', '🍌', '🍉', '🥝', '🍑', '🥭', '🍍', '🥥'], constraint: 'time', value: 40, advanced: 'bomb' },
  { level: 11, items: ['🍎', '🍊', '🍋', '🍇', '🍓', '🍌', '🍉', '🥝', '🍑', '🥭', '🍍', '🥥', '🍒'], constraint: 'moves', value: 15, advanced: 'bomb' },
  { level: 12, items: ['🍎', '🍊', '🍋', '🍇', '🍓', '🍌', '🍉', '🥝', '🍑', '🥭', '🍍', '🥥', '🍒', '🍈'], constraint: 'time', value: 40, advanced: 'bomb' },
  { level: 13, items: ['🍎', '🍊', '🍋', '🍇', '🍓', '🍌', '🍉', '🥝', '🍑', '🥭', '🍍', '🥥', '🍒', '🍈', '🫐'], constraint: 'moves', value: 14, advanced: 'bomb' },
  { level: 14, items: ['🍎', '🍊', '🍋', '🍇', '🍓', '🍌', '🍉', '🥝', '🍑', '🥭', '🍍', '🥥', '🍒', '🍈', '🫐', '🍐'], constraint: 'time', value: 38, advanced: 'bomb' },
  { level: 15, items: ['🍎', '🍊', '🍋', '🍇', '🍓', '🍌', '🍉', '🥝', '🍑', '🥭', '🍍', '🥥', '🍒', '🍈', '🫐', '🍐', '🥑'], constraint: 'moves', value: 13, advanced: 'bomb' },
  { level: 16, items: ['🍎', '🍊', '🍋', '🍇', '🍓', '🍌', '🍉', '🥝', '🍑', '🥭', '🍍', '🥥', '🍒', '🍈', '🫐', '🍐', '🥑', '🍅'], constraint: 'time', value: 35, advanced: 'bomb' },
  { level: 17, items: ['🍎', '🍊', '🍋', '🍇', '🍓', '🍌', '🍉', '🥝', '🍑', '🥭', '🍍', '🥥', '🍒', '🍈', '🫐', '🍐', '🥑', '🍅', '🌽'], constraint: 'moves', value: 12, advanced: 'bomb' },
  { level: 18, items: ['🍎', '🍊', '🍋', '🍇', '🍓', '🍌', '🍉', '🥝', '🍑', '🥭', '🍍', '🥥', '🍒', '🍈', '🫐', '🍐', '🥑', '🍅', '🌽', '🥕'], constraint: 'time', value: 35, advanced: 'bomb' },
  { level: 19, items: ['🍎', '🍊', '🍋', '🍇', '🍓', '🍌', '🍉', '🥝', '🍑', '🥭', '🍍', '🥥', '🍒', '🍈', '🫐', '🍐', '🥑', '🍅', '🌽', '🥕', '🥒'], constraint: 'moves', value: 11, advanced: 'bomb' },
  { level: 20, items: ['🍎', '🍊', '🍋', '🍇', '🍓', '🍌', '🍉', '🥝', '🍑', '🥭', '🍍', '🥥', '🍒', '🍈', '🫐', '🍐', '🥑', '🍅', '🌽', '🥕', '🥒', '🍆'], constraint: 'time', value: 30, advanced: 'bomb' }
];
