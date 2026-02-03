import { Then } from '@cucumber/cucumber';
import { expect } from 'chai';
import { TennisWorld } from '../world.js';
import { calculateFirstServePercentage, calculateSecondServePercentage } from '../../../src/scoring/types.js';

Then(/^player (\d+) should have (\d+) aces?$/, function (
    this: TennisWorld,
    player: string,
    aces: string
) {
    const stats = this.getStatistics();
    const playerStats = parseInt(player) === 1 ? stats.player1 : stats.player2;
    expect(playerStats.aces).to.equal(parseInt(aces));
});

Then(/^player (\d+) should have (\d+) double faults?$/, function (
    this: TennisWorld,
    player: string,
    doubleFaults: string
) {
    const stats = this.getStatistics();
    const playerStats = parseInt(player) === 1 ? stats.player1 : stats.player2;
    expect(playerStats.doubleFaults).to.equal(parseInt(doubleFaults));
});

Then(/^player (\d+) should have (\d+) winners?$/, function (
    this: TennisWorld,
    player: string,
    winners: string
) {
    const stats = this.getStatistics();
    const playerStats = parseInt(player) === 1 ? stats.player1 : stats.player2;
    expect(playerStats.winners).to.equal(parseInt(winners));
});

Then(/^player (\d+) should have (\d+) unforced errors?$/, function (
    this: TennisWorld,
    player: string,
    errors: string
) {
    const stats = this.getStatistics();
    const playerStats = parseInt(player) === 1 ? stats.player1 : stats.player2;
    expect(playerStats.unforcedErrors).to.equal(parseInt(errors));
});

Then(/^player (\d+) should have (\d+) forced errors?$/, function (
    this: TennisWorld,
    player: string,
    errors: string
) {
    const stats = this.getStatistics();
    const playerStats = parseInt(player) === 1 ? stats.player1 : stats.player2;
    expect(playerStats.forcedErrors).to.equal(parseInt(errors));
});

Then('player {int} first serve percentage should be {int}%', function (
    this: TennisWorld,
    player: number,
    percentage: number
) {
    const stats = this.getStatistics();
    const playerStats = player === 1 ? stats.player1 : stats.player2;
    const actualPercentage = calculateFirstServePercentage(playerStats);
    expect(actualPercentage).to.equal(percentage);
});

Then('player {int} second serve percentage should be {int}%', function (
    this: TennisWorld,
    player: number,
    percentage: number
) {
    const stats = this.getStatistics();
    const playerStats = player === 1 ? stats.player1 : stats.player2;
    const actualPercentage = calculateSecondServePercentage(playerStats);
    expect(actualPercentage).to.equal(percentage);
});

Then('player {int} should have {int} first serves in out of {int} total', function (
    this: TennisWorld,
    player: number,
    servesIn: number,
    total: number
) {
    const stats = this.getStatistics();
    const playerStats = player === 1 ? stats.player1 : stats.player2;
    expect(playerStats.firstServesIn).to.equal(servesIn);
    expect(playerStats.firstServesTotal).to.equal(total);
});

Then('player {int} should have {int} points won at net', function (
    this: TennisWorld,
    player: number,
    points: number
) {
    const stats = this.getStatistics();
    const playerStats = player === 1 ? stats.player1 : stats.player2;
    expect(playerStats.pointsWonAtNet).to.equal(points);
});

Then(/^player (\d+) should have (\d+) break points? won out of (\d+)$/, function (
    this: TennisWorld,
    player: string,
    won: string,
    total: string
) {
    const stats = this.getStatistics();
    const playerStats = parseInt(player) === 1 ? stats.player1 : stats.player2;
    expect(playerStats.breakPointsWon).to.equal(parseInt(won));
    expect(playerStats.breakPointsTotal).to.equal(parseInt(total));
});

Then('player {int} should have {int} points won on first serve', function (
    this: TennisWorld,
    player: number,
    points: number
) {
    const stats = this.getStatistics();
    const playerStats = player === 1 ? stats.player1 : stats.player2;
    expect(playerStats.pointsWonOnFirstServe).to.equal(points);
});

Then('player {int} should have {int} points won on second serve', function (
    this: TennisWorld,
    player: number,
    points: number
) {
    const stats = this.getStatistics();
    const playerStats = player === 1 ? stats.player1 : stats.player2;
    expect(playerStats.pointsWonOnSecondServe).to.equal(points);
});
