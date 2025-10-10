# Tennis Score Keeper

A modular TypeScript-based tennis match scorer with a clean separation between scoring logic and display rendering.

## Architecture

The project is organized into three main packages:

### 📊 **`src/scoring/`** - Pure Scoring Logic
Contains the core tennis match engine with **no UI dependencies**. This package can be used programmatically to simulate matches, play points from files, or integrate with any display system.

**Files:**
- `TennisMatch.ts` - Core match state & scoring rules
- `types.ts` - Type definitions (MatchConfig, MatchState, PlayerScore, etc.)
- `index.ts` - Package exports

**Responsibilities:**
- Manage match state (points, games, sets)
- Apply official tennis scoring rules (deuce, advantage, tie-breaks)
- Determine game/set/match winners
- Track score history
- Provide read-only access to current match state

### 🎨 **`src/display/`** - UI Rendering
Handles rendering tennis match state to HTML elements, completely decoupled from scoring logic.

**Files:**
- `TennisDisplayRenderer.ts` - DOM manipulation & theme rendering
- `index.ts` - Package exports

**Responsibilities:**
- Render match state to DOM elements
- Apply and manage visual themes
- Update scoreboard display (points, games, sets)
- Show/hide winner announcements
- Format score displays ("0", "15", "30", "40", "AD")

### 🎯 **`src/`** - Main Application
The orchestration layer that coordinates between the scoring engine and display renderer.

**Files:**
- `ScoreKeeper.ts` - Simplified orchestrator
- `main.ts` - Entry point and global event handlers

**Responsibilities:**
- Coordinate between TennisMatch and TennisDisplayRenderer
- Handle user input (button clicks, settings changes)
- Manage player names and UI interactions

## Building the Project

```bash
# Install dependencies
npm install

# Build TypeScript files
npm run build

# Watch mode for development
npm run watch
```

The compiled JavaScript will be output to the `dist/` directory.

## Running the Application

Due to browser CORS restrictions with ES6 modules, you need to serve the application via HTTP rather than opening the file directly.

### Quick Start

```bash
# Build and start the development server
npm run dev
```

Then open your browser to: **http://localhost:8000**

### Alternative: Just Serve (Without Rebuilding)

If you've already built the project and just want to serve it:

```bash
npm run serve
```

Then open: **http://localhost:8000**

**Note:** Opening `index.html` directly using the `file://` protocol will not work due to CORS restrictions on ES6 module imports. You must use a local HTTP server.

## Programmatic Usage

The scoring package can be used independently without any UI. See [examples/programmatic-example.ts](examples/programmatic-example.ts) for a complete example.

### Example: Playing Points from a String

```typescript
import { TennisMatch } from './src/scoring';

const match = new TennisMatch({
    gamesPerSet: 6,
    setsToWin: 2,
    tieBreakPoints: 7
});

// Play a sequence of points (1 = Player 1, 2 = Player 2)
const points = "1112211121112211112211121112";

for (const point of points) {
    const player = point === "1" ? 1 : 2;
    match.scorePoint(player);

    const state = match.getState();
    console.log(`Score: ${state.player1.points}-${state.player2.points}`);
    console.log(`Games: ${state.player1.games}-${state.player2.games}`);
    console.log(`Sets: ${state.player1.sets}-${state.player2.sets}`);

    if (state.matchWinner) {
        console.log(`Match winner: Player ${state.matchWinner}`);
        break;
    }
}
```

### Example: Reading Points from a File

```typescript
import { TennisMatch } from './src/scoring';
import * as fs from 'fs';

const match = new TennisMatch();
const pointsFromFile = fs.readFileSync('match-points.txt', 'utf-8');

for (const point of pointsFromFile.trim()) {
    if (point === '1' || point === '2') {
        match.scorePoint(parseInt(point) as 1 | 2);
    }
}

console.log('Final state:', match.getState());
```

## Project Structure

```
tennis_score/
├── src/
│   ├── scoring/           # Pure scoring logic (no DOM)
│   │   ├── TennisMatch.ts
│   │   ├── types.ts
│   │   └── index.ts
│   ├── display/           # UI rendering
│   │   ├── TennisDisplayRenderer.ts
│   │   └── index.ts
│   ├── ScoreKeeper.ts     # Orchestrator
│   └── main.ts            # Entry point
├── examples/
│   └── programmatic-example.ts
├── dist/                  # Compiled JavaScript (generated)
├── index.html             # Main HTML page
├── tsconfig.json          # TypeScript configuration
└── package.json           # npm configuration
```

## Benefits of This Architecture

1. **Separation of Concerns**: Scoring logic is completely independent of UI rendering
2. **Reusability**: The scoring engine can be used in any context (CLI, web, mobile, tests)
3. **Testability**: Each package can be tested independently
4. **Maintainability**: Clear boundaries make it easier to understand and modify code
5. **Flexibility**: Easy to swap out the display layer or use the scoring engine programmatically

## Development

Each package has clear documentation headers explaining its responsibilities and dependencies. Future developers can easily understand the purpose of each module and how they interact.
