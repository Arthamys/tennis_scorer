import { PlayerStatistics, PointMetadata } from './types.js';

export interface ExportMatchDetails {
    setsToWin: number;
    gamesPerSet: number;
    tieBreakPoints: number;
}

export interface ExportPlayers {
    player1: string;
    player2: string;
}

export interface ExportFinalScore {
    player1Sets: number;
    player2Sets: number;
    setScores: Array<{ player1: number; player2: number }>;
    matchWinner: string | null;
}

export interface MatchStatisticsExport {
    $schema: string;
    $id: string;
    generatedAt: string;
    matchDetails: ExportMatchDetails;
    players: ExportPlayers;
    finalScore: ExportFinalScore;
    statistics: {
        player1: PlayerStatistics;
        player2: PlayerStatistics;
    };
}

export interface MatchScoreExport {
    $schema: string;
    $id: string;
    generatedAt: string;
    matchDetails: ExportMatchDetails;
    players: ExportPlayers;
    finalScore: ExportFinalScore;
    pointsHistory: PointMetadata[];
}
