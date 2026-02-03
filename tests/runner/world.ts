import { World, setWorldConstructor } from '@cucumber/cucumber';
import { TennisMatch } from '../../src/scoring/TennisMatch.js';
import { MatchConfig, MatchState, PlayerStatistics, PointMetadata } from '../../src/scoring/types.js';

export class TennisWorld extends World {
    public match: TennisMatch | null = null;
    public lastState: MatchState | null = null;
    public lastStatistics: { player1: PlayerStatistics; player2: PlayerStatistics } | null = null;
    public lastExport: string | null = null;

    createMatch(config?: Partial<MatchConfig>): void {
        this.match = new TennisMatch(config);
        this.updateCachedState();
    }

    scorePoint(
        player: 1 | 2,
        serveResult: 'first' | 'second',
        pointType: PointMetadata['pointType']
    ): void {
        if (!this.match) {
            throw new Error('Match not initialized. Call createMatch() first.');
        }
        this.match.scorePointWithStats(player, { serveResult, pointType });
        this.updateCachedState();
    }

    undoPoint(player: 1 | 2): void {
        if (!this.match) {
            throw new Error('Match not initialized. Call createMatch() first.');
        }
        this.match.removePoint(player);
        this.updateCachedState();
    }

    private updateCachedState(): void {
        if (this.match) {
            this.lastState = this.match.getState();
            this.lastStatistics = this.match.getStatistics();
        }
    }

    getState(): MatchState {
        if (!this.lastState) {
            throw new Error('No match state available.');
        }
        return this.lastState;
    }

    getStatistics(): { player1: PlayerStatistics; player2: PlayerStatistics } {
        if (!this.lastStatistics) {
            throw new Error('No statistics available.');
        }
        return this.lastStatistics;
    }

    getPointsHistory(): PointMetadata[] {
        if (!this.match) {
            throw new Error('Match not initialized.');
        }
        return this.match.getState().pointsHistory;
    }
}

setWorldConstructor(TennisWorld);
