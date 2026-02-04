/**
 * MAIN APPLICATION - SCORE KEEPER ORCHESTRATOR
 *
 * This is the main application layer that orchestrates the scoring engine
 * and display renderer. It acts as the bridge between user interactions
 * and the underlying packages.
 *
 * Responsibilities:
 * - Coordinate between TennisMatch (scoring) and TennisDisplayRenderer (display)
 * - Handle configuration updates
 * - Provide a unified interface for the UI to interact with
 * - Manage the update cycle (score → render)
 *
 * Dependencies:
 * - scoring package: For match logic and state management
 * - display package: For rendering match state to HTML
 */

import { TennisMatch, MatchConfig, PointMetadata, MatchStatisticsExport, MatchScoreExport } from './scoring/index.js';
import { TennisDisplayRenderer } from './display/index.js';
import domtoimage from 'dom-to-image';
import { saveAs } from 'file-saver';
import JSZip from 'jszip';

export class ScoreKeeper {
    private match: TennisMatch;
    private renderer: TennisDisplayRenderer;

    constructor() {
        this.match = new TennisMatch();
        this.renderer = new TennisDisplayRenderer();

        this.updateDisplay();
        this.applyTheme();
    }

    /**
     * Get the current match configuration
     */
    public getConfig(): MatchConfig {
        return this.match.getConfig();
    }

    /**
     * Update match configuration
     */
    public updateConfig(newConfig: Partial<MatchConfig>): void {
        this.match.updateConfig(newConfig);
        this.applyTheme();
        this.updateDisplay();
    }

    /**
     * Score a point with detailed statistics
     */
    public scorePointWithStats(player: 1 | 2, metadata: Omit<PointMetadata, 'winner' | 'server'>): void {
        this.match.scorePointWithStats(player, metadata);
        this.updateDisplay();
    }

    /**
     * Get match statistics (for testing/advanced use)
     */
    public getStatistics(): any {
        return this.match.getStatistics();
    }

    /**
     * Get the current server (1 or 2)
     */
    public getServer(): 1 | 2 {
        return this.match.getState().server;
    }

    /**
     * Remove a point from the specified player (undo)
     */
    public removePoint(player: 1 | 2): void {
        this.match.removePoint(player);
        this.updateDisplay();
    }

    /**
     * Reset the match to initial state
     */
    public resetMatch(): void {
        this.match.reset();
        this.updateDisplay();
    }

    /**
     * Update match settings from DOM elements
     */
    public updateMatchSettings(): void {
        const gamesSelect = document.getElementById('gamesPerSet') as HTMLSelectElement;
        const setsSelect = document.getElementById('setsToWin') as HTMLSelectElement;

        if (gamesSelect && setsSelect) {
            this.updateConfig({
                gamesPerSet: parseInt(gamesSelect.value),
                setsToWin: parseInt(setsSelect.value)
            });
        }
    }

    /**
     * Update theme from DOM element
     */
    public updateTheme(): void {
        const themeSelect = document.getElementById('bgTheme') as HTMLSelectElement;
        if (themeSelect) {
            this.updateConfig({ theme: themeSelect.value });
        }
    }

    /**
     * Generate the score card of every point in the game
     */
    public async buildScoreCards(): Promise<void> {
        const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
        const state = this.match.getState();
        // save the points played in the match.
        const pointsHistory = state.pointsHistory;
        if (pointsHistory.length === 0) {
            console.log("No points to replay");
            return; // No points to replay
        }
        console.log("Points history: ", pointsHistory);
        const zip = new JSZip();

        // Show progress bar
        const progressContainer = document.getElementById("progressContainer");
        const progressBar = document.getElementById("progressBar");
        const progressText = document.getElementById("progressText");
        if (progressContainer) {
            progressContainer.style.display = "block";
        }
        this.updateProgress(0, pointsHistory.length, progressBar, progressText);

        // Expand stats panel before export and track original state
        const statsPanel = document.getElementById("statsPanel");
        const wasExpanded = statsPanel?.classList.contains("expanded") ?? false;
        if (statsPanel && !wasExpanded) {
            statsPanel.classList.add("expanded");
        }

        // Create subfolders for organization
        const pointsFolder = zip.folder("points");
        const statisticsFolder = zip.folder("statistics");

        // Start a fresh match before replaying the points
        this.resetMatch();
        const first_card = await this.generateScoreCard();
        pointsFolder?.file("000_match_opener.png", first_card);
        const first_stats = await this.generateStatsCard();
        statisticsFolder?.file("000_match_opener.png", first_stats);
        for (let i = 0; i < pointsHistory.length; i++) {
            const state = this.match.getState();
            // Update progress bar
            this.updateProgress(i + 1, pointsHistory.length, progressBar, progressText);

            // Small delay to ensure DOM updates
            await sleep(150);
            // Handle both old format (number) and new format (PointMetadata)
            const point = pointsHistory[i];

            this.scorePointWithStats(point.winner, point);
            const currentSet = state.pastSetScores.length + 1;
            const currentGame = state.player1.games + state.player2.games + 1;
            const currentPoint = state.player1.points + state.player2.points;
            const frame = (i + 1).toString().padStart(3, '0');
            const filename = `${frame}_set_${currentSet}_game_${currentGame}_point_${currentPoint}.png`;
            if (point.pointType === 'double_fault') {
                continue; // Skip scorecard for double faults
            }
            const scorecard = await this.generateScoreCard();
            pointsFolder?.file(filename, scorecard);
            const statscard = await this.generateStatsCard();
            statisticsFolder?.file(filename, statscard);
        }

        // Add JSON export files to root
        const matchStatistics = this.generateMatchStatistics();
        const matchScore = this.generateMatchScore();
        zip.file('match-statistics.json', JSON.stringify(matchStatistics, null, 2));
        zip.file('match-score.json', JSON.stringify(matchScore, null, 2));

        // Restore stats panel to original state
        if (statsPanel && !wasExpanded) {
            statsPanel.classList.remove("expanded");
        }

        // Hide progress bar
        if (progressContainer) {
            progressContainer.style.display = "none";
        }

        // Generate and download single ZIP file
        const zipBlob = await zip.generateAsync({ type: 'blob' });
        let players = this.getPlayerNames();
        let player1Safe = players.player1.replace(/\s+/g, '_').toLowerCase();
        let player2Safe = players.player2.replace(/\s+/g, '_').toLowerCase();
        saveAs(zipBlob, `${player1Safe}_vs_${player2Safe}.zip`);
    }

    /**
     * Update the progress bar display
     */
    private updateProgress(
        current: number,
        total: number,
        progressBar: HTMLElement | null,
        progressText: HTMLElement | null
    ): void {
        const percentage = Math.round((current / total) * 100);
        if (progressBar) {
            progressBar.style.width = `${percentage}%`;
        }
        if (progressText) {
            progressText.textContent = `${current} / ${total} points (${percentage}%)`;
        }
    }


    /**
     * Apply the current theme
     */
    private applyTheme(): void {
        const config = this.match.getConfig();
        this.renderer.applyTheme(config.theme);
    }

    /**
     * Update the display to reflect current match state
     */
    private updateDisplay(): void {
        const state = this.match.getState();
        const config = this.match.getConfig();
        this.renderer.render(state, config);
    }

    /**
     * Download a png snapshot of the current score display
     */
    private async generateScoreCard(): Promise<Blob> {
        let scoreDisplay = document.getElementById("score-display");
        return domtoimage.toBlob(scoreDisplay as HTMLElement)
    }

    /**
     * Download a png snapshot of the statistics panel
     */
    private async generateStatsCard(): Promise<Blob> {
        const statsPanel = document.getElementById("statsPanel");
        return domtoimage.toBlob(statsPanel as HTMLElement);
    }

    /**
     * Get player names from DOM elements
     */
    private getPlayerNames(): { player1: string; player2: string } {
        const player1NameSpan = document.getElementById('player1NameSpan');
        const player2NameSpan = document.getElementById('player2NameSpan');
        return {
            player1: player1NameSpan?.textContent?.trim() || 'Player 1',
            player2: player2NameSpan?.textContent?.trim() || 'Player 2'
        };
    }

    /**
     * Generate match statistics export object
     */
    private generateMatchStatistics(): MatchStatisticsExport {
        const state = this.match.getState();
        const config = this.match.getConfig();
        const players = this.getPlayerNames();

        const matchWinner = state.matchWinner
            ? (state.matchWinner === 1 ? players.player1 : players.player2)
            : null;

        return {
            $schema: 'https://json-schema.org/draft/2020-12/schema',
            $id: 'match-statistics-schema.json',
            generatedAt: new Date().toISOString(),
            matchDetails: {
                setsToWin: config.setsToWin,
                gamesPerSet: config.gamesPerSet,
                tieBreakPoints: config.tieBreakPoints
            },
            players: players,
            finalScore: {
                player1Sets: state.player1.sets,
                player2Sets: state.player2.sets,
                setScores: state.pastSetScores.map(set => ({
                    player1: set.player1,
                    player2: set.player2
                })),
                matchWinner: matchWinner
            },
            statistics: {
                player1: state.player1Stats,
                player2: state.player2Stats
            }
        };
    }

    /**
     * Generate match score (point history) export object
     */
    private generateMatchScore(): MatchScoreExport {
        const state = this.match.getState();
        const config = this.match.getConfig();
        const players = this.getPlayerNames();

        const matchWinner = state.matchWinner
            ? (state.matchWinner === 1 ? players.player1 : players.player2)
            : null;

        return {
            $schema: 'https://json-schema.org/draft/2020-12/schema',
            $id: 'match-score-schema.json',
            generatedAt: new Date().toISOString(),
            matchDetails: {
                setsToWin: config.setsToWin,
                gamesPerSet: config.gamesPerSet,
                tieBreakPoints: config.tieBreakPoints
            },
            players: players,
            finalScore: {
                player1Sets: state.player1.sets,
                player2Sets: state.player2.sets,
                setScores: state.pastSetScores.map(set => ({
                    player1: set.player1,
                    player2: set.player2
                })),
                matchWinner: matchWinner
            },
            pointsHistory: state.pointsHistory
        };
    }
}
