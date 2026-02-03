/**
 * SCORING PACKAGE - TYPES
 *
 * This package contains the pure tennis match scoring logic with no UI dependencies.
 * It can be used programmatically to simulate matches, play points from files,
 * or integrate with any display system.
 *
 * Responsibilities:
 * - Define all match-related types and interfaces
 * - Provide type safety for match state and configuration
 */

/// Configuration for a tennis match
export interface MatchConfig {
    gamesPerSet: number;
    setsToWin: number;
    theme: string;
    tieBreakPoints: number; // 7 for regular tie-break, 10 for super tie-break
}

/// Metadata about how a point was won
export interface PointMetadata {
    winner: 1 | 2; // Which player won the point
    server: 1 | 2; // Who was serving
    serveResult: 'first' | 'second'; // Which serve landed (required)
    pointType: 'ace' | 'double_fault' | 'winner' | 'unforced_error' | 'forced_error' | 'net' | 'missed_return'; // How the point ended (required)
    wasBreakPoint?: boolean; // Automatically set: whether this point was a break point opportunity for the returner
}

/// Statistics tracked for each player during the match.
export interface PlayerStatistics {
    // Serve statistics
    firstServesIn: number; // Successful first serves
    firstServesTotal: number; // Total first serve attempts
    secondServesIn: number; // Successful second serves
    secondServesTotal: number; // Total second serve attempts
    aces: number; // Serves that are not touched by the opponent
    doubleFaults: number; // Points lost due to double faults

    // Point outcome statistics
    unforcedErrors: number; // Points _lost_ due to player's own mistakes
    forcedErrors: number; // Points _lost_ due to the opponent pressuring a bad shot
    winners: number; // Points _won_ by playing an unreturnable shot
    pointsWonAtNet: number; // Points won by playing at the net

    // Points won on service games
    pointsWonOnFirstServe: number;
    pointsWonOnSecondServe: number;

    // Points won on return games
    firstServeReturns: number; // Total first serves returned
    secondServeReturns: number; // Total second serves returned
    pointsWonOnFirstServeReturn: number; // Points won when returning a first serve
    pointsWonOnSecondServeReturn: number; // Points won when returning a second serve

    // Missed returns
    firstServeMissedReturns: number; // Returns missed on first serve
    secondServeMissedReturns: number; // Returns missed on second serve

    // Break points (as returner)
    breakPointsWon: number; // Break points converted (won the point)
    breakPointsTotal: number; // Total break point opportunities faced
}

/// Helper functions to calculate percentages from statistics
export function calculateFirstServePercentage(stats: PlayerStatistics): number {
    if (stats.firstServesTotal === 0) return 0;
    return Math.round((stats.firstServesIn / stats.firstServesTotal) * 100);
}

export function calculateSecondServePercentage(stats: PlayerStatistics): number {
    if (stats.secondServesTotal === 0) return 0;
    return Math.round((stats.secondServesIn / stats.secondServesTotal) * 100);
}

/// Create an empty statistics object
export function createEmptyStatistics(): PlayerStatistics {
    return {
        firstServesIn: 0,
        firstServesTotal: 0,
        secondServesIn: 0,
        secondServesTotal: 0,
        aces: 0,
        doubleFaults: 0,
        unforcedErrors: 0,
        forcedErrors: 0,
        winners: 0,
        pointsWonAtNet: 0,
        pointsWonOnFirstServe: 0,
        pointsWonOnSecondServe: 0,
        firstServeReturns: 0,
        secondServeReturns: 0,
        pointsWonOnFirstServeReturn: 0,
        pointsWonOnSecondServeReturn: 0,
        firstServeMissedReturns: 0,
        secondServeMissedReturns: 0,
        breakPointsWon: 0,
        breakPointsTotal: 0,
    };
}

/// The score for a player
export interface PlayerScore {
    points: number;
    games: number;
    sets: number;

    /// Score a point for the player
    scorePoint(): void;
    /// Score a game for the player, resetting points
    scoreGame(): void;
    /// Score a set for the player, resetting games and points
    scoreSet(): void;
    /// Reset points and games for the next set
    nextSet(): void;
}

export class Player implements PlayerScore {
    points: number;
    games: number;
    sets: number;

    constructor() {
        this.points = 0;
        this.games = 0;
        this.sets = 0;
    }

    /// Reset points and games for the next set
    nextSet(): void {
        this.points = 0;
        this.games = 0;
    }

    scoreGame(): void {
        this.games += 1;
        this.points = 0; // Reset points after winning a game
    }

    scorePoint(): void {
        this.points += 1;
    }

    scoreSet(): void {
        this.sets += 1;
        this.nextSet();
    }
}

/// Score of a completed set. Used to track the match history.
export interface SetScore {
    player1: number;
    player2: number;
}

/// The complete state of a tennis match
export interface MatchState {
    player1: PlayerScore;
    player2: PlayerScore;
    server: 1 | 2;
    pastSetScores: SetScore[];
    matchWinner: 1 | 2 | null;
    isTieBreak: boolean;
    pointsHistory: Array<PointMetadata>;
    player1Stats: PlayerStatistics;
    player2Stats: PlayerStatistics;
}
