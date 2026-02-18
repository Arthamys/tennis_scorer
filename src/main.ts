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
    confirmPoint(player);
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

// Keyboard-driven scoring state
let selectedServe: 'first' | 'second' | null = null;
let selectedPointType: string | null = null;
let rallyCounter = 0;

const POINT_TYPE_KEYS: Record<string, string> = {
    'w': 'winner',
    'u': 'unforced_error',
    'e': 'forced_error',
    'n': 'net',
};

const POINT_TYPE_LABELS: Record<string, string> = {
    'winner': 'Winner',
    'unforced_error': 'Unforced Err',
    'forced_error': 'Forced Err',
    'net': 'Net Point',
    'ace': 'Ace',
    'missed_return': 'Missed Return',
};

function clearState(): void {
    selectedServe = null;
    selectedPointType = null;
    rallyCounter = 0;
    updateStateDisplay();
}

function updateStateDisplay(): void {
    const serveEl = document.getElementById('serveState');
    const rallyEl = document.getElementById('rallyState');
    const typeEl = document.getElementById('pointTypeState');

    if (serveEl) {
        serveEl.textContent = selectedServe ? `Serve: ${selectedServe === 'first' ? '1st' : '2nd'}` : 'Serve: —';
        serveEl.classList.toggle('selected', selectedServe !== null);
        serveEl.classList.toggle('second-serve', selectedServe === 'second');
    }
    if (rallyEl) {
        rallyEl.textContent = `Rally: ${rallyCounter}`;
        rallyEl.classList.toggle('selected', rallyCounter > 0);
    }
    if (typeEl) {
        typeEl.textContent = selectedPointType ? `Type: ${POINT_TYPE_LABELS[selectedPointType] || selectedPointType}` : 'Type: —';
        typeEl.classList.toggle('selected', selectedPointType !== null);
    }

    // Update serve indicator dots next to player names
    const serve1 = document.getElementById('serve1');
    const serve2 = document.getElementById('serve2');
    if (serve1) serve1.classList.toggle('second-serve', selectedServe === 'second');
    if (serve2) serve2.classList.toggle('second-serve', selectedServe === 'second');
}

function shakeElement(id: string): void {
    const el = document.getElementById(id);
    if (el) {
        el.classList.remove('error');
        // Force reflow to restart animation
        void el.offsetWidth;
        el.classList.add('error');
        setTimeout(() => el.classList.remove('error'), 600);
    }
}

function confirmPoint(player: 1 | 2): void {
    // Validate serve type
    if (!selectedServe) {
        shakeElement('serveState');
        return;
    }
    // Validate point type
    if (!selectedPointType) {
        shakeElement('pointTypeState');
        return;
    }
    const metadata: any = {
        serveResult: selectedServe,
        pointType: selectedPointType,
    };
    if (rallyCounter > 0) {
        metadata.rallyLength = rallyCounter;
    }

    scorer.scorePointWithStats(player, metadata);
    clearState();
}

function handleAce(): void {
    if (!selectedServe) {
        shakeElement('serveState');
        return;
    }
    const server = scorer.getServer();
    scorer.scorePointWithStats(server, {
        serveResult: selectedServe,
        pointType: 'ace',
        rallyLength: 1,
    });
    clearState();
}

function handleMissedReturn(): void {
    if (!selectedServe) {
        shakeElement('serveState');
        return;
    }
    const server = scorer.getServer();
    scorer.scorePointWithStats(server, {
        serveResult: selectedServe,
        pointType: 'missed_return',
        rallyLength: 2,
    });
    clearState();
}

function handleDoubleFault(): void {
    const server = scorer.getServer();
    const returner: 1 | 2 = server === 1 ? 2 : 1;

    scorer.scorePointWithStats(returner, {
        serveResult: 'second',
        pointType: 'double_fault',
        rallyLength: 1,
    });
    clearState();
}

// Keyboard shortcuts for scoring
document.addEventListener('keydown', (event: KeyboardEvent) => {
    // Ignore keystrokes when typing in input fields
    const target = event.target as HTMLElement;
    if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
        return;
    }

    // Ignore when settings modal is open
    const settingsModal = document.getElementById('settingsModal');
    if (settingsModal && settingsModal.style.display === 'block') {
        return;
    }

    const key = event.key;

    switch (key) {
        case 'f':
            event.preventDefault();
            selectedServe = 'first';
            updateStateDisplay();
            break;
        case 's':
            event.preventDefault();
            selectedServe = 'second';
            updateStateDisplay();
            break;
        case ' ':
            event.preventDefault();
            rallyCounter++;
            updateStateDisplay();
            break;
        case 'w':
        case 'u':
        case 'e':
        case 'n':
            event.preventDefault();
            selectedPointType = POINT_TYPE_KEYS[key];
            updateStateDisplay();
            break;
        case 'a':
            event.preventDefault();
            handleAce();
            break;
        case 'r':
            event.preventDefault();
            handleMissedReturn();
            break;
        case 'd':
            event.preventDefault();
            handleDoubleFault();
            break;
        case '1':
            event.preventDefault();
            confirmPoint(1);
            break;
        case '2':
            event.preventDefault();
            confirmPoint(2);
            break;
        case '!':
            // Remove point from player 1 (Shift + 1)
            removePoint(1);
            break;
        case '@':
            // Remove point from player 2 (Shift + 2)
            removePoint(2);
            break;
        case 'Escape':
            event.preventDefault();
            clearState();
            break;
    }
});
