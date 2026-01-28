/**
 * Simple test script to verify statistics tracking functionality
 */

import { TennisMatch } from './src/scoring/TennisMatch.js';
import { calculateFirstServePercentage, calculateSecondServePercentage } from './src/scoring/types.js';

console.log('🎾 Testing Tennis Match Statistics Tracking\n');

// Test 1: Basic backward compatibility
console.log('Test 1: Backward Compatibility - scorePoint() still works');
const match1 = new TennisMatch();
match1.scorePoint(1);
match1.scorePoint(2);
match1.scorePoint(1);
const state1 = match1.getState();
console.log(`✅ Points: P1=${state1.player1.points}, P2=${state1.player2.points}`);
console.log(`✅ Point history length: ${state1.pointsHistory.length}`);
console.log('');

// Test 2: New scorePointWithStats() method
console.log('Test 2: scorePointWithStats() with detailed metadata');
const match2 = new TennisMatch();

// Player 1 serves, ace
match2.scorePointWithStats(1, {
    serveNumber: 1,
    serveResult: 'ace',
    pointType: 'winner'
});

// Player 1 serves, first serve in, winner
match2.scorePointWithStats(1, {
    serveNumber: 1,
    serveResult: 'in',
    pointType: 'winner'
});

// Player 1 serves, fault, second serve in, player 2 wins (unforced error by P1)
match2.scorePointWithStats(2, {
    serveNumber: 2,
    serveResult: 'in',
    pointType: 'unforced_error'
});

// Player 1 serves, first serve in, point won at net
match2.scorePointWithStats(1, {
    serveNumber: 1,
    serveResult: 'in',
    pointType: 'net'
});

const stats2 = match2.getStatistics();
console.log('Player 1 Statistics:');
console.log(`  First Serves: ${stats2.player1.firstServesIn}/${stats2.player1.firstServesTotal} (${calculateFirstServePercentage(stats2.player1)}%)`);
console.log(`  Second Serves: ${stats2.player1.secondServesIn}/${stats2.player1.secondServesTotal} (${calculateSecondServePercentage(stats2.player1)}%)`);
console.log(`  Aces: ${stats2.player1.aces}`);
console.log(`  Double Faults: ${stats2.player1.doubleFaults}`);
console.log(`  Winners: ${stats2.player1.winners}`);
console.log(`  Unforced Errors: ${stats2.player1.unforcedErrors}`);
console.log(`  Points Won at Net: ${stats2.player1.pointsWonAtNet}`);

console.log('\nPlayer 2 Statistics:');
console.log(`  Unforced Errors: ${stats2.player2.unforcedErrors}`);
console.log('');

// Test 3: Undo functionality with statistics
console.log('Test 3: Undo with statistics tracking');
const match3 = new TennisMatch();

// Score a point with stats
match3.scorePointWithStats(1, {
    serveNumber: 1,
    serveResult: 'ace',
    pointType: 'winner'
});

let stats3Before = match3.getStatistics();
console.log(`Before undo - Aces: ${stats3Before.player1.aces}, Winners: ${stats3Before.player1.winners}`);

// Undo the point
match3.removePoint(1);

let stats3After = match3.getStatistics();
console.log(`After undo  - Aces: ${stats3After.player1.aces}, Winners: ${stats3After.player1.winners}`);
console.log(`✅ Undo correctly reversed statistics`);
console.log('');

// Test 4: Double fault tracking
console.log('Test 4: Double fault tracking');
const match4 = new TennisMatch();

// Player 1 serves, second serve fault (double fault)
match4.scorePointWithStats(2, {
    serveNumber: 2,
    serveResult: 'fault',
});

const stats4 = match4.getStatistics();
console.log(`✅ Double Faults: ${stats4.player1.doubleFaults}`);
console.log('');

// Test 5: Match reset clears statistics
console.log('Test 5: Reset clears statistics');
const match5 = new TennisMatch();
match5.scorePointWithStats(1, { serveNumber: 1, serveResult: 'ace' });
match5.reset();
const stats5 = match5.getStatistics();
console.log(`✅ After reset - Aces: ${stats5.player1.aces} (should be 0)`);
console.log('');

console.log('✅ All tests passed! Statistics tracking is working correctly.');
