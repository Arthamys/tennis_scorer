/**
 * DISPLAY PACKAGE - TENNIS DISPLAY RENDERER
 *
 * This package handles rendering tennis match state to HTML elements.
 * It is completely decoupled from the scoring logic and only concerns itself
 * with visual representation.
 *
 * Responsibilities:
 * - Render match state to DOM elements
 * - Apply and manage visual themes
 * - Update scoreboard display (points, games, sets)
 * - Show/hide winner announcements
 * - Format score displays (e.g., "0", "15", "30", "40", "AD")
 *
 * Dependencies: Requires scoring package types for MatchState interface.
 */

import { MatchState, MatchConfig, calculateFirstServePercentage, calculateSecondServePercentage } from '../scoring/index.js';

export class TennisDisplayRenderer {
    private themes: { [key: string]: { bg: string, text: string } };

    constructor() {
        this.themes = {
            default: {
                bg: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                text: 'white'
            },
            sunset: {
                bg: 'linear-gradient(135deg, #ff7e5f 0%, #feb47b 100%)',
                text: 'white'
            },
            forest: {
                bg: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
                text: 'white'
            },
            royal: {
                bg: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                text: 'white'
            },
            dark: {
                bg: 'linear-gradient(135deg, #2c3e50 0%, #34495e 100%)',
                text: 'white'
            }
        };
    }

    /**
     * Render the complete match state to the DOM
     */
    public render(state: MatchState, config: MatchConfig): void {
        this.updateGameScores(state);
        this.updateCurrentGames(state);
        this.updateSetHistory(state, config);
        this.updateServerIndicator(state);
        this.updateWinnerDisplay(state);
        this.updateStatistics(state);
    }

    /**
     * Apply a visual theme to the page
     */
    public applyTheme(themeName: string): void {
        const theme = this.themes[themeName];
        if (theme) {
            document.documentElement.style.setProperty('--bg-gradient', theme.bg);
            document.documentElement.style.setProperty('--text-color', theme.text);
        }
    }

    /**
     * Update game scores (points) display
     */
    private updateGameScores(state: MatchState): void {
        const gameScore1El = document.getElementById('gameScore1');
        const gameScore2El = document.getElementById('gameScore2');

        if (gameScore1El) {
            gameScore1El.textContent = this.getGameScoreDisplay(state.player1.points, state.player2.points, state.isTieBreak);
        }
        if (gameScore2El) {
            gameScore2El.textContent = this.getGameScoreDisplay(state.player2.points, state.player1.points, state.isTieBreak);
        }
    }

    /**
     * Update current games display
     */
    private updateCurrentGames(state: MatchState): void {
        const games1El = document.getElementById('games1');
        const games2El = document.getElementById('games2');

        if (games1El) {
            games1El.textContent = state.player1.games.toString();
        }
        if (games2El) {
            games2El.textContent = state.player2.games.toString();
        }
    }

    /**
     * Update server indicator
     */
    private updateServerIndicator(state: MatchState): void {
        const serve1El = document.getElementById('serve1');
        const serve2El = document.getElementById('serve2');

        if (serve1El) {
            serve1El.classList.toggle('active', state.server === 1);
        }
        if (serve2El) {
            serve2El.classList.toggle('active', state.server === 2);
        }
    }

    /**
     * Update winner display
     */
    private updateWinnerDisplay(state: MatchState): void {
        const winnerDiv = document.getElementById('winner');

        if (!winnerDiv) return;

        if (state.matchWinner) {
            const playerNameEl = document.getElementById(`player${state.matchWinner}NameScore`)?.querySelector('span');
            const playerName = playerNameEl?.textContent || `Player ${state.matchWinner}`;
            winnerDiv.textContent = `🏆 ${playerName} Wins the Match! 🏆`;
            winnerDiv.style.display = 'block';
        } else {
            winnerDiv.style.display = 'none';
        }
    }

    /**
     * Update set history headers and cells
     */
    private updateSetHistory(state: MatchState, config: MatchConfig): void {
        // Update set headers
        const setHeadersContainer = document.getElementById('set-headers-container');
        if (setHeadersContainer) {
            setHeadersContainer.innerHTML = '';

            for (let i = 0; i < config.setsToWin; i++) {
                const headerDiv = document.createElement('div');
                headerDiv.textContent = `Set ${i + 1}`;
                setHeadersContainer.appendChild(headerDiv);
            }
        }

        // Update player 1 set history
        const player1SetsContainer = document.getElementById('player1-sets-container');
        if (player1SetsContainer) {
            player1SetsContainer.innerHTML = '';

            for (let i = 0; i < config.setsToWin; i++) {
                const setCell = document.createElement('div');
                if (i < state.pastSetScores.length) {
                    // Completed set
                    setCell.className = 'score-cell';
                    setCell.textContent = state.pastSetScores[i].player1.toString();
                } else {
                    // Empty set
                    setCell.className = 'score-cell empty-set';
                    setCell.textContent = '-';
                }
                player1SetsContainer.appendChild(setCell);
            }
        }

        // Update player 2 set history
        const player2SetsContainer = document.getElementById('player2-sets-container');
        if (player2SetsContainer) {
            player2SetsContainer.innerHTML = '';

            for (let i = 0; i < config.setsToWin; i++) {
                const setCell = document.createElement('div');
                if (i < state.pastSetScores.length) {
                    // Completed set
                    setCell.className = 'score-cell';
                    setCell.textContent = state.pastSetScores[i].player2.toString();
                } else {
                    // Empty set
                    setCell.className = 'score-cell empty-set';
                    setCell.textContent = '-';
                }
                player2SetsContainer.appendChild(setCell);
            }
        }
    }

    /**
     * Format a game score for display (0, 15, 30, 40, AD, or tie-break points)
     */
    private getGameScoreDisplay(score: number, opponentScore: number, isTieBreak: boolean): string {
        // In tie-break, show actual points
        if (isTieBreak) {
            return score.toString();
        }

        // Regular game scoring
        if (score >= 3 && opponentScore >= 3) {
            if (score === opponentScore) return "40";
            return score > opponentScore ? "AD" : "40";
        }

        const scoreMap: { [key: number]: string } = {
            0: "0", 1: "15", 2: "30", 3: "40"
        };
        return scoreMap[score] || "0";
    }

    /**
     * Update statistics display
     */
    private updateStatistics(state: MatchState): void {
        // Update player names in stats headers
        const player1NameEl = document.getElementById('player1NameSpan');
        const player2NameEl = document.getElementById('player2NameSpan');
        const statsPlayer1HeaderEl = document.getElementById('statsPlayer1Header');
        const statsPlayer2HeaderEl = document.getElementById('statsPlayer2Header');

        if (statsPlayer1HeaderEl && player1NameEl) {
            statsPlayer1HeaderEl.textContent = player1NameEl.textContent || 'Player 1';
        }
        if (statsPlayer2HeaderEl && player2NameEl) {
            statsPlayer2HeaderEl.textContent = player2NameEl.textContent || 'Player 2';
        }

        // Update Player 1 statistics
        const p1Stats = state.player1Stats;
        const firstServe1 = calculateFirstServePercentage(p1Stats);
        const secondServe1 = calculateSecondServePercentage(p1Stats);

        this.updateStatElement('stat-firstServe-1',
            `${firstServe1}% (${p1Stats.firstServesIn}/${p1Stats.firstServesTotal})`);
        this.updateStatElement('stat-secondServe-1',
            `${secondServe1}% (${p1Stats.secondServesIn}/${p1Stats.secondServesTotal})`);
        this.updateStatElement('stat-aces-1', p1Stats.aces.toString());
        this.updateStatElement('stat-doubleFaults-1', p1Stats.doubleFaults.toString());
        this.updateStatElement('stat-winners-1', p1Stats.winners.toString());
        this.updateStatElement('stat-unforcedErrors-1', p1Stats.unforcedErrors.toString());
        this.updateStatElement('stat-forcedErrors-1', p1Stats.forcedErrors.toString());
        this.updateStatElement('stat-netPoints-1', p1Stats.pointsWonAtNet.toString());

        // Update Player 2 statistics
        const p2Stats = state.player2Stats;
        const firstServe2 = calculateFirstServePercentage(p2Stats);
        const secondServe2 = calculateSecondServePercentage(p2Stats);

        this.updateStatElement('stat-firstServe-2',
            `${firstServe2}% (${p2Stats.firstServesIn}/${p2Stats.firstServesTotal})`);
        this.updateStatElement('stat-secondServe-2',
            `${secondServe2}% (${p2Stats.secondServesIn}/${p2Stats.secondServesTotal})`);
        this.updateStatElement('stat-aces-2', p2Stats.aces.toString());
        this.updateStatElement('stat-doubleFaults-2', p2Stats.doubleFaults.toString());
        this.updateStatElement('stat-winners-2', p2Stats.winners.toString());
        this.updateStatElement('stat-unforcedErrors-2', p2Stats.unforcedErrors.toString());
        this.updateStatElement('stat-forcedErrors-2', p2Stats.forcedErrors.toString());
        this.updateStatElement('stat-netPoints-2', p2Stats.pointsWonAtNet.toString());
    }

    /**
     * Helper to update a stat element's text content
     */
    private updateStatElement(id: string, value: string): void {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = value;
        }
    }
}
