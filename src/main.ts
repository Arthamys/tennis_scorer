/**
 * MAIN APPLICATION - ENTRY POINT
 *
 * This is the entry point for the tennis scorer application.
 * It initializes the ScoreKeeper and exposes global functions for HTML event handlers.
 *
 * Responsibilities:
 * - Initialize the ScoreKeeper orchestrator
 * - Expose global event handler functions for HTML buttons
 * - Handle player name editing functionality
 */

import { ScoreKeeper } from './ScoreKeeper.js';

// Initialize the scorer
const scorer = new ScoreKeeper();

// Expose scorer globally for settings modal access
(window as any).scorer = scorer;

// Global functions for button clicks
function scorePoint(player: 1 | 2): void {
    // Check if detailed stats mode is enabled
    const detailedStatsMode = localStorage.getItem('detailedStatsMode') === 'true';

    if (detailedStatsMode) {
        // Open stat input modal
        (window as any).openStatInputModal(player);
    } else {
        // Score directly without stats
        scorer.scorePoint(player);
    }
}

function removePoint(player: 1 | 2): void {
    scorer.removePoint(player);
}

function resetMatch(): void {
    scorer.resetMatch();
}

function updateMatchSettings(): void {
    scorer.updateMatchSettings();
}

function updateTheme(): void {
    scorer.updateTheme();
}

function buildScoreCards(): void {
    scorer.buildScoreCards();
}

function editPlayerName(player: 1 | 2): void {
    const span = document.getElementById(`player${player}NameSpan`) as HTMLSpanElement;
    const input = document.getElementById(`player${player}NameInput`) as HTMLInputElement;

    if (span && input) {
        input.value = span.textContent || '';
        span.style.display = 'none';
        input.style.display = 'inline';
        input.focus();
        input.select();
    }
}

function savePlayerName(player: 1 | 2): void {
    const span = document.getElementById(`player${player}NameSpan`) as HTMLSpanElement;
    const input = document.getElementById(`player${player}NameInput`) as HTMLInputElement;

    if (span && input) {
        const newName = input.value.trim() || `Player ${player}`;
        span.textContent = newName;

        input.style.display = 'none';
        span.style.display = 'inline';

        // Update the controls as well
        const controlElement = document.getElementById(`player${player}Control`);
        if (controlElement) {
            controlElement.textContent = newName;
        }
    }
}

function handleNameKeydown(event: KeyboardEvent, player: 1 | 2): void {
    if (event.key === 'Enter') {
        event.preventDefault();
        (event.target as HTMLInputElement).blur();
    } else if (event.key === 'Escape') {
        event.preventDefault();
        const span = document.getElementById(`player${player}NameSpan`) as HTMLSpanElement;
        const input = document.getElementById(`player${player}NameInput`) as HTMLInputElement;

        if (span && input) {
            input.style.display = 'none';
            span.style.display = 'inline';
        }
    }
}

// Expose functions globally for HTML onclick handlers
(window as any).scorePoint = scorePoint;
(window as any).removePoint = removePoint;
(window as any).resetMatch = resetMatch;
(window as any).updateMatchSettings = updateMatchSettings;
(window as any).updateTheme = updateTheme;
(window as any).editPlayerName = editPlayerName;
(window as any).savePlayerName = savePlayerName;
(window as any).handleNameKeydown = handleNameKeydown;
(window as any).buildScoreCards = buildScoreCards;

// Keyboard shortcuts for scoring
document.addEventListener('keydown', (event: KeyboardEvent) => {
    // Ignore keystrokes when typing in input fields
    const target = event.target as HTMLElement;
    if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
        return;
    }

    switch (event.key) {
        case '1':
            // Add point to player 1
            scorePoint(1);
            break;
        case '2':
            // Add point to player 2
            scorePoint(2);
            break;
        case '!':
            // Remove point from player 1 (Shift + 1)
            removePoint(1);
            break;
        case '@':
            // Remove point from player 2 (Shift + 2)
            removePoint(2);
            break;
    }
});
