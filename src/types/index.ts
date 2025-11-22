export interface GameConstants {
  INITIAL_LIVES: number;
  MAX_LIVES: number;
  INITIAL_COINS: number;
  LIFE_REGEN_TIME_MS: number;
  BOMB_ITEM: string;
  BOMB_COUNTDOWN_SECONDS: number;
  SECRET_UNLOCK_CLICKS: number;
  ROWS: number;
  COLS: number;
  TOTAL_SLOTS: number;
  EMPTY_SLOTS: number;
}

export interface LevelConfig {
  level: number;
  items: string[];
  constraint: 'moves' | 'time';
  value: number;
  advanced: 'bomb' | null;
}

export interface GameState {
  lives: number;
  coins: number;
  currentLevel: number;
  unlockedLevels: number[];
  completedLevels: number[];
  board: (string | null)[][];
  movesRemaining: number | null;
  timeRemaining: number | null;
  clickCounts: Record<number, number>;
  lastLifeTime: number;
}

export interface DragItem {
  item: string;
  fromRow: number;
  fromCol: number;
}

export type Screen = 'menu' | 'levelMap' | 'game' | 'pause' | 'win' | 'lose';
