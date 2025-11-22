// Game Constants
const GAME_CONSTANTS = {
    INITIAL_LIVES: 10,
    MAX_LIVES: 10,
    INITIAL_COINS: 1000,
    LIFE_REGEN_TIME_MS: 5 * 60 * 1000, // 5 minutes
    BOMB_ITEM: '💣',
    BOMB_COUNTDOWN_SECONDS: 12,
    SECRET_UNLOCK_CLICKS: 5
};

// Game State
const gameState = {
    lives: GAME_CONSTANTS.INITIAL_LIVES,
    coins: GAME_CONSTANTS.INITIAL_COINS,
    currentLevel: 1,
    unlockedLevels: [1],
    completedLevels: [],
    board: [],
    itemTypes: ['🍎', '🍊', '🍋'],
    movesRemaining: null,
    timeRemaining: null,
    gameTimer: null,
    bombTimer: null,
    lifeTimer: null,
    draggedItem: null,
    clickCounts: {},
    lastLifeTime: Date.now()
};

// Level Configuration
const levelConfigs = [
    // Level 1-5: Basic levels with increasing difficulty
    { level: 1, items: ['🍎', '🍊', '🍋'], constraint: 'moves', value: 20, advanced: null },
    { level: 2, items: ['🍎', '🍊', '🍋', '🍇'], constraint: 'time', value: 60, advanced: null },
    { level: 3, items: ['🍎', '🍊', '🍋', '🍇', '🍓'], constraint: 'moves', value: 18, advanced: null },
    { level: 4, items: ['🍎', '🍊', '🍋', '🍇', '🍓', '🍌'], constraint: 'time', value: 55, advanced: null },
    { level: 5, items: ['🍎', '🍊', '🍋', '🍇', '🍓', '🍌', '🍉'], constraint: 'moves', value: 16, advanced: null },
    // Level 6+: Bomb levels
    { level: 6, items: ['🍎', '🍊', '🍋', '🍇', '🍓', '🍌', '🍉', '🥝'], constraint: 'time', value: 50, advanced: 'bomb' },
    { level: 7, items: ['🍎', '🍊', '🍋', '🍇', '🍓', '🍌', '🍉', '🥝', '🍑'], constraint: 'moves', value: 15, advanced: 'bomb' },
    { level: 8, items: ['🍎', '🍊', '🍋', '🍇', '🍓', '🍌', '🍉', '🥝', '🍑', '🥭'], constraint: 'time', value: 45, advanced: 'bomb' },
    { level: 9, items: ['🍎', '🍊', '🍋', '🍇', '🍓', '🍌', '🍉', '🥝', '🍑', '🥭', '🍍'], constraint: 'moves', value: 14, advanced: 'bomb' },
    { level: 10, items: ['🍎', '🍊', '🍋', '🍇', '🍓', '🍌', '🍉', '🥝', '🍑', '🥭', '🍍', '🥥'], constraint: 'time', value: 40, advanced: 'bomb' },
    { level: 11, items: ['🍎', '🍊', '🍋', '🍇', '🍓', '🍌', '🍉', '🥝', '🍑', '🥭', '🍍', '🥥', '🍒'], constraint: 'moves', value: 13, advanced: 'bomb' },
    { level: 12, items: ['🍎', '🍊', '🍋', '🍇', '🍓', '🍌', '🍉', '🥝', '🍑', '🥭', '🍍', '🥥', '🍒', '🍈'], constraint: 'time', value: 40, advanced: 'bomb' },
    { level: 13, items: ['🍎', '🍊', '🍋', '🍇', '🍓', '🍌', '🍉', '🥝', '🍑', '🥭', '🍍', '🥥', '🍒', '🍈', '🫐'], constraint: 'moves', value: 12, advanced: 'bomb' },
    { level: 14, items: ['🍎', '🍊', '🍋', '🍇', '🍓', '🍌', '🍉', '🥝', '🍑', '🥭', '🍍', '🥥', '🍒', '🍈', '🫐', '🍐'], constraint: 'time', value: 38, advanced: 'bomb' },
    { level: 15, items: ['🍎', '🍊', '🍋', '🍇', '🍓', '🍌', '🍉', '🥝', '🍑', '🥭', '🍍', '🥥', '🍒', '🍈', '🫐', '🍐', '🥑'], constraint: 'moves', value: 12, advanced: 'bomb' },
    { level: 16, items: ['🍎', '🍊', '🍋', '🍇', '🍓', '🍌', '🍉', '🥝', '🍑', '🥭', '🍍', '🥥', '🍒', '🍈', '🫐', '🍐', '🥑', '🍅'], constraint: 'time', value: 35, advanced: 'bomb' },
    { level: 17, items: ['🍎', '🍊', '🍋', '🍇', '🍓', '🍌', '🍉', '🥝', '🍑', '🥭', '🍍', '🥥', '🍒', '🍈', '🫐', '🍐', '🥑', '🍅', '🌽'], constraint: 'moves', value: 11, advanced: 'bomb' },
    { level: 18, items: ['🍎', '🍊', '🍋', '🍇', '🍓', '🍌', '🍉', '🥝', '🍑', '🥭', '🍍', '🥥', '🍒', '🍈', '🫐', '🍐', '🥑', '🍅', '🌽', '🥕'], constraint: 'time', value: 35, advanced: 'bomb' },
    { level: 19, items: ['🍎', '🍊', '🍋', '🍇', '🍓', '🍌', '🍉', '🥝', '🍑', '🥭', '🍍', '🥥', '🍒', '🍈', '🫐', '🍐', '🥑', '🍅', '🌽', '🥕', '🥒'], constraint: 'moves', value: 10, advanced: 'bomb' },
    { level: 20, items: ['🍎', '🍊', '🍋', '🍇', '🍓', '🍌', '🍉', '🥝', '🍑', '🥭', '🍍', '🥥', '🍒', '🍈', '🫐', '🍐', '🥑', '🍅', '🌽', '🥕', '🥒', '🍆'], constraint: 'time', value: 30, advanced: 'bomb' }
];

// Initialize game
function initGame() {
    loadGameState();
    startLifeRegeneration();
    updateAllStats();
    showMainMenu();
}

// Screen Management
function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById(screenId).classList.add('active');
}

function showMainMenu() {
    updateAllStats();
    showScreen('main-menu');
}

function showLevelMap() {
    renderLevelMap();
    updateAllStats();
    showScreen('level-map');
}

function renderLevelMap() {
    const grid = document.getElementById('level-grid');
    grid.innerHTML = '';
    
    for (let i = 1; i <= 20; i++) {
        const levelDiv = document.createElement('div');
        levelDiv.className = 'level-item';
        
        if (gameState.completedLevels.includes(i)) {
            levelDiv.classList.add('completed');
            levelDiv.innerHTML = `<div>${i}</div><div style="font-size: 16px;">✓</div>`;
        } else if (gameState.unlockedLevels.includes(i)) {
            levelDiv.classList.add('unlocked');
            levelDiv.innerHTML = i;
        } else {
            levelDiv.classList.add('locked');
            levelDiv.innerHTML = '🔒';
        }
        
        levelDiv.addEventListener('click', () => handleLevelClick(i));
        grid.appendChild(levelDiv);
    }
}

function handleLevelClick(level) {
    if (gameState.unlockedLevels.includes(level)) {
        startLevel(level);
    } else {
        // Secret unlock: click 5 times
        if (!gameState.clickCounts[level]) {
            gameState.clickCounts[level] = 0;
        }
        gameState.clickCounts[level]++;
        
        if (gameState.clickCounts[level] >= GAME_CONSTANTS.SECRET_UNLOCK_CLICKS) {
            gameState.unlockedLevels.push(level);
            gameState.clickCounts[level] = 0;
            saveGameState();
            renderLevelMap();
        }
    }
}

// Level Management
function startLevel(level) {
    if (gameState.lives <= 0) {
        showNotification('Not enough lives! Wait for regeneration.');
        return;
    }
    
    gameState.currentLevel = level;
    const config = levelConfigs[level - 1];
    
    // Set constraint
    if (config.constraint === 'moves') {
        gameState.movesRemaining = config.value;
        gameState.timeRemaining = null;
    } else {
        gameState.timeRemaining = config.value;
        gameState.movesRemaining = null;
    }
    
    // Initialize board
    initializeBoard(config);
    
    // Update UI
    document.getElementById('current-level').textContent = level;
    updateConstraintDisplay();
    updateAllStats();
    showScreen('game-screen');
    
    // Start timers
    if (gameState.timeRemaining !== null) {
        startGameTimer();
    }
    
    if (config.advanced === 'bomb') {
        startBombTimer();
    }
}

function initializeBoard(config) {
    gameState.board = [];
    
    // Create board with at least 2 empty slots at random positions
    const totalSlots = 9;
    const emptyCount = 2;
    const emptyPositions = [];
    
    while (emptyPositions.length < emptyCount) {
        const pos = Math.floor(Math.random() * totalSlots);
        if (!emptyPositions.includes(pos)) {
            emptyPositions.push(pos);
        }
    }
    
    // Fill board
    const items = [];
    const itemsNeeded = totalSlots - emptyCount;
    
    // Add bombs if needed
    const bombCount = config.advanced === 'bomb' ? 3 : 0;
    for (let i = 0; i < bombCount; i++) {
        items.push(GAME_CONSTANTS.BOMB_ITEM);
    }
    
    // Fill remaining with random items (ensure no initial matches)
    while (items.length < itemsNeeded) {
        const item = config.items[Math.floor(Math.random() * config.items.length)];
        items.push(item);
    }
    
    // Shuffle items
    items.sort(() => Math.random() - 0.5);
    
    // Create board structure
    let itemIndex = 0;
    for (let row = 0; row < 3; row++) {
        gameState.board[row] = [];
        for (let col = 0; col < 3; col++) {
            const slotIndex = row * 3 + col;
            if (emptyPositions.includes(slotIndex)) {
                gameState.board[row][col] = null;
            } else {
                gameState.board[row][col] = items[itemIndex++];
            }
        }
    }
    
    // Ensure no initial matches
    removeInitialMatches();
    
    renderBoard();
}

function removeInitialMatches() {
    let hasMatches = true;
    while (hasMatches) {
        hasMatches = false;
        for (let row = 0; row < 3; row++) {
            for (let col = 0; col < 3; col++) {
                if (gameState.board[row][col] && hasMatch(row, col)) {
                    // Change this item to a different one
                    const config = levelConfigs[gameState.currentLevel - 1];
                    const currentItem = gameState.board[row][col];
                    const availableItems = config.items.filter(item => item !== currentItem);
                    gameState.board[row][col] = availableItems[Math.floor(Math.random() * availableItems.length)];
                    hasMatches = true;
                }
            }
        }
    }
}

function hasMatch(row, col) {
    const item = gameState.board[row][col];
    if (!item || item === GAME_CONSTANTS.BOMB_ITEM) return false;
    
    // Check horizontal
    let count = 1;
    // Left
    for (let c = col - 1; c >= 0 && gameState.board[row][c] === item; c--) count++;
    // Right
    for (let c = col + 1; c < 3 && gameState.board[row][c] === item; c++) count++;
    if (count >= 3) return true;
    
    // Check vertical
    count = 1;
    // Up
    for (let r = row - 1; r >= 0 && gameState.board[r][col] === item; r--) count++;
    // Down
    for (let r = row + 1; r < 3 && gameState.board[r][col] === item; r++) count++;
    if (count >= 3) return true;
    
    return false;
}

function renderBoard() {
    const board = document.getElementById('game-board');
    
    for (let row = 0; row < 3; row++) {
        for (let col = 0; col < 3; col++) {
            const slot = board.querySelector(`[data-row="${row}"][data-col="${col}"]`);
            slot.innerHTML = '';
            slot.classList.remove('empty');
            
            const item = gameState.board[row][col];
            if (item === null) {
                slot.classList.add('empty');
            } else {
                const itemDiv = document.createElement('div');
                itemDiv.className = 'game-item';
                if (item === GAME_CONSTANTS.BOMB_ITEM) {
                    itemDiv.classList.add('bomb');
                }
                itemDiv.textContent = item;
                itemDiv.setAttribute('data-item', item);
                itemDiv.setAttribute('data-row', row);
                itemDiv.setAttribute('data-col', col);
                
                // Add touch/mouse events
                itemDiv.addEventListener('touchstart', handleDragStart, { passive: false });
                itemDiv.addEventListener('mousedown', handleDragStart);
                
                slot.appendChild(itemDiv);
            }
        }
    }
}

// Drag and Drop
let touchStartX, touchStartY;
let dragClone = null;

function handleDragStart(e) {
    e.preventDefault();
    const item = e.target.closest('.game-item');
    if (!item) return;
    
    gameState.draggedItem = {
        item: item.getAttribute('data-item'),
        fromRow: parseInt(item.getAttribute('data-row')),
        fromCol: parseInt(item.getAttribute('data-col'))
    };
    
    item.classList.add('dragging');
    
    // Create clone for visual feedback
    dragClone = item.cloneNode(true);
    dragClone.style.position = 'fixed';
    dragClone.style.pointerEvents = 'none';
    dragClone.style.zIndex = '1000';
    dragClone.classList.add('dragging');
    document.body.appendChild(dragClone);
    
    if (e.type === 'touchstart') {
        const touch = e.touches[0];
        touchStartX = touch.clientX;
        touchStartY = touch.clientY;
        updateDragPosition(touch.clientX, touch.clientY);
        document.addEventListener('touchmove', handleDragMove, { passive: false });
        document.addEventListener('touchend', handleDragEnd);
    } else {
        touchStartX = e.clientX;
        touchStartY = e.clientY;
        updateDragPosition(e.clientX, e.clientY);
        document.addEventListener('mousemove', handleDragMove);
        document.addEventListener('mouseup', handleDragEnd);
    }
}

function handleDragMove(e) {
    e.preventDefault();
    const clientX = e.type === 'touchmove' ? e.touches[0].clientX : e.clientX;
    const clientY = e.type === 'touchmove' ? e.touches[0].clientY : e.clientY;
    
    updateDragPosition(clientX, clientY);
    
    // Highlight potential drop targets
    const elementBelow = document.elementFromPoint(clientX, clientY);
    document.querySelectorAll('.shelf-slot').forEach(s => s.classList.remove('highlight'));
    
    if (elementBelow) {
        const slot = elementBelow.closest('.shelf-slot');
        if (slot && (slot.classList.contains('empty') || slot.querySelector('.game-item'))) {
            slot.classList.add('highlight');
        }
    }
}

function updateDragPosition(x, y) {
    if (dragClone) {
        dragClone.style.left = (x - 40) + 'px';
        dragClone.style.top = (y - 40) + 'px';
    }
}

function handleDragEnd(e) {
    e.preventDefault();
    
    const clientX = e.type === 'touchend' ? e.changedTouches[0].clientX : e.clientX;
    const clientY = e.type === 'touchend' ? e.changedTouches[0].clientY : e.clientY;
    
    document.removeEventListener('touchmove', handleDragMove);
    document.removeEventListener('touchend', handleDragEnd);
    document.removeEventListener('mousemove', handleDragMove);
    document.removeEventListener('mouseup', handleDragEnd);
    
    // Clean up
    if (dragClone) {
        dragClone.remove();
        dragClone = null;
    }
    
    document.querySelectorAll('.game-item').forEach(i => i.classList.remove('dragging'));
    document.querySelectorAll('.shelf-slot').forEach(s => s.classList.remove('highlight'));
    
    // Find drop target
    const elementBelow = document.elementFromPoint(clientX, clientY);
    if (elementBelow) {
        const slot = elementBelow.closest('.shelf-slot');
        if (slot) {
            const toRow = parseInt(slot.getAttribute('data-row'));
            const toCol = parseInt(slot.getAttribute('data-col'));
            handleDrop(toRow, toCol);
        }
    }
    
    gameState.draggedItem = null;
}

function handleDrop(toRow, toCol) {
    if (!gameState.draggedItem) return;
    
    const { fromRow, fromCol, item } = gameState.draggedItem;
    
    // Can't drop on same position
    if (fromRow === toRow && fromCol === toCol) return;
    
    // Can only drop to empty slots or swap with another item in the same row
    const targetItem = gameState.board[toRow][toCol];
    
    if (fromRow !== toRow && targetItem !== null) {
        // Can't move to a different row if target is not empty
        return;
    }
    
    // Perform the move
    gameState.board[toRow][toCol] = item;
    gameState.board[fromRow][fromCol] = targetItem;
    
    // Count move only if moving between rows
    if (fromRow !== toRow && gameState.movesRemaining !== null) {
        gameState.movesRemaining--;
        updateConstraintDisplay();
    }
    
    renderBoard();
    
    // Check for matches
    setTimeout(() => {
        checkMatches();
    }, 100);
}

function checkMatches() {
    const matchedPositions = new Set();
    
    // Find all matches
    for (let row = 0; row < 3; row++) {
        for (let col = 0; col < 3; col++) {
            const item = gameState.board[row][col];
            if (!item || item === GAME_CONSTANTS.BOMB_ITEM) continue;
            
            // Horizontal match
            if (col === 0) {
                let count = 1;
                for (let c = col + 1; c < 3 && gameState.board[row][c] === item; c++) count++;
                if (count >= 3) {
                    for (let c = col; c < col + count; c++) {
                        matchedPositions.add(`${row},${c}`);
                    }
                }
            }
            
            // Vertical match
            if (row === 0) {
                let count = 1;
                for (let r = row + 1; r < 3 && gameState.board[r][col] === item; r++) count++;
                if (count >= 3) {
                    for (let r = row; r < row + count; r++) {
                        matchedPositions.add(`${r},${col}`);
                    }
                }
            }
        }
    }
    
    // Clear matched items
    if (matchedPositions.size > 0) {
        matchedPositions.forEach(pos => {
            const [row, col] = pos.split(',').map(Number);
            const slot = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
            const itemDiv = slot.querySelector('.game-item');
            if (itemDiv) {
                itemDiv.classList.add('matched');
            }
        });
        
        setTimeout(() => {
            matchedPositions.forEach(pos => {
                const [row, col] = pos.split(',').map(Number);
                gameState.board[row][col] = null;
            });
            renderBoard();
            checkWinCondition();
        }, 500);
    }
    
    checkWinCondition();
}

function checkWinCondition() {
    // Check if all items cleared
    let hasItems = false;
    for (let row = 0; row < 3; row++) {
        for (let col = 0; col < 3; col++) {
            if (gameState.board[row][col] !== null) {
                hasItems = true;
                break;
            }
        }
        if (hasItems) break;
    }
    
    if (!hasItems) {
        winLevel();
        return;
    }
    
    // Check lose conditions
    if (gameState.movesRemaining !== null && gameState.movesRemaining <= 0) {
        loseLevel('No moves remaining!');
        return;
    }
    
    if (gameState.timeRemaining !== null && gameState.timeRemaining <= 0) {
        loseLevel('Time\'s up!');
        return;
    }
}

function winLevel() {
    stopAllTimers();
    
    if (!gameState.completedLevels.includes(gameState.currentLevel)) {
        gameState.completedLevels.push(gameState.currentLevel);
    }
    
    // Unlock next level
    if (gameState.currentLevel < 20 && !gameState.unlockedLevels.includes(gameState.currentLevel + 1)) {
        gameState.unlockedLevels.push(gameState.currentLevel + 1);
    }
    
    saveGameState();
    
    const winStats = document.getElementById('win-stats');
    winStats.textContent = '';
    const levelP = document.createElement('p');
    levelP.textContent = `Level ${gameState.currentLevel} Complete!`;
    const jobP = document.createElement('p');
    jobP.textContent = 'Great job!';
    winStats.appendChild(levelP);
    winStats.appendChild(jobP);
    
    showScreen('win-screen');
}

function loseLevel(reason) {
    stopAllTimers();
    gameState.lives--;
    saveGameState();
    updateAllStats();
    
    const loseStats = document.getElementById('lose-stats');
    loseStats.textContent = '';
    const reasonP = document.createElement('p');
    reasonP.textContent = reason;
    const livesP = document.createElement('p');
    livesP.textContent = `Lives remaining: ${gameState.lives}`;
    loseStats.appendChild(reasonP);
    loseStats.appendChild(livesP);
    
    showScreen('lose-screen');
}

function nextLevel() {
    if (gameState.currentLevel < 20) {
        startLevel(gameState.currentLevel + 1);
    } else {
        quitToMenu();
    }
}

function retryLevel() {
    if (gameState.lives > 0) {
        startLevel(gameState.currentLevel);
    } else {
        quitToMenu();
    }
}

function pauseGame() {
    stopAllTimers();
    showScreen('pause-screen');
}

function resumeGame() {
    showScreen('game-screen');
    
    const config = levelConfigs[gameState.currentLevel - 1];
    if (gameState.timeRemaining !== null) {
        startGameTimer();
    }
    if (config.advanced === 'bomb') {
        startBombTimer();
    }
}

function quitToMenu() {
    stopAllTimers();
    showMainMenu();
}

// Timers
function startGameTimer() {
    stopGameTimer();
    gameState.gameTimer = setInterval(() => {
        gameState.timeRemaining--;
        updateConstraintDisplay();
        
        if (gameState.timeRemaining <= 0) {
            checkWinCondition();
        }
    }, 1000);
}

function stopGameTimer() {
    if (gameState.gameTimer) {
        clearInterval(gameState.gameTimer);
        gameState.gameTimer = null;
    }
}

function startBombTimer() {
    let bombTime = GAME_CONSTANTS.BOMB_COUNTDOWN_SECONDS;
    gameState.bombTimer = setInterval(() => {
        bombTime--;
        
        if (bombTime <= 0) {
            // Check if bombs are still on board
            let hasBombs = false;
            for (let row = 0; row < 3; row++) {
                for (let col = 0; col < 3; col++) {
                    if (gameState.board[row][col] === GAME_CONSTANTS.BOMB_ITEM) {
                        hasBombs = true;
                        break;
                    }
                }
                if (hasBombs) break;
            }
            
            if (hasBombs) {
                loseLevel('Bombs exploded!');
            }
            stopBombTimer();
        }
    }, 1000);
}

function stopBombTimer() {
    if (gameState.bombTimer) {
        clearInterval(gameState.bombTimer);
        gameState.bombTimer = null;
    }
}

function startLifeRegeneration() {
    gameState.lifeTimer = setInterval(() => {
        const now = Date.now();
        const elapsed = now - gameState.lastLifeTime;
        
        if (elapsed >= GAME_CONSTANTS.LIFE_REGEN_TIME_MS && gameState.lives < GAME_CONSTANTS.MAX_LIVES) {
            gameState.lives++;
            gameState.lastLifeTime = now;
            saveGameState();
            updateAllStats();
        }
    }, 1000);
}

function stopAllTimers() {
    stopGameTimer();
    stopBombTimer();
}

// UI Updates
function updateConstraintDisplay() {
    const display = document.getElementById('constraint-display');
    if (gameState.movesRemaining !== null) {
        display.textContent = `Moves: ${gameState.movesRemaining}`;
    } else if (gameState.timeRemaining !== null) {
        display.textContent = `Time: ${gameState.timeRemaining}s`;
    }
}

function updateAllStats() {
    document.getElementById('lives-display').textContent = gameState.lives;
    document.getElementById('coins-display').textContent = gameState.coins;
    document.getElementById('lives-map').textContent = gameState.lives;
    document.getElementById('coins-map').textContent = gameState.coins;
    document.getElementById('lives-game').textContent = gameState.lives;
}

// Save/Load
function saveGameState() {
    localStorage.setItem('goodGoodsGame', JSON.stringify({
        lives: gameState.lives,
        coins: gameState.coins,
        unlockedLevels: gameState.unlockedLevels,
        completedLevels: gameState.completedLevels,
        lastLifeTime: gameState.lastLifeTime
    }));
}

function loadGameState() {
    const saved = localStorage.getItem('goodGoodsGame');
    if (saved) {
        const data = JSON.parse(saved);
        gameState.lives = data.lives || GAME_CONSTANTS.INITIAL_LIVES;
        gameState.coins = data.coins || GAME_CONSTANTS.INITIAL_COINS;
        gameState.unlockedLevels = data.unlockedLevels || [1];
        gameState.completedLevels = data.completedLevels || [];
        gameState.lastLifeTime = data.lastLifeTime || Date.now();
    }
}

// Notification System
function showNotification(message) {
    const toast = document.getElementById('notification-toast');
    toast.textContent = message;
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// Initialize on load
window.addEventListener('load', initGame);
