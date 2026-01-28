/**
 * Test script to populate statistics with mock data
 * This tests the UI rendering of statistics
 *
 * To use: Copy the code inside the main function and paste it in the browser console
 * after loading the app
 */

// This is example code to run in the browser console after the app loads
const mockStatsTest = `
// Wait for scorer to be available
if (typeof scorer !== 'undefined') {
    console.log('📊 Adding mock statistics data...');

    // Player 1 serves and wins with an ace
    scorer.match.scorePointWithStats(1, {
        serveNumber: 1,
        serveResult: 'ace',
        pointType: 'winner'
    });

    // Player 1 serves, first serve in, wins with winner
    scorer.match.scorePointWithStats(1, {
        serveNumber: 1,
        serveResult: 'in',
        pointType: 'winner'
    });

    // Player 1 serves, fault, second serve in, player 2 wins (unforced error)
    scorer.match.scorePointWithStats(2, {
        serveNumber: 2,
        serveResult: 'in',
        pointType: 'unforced_error'
    });

    // Player 1 serves, first serve in, wins at net
    scorer.match.scorePointWithStats(1, {
        serveNumber: 1,
        serveResult: 'in',
        pointType: 'net'
    });

    // Player 2 serves, ace
    scorer.match.scorePointWithStats(2, {
        serveNumber: 1,
        serveResult: 'ace',
        pointType: 'winner'
    });

    // Player 2 serves, double fault
    scorer.match.scorePointWithStats(1, {
        serveNumber: 2,
        serveResult: 'fault'
    });

    // Player 2 serves, first serve in, player 1 wins (forced error by P2)
    scorer.match.scorePointWithStats(1, {
        serveNumber: 1,
        serveResult: 'in',
        pointType: 'forced_error'
    });

    // Player 2 serves, second serve in, player 2 wins with winner
    scorer.match.scorePointWithStats(2, {
        serveNumber: 2,
        serveResult: 'in',
        pointType: 'winner'
    });

    // Manually trigger display update
    scorer.updateDisplay();

    console.log('✅ Mock statistics added successfully!');
    console.log('Player 1 Stats:', scorer.match.getStatistics().player1);
    console.log('Player 2 Stats:', scorer.match.getStatistics().player2);
    console.log('');
    console.log('📊 Expand the statistics panel to see the results!');
} else {
    console.error('❌ scorer not found. Make sure the app is loaded.');
}
`;

console.log('🎾 Statistics UI Test');
console.log('====================');
console.log('');
console.log('To test the statistics UI:');
console.log('1. Start the dev server: npm run dev');
console.log('2. Open http://localhost:8000 in your browser');
console.log('3. Open the browser console (F12)');
console.log('4. Paste and run the following code:');
console.log('');
console.log(mockStatsTest);
