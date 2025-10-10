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

export class ScoreKeeper {
    private match: TennisMatch;
    private renderer: TennisDisplayRenderer;
    /// A list of socre renders
    //private scoreCards: 

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
        console.log('Scoring point for player', player);
        this.match.scorePoint(player);
        this.updateDisplay();
        this.generateScoreCard();
        console.log("here");
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

    private generateScoreCard(): void {
        const state = this.match.getState();
        const config = this.match.getConfig();
        this.renderer.generateScoreCard(state, config);
    }
}
