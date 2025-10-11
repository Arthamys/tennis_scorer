/**
 * SCORING PACKAGE - TENNIS MATCH ENGINE
 *
 * This package contains the pure tennis match scoring logic with no UI dependencies.
 * It can be used programmatically to simulate matches, play points from files,
 * or integrate with any display system.
 *
 * Responsibilities:
 * - Manage match state (points, games, sets)
 * - Apply official tennis scoring rules (deuce, advantage, tie-breaks)
 * - Determine game/set/match winners
 * - Track score history
 * - Provide read-only access to current match state
 *
 * NO DOM/HTML dependencies - pure TypeScript logic only.
 */

import { MatchConfig, MatchState, Player } from './types.js';

export class TennisMatch {
    private state: MatchState;
    private config: MatchConfig;

    constructor(config?: Partial<MatchConfig>) {
        this.config = {
            gamesPerSet: 6,
            setsToWin: 2,
            theme: 'default',
            tieBreakPoints: 7,
            ...config
        };

        this.state = {
            player1: new Player(),
            player2: new Player(),
            pastSetScores: [],
            server: 1,
            matchWinner: null,
            isTieBreak: false,
            pointsHistory: [],
        };
    }

    /**
     * Get the current match configuration
     */
    public getConfig(): MatchConfig {
        return { ...this.config };
    }

    /**
     * Update match configuration
     */
    public updateConfig(newConfig: Partial<MatchConfig>): void {
        this.config = { ...this.config, ...newConfig };
    }

    /**
     * Get the current match state (read-only copy)
     */
    public getState(): MatchState {
        return {
            player1: { ...this.state.player1 },
            player2: { ...this.state.player2 },
            server: this.state.server,
            pastSetScores: [...this.state.pastSetScores],
            matchWinner: this.state.matchWinner,
            isTieBreak: this.state.isTieBreak,
            pointsHistory: [...this.state.pointsHistory],
        };
    }

    /**
     * Score a point for the specified player
     */
    public scorePoint(player: 1 | 2): void {
        const currentPlayer = player === 1 ? this.state.player1 : this.state.player2;

        currentPlayer.points++;
        this.state.pointsHistory.push(player);

        if (this.state.matchWinner) return;

        // Check if we should enter tie-break mode
        if (!this.state.isTieBreak && this.shouldEnterTieBreak()) {
            this.state.isTieBreak = true;
            this.state.player1.points = 0;
            this.state.player2.points = 0;
            currentPlayer.points = 1; // The current point scored starts the tie-break
        }

        // Check for game/set win
        if (this.state.isTieBreak) {
            // Tie-break win
            if (this.checkSetWin(player)) {
                currentPlayer.sets++;
                // In tie-break, the final score includes the tie-break result
                const finalSetScore = {
                    player1: this.state.player1.games + (player === 1 ? 1 : 0),
                    player2: this.state.player2.games + (player === 2 ? 1 : 0)
                };
                this.state.pastSetScores.push(finalSetScore);

                if (this.checkMatchWin(player)) {
                    this.state.matchWinner = player;
                    return;
                }

                // Reset for next set
                this.state.player1.games = 0;
                this.state.player2.games = 0;
                this.state.player1.points = 0;
                this.state.player2.points = 0;
                this.state.isTieBreak = false;
            }
        } else {
            // Regular game win
            if (this.checkGameWin(player)) {
                currentPlayer.games++;
                this.state.player1.points = 0;
                this.state.player2.points = 0;
                this.switchServer();

                if (this.checkSetWin(player)) {
                    currentPlayer.sets++;
                    const finalSetScore = {
                        player1: this.state.player1.games,
                        player2: this.state.player2.games
                    };
                    this.state.pastSetScores.push(finalSetScore);
                    this.state.player1.games = 0;
                    this.state.player2.games = 0;

                    if (this.checkMatchWin(player)) {
                        this.state.matchWinner = player;
                    }
                }
            }
        }
    }

    /**
     * Remove a point from the specified player (undo functionality)
     */
    public removePoint(player: 1 | 2): void {
        if (this.state.matchWinner) return;

        const currentPlayer = player === 1 ? this.state.player1 : this.state.player2;

        if (currentPlayer.points > 0) {
            currentPlayer.points--;
        } else if (currentPlayer.games > 0) {
            currentPlayer.games--;
            this.state.player1.points = 3;
            this.state.player2.points = 3;
            this.switchServer();
        } else if (currentPlayer.sets > 0) {
            currentPlayer.sets--;
            this.state.player1.games = 5;
            this.state.player2.games = 5;
            this.state.player1.points = 3;
            this.state.player2.points = 3;
        }
        this.state.pointsHistory.pop();
    }

    /**
     * Reset the match to initial state
     */
    public reset(): void {
        this.state = {
            player1: new Player(),
            player2: new Player(),
            pastSetScores: [],
            server: 1,
            matchWinner: null,
            isTieBreak: false,
            pointsHistory: [],
        };
    }

    /**
     * Check if a player has won the current game
     */
    private checkGameWin(player: 1 | 2): boolean {
        const currentPlayer = player === 1 ? this.state.player1 : this.state.player2;
        const opponent = player === 1 ? this.state.player2 : this.state.player1;

        if (currentPlayer.points >= 4 && currentPlayer.points >= opponent.points + 2) {
            return true;
        }
        return false;
    }

    /**
     * Check if a player has won the current set
     */
    private checkSetWin(player: 1 | 2): boolean {
        const currentPlayer = player === 1 ? this.state.player1 : this.state.player2;
        const opponent = player === 1 ? this.state.player2 : this.state.player1;

        // Regular set win (win by 2, up to 6 games, or 7-5)
        if (currentPlayer.games >= this.config.gamesPerSet && currentPlayer.games >= opponent.games + 2) {
            return true;
        }

        // Tie-break win condition
        if (this.state.isTieBreak) {
            const pointsNeeded = this.isDecidingSet() ? 10 : this.config.tieBreakPoints;
            return currentPlayer.points >= pointsNeeded && currentPlayer.points >= opponent.points + 2;
        }

        return false;
    }

    /**
     * Check if a player has won the match
     */
    private checkMatchWin(player: 1 | 2): boolean {
        const currentPlayer = player === 1 ? this.state.player1 : this.state.player2;
        return currentPlayer.sets >= this.config.setsToWin;
    }

    /**
     * Check if match should enter tie-break mode
     */
    private shouldEnterTieBreak(): boolean {
        return (this.state.player1.games === this.config.gamesPerSet &&
            this.state.player2.games === this.config.gamesPerSet) || this.isDecidingSet();
    }

    /**
     * Check if current set is the deciding set
     */
    private isDecidingSet(): boolean {
        // This is the deciding set if both players are one set away from winning
        return this.state.player1.sets === Math.max(this.config.setsToWin - 1, 1) &&
            this.state.player2.sets === Math.max(this.config.setsToWin - 1, 1);
    }

    /**
     * Switch server between players
     */
    private switchServer(): void {
        this.state.server = this.state.server === 1 ? 2 : 1;
    }
}
