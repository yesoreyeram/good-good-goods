import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Screen, GameState, DragItem } from './types';
import { GAME_CONSTANTS, LEVEL_CONFIGS } from './utils/constants';
import { getInitialGameState, saveGameState } from './utils/storage';
import { initializeBoard, checkMatches, checkForBombs, isBoardClear } from './utils/gameLogic';

const App: React.FC = () => {
  const [screen, setScreen] = useState<Screen>('menu');
  const [gameState, setGameState] = useState<GameState>(getInitialGameState());
  const [draggedItem, setDraggedItem] = useState<DragItem | null>(null);
  const [bombTimeLeft, setBombTimeLeft] = useState<number | null>(null);
  const [notification, setNotification] = useState<string>('');
  
  const gameTimerRef = useRef<NodeJS.Timeout | null>(null);
  const bombTimerRef = useRef<NodeJS.Timeout | null>(null);
  const lifeTimerRef = useRef<NodeJS.Timeout | null>(null);
  const boardRef = useRef<(string | null)[][]>([]);

  // Life regeneration
  useEffect(() => {
    lifeTimerRef.current = setInterval(() => {
      const now = Date.now();
      const elapsed = now - gameState.lastLifeTime;
      
      if (elapsed >= GAME_CONSTANTS.LIFE_REGEN_TIME_MS && gameState.lives < GAME_CONSTANTS.MAX_LIVES) {
        setGameState(prev => {
          const newState = {
            ...prev,
            lives: prev.lives + 1,
            lastLifeTime: now
          };
          saveGameState(newState);
          return newState;
        });
      }
    }, 1000);

    return () => {
      if (lifeTimerRef.current) clearInterval(lifeTimerRef.current);
    };
  }, [gameState.lives, gameState.lastLifeTime]);

  // Save state on changes
  useEffect(() => {
    saveGameState({
      lives: gameState.lives,
      coins: gameState.coins,
      unlockedLevels: gameState.unlockedLevels,
      completedLevels: gameState.completedLevels,
      lastLifeTime: gameState.lastLifeTime,
    });
  }, [gameState.lives, gameState.coins, gameState.unlockedLevels, gameState.completedLevels, gameState.lastLifeTime]);

  const showNotification = (message: string) => {
    setNotification(message);
    setTimeout(() => setNotification(''), 3000);
  };

  const startLevel = useCallback((level: number) => {
    if (gameState.lives <= 0) {
      showNotification('Not enough lives!');
      return;
    }

    const config = LEVEL_CONFIGS[level - 1];
    const board = initializeBoard(config);
    boardRef.current = board; // Update ref

    setGameState(prev => ({
      ...prev,
      currentLevel: level,
      board,
      movesRemaining: config.constraint === 'moves' ? config.value : null,
      timeRemaining: config.constraint === 'time' ? config.value : null,
    }));

    setScreen('game');

    // Start timers
    if (config.constraint === 'time') {
      startGameTimer();
    }

    if (config.advanced === 'bomb') {
      startBombTimer();
    }
  }, [gameState.lives]);

  const startGameTimer = () => {
    if (gameTimerRef.current) clearInterval(gameTimerRef.current);
    
    gameTimerRef.current = setInterval(() => {
      setGameState(prev => {
        if (prev.timeRemaining !== null && prev.timeRemaining > 0) {
          return { ...prev, timeRemaining: prev.timeRemaining - 1 };
        }
        return prev;
      });
    }, 1000);
  };

  const startBombTimer = () => {
    setBombTimeLeft(GAME_CONSTANTS.BOMB_COUNTDOWN_SECONDS);
    
    if (bombTimerRef.current) clearInterval(bombTimerRef.current);
    
    bombTimerRef.current = setInterval(() => {
      setBombTimeLeft(prev => {
        if (prev === null) return null;
        if (prev <= 1) {
          // Check if bombs still on board using ref
          if (checkForBombs(boardRef.current)) {
            loseLevel('Bombs exploded!');
          }
          return null;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const stopTimers = () => {
    if (gameTimerRef.current) clearInterval(gameTimerRef.current);
    if (bombTimerRef.current) clearInterval(bombTimerRef.current);
  };

  const handleDrop = (toRow: number, toCol: number) => {
    if (!draggedItem) return;

    const { fromRow, fromCol, item } = draggedItem;

    // Can't drop on same position
    if (fromRow === toRow && fromCol === toCol) {
      setDraggedItem(null);
      return;
    }

    const targetItem = gameState.board[toRow][toCol];

    // Can only drop to empty slots or swap within same row
    if (fromRow !== toRow && targetItem !== null) {
      setDraggedItem(null);
      return;
    }

    // Perform the move
    const newBoard = gameState.board.map(row => [...row]);
    newBoard[toRow][toCol] = item;
    newBoard[fromRow][fromCol] = targetItem;
    boardRef.current = newBoard; // Update ref

    // Count move only if moving between rows
    const newMoves = fromRow !== toRow && gameState.movesRemaining !== null
      ? gameState.movesRemaining - 1
      : gameState.movesRemaining;

    setGameState(prev => ({
      ...prev,
      board: newBoard,
      movesRemaining: newMoves,
    }));

    setDraggedItem(null);

    // Check for matches
    setTimeout(() => {
      checkAndClearMatches(newBoard);
    }, 100);
  };

  const checkAndClearMatches = (board: (string | null)[][]) => {
    const matches = checkMatches(board);

    if (matches.size > 0) {
      const newBoard = board.map(row => [...row]);
      matches.forEach(pos => {
        const [row, col] = pos.split(',').map(Number);
        newBoard[row][col] = null;
      });
      boardRef.current = newBoard; // Update ref

      setGameState(prev => ({
        ...prev,
        board: newBoard,
      }));

      setTimeout(() => {
        checkWinCondition(newBoard);
      }, 500);
    } else {
      checkWinCondition(board);
    }
  };

  const checkWinCondition = (board: (string | null)[][]) => {
    // Check if board is clear (win)
    if (isBoardClear(board)) {
      winLevel();
      return;
    }

    // Check lose conditions
    if (gameState.movesRemaining !== null && gameState.movesRemaining <= 0) {
      loseLevel('No moves remaining!');
      return;
    }

    if (gameState.timeRemaining !== null && gameState.timeRemaining <= 0) {
      loseLevel("Time's up!");
      return;
    }
  };

  const winLevel = () => {
    stopTimers();

    setGameState(prev => {
      const newState = {
        ...prev,
        completedLevels: prev.completedLevels.includes(prev.currentLevel)
          ? prev.completedLevels
          : [...prev.completedLevels, prev.currentLevel],
        unlockedLevels: prev.currentLevel < 20 && !prev.unlockedLevels.includes(prev.currentLevel + 1)
          ? [...prev.unlockedLevels, prev.currentLevel + 1]
          : prev.unlockedLevels,
      };
      saveGameState(newState);
      return newState;
    });

    setScreen('win');
  };

  const loseLevel = (reason: string) => {
    stopTimers();
    
    setGameState(prev => {
      const newState = {
        ...prev,
        lives: prev.lives - 1,
      };
      saveGameState(newState);
      return newState;
    });

    showNotification(reason);
    setScreen('lose');
  };

  const handleLevelClick = (level: number) => {
    if (gameState.unlockedLevels.includes(level)) {
      startLevel(level);
    } else {
      // Secret unlock
      const clicks = (gameState.clickCounts[level] || 0) + 1;
      
      if (clicks >= GAME_CONSTANTS.SECRET_UNLOCK_CLICKS) {
        setGameState(prev => ({
          ...prev,
          unlockedLevels: [...prev.unlockedLevels, level],
          clickCounts: { ...prev.clickCounts, [level]: 0 },
        }));
      } else {
        setGameState(prev => ({
          ...prev,
          clickCounts: { ...prev.clickCounts, [level]: clicks },
        }));
      }
    }
  };

  // Render functions for different screens
  const renderMainMenu = () => (
    <div className="flex flex-col items-center justify-center h-full bg-purple-500">
      {/* Global Stats */}
      <div className="absolute top-4 right-4 flex gap-3">
        <div className="bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 flex items-center gap-2">
          <span className="text-2xl">❤️</span>
          <span className="text-white font-bold">{gameState.lives}</span>
        </div>
        <div className="bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 flex items-center gap-2">
          <span className="text-2xl">💰</span>
          <span className="text-white font-bold">{gameState.coins}</span>
        </div>
      </div>

      <h1 className="comic-font text-5xl md:text-7xl text-white mb-8 drop-shadow-lg">
        GOOD GOOD GOODS
      </h1>

      <button
        onClick={() => setScreen('levelMap')}
        className="comic-font bg-pink-500 hover:bg-pink-600 text-white text-3xl px-12 py-4 rounded-full shadow-lg transform hover:scale-105 transition-transform"
      >
        ▶️
      </button>
    </div>
  );

  const renderLevelMap = () => (
    <div className="flex flex-col h-full bg-purple-500">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-black/20">
        <button
          onClick={() => setScreen('menu')}
          className="bg-white/30 hover:bg-white/40 rounded-full px-4 py-2 text-white"
        >
          ← 
        </button>
        <h2 className="comic-font text-2xl text-white">SELECT LEVEL</h2>
        <div className="flex gap-2">
          <span className="text-white">❤️ {gameState.lives}</span>
          <span className="text-white">💰 {gameState.coins}</span>
        </div>
      </div>

      {/* Level Grid - Tighter spacing */}
      <div className="flex-1 overflow-auto p-4">
        <div className="grid grid-cols-5 gap-2 max-w-2xl mx-auto">
          {Array.from({ length: 20 }, (_, i) => i + 1).map(level => {
            const isUnlocked = gameState.unlockedLevels.includes(level);
            const isCompleted = gameState.completedLevels.includes(level);

            return (
              <button
                key={level}
                onClick={() => handleLevelClick(level)}
                className={`
                  aspect-square rounded-2xl font-bold text-2xl transition-all
                  ${isCompleted ? 'bg-green-400 text-white' : ''}
                  ${isUnlocked && !isCompleted ? 'bg-cyan-400 text-white' : ''}
                  ${!isUnlocked ? 'bg-gray-600 text-gray-400' : ''}
                  ${isUnlocked ? 'hover:scale-105' : 'cursor-not-allowed'}
                `}
              >
                {isUnlocked ? level : '🔒'}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );

  const renderGameScreen = () => {
    const config = LEVEL_CONFIGS[gameState.currentLevel - 1];
    
    return (
      <div className="flex flex-col h-full bg-purple-500">
        {/* Header with global stats */}
        <div className="flex items-center justify-between p-3 bg-black/20">
          <button
            onClick={() => {
              stopTimers();
              setScreen('pause');
            }}
            className="bg-white/30 hover:bg-white/40 rounded-full px-4 py-2"
          >
            ⏸
          </button>
          
          <div className="comic-font text-white text-xl">
            Level {gameState.currentLevel}
          </div>

          <div className="flex gap-3">
            <div className="bg-white/20 rounded-full px-3 py-1 text-white">
              {config.constraint === 'moves' 
                ? `Moves: ${gameState.movesRemaining}` 
                : `Time: ${gameState.timeRemaining}s`}
            </div>
            <div className="bg-white/20 rounded-full px-3 py-1 text-white">
              ❤️ {gameState.lives}
            </div>
          </div>
        </div>

        {/* Bomb timer warning */}
        {bombTimeLeft !== null && bombTimeLeft > 0 && (
          <div className="bg-red-500 text-white text-center py-2 font-bold animate-pulse">
            💣 Clear bombs in {bombTimeLeft}s!
          </div>
        )}

        {/* Game Board - 4 rows x 2 cols */}
        <div className="flex-1 flex flex-col items-center justify-center gap-4 p-6">
          {gameState.board.map((row, rowIndex) => (
            <div key={rowIndex} className="flex gap-4 bg-amber-700 rounded-3xl p-4 shadow-lg w-full max-w-2xl">
              {row.map((item, colIndex) => (
                <div
                  key={colIndex}
                  className={`
                    flex-1 aspect-square rounded-2xl flex items-center justify-center text-7xl sm:text-8xl md:text-9xl
                    ${item === null ? 'bg-amber-900/30 border-4 border-dashed border-amber-600/50' : 'bg-white shadow-md cursor-grab'}
                  `}
                  onTouchStart={() => {
                    if (item) {
                      setDraggedItem({ item, fromRow: rowIndex, fromCol: colIndex });
                    }
                  }}
                  onTouchEnd={(e) => {
                    const touch = e.changedTouches[0];
                    const element = document.elementFromPoint(touch.clientX, touch.clientY);
                    const slot = element?.closest('[data-row]');
                    if (slot) {
                      const toRow = parseInt(slot.getAttribute('data-row') || '0');
                      const toCol = parseInt(slot.getAttribute('data-col') || '0');
                      handleDrop(toRow, toCol);
                    }
                    setDraggedItem(null);
                  }}
                  onMouseDown={() => {
                    if (item) {
                      setDraggedItem({ item, fromRow: rowIndex, fromCol: colIndex });
                    }
                  }}
                  onMouseUp={() => {
                    if (draggedItem) {
                      handleDrop(rowIndex, colIndex);
                    }
                  }}
                  data-row={rowIndex}
                  data-col={colIndex}
                  style={{
                    transform: draggedItem?.fromRow === rowIndex && draggedItem?.fromCol === colIndex
                      ? 'scale(1.1) rotate(5deg)'
                      : 'none',
                  }}
                >
                  {item && (
                    <span className={item === GAME_CONSTANTS.BOMB_ITEM ? 'animate-pulse' : ''}>
                      {item}
                    </span>
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderPauseScreen = () => (
    <div className="flex items-center justify-center h-full bg-black/80">
      <div className="bg-white rounded-3xl p-8 text-center">
        <h2 className="comic-font text-4xl mb-6">PAUSED</h2>
        <button
          onClick={() => {
            setScreen('game');
            const config = LEVEL_CONFIGS[gameState.currentLevel - 1];
            if (config.constraint === 'time') startGameTimer();
            if (config.advanced === 'bomb') startBombTimer();
          }}
          className="comic-font bg-pink-500 hover:bg-pink-600 text-white px-8 py-3 rounded-full mb-3 w-full"
        >
          ▶️ RESUME
        </button>
        <button
          onClick={() => {
            stopTimers();
            setScreen('menu');
          }}
          className="comic-font bg-gray-400 hover:bg-gray-500 text-white px-8 py-3 rounded-full w-full"
        >
          🏠 QUIT
        </button>
      </div>
    </div>
  );

  const renderWinScreen = () => (
    <div className="flex items-center justify-center h-full bg-black/80">
      <div className="bg-white rounded-3xl p-8 text-center">
        <h2 className="comic-font text-4xl mb-4">🎉 LEVEL COMPLETE!</h2>
        <p className="text-xl mb-6">Level {gameState.currentLevel} Complete!</p>
        <button
          onClick={() => {
            if (gameState.currentLevel < 20) {
              startLevel(gameState.currentLevel + 1);
            } else {
              setScreen('menu');
            }
          }}
          className="comic-font bg-pink-500 hover:bg-pink-600 text-white px-8 py-3 rounded-full mb-3 w-full"
        >
          {gameState.currentLevel < 20 ? '➡️ NEXT' : '🏠 MENU'}
        </button>
        <button
          onClick={() => setScreen('menu')}
          className="comic-font bg-gray-400 hover:bg-gray-500 text-white px-8 py-3 rounded-full w-full"
        >
          🏠 MENU
        </button>
      </div>
    </div>
  );

  const renderLoseScreen = () => (
    <div className="flex items-center justify-center h-full bg-black/80">
      <div className="bg-white rounded-3xl p-8 text-center">
        <h2 className="comic-font text-4xl mb-4">❌ LEVEL FAILED</h2>
        <p className="text-lg mb-2">Lives remaining: {gameState.lives}</p>
        <button
          onClick={() => {
            if (gameState.lives > 0) {
              startLevel(gameState.currentLevel);
            } else {
              setScreen('menu');
            }
          }}
          className="comic-font bg-pink-500 hover:bg-pink-600 text-white px-8 py-3 rounded-full mb-3 w-full"
        >
          {gameState.lives > 0 ? '🔄 RETRY' : '🏠 MENU'}
        </button>
        <button
          onClick={() => setScreen('menu')}
          className="comic-font bg-gray-400 hover:bg-gray-500 text-white px-8 py-3 rounded-full w-full"
        >
          🏠 MENU
        </button>
      </div>
    </div>
  );

  return (
    <div className="w-full h-screen overflow-hidden">
      {screen === 'menu' && renderMainMenu()}
      {screen === 'levelMap' && renderLevelMap()}
      {screen === 'game' && renderGameScreen()}
      {screen === 'pause' && renderPauseScreen()}
      {screen === 'win' && renderWinScreen()}
      {screen === 'lose' && renderLoseScreen()}

      {/* Notification Toast */}
      {notification && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-black/80 text-white px-6 py-3 rounded-full backdrop-blur-sm z-50">
          {notification}
        </div>
      )}
    </div>
  );
};

export default App;
