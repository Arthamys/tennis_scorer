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

import { MatchConfig, MatchState, Player, PointMetadata, PlayerStatistics, createEmptyStatistics } from './types.js';

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
            player1Stats: createEmptyStatistics(),
            player2Stats: createEmptyStatistics(),
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
            player1Stats: { ...this.state.player1Stats },
            player2Stats: { ...this.state.player2Stats },
        };
    }

    /**
     * Get statistics for both players
     */
    public getStatistics(): { player1: PlayerStatistics; player2: PlayerStatistics } {
        return {
            player1: { ...this.state.player1Stats },
            player2: { ...this.state.player2Stats },
        };
    }

    /**
     * Score a point with detailed statistics tracking
     */
    public scorePointWithStats(player: 1 | 2, metadata: Omit<PointMetadata, 'winner' | 'server'>): void {
        const currentPlayer = player === 1 ? this.state.player1 : this.state.player2;

        // Check for break point BEFORE incrementing points
        const breakPointInfo = this.checkBreakPointBefore();

        currentPlayer.points++;

        // Create full point metadata
        const fullMetadata: PointMetadata = {
            winner: player,
            server: this.state.server,
            wasBreakPoint: breakPointInfo.isBreakPoint,
            ...metadata
        };

        // Update statistics based on metadata
        this.updateStatistics(fullMetadata);

        // Store in history
        this.state.pointsHistory.push(fullMetadata);

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
            } else {
                // Tie-break server switching: switch on every odd total point
                // Pattern: P1 serves point 1, P2 serves 2-3, P1 serves 4-5, etc.
                const totalPoints = this.state.player1.points + this.state.player2.points;
                if (totalPoints % 2 === 1) {
                    this.switchServer();
                }
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

        // Reverse statistics if the last point has metadata
        const lastPoint = this.state.pointsHistory[this.state.pointsHistory.length - 1];
        if (lastPoint && typeof lastPoint === 'object' && 'winner' in lastPoint) {
            this.reverseStatistics(lastPoint);
        }

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
            player1Stats: createEmptyStatistics(),
            player2Stats: createEmptyStatistics(),
        };
    }

    /**
     * Update statistics based on point metadata
     */
    private updateStatistics(metadata: PointMetadata): void {
        const winner = metadata.winner;
        const loser: 1 | 2 = winner === 1 ? 2 : 1;
        const server = metadata.server;

        const winnerStats = winner === 1 ? this.state.player1Stats : this.state.player2Stats;
        const loserStats = loser === 1 ? this.state.player1Stats : this.state.player2Stats;
        const serverStats = server === 1 ? this.state.player1Stats : this.state.player2Stats;

        // Track serve statistics if provided
        if (metadata.serveResult !== undefined) {
            if (metadata.serveResult === 'first') {
                serverStats.firstServesTotal++;
                serverStats.firstServesIn++;
            } else if (metadata.serveResult === 'second') {
                // A second serve implies a first serve fault occurred
                serverStats.firstServesTotal++;
                serverStats.secondServesTotal++;
                serverStats.secondServesIn++;
            }
        }

        // Track double faults
        if (metadata.pointType === 'double_fault') {
            // Double fault counts both first and second serve attempts
            serverStats.firstServesTotal++;
            serverStats.secondServesTotal++;
            serverStats.doubleFaults++;
        }

        // Track aces
        if (metadata.pointType === 'ace') {
            serverStats.aces++;
            // Aces also count as missed returns for the returner
            if (metadata.serveResult === 'first') {
                loserStats.firstServeMissedReturns++;
            } else if (metadata.serveResult === 'second') {
                loserStats.secondServeMissedReturns++;
            }
        }

        // Track point type statistics
        if (metadata.pointType === 'winner') {
            winnerStats.winners++;
        } else if (metadata.pointType === 'unforced_error') {
            loserStats.unforcedErrors++;
        } else if (metadata.pointType === 'forced_error') {
            loserStats.forcedErrors++;
        } else if (metadata.pointType === 'net') {
            winnerStats.pointsWonAtNet++;
        } else if (metadata.pointType === 'missed_return') {
            // Track missed returns for the returner (loser)
            if (metadata.serveResult === 'first') {
                loserStats.firstServeMissedReturns++;
            } else if (metadata.serveResult === 'second') {
                loserStats.secondServeMissedReturns++;
            }
        }

        // Track points won on serve
        if (winner === server && metadata.serveResult !== undefined) {
            if (metadata.serveResult === 'first') {
                winnerStats.pointsWonOnFirstServe++;
            } else if (metadata.serveResult === 'second') {
                winnerStats.pointsWonOnSecondServe++;
            }
        }

        // Track return statistics (when receiver wins the point)
        if (winner !== server && metadata.serveResult !== undefined) {
            if (metadata.serveResult === 'first') {
                winnerStats.firstServeReturns++;
                winnerStats.pointsWonOnFirstServeReturn++;
            } else if (metadata.serveResult === 'second') {
                winnerStats.secondServeReturns++;
                winnerStats.pointsWonOnSecondServeReturn++;
            }
        } else if (loser !== server && metadata.serveResult !== undefined && metadata.pointType !== 'missed_return') {
            // Loser attempted a return but didn't win (only if they didn't miss the return)
            if (metadata.serveResult === 'first') {
                loserStats.firstServeReturns++;
            } else if (metadata.serveResult === 'second') {
                loserStats.secondServeReturns++;
            }
        }

        // Track break points (for the returner)
        if (metadata.wasBreakPoint) {
            const returner: 1 | 2 = server === 1 ? 2 : 1;
            const returnerStats = returner === 1 ? this.state.player1Stats : this.state.player2Stats;
            returnerStats.breakPointsTotal++;

            // If the returner won this break point, they converted it
            if (winner === returner) {
                returnerStats.breakPointsWon++;
            }
        }
    }

    /**
     * Reverse statistics updates when undoing a point
     */
    private reverseStatistics(metadata: PointMetadata): void {
        const winner = metadata.winner;
        const loser: 1 | 2 = winner === 1 ? 2 : 1;
        const server = metadata.server;

        const winnerStats = winner === 1 ? this.state.player1Stats : this.state.player2Stats;
        const loserStats = loser === 1 ? this.state.player1Stats : this.state.player2Stats;
        const serverStats = server === 1 ? this.state.player1Stats : this.state.player2Stats;

        // Reverse serve statistics if provided
        if (metadata.serveResult !== undefined) {
            if (metadata.serveResult === 'first') {
                serverStats.firstServesTotal = Math.max(0, serverStats.firstServesTotal - 1);
                serverStats.firstServesIn = Math.max(0, serverStats.firstServesIn - 1);
            } else if (metadata.serveResult === 'second') {
                // Also reverse the implied first serve fault
                serverStats.firstServesTotal = Math.max(0, serverStats.firstServesTotal - 1);
                serverStats.secondServesTotal = Math.max(0, serverStats.secondServesTotal - 1);
                serverStats.secondServesIn = Math.max(0, serverStats.secondServesIn - 1);
            }
        }

        // Reverse double faults
        if (metadata.pointType === 'double_fault') {
            serverStats.firstServesTotal = Math.max(0, serverStats.firstServesTotal - 1);
            serverStats.secondServesTotal = Math.max(0, serverStats.secondServesTotal - 1);
            serverStats.doubleFaults = Math.max(0, serverStats.doubleFaults - 1);
        }

        // Reverse aces
        if (metadata.pointType === 'ace') {
            serverStats.aces = Math.max(0, serverStats.aces - 1);
            // Also reverse the missed return for the returner
            if (metadata.serveResult === 'first') {
                loserStats.firstServeMissedReturns = Math.max(0, loserStats.firstServeMissedReturns - 1);
            } else if (metadata.serveResult === 'second') {
                loserStats.secondServeMissedReturns = Math.max(0, loserStats.secondServeMissedReturns - 1);
            }
        }

        // Reverse point type statistics
        if (metadata.pointType === 'winner') {
            winnerStats.winners = Math.max(0, winnerStats.winners - 1);
        } else if (metadata.pointType === 'unforced_error') {
            loserStats.unforcedErrors = Math.max(0, loserStats.unforcedErrors - 1);
        } else if (metadata.pointType === 'forced_error') {
            loserStats.forcedErrors = Math.max(0, loserStats.forcedErrors - 1);
        } else if (metadata.pointType === 'net') {
            winnerStats.pointsWonAtNet = Math.max(0, winnerStats.pointsWonAtNet - 1);
        } else if (metadata.pointType === 'missed_return') {
            // Reverse missed returns for the returner (loser)
            if (metadata.serveResult === 'first') {
                loserStats.firstServeMissedReturns = Math.max(0, loserStats.firstServeMissedReturns - 1);
            } else if (metadata.serveResult === 'second') {
                loserStats.secondServeMissedReturns = Math.max(0, loserStats.secondServeMissedReturns - 1);
            }
        }

        // Reverse points won on serve
        if (winner === server && metadata.serveResult !== undefined) {
            if (metadata.serveResult === 'first') {
                winnerStats.pointsWonOnFirstServe = Math.max(0, winnerStats.pointsWonOnFirstServe - 1);
            } else if (metadata.serveResult === 'second') {
                winnerStats.pointsWonOnSecondServe = Math.max(0, winnerStats.pointsWonOnSecondServe - 1);
            }
        }

        // Reverse return statistics
        if (winner !== server && metadata.serveResult !== undefined) {
            if (metadata.serveResult === 'first') {
                winnerStats.firstServeReturns = Math.max(0, winnerStats.firstServeReturns - 1);
                winnerStats.pointsWonOnFirstServeReturn = Math.max(0, winnerStats.pointsWonOnFirstServeReturn - 1);
            } else if (metadata.serveResult === 'second') {
                winnerStats.secondServeReturns = Math.max(0, winnerStats.secondServeReturns - 1);
                winnerStats.pointsWonOnSecondServeReturn = Math.max(0, winnerStats.pointsWonOnSecondServeReturn - 1);
            }
        } else if (loser !== server && metadata.serveResult !== undefined && metadata.pointType !== 'missed_return') {
            if (metadata.serveResult === 'first') {
                loserStats.firstServeReturns = Math.max(0, loserStats.firstServeReturns - 1);
            } else if (metadata.serveResult === 'second') {
                loserStats.secondServeReturns = Math.max(0, loserStats.secondServeReturns - 1);
            }
        }

        // Reverse break point statistics
        if (metadata.wasBreakPoint) {
            const returner: 1 | 2 = server === 1 ? 2 : 1;
            const returnerStats = returner === 1 ? this.state.player1Stats : this.state.player2Stats;
            returnerStats.breakPointsTotal = Math.max(0, returnerStats.breakPointsTotal - 1);

            // If the returner won this break point, reverse the conversion
            if (winner === returner) {
                returnerStats.breakPointsWon = Math.max(0, returnerStats.breakPointsWon - 1);
            }
        }
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

    /**
     * Check if the current state (before a point is scored) is a break point situation.
     * A break point is when the returner can win the game on this point.
     * Break points don't exist during tie-breaks.
     *
     * @returns Object with isBreakPoint flag and which player has the break point opportunity
     */
    private checkBreakPointBefore(): { isBreakPoint: boolean; returner: 1 | 2 } {
        const server = this.state.server;
        const returner: 1 | 2 = server === 1 ? 2 : 1;

        // No break points during tie-breaks
        if (this.state.isTieBreak) {
            return { isBreakPoint: false, returner };
        }

        const serverScore = server === 1 ? this.state.player1.points : this.state.player2.points;
        const returnerScore = returner === 1 ? this.state.player1.points : this.state.player2.points;

        // Break point conditions:
        // 1. Returner has 40 (3+ points) and server has less than 40 (< 3 points)
        // 2. Both at deuce or beyond (both >= 3) and returner has advantage (one more point)
        const isBreakPoint = (returnerScore >= 3 && serverScore < 3) ||
                             (returnerScore >= 3 && serverScore >= 3 && returnerScore === serverScore + 1);

        return { isBreakPoint, returner };
    }
}
