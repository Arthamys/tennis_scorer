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

/// Statistics tracked for each player during the match.
export interface PlayerStatistics {
    aces: number; // Serves that are not touched by the opponent
    doubleFaults: number; // Points lost due to double faults
    unforcedErrors: number; // Points _lost_ due to player's own mistakes
    forcedErrors: number; // Points _lost_ due to the opponent pressuring a bad shot
    winners: number; // Points _won_ by playing an unreturnable shot

    // Points won on service games
    pointsWonOnFirstServe: number;
    pointsWonOnSecondServe: number;

    // Points won on return games
    firstServeReturns: number; // Total first serves returned
    secondServeReturns: number; // Total second serves returned
    pointsWonOnFirstServeReturn: number; // Points won when returning a first serve
    pointsWonOnSecondServeReturn: number; // Points won when returning a second serve
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
    scoreHistory: SetScore[];
    matchWinner: 1 | 2 | null;
    isTieBreak: boolean;
}
