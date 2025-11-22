import { LevelConfig } from '../types';
import { GAME_CONSTANTS } from './constants';

export const initializeBoard = (config: LevelConfig): (string | null)[][] => {
  const board: (string | null)[][] = [];
  
  // Create empty board
  for (let row = 0; row < GAME_CONSTANTS.ROWS; row++) {
    board[row] = [];
    for (let col = 0; col < GAME_CONSTANTS.COLS; col++) {
      board[row][col] = null;
    }
  }
  
  // Determine empty positions (3 random slots)
  const emptyPositions: number[] = [];
  while (emptyPositions.length < GAME_CONSTANTS.EMPTY_SLOTS) {
    const pos = Math.floor(Math.random() * GAME_CONSTANTS.TOTAL_SLOTS);
    if (!emptyPositions.includes(pos)) {
      emptyPositions.push(pos);
    }
  }
  
  // Create items array
  const items: string[] = [];
  const itemsNeeded = GAME_CONSTANTS.TOTAL_SLOTS - GAME_CONSTANTS.EMPTY_SLOTS;
  
  // Add bombs if needed (3 bombs)
  const bombCount = config.advanced === 'bomb' ? 3 : 0;
  for (let i = 0; i < bombCount; i++) {
    items.push(GAME_CONSTANTS.BOMB_ITEM);
  }
  
  // Fill remaining with items in groups of 3 to ensure playability
  const availableItems = config.items;
  let remainingSlots = itemsNeeded - bombCount;
  
  // Always ensure items are in multiples of 3
  const itemGroups: string[] = [];
  while (itemGroups.length < remainingSlots) {
    const item = availableItems[Math.floor(Math.random() * availableItems.length)];
    // Add 3 of the same item
    for (let i = 0; i < 3 && itemGroups.length < remainingSlots; i++) {
      itemGroups.push(item);
    }
  }
  
  items.push(...itemGroups);
  
  // Shuffle items
  items.sort(() => Math.random() - 0.5);
  
  // Place items on board
  let itemIndex = 0;
  for (let row = 0; row < GAME_CONSTANTS.ROWS; row++) {
    for (let col = 0; col < GAME_CONSTANTS.COLS; col++) {
      const slotIndex = row * GAME_CONSTANTS.COLS + col;
      if (!emptyPositions.includes(slotIndex)) {
        board[row][col] = items[itemIndex++];
      }
    }
  }
  
  // Ensure no initial matches
  removeInitialMatches(board, config.items);
  
  return board;
};

const removeInitialMatches = (board: (string | null)[][], availableItems: string[]): void => {
  let hasMatches = true;
  while (hasMatches) {
    hasMatches = false;
    for (let row = 0; row < GAME_CONSTANTS.ROWS; row++) {
      for (let col = 0; col < GAME_CONSTANTS.COLS; col++) {
        if (board[row][col] && hasMatch(board, row, col)) {
          const currentItem = board[row][col];
          const otherItems = availableItems.filter(item => item !== currentItem);
          board[row][col] = otherItems[Math.floor(Math.random() * otherItems.length)];
          hasMatches = true;
        }
      }
    }
  }
};

const hasMatch = (board: (string | null)[][], row: number, col: number): boolean => {
  const item = board[row][col];
  if (!item || item === GAME_CONSTANTS.BOMB_ITEM) return false;
  
  // Check horizontal
  let count = 1;
  for (let c = col - 1; c >= 0 && board[row][c] === item; c--) count++;
  for (let c = col + 1; c < GAME_CONSTANTS.COLS && board[row][c] === item; c++) count++;
  if (count >= 3) return true;
  
  // Check vertical
  count = 1;
  for (let r = row - 1; r >= 0 && board[r][col] === item; r--) count++;
  for (let r = row + 1; r < GAME_CONSTANTS.ROWS && board[r][col] === item; r++) count++;
  if (count >= 3) return true;
  
  return false;
};

export const checkMatches = (board: (string | null)[][]): Set<string> => {
  const matchedPositions = new Set<string>();
  
  // Note: With a 2-column board, horizontal matches are impossible (need 3 in a row)
  // Only check vertical matches (3 or more items in the same column)
  for (let col = 0; col < GAME_CONSTANTS.COLS; col++) {
    for (let row = 0; row < GAME_CONSTANTS.ROWS; row++) {
      const item = board[row][col];
      if (!item || item === GAME_CONSTANTS.BOMB_ITEM) continue;
      
      // Check if this starts a vertical match
      if (row <= GAME_CONSTANTS.ROWS - 3) { // Need at least 3 rows remaining
        let count = 1;
        for (let r = row + 1; r < GAME_CONSTANTS.ROWS && board[r][col] === item; r++) {
          count++;
        }
        if (count >= 3) {
          for (let r = row; r < row + count; r++) {
            matchedPositions.add(`${r},${col}`);
          }
        }
      }
    }
  }
  
  return matchedPositions;
};

export const checkForBombs = (board: (string | null)[][]): boolean => {
  for (let row = 0; row < GAME_CONSTANTS.ROWS; row++) {
    for (let col = 0; col < GAME_CONSTANTS.COLS; col++) {
      if (board[row][col] === GAME_CONSTANTS.BOMB_ITEM) {
        return true;
      }
    }
  }
  return false;
};

export const isBoardClear = (board: (string | null)[][]): boolean => {
  for (let row = 0; row < GAME_CONSTANTS.ROWS; row++) {
    for (let col = 0; col < GAME_CONSTANTS.COLS; col++) {
      if (board[row][col] !== null) {
        return false;
      }
    }
  }
  return true;
};
