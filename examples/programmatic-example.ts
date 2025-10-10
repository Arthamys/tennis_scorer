/**
 * EXAMPLE: Programmatic Usage of Tennis Scoring Engine
 *
 * This example demonstrates how to use the scoring package independently
 * without any UI/display components. This is useful for:
 * - Playing points from a file
 * - Simulating matches
 * - Testing scoring logic
 * - Building alternative UIs
 */

import { TennisMatch, MatchState } from '../src/scoring';

// Create a new match with custom configuration
const match = new TennisMatch({
    gamesPerSet: 6,
    setsToWin: 2,
    tieBreakPoints: 7,
    theme: 'default' // Theme is ignored when not using display package
});

// Simulate a string of points from a file or input
// Format: "1" = Player 1 scores, "2" = Player 2 scores
const pointsSequence = "1112211121112211112211121112";

console.log("=== Tennis Match Simulation ===\n");

// Play through the points
for (let i = 0; i < pointsSequence.length; i++) {
    const player = pointsSequence[i] === "1" ? 1 : 2;
    match.scorePoint(player as 1 | 2);

    const state: MatchState = match.getState();

    // Log the current state
    console.log(`Point ${i + 1}: Player ${player} scores`);
    console.log(`  Score: ${state.player1.points}-${state.player2.points}`);
    console.log(`  Games: ${state.player1.games}-${state.player2.games}`);
    console.log(`  Sets: ${state.player1.sets}-${state.player2.sets}`);

    if (state.matchWinner) {
        console.log(`\n🏆 MATCH WINNER: Player ${state.matchWinner}!`);
        console.log(`Final Score History:`);
        state.scoreHistory.forEach((set, index) => {
            console.log(`  Set ${index + 1}: ${set.player1}-${set.player2}`);
        });
        break;
    }

    console.log("---");
}

// Example: Reading points from a file
// In a real scenario, you could read from a file like this:
// import * as fs from 'fs';
// const pointsFromFile = fs.readFileSync('match-points.txt', 'utf-8');
// for (const point of pointsFromFile.trim()) {
//     if (point === '1' || point === '2') {
//         match.scorePoint(parseInt(point) as 1 | 2);
//     }
// }
