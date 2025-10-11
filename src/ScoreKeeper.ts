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

import { TennisMatch, MatchConfig } from './scoring/index.js';
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
     * Score a point for the specified player
     */
    public scorePoint(player: 1 | 2): void {
        this.match.scorePoint(player);
        this.updateDisplay();
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
        let pointsHistory = state.pointsHistory;
        if (pointsHistory.length === 0) {
            console.log("No points to replay");
            return; // No points to replay
        }
        console.log("Points history: ", pointsHistory);
        const zip = new JSZip();

        // Start a fresh match before replaying the points
        this.resetMatch();
        const first_card = await this.generateScoreCard();
        zip.file("000_scorecard_match_opener.png", first_card);
        for (let i = 0; i < pointsHistory.length; i++) {
            await sleep(250);
            this.scorePoint(pointsHistory[i]);
            this.updateDisplay();
            let currentSet = state.pastSetScores.length + 1;
            let currentGame = state.player1.games + this.match.getState().player2.games + 1;
            let currentPoint = state.player1.points + this.match.getState().player2.points;
            let frame = (i + 1).toString().padStart(3, '0');
            const scorecard = this.generateScoreCard();
            zip.file(frame + "_set_" + currentSet + "_game_" + currentGame + "_point_" + currentPoint + ".png", scorecard)
        }
        // Generate and download single ZIP file
        const zipBlob = await zip.generateAsync({ type: 'blob' });
        saveAs(zipBlob, 'score_cards.zip');
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
}
