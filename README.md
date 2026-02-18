# Tennis Score Keeper

A modular TypeScript-based tennis match scorer with a clean separation between scoring logic and display rendering.

## Features

- **Tennis Scoring Engine** - Full support for standard tennis scoring including deuce, advantage, tie-breaks, and super tie-breaks (deciding set)
- **Live Statistics Tracking** - Comprehensive per-player stats: aces, double faults, winners, unforced/forced errors, serve percentages, break points, rally length, and more
- **Scorecard Export** - Export a complete match as a ZIP containing point-by-point PNG snapshots of the scoreboard and statistics panel, plus JSON data files
- **Match Import/Replay** - Replay a previously exported match from its JSON point history
- **Undo Support** - Undo the last scored point with full statistics reversal
- **Server Switching** - Automatic server alternation after games, with correct tie-break rotation
- **Configurable Matches** - Customise games per set, sets to win, tie-break points, and visual themes
- **Keyboard Shortcuts** - Score points with `1`/`2` and undo with `Shift+1`/`Shift+2`

## Architecture

The project is organized into three main packages:

### `src/scoring/` - Pure Scoring Logic
Contains the core tennis match engine with **no UI dependencies**. This package can be used programmatically to simulate matches, play points from files, or integrate with any display system.

**Files:**
- `TennisMatch.ts` - Core match state & scoring rules
- `types.ts` - Type definitions (MatchConfig, MatchState, PlayerScore, etc.)
- `exportTypes.ts` - Export data structures (MatchStatisticsExport, MatchScoreExport)
- `index.ts` - Package exports

**Responsibilities:**
- Manage match state (points, games, sets)
- Apply official tennis scoring rules (deuce, advantage, tie-breaks)
- Determine game/set/match winners
- Track score history and per-point metadata
- Provide read-only access to current match state

### `src/display/` - UI Rendering
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

### `src/` - Main Application
The orchestration layer that coordinates between the scoring engine and display renderer.

**Files:**
- `ScoreKeeper.ts` - Simplified orchestrator
- `main.ts` - Entry point and global event handlers

**Responsibilities:**
- Coordinate between TennisMatch and TennisDisplayRenderer
- Handle user input (button clicks, settings changes)
- Manage player names and UI interactions
- Build scorecard ZIP exports and handle match imports

## Export Functionality

The scorecard export (`Build Score Cards` button) generates a ZIP file named `{Player1}_vs_{Player2}.zip` containing:

| Path | Content |
|------|---------|
| `points/*.png` | Screenshot of the scoreboard after every point |
| `statistics/*.png` | Screenshot of the statistics panel after every point |
| `match-statistics.json` | Cumulative statistics for both players (aces, double faults, serve %, winners, errors, break points, etc.) |
| `match-score.json` | Complete point-by-point history with serve result, point type, rally length, and server for each point |

The `match-score.json` file can be re-imported to replay a match in the UI.

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

## Testing

The project uses **Cucumber.js** with **Gherkin** feature files for integration testing. Tests are written in a behaviour-driven style that reads like plain English, making them serve as both executable specifications and living documentation.

### Running Tests

```bash
# Run all tests
npm test

# Run tests and generate an HTML report
npm run test:report    # outputs reports/cucumber-report.html
```

### Test Structure

```
tests/
├── scenarios/
│   ├── scoring/                    # Core scoring rules
│   │   ├── straight_game.feature
│   │   ├── game_win_after_deuce.feature
│   │   ├── score_wraps_to_deuce.feature
│   │   ├── tie_break.feature
│   │   ├── super_tie_break.feature
│   │   ├── server_switching/       # Server rotation rules
│   │   │   ├── straight_game.feature
│   │   │   ├── new_set.feature
│   │   │   ├── tie_break.feature
│   │   │   └── super_tie_break.feature
│   │   └── undo/                   # Undo behaviour
│   │       ├── after_game_win.feature
│   │       ├── after_set_win.feature
│   │       └── during_tie_break.feature
│   └── statistics/                 # Statistics tracking
│       ├── aces.feature
│       ├── double_faults.feature
│       ├── serve_percentages.feature
│       ├── points_won_on_serve.feature
│       ├── regular_points.feature
│       ├── rally_length.feature
│       ├── missed_returns.feature
│       ├── undo_statistics.feature
│       └── export/                 # Export verification
│           ├── global_statistics.feature
│           └── point_history.feature
└── runner/
    ├── world.ts                    # Test context (TennisWorld)
    ├── hooks.ts                    # Before/After hooks
    └── steps/
        ├── common.steps.ts         # Given steps (match setup)
        ├── scoring.steps.ts        # When/Then for scoring
        ├── statistics.steps.ts     # Then for statistics assertions
        └── export.steps.ts         # When/Then for export operations
```

### Example Feature File

Feature files describe behaviour in plain Gherkin syntax:

```gherkin
Feature: Straight Game Win (Love Game)
  A game is won when a player scores four points (15, 30, 40, game)
  and the opponent has fewer than three points.

  Background:
    Given a new match with default configuration

  Scenario: Player 1 wins a love game
    When player 1 scores 4 points
    Then player 1 should have 1 games
    And player 1 should have 0 points
    And player 2 should have 0 games

  Scenario: Player 1 wins a love game with aces
    When player 1 scores 4 consecutive points on first serve as aces
    Then player 1 should have 1 games
    And player 1 should have 4 aces
```

The step definitions in `tests/runner/steps/` map these Gherkin steps to TypeScript code that exercises the `TennisMatch` scoring engine directly, without any DOM or UI involvement.

## Project Structure

```
tennis_score/
├── src/
│   ├── scoring/              # Pure scoring logic (no DOM)
│   │   ├── TennisMatch.ts
│   │   ├── types.ts
│   │   ├── exportTypes.ts
│   │   └── index.ts
│   ├── display/              # UI rendering
│   │   ├── TennisDisplayRenderer.ts
│   │   └── index.ts
│   ├── ScoreKeeper.ts        # Orchestrator
│   └── main.ts               # Entry point
├── tests/                    # Cucumber/Gherkin integration tests
│   ├── scenarios/            # .feature files
│   └── runner/               # Step definitions & world
├── examples/
│   └── programmatic-example.ts
├── dist/                     # Compiled JavaScript (generated)
├── reports/                  # Test reports (generated)
├── index.html                # Main HTML page
├── cucumber.mjs              # Cucumber configuration
├── vite.config.js            # Vite dev server config
├── tsconfig.json             # TypeScript configuration
└── package.json              # npm configuration
```

## Benefits of This Architecture

1. **Separation of Concerns** - Scoring logic is completely independent of UI rendering
2. **Reusability** - The scoring engine can be used in any context (CLI, web, mobile, tests)
3. **Testability** - Each package can be tested independently; Gherkin tests act as living documentation
4. **Maintainability** - Clear boundaries make it easier to understand and modify code
5. **Flexibility** - Easy to swap out the display layer or use the scoring engine programmatically
