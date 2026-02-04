import { When, Then } from '@cucumber/cucumber';
import { expect } from 'chai';
import { TennisWorld } from '../world.js';
import { PointMetadata } from '../../../src/scoring/types.js';

// Point type mapping from Gherkin to code
const pointTypeMap: Record<string, PointMetadata['pointType']> = {
    'winner': 'winner',
    'ace': 'ace',
    'double_fault': 'double_fault',
    'double-fault': 'double_fault',
    'unforced_error': 'unforced_error',
    'unforced-error': 'unforced_error',
    'forced_error': 'forced_error',
    'forced-error': 'forced_error',
    'net': 'net',
    'missed_return': 'missed_return',
    'missed-return': 'missed_return',
};

When('player {int} scores a point', function (
    this: TennisWorld,
    player: number,
) {
    this.scorePoint(player as 1 | 2, 'first', 'winner');
});


When('player {int} scores {int} points', function (
    this: TennisWorld,
    player: number,
    points: number,
) {
    for (let i = 0; i < points; i++) {
        this.scorePoint(player as 1 | 2, 'first', 'winner');
    }
});

When('player {int} scores a point on {word} serve as a/an {word}', function (
    this: TennisWorld,
    player: number,
    serve: string,
    pointType: string
) {
    const serveResult = serve as 'first' | 'second';
    const mappedPointType = pointTypeMap[pointType] || pointType as PointMetadata['pointType'];
    // Aces and missed returns always have rally length of 1
    const rallyLength = (mappedPointType === 'ace' || mappedPointType === 'missed_return') ? 1 : undefined;
    this.scorePoint(player as 1 | 2, serveResult, mappedPointType, rallyLength);
});

When('player {int} scores {int} consecutive points on {word} serve as winners', function (
    this: TennisWorld,
    player: number,
    count: number,
    serve: string
) {
    const serveResult = serve as 'first' | 'second';
    for (let i = 0; i < count; i++) {
        this.scorePoint(player as 1 | 2, serveResult, 'winner');
    }
});

When('player {int} scores {int} consecutive points on {word} serve as aces', function (
    this: TennisWorld,
    player: number,
    count: number,
    serve: string
) {
    const serveResult = serve as 'first' | 'second';
    for (let i = 0; i < count; i++) {
        this.scorePoint(player as 1 | 2, serveResult, 'ace', 1);
    }
});

When('player {int} wins a game with aces', function (this: TennisWorld, player: number) {
    for (let i = 0; i < 4; i++) {
        this.scorePoint(player as 1 | 2, 'first', 'ace', 1);
    }
});

When('player {int} wins a game on {word} serve', function (
    this: TennisWorld,
    player: number,
    serve: string
) {
    const serveResult = serve as 'first' | 'second';
    for (let i = 0; i < 4; i++) {
        this.scorePoint(player as 1 | 2, serveResult, 'winner');
    }
});

When('player {int} wins {int} games on {word} serve', function (
    this: TennisWorld,
    player: number,
    games: number,
    serve: string
) {
    const serveResult = serve as 'first' | 'second';
    for (let g = 0; g < games; g++) {
        for (let p = 0; p < 4; p++) {
            this.scorePoint(player as 1 | 2, serveResult, 'winner');
        }
    }
});

When('player {int} wins a set {int}-{int}', function (
    this: TennisWorld,
    player: number,
    winnerGames: number,
    loserGames: number
) {
    const otherPlayer = player === 1 ? 2 : 1;
    // Win loser's games first
    for (let g = 0; g < loserGames; g++) {
        for (let p = 0; p < 4; p++) {
            this.scorePoint(otherPlayer as 1 | 2, 'first', 'winner');
        }
    }
    // Win winner's games
    for (let g = 0; g < winnerGames; g++) {
        for (let p = 0; p < 4; p++) {
            this.scorePoint(player as 1 | 2, 'first', 'winner');
        }
    }
});

When('the score reaches deuce', function (this: TennisWorld) {
    // Both players score 3 points (40-40)
    for (let i = 0; i < 3; i++) {
        this.scorePoint(1, 'first', 'winner');
        this.scorePoint(2, 'first', 'winner');
    }
});

When('player {int} undoes the last point', function (this: TennisWorld, player: number) {
    this.undoPoint(player as 1 | 2);
});

Then(/^player (\d+) should have (\d+) points?$/, function (
    this: TennisWorld,
    player: string,
    points: string
) {
    const state = this.getState();
    const actualPoints = parseInt(player) === 1 ? state.player1.points : state.player2.points;
    expect(actualPoints).to.equal(parseInt(points));
});

Then(/^player (\d+) should have (\d+) games?$/, function (
    this: TennisWorld,
    player: string,
    games: string
) {
    const state = this.getState();
    const actualGames = parseInt(player) === 1 ? state.player1.games : state.player2.games;
    expect(actualGames).to.equal(parseInt(games));
});

Then(/^player (\d+) should have (\d+) sets?$/, function (
    this: TennisWorld,
    player: string,
    sets: string
) {
    const state = this.getState();
    const actualSets = parseInt(player) === 1 ? state.player1.sets : state.player2.sets;
    expect(actualSets).to.equal(parseInt(sets));
});

Then('the score should be {int}-{int} in points', function (
    this: TennisWorld,
    player1Points: number,
    player2Points: number
) {
    const state = this.getState();
    expect(state.player1.points).to.equal(player1Points);
    expect(state.player2.points).to.equal(player2Points);
});

Then('the score should be {int}-{int} in games', function (
    this: TennisWorld,
    player1Games: number,
    player2Games: number
) {
    const state = this.getState();
    expect(state.player1.games).to.equal(player1Games);
    expect(state.player2.games).to.equal(player2Games);
});

Then('the match should be in a tie-break', function (this: TennisWorld) {
    const state = this.getState();
    expect(state.isTieBreak).to.be.true;
});

Then('the match should not be in a tie-break', function (this: TennisWorld) {
    const state = this.getState();
    expect(state.isTieBreak).to.be.false;
});

Then('player {int} should have won the match', function (this: TennisWorld, player: number) {
    const state = this.getState();
    expect(state.matchWinner).to.equal(player);
});

Then('the match should not be over', function (this: TennisWorld) {
    const state = this.getState();
    expect(state.matchWinner).to.be.null;
});

Then('player {int} should be serving', function (this: TennisWorld, player: number) {
    const state = this.getState();
    expect(state.server).to.equal(player);
});

Then('the past set scores should include {int}-{int}', function (
    this: TennisWorld,
    player1Score: number,
    player2Score: number
) {
    const state = this.getState();
    const found = state.pastSetScores.some(
        (score) => score.player1 === player1Score && score.player2 === player2Score
    );
    expect(found).to.be.true;
});
