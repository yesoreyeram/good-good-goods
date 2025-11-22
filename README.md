# Good Good Goods - Mobile Sorting Game

A mobile-friendly goods sorting game built with React, TypeScript, and Tailwind CSS. Features a 4-row board layout with 8 shelves (2 per row) and 20 progressive levels.

## Features

### Core Gameplay
- **4 Rows x 2 Columns Board**: 8 wooden shelves total, 2 shelves per row
- **Match-3 Mechanics**: Match 3 identical items horizontally or vertically to clear them
- **Drag and Drop**: Touch-friendly drag and drop with subtle tilt effect (10% skew)
- **3 Empty Slots**: Each level starts with 3 random empty slots
- **Playable Items**: All items come in groups of 3 to ensure the game is always solvable
- **No Initial Matches**: Board generation prevents starting with any 3-match configurations

### Game Mechanics
- **Lives System**: Start with 10 lives (max 10)
  - Lose 1 life when failing a level
  - Gain 1 life every 5 minutes automatically
- **Coins**: Start with 1000 coins (tracked globally)
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
- **Progressive Difficulty**: Levels increase in complexity with more item types and tighter constraints

### Visual Design
- **No Gradient Backgrounds**: Solid color purple background
- **Comic Font**: Logo and primary action buttons use Comic Sans MS style
- **Wooden Shelves**: Realistic wood texture with proper depth
- **Rounded Corners**: All game elements (shelves, items, buttons) have rounded corners
- **Mobile-First**: Fixed aspect ratio across all devices
- **Tight Level Map**: Compact 5-column grid layout
- **Icons/Emojis**: Action buttons use emojis instead of text where possible
- **Global Stats**: Lives and coins displayed at top level across all screens

### Mobile Optimizations
- **No Scrolling**: Entire game fits on screen, no scroll bars anywhere
- **Touch-Friendly**: Large touch targets and smooth interactions
- **Subtle Drag Effect**: 10% skew/tilt when dragging items (not zoomed)
- **Performance**: Optimized for smooth 50fps gameplay
- **Responsive**: Works on all mobile screen sizes with consistent aspect ratio

## Tech Stack

- **React 19**: Modern UI framework
- **TypeScript**: Type-safe development
- **Tailwind CSS 4**: Utility-first CSS framework
- **Vite**: Fast build tool and dev server

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## How to Play

### Starting the Game
1. Open the game in your browser
2. Click the ▶️ button to view the level map
3. Select an unlocked level to start

### Controls
- **Drag & Drop**: Touch/click and drag an item to move it
  - Move items to empty slots in the same row (free move, doesn't count)
  - Move items to different rows (counts as a move)
- **Matching**: Align 3 identical items horizontally or vertically to clear them
- **Pause**: Click the ⏸ button during gameplay

### Winning a Level
- Clear all items from the board by matching 3 or more
- Complete before running out of moves or time
- Successfully clear all bomb items within 12 seconds (Level 6+)

### Losing a Level
- Run out of moves (move-based levels)
- Run out of time (time-based levels)
- Fail to clear bombs within 12 seconds (Level 6+)

## Project Structure

```
good-good-goods/
├── src/
│   ├── types/             # TypeScript type definitions
│   ├── utils/             # Game logic and utilities
│   │   ├── constants.ts   # Game constants and level configs
│   │   ├── gameLogic.ts   # Board generation and match detection
│   │   └── storage.ts     # LocalStorage utilities
│   ├── App.tsx            # Main game component
│   ├── main.tsx           # Application entry point
│   └── index.css          # Global styles
├── index.html             # HTML template
├── package.json           # Dependencies and scripts
├── tsconfig.json          # TypeScript configuration
├── tailwind.config.js     # Tailwind CSS configuration
├── vite.config.ts         # Vite configuration
└── README.md              # This file
```

## Data Persistence

Game progress is automatically saved to browser localStorage:
- Lives and coins
- Unlocked levels
- Completed levels
- Life regeneration timer

## Reset Game Progress

To reset your game progress:
```javascript
// Open browser console and run:
localStorage.removeItem('goodGoodsGame');
// Then refresh the page
```

## License

MIT License - Feel free to use and modify!
