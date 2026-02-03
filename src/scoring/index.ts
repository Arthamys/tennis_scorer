/**
 * SCORING PACKAGE - EXPORTS
 *
 * This package contains the pure tennis match scoring logic with no UI dependencies.
 * Use this to programmatically manage tennis matches without any display concerns.
 */

export { TennisMatch } from './TennisMatch.js';
export type { MatchConfig, MatchState, PlayerScore, SetScore, PlayerStatistics, PointMetadata } from './types.js';
export { calculateFirstServePercentage, calculateSecondServePercentage, createEmptyStatistics } from './types.js';
export type { MatchStatisticsExport, MatchScoreExport, ExportMatchDetails, ExportPlayers, ExportFinalScore } from './exportTypes.js';
