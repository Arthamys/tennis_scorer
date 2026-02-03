import { When, Then } from '@cucumber/cucumber';
import { expect } from 'chai';
import { TennisWorld } from '../world.js';

When('I export the point history', function (this: TennisWorld) {
    const history = this.getPointsHistory();
    this.lastExport = JSON.stringify(history, null, 2);
});

When('I export the match statistics', function (this: TennisWorld) {
    const stats = this.getStatistics();
    this.lastExport = JSON.stringify(stats, null, 2);
});

When('I export the match state', function (this: TennisWorld) {
    const state = this.getState();
    this.lastExport = JSON.stringify(state, null, 2);
});

Then('the export should contain {int} points', function (this: TennisWorld, count: number) {
    if (!this.lastExport) {
        throw new Error('No export available');
    }
    const data = JSON.parse(this.lastExport);
    expect(Array.isArray(data)).to.be.true;
    expect(data.length).to.equal(count);
});

Then('the export should be valid JSON', function (this: TennisWorld) {
    if (!this.lastExport) {
        throw new Error('No export available');
    }
    expect(() => JSON.parse(this.lastExport!)).to.not.throw();
});

Then('the export should contain player {int} statistics', function (
    this: TennisWorld,
    player: number
) {
    if (!this.lastExport) {
        throw new Error('No export available');
    }
    const data = JSON.parse(this.lastExport);
    const playerKey = player === 1 ? 'player1' : 'player2';
    expect(data).to.have.property(playerKey);
});

Then('the exported statistics should show {int} aces for player {int}', function (
    this: TennisWorld,
    aces: number,
    player: number
) {
    if (!this.lastExport) {
        throw new Error('No export available');
    }
    const data = JSON.parse(this.lastExport);
    const playerKey = player === 1 ? 'player1' : 'player2';
    expect(data[playerKey].aces).to.equal(aces);
});

Then('each point in the export should have a winner', function (this: TennisWorld) {
    if (!this.lastExport) {
        throw new Error('No export available');
    }
    const data = JSON.parse(this.lastExport);
    expect(Array.isArray(data)).to.be.true;
    for (const point of data) {
        expect(point).to.have.property('winner');
        expect([1, 2]).to.include(point.winner);
    }
});

Then('each point in the export should have a server', function (this: TennisWorld) {
    if (!this.lastExport) {
        throw new Error('No export available');
    }
    const data = JSON.parse(this.lastExport);
    expect(Array.isArray(data)).to.be.true;
    for (const point of data) {
        expect(point).to.have.property('server');
        expect([1, 2]).to.include(point.server);
    }
});
