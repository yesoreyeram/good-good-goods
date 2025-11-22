# Good Good Goods - Mobile Sorting Game

A mobile-friendly 3D goods sorting game with a GTA supermarket theme. Match 3 items to clear them from the shelves!

![Main Menu](https://github.com/user-attachments/assets/eb64bb67-d5f5-4d17-9380-f582c6d79890)

## Features

### Core Gameplay
- **3 Rows x 3 Columns Board**: Three wooden shelves with 9 slots total
- **Match-3 Mechanics**: Match 3 identical items horizontally or vertically to clear them
- **Drag and Drop**: Touch-friendly drag and drop controls for moving items
- **Empty Slots**: At least 2 random empty slots on each level
- **Progressive Levels**: 20 levels with increasing difficulty

### Game Mechanics
- **Lives System**: Start with 10 lives (max 10)
  - Lose 1 life when failing a level
  - Gain 1 life every 5 minutes automatically
- **Coins**: Start with 1000 coins
- **Level Constraints**:
  - **Move-based**: Complete within a limited number of moves
  - **Time-based**: Complete within a time limit
- **Advanced Constraints** (Level 6+):
  - **Bomb Items**: 3 bombs spawn randomly and must be cleared within 12 seconds

### Level Progression
- **20 Total Levels**: Each level introduces new item types
- **Unlock Methods**:
  1. Complete the previous level
  2. Secret unlock: Click a locked level 5 times continuously
- **No Initial Matches**: Boards are generated to avoid initial 3-match configurations

### Visual Design
- **3D Wooden Shelves**: Realistic wooden texture with depth effects
- **Gradient Backgrounds**: Vibrant purple gradient theme
- **Item Animations**: Smooth match animations with scale effects
- **Bomb Effects**: Pulsing animation for bomb items
- **Responsive Design**: Adapts to all mobile screen sizes

### Mobile Optimizations
- **No Scrolling**: Entire game fits on screen
- **Touch-Friendly**: Large touch targets and smooth interactions
- **50 FPS Target**: Optimized for smooth performance
- **No User Scaling**: Fixed viewport for consistent experience

## How to Play

### Starting the Game
1. Open `index.html` in a web browser
2. Click "PLAY" to view the level map
3. Select an unlocked level to start

### Controls
- **Drag & Drop**: Touch/click and drag an item to move it
  - Move items to empty slots in the same row (free move)
  - Move items to different rows (counts as a move)
- **Matching**: Align 3 identical items horizontally or vertically
- **Pause**: Click the ⏸ button during gameplay

### Winning a Level
- Clear all items from the board by matching 3 or more
- Complete before running out of moves or time
- Successfully clear all bomb items within 12 seconds (Level 6+)

### Losing a Level
- Run out of moves (move-based levels)
- Run out of time (time-based levels)
- Fail to clear bombs within 12 seconds (Level 6+)

## Level Configuration

| Level | Items | Constraint | Value | Advanced |
|-------|-------|------------|-------|----------|
| 1 | 3 types | Moves | 20 | - |
| 2 | 4 types | Time | 60s | - |
| 3 | 5 types | Moves | 18 | - |
| 4 | 6 types | Time | 55s | - |
| 5 | 7 types | Moves | 16 | - |
| 6 | 8 types | Time | 50s | 💣 Bombs |
| 7 | 9 types | Moves | 15 | 💣 Bombs |
| 8 | 10 types | Time | 45s | 💣 Bombs |
| ... | ... | ... | ... | ... |
| 20 | 22 types | Time | 30s | 💣 Bombs |

## Technical Details

### Files
- `index.html`: Main game structure and UI screens
- `styles.css`: Responsive styling and 3D effects
- `game.js`: Complete game logic and mechanics

### Browser Compatibility
- Modern browsers with HTML5 support
- Touch events for mobile devices
- Mouse events for desktop testing

### Data Persistence
- Game state saved to localStorage
- Tracks: lives, coins, unlocked levels, completed levels
- Life regeneration timer persists across sessions

## Screenshots

### Level Map
![Level Map](https://github.com/user-attachments/assets/b6b1fa5d-7bde-40f8-bf07-d9840160bda7)

### Gameplay
![Gameplay](https://github.com/user-attachments/assets/5dcb9540-eed3-47bf-8bb6-a296399c246d)

### Pause Screen
![Pause Screen](https://github.com/user-attachments/assets/55bcf301-8f95-4014-a12c-9bedece84be2)

## Development

### Running Locally
```bash
# Simple HTTP server with Python
python3 -m http.server 8000

# Or with Node.js
npx http-server

# Then open http://localhost:8000 in your browser
```

### Reset Game Progress
```javascript
// Open browser console and run:
localStorage.removeItem('goodGoodsGame');
// Then refresh the page
```

## Future Enhancements
- Additional constraint types
- Power-ups and special items
- Sound effects and music
- Leaderboards and scoring system
- More visual themes
- Tutorial mode

## License

MIT License - Feel free to use and modify!