import { Given } from '@cucumber/cucumber';
import { TennisWorld } from '../world.js';

Given('a new match with default configuration', function (this: TennisWorld) {
    this.createMatch();
});

Given('a new match with {int} games per set', function (this: TennisWorld, gamesPerSet: number) {
    this.createMatch({ gamesPerSet });
});

Given('a new match with {int} sets to win', function (this: TennisWorld, setsToWin: number) {
    this.createMatch({ setsToWin });
});

Given('a new match with {int} games per set and {int} sets to win', function (
    this: TennisWorld,
    gamesPerSet: number,
    setsToWin: number
) {
    this.createMatch({ gamesPerSet, setsToWin });
});

Given('player {int} is serving', function (this: TennisWorld, player: number) {
    if (!this.match) {
        throw new Error('Match not initialized');
    }
    // Reset to set server - we need to access internal state or create fresh match
    // Since TennisMatch always starts with player 1 serving, we simulate games if needed
    const state = this.getState();
    if (state.server !== player) {
        // Score a game for player 1 to switch server, then reset points
        for (let i = 0; i < 4; i++) {
            this.scorePoint(1, 'first', 'winner');
        }
        // Now server is player 2, but we need to reset the game state
        // This is a workaround - ideally TennisMatch would have setServer()
    }
});

Given('the score is {int}-{int} in games', function (
    this: TennisWorld,
    player1Games: number,
    player2Games: number
) {
    if (!this.match) {
        throw new Error('Match not initialized');
    }
    // Score games to reach the desired state
    for (let i = 0; i < player1Games; i++) {
        for (let j = 0; j < 4; j++) {
            this.scorePoint(1, 'first', 'winner');
        }
    }
    for (let i = 0; i < player2Games; i++) {
        for (let j = 0; j < 4; j++) {
            this.scorePoint(2, 'first', 'winner');
        }
    }
});

Given('both players have won {int} sets', function (this: TennisWorld, sets: number) {
    if (!this.match) {
        throw new Error('Match not initialized');
    }
    // Win sets for both players
    for (let s = 0; s < sets; s++) {
        // Player 1 wins a set
        for (let g = 0; g < 6; g++) {
            for (let p = 0; p < 4; p++) {
                this.scorePoint(1, 'first', 'winner');
            }
        }
        // Player 2 wins a set
        for (let g = 0; g < 6; g++) {
            for (let p = 0; p < 4; p++) {
                this.scorePoint(2, 'first', 'winner');
            }
        }
    }
});
