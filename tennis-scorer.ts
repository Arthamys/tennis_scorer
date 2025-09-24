interface MatchConfig {
    gamesPerSet: number;
    setsToWin: number;
    theme: string;
    tieBreakPoints: number; // 7 for regular tie-break, 10 for super tie-break
}

interface MatchState {
    player1: PlayerScore;
    player2: PlayerScore;
    server: 1 | 2;
    scoreHistory: SetScore[];
    matchWinner: 1 | 2 | null;
    isTieBreak: boolean;
}

interface PlayerScore {
    points: number;
    games: number;
    sets: number;
}

/// Score of a completed set
interface SetScore {
    player1: number;
    player2: number;
}

class TennisScorer {
    private state: MatchState;
    private config: MatchConfig;
    private themes: { [key: string]: { bg: string, text: string } };

    constructor() {
        this.config = {
            gamesPerSet: 6,
            setsToWin: 2,
            theme: 'default',
            tieBreakPoints: 7
        };

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

        this.state = {
            player1: { points: 0, games: 0, sets: 0 },
            player2: { points: 0, games: 0, sets: 0 },
            scoreHistory: [],
            server: 1,
            matchWinner: null,
            isTieBreak: false
        };

        this.updateDisplay();
        this.applyTheme();
    }

    public getConfig(): MatchConfig {
        return this.config;
    }

    public updateConfig(newConfig: Partial<MatchConfig>): void {
        this.config = { ...this.config, ...newConfig };
    }

    private getGameScoreDisplay(score: number, opponentScore: number): string {
        // In tie-break, show actual points
        if (this.state.isTieBreak) {
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

    private checkGameWin(player: 1 | 2): boolean {
        const currentPlayer = player === 1 ? this.state.player1 : this.state.player2;
        const opponent = player === 1 ? this.state.player2 : this.state.player1;

        if (currentPlayer.points >= 4 && currentPlayer.points >= opponent.points + 2) {
            return true;
        }
        return false;
    }

    private checkSetWin(player: 1 | 2): boolean {
        const currentPlayer = player === 1 ? this.state.player1 : this.state.player2;
        const opponent = player === 1 ? this.state.player2 : this.state.player1;

        // Regular set win (win by 2, up to 6 games, or 7-5)
        if (currentPlayer.games >= this.config.gamesPerSet && currentPlayer.games >= opponent.games + 2) {
            return true;
        }

        // Tie-break win condition
        if (this.state.isTieBreak) {
            const pointsNeeded = this.isDecidingSet() ? 10 : this.config.tieBreakPoints;
            return currentPlayer.points >= pointsNeeded && currentPlayer.points >= opponent.points + 2;
        }

        return false;
    }

    private checkMatchWin(player: 1 | 2): boolean {
        const currentPlayer = player === 1 ? this.state.player1 : this.state.player2;
        return currentPlayer.sets >= this.config.setsToWin;
    }

    private shouldEnterTieBreak(): boolean {
        return this.state.player1.games === this.config.gamesPerSet &&
               this.state.player2.games === this.config.gamesPerSet;
    }

    private isDecidingSet(): boolean {
        // This is the deciding set if both players are one set away from winning
        return this.state.player1.sets === (this.config.setsToWin - 1) &&
               this.state.player2.sets === (this.config.setsToWin - 1);
    }

    private switchServer(): void {
        this.state.server = this.state.server === 1 ? 2 : 1;
    }

    public scorePoint(player: 1 | 2): void {
        if (this.state.matchWinner) return;

        const currentPlayer = player === 1 ? this.state.player1 : this.state.player2;

        currentPlayer.points++;

        // Check if we should enter tie-break mode
        if (!this.state.isTieBreak && this.shouldEnterTieBreak()) {
            this.state.isTieBreak = true;
            this.state.player1.points = 0;
            this.state.player2.points = 0;
            currentPlayer.points = 1; // The current point scored starts the tie-break
        }

        // Check for game/set win
        if (this.state.isTieBreak) {
            // Tie-break win
            if (this.checkSetWin(player)) {
                currentPlayer.sets++;
                // In tie-break, the final score includes the tie-break result
                const finalSetScore = {
                    player1: this.state.player1.games + (player === 1 ? 1 : 0),
                    player2: this.state.player2.games + (player === 2 ? 1 : 0)
                };
                this.state.scoreHistory.push(finalSetScore);

                // Reset for next set
                this.state.player1.games = 0;
                this.state.player2.games = 0;
                this.state.player1.points = 0;
                this.state.player2.points = 0;
                this.state.isTieBreak = false;

                if (this.checkMatchWin(player)) {
                    this.state.matchWinner = player;
                }
            }
        } else {
            // Regular game win
            if (this.checkGameWin(player)) {
                currentPlayer.games++;
                this.state.player1.points = 0;
                this.state.player2.points = 0;
                this.switchServer();

                if (this.checkSetWin(player)) {
                    currentPlayer.sets++;
                    const finalSetScore = {
                        player1: this.state.player1.games,
                        player2: this.state.player2.games
                    };
                    this.state.scoreHistory.push(finalSetScore);
                    this.state.player1.games = 0;
                    this.state.player2.games = 0;

                    if (this.checkMatchWin(player)) {
                        this.state.matchWinner = player;
                    }
                }
            }
        }

        this.updateDisplay();
    }

    public removePoint(player: 1 | 2): void {
        if (this.state.matchWinner) return;

        const currentPlayer = player === 1 ? this.state.player1 : this.state.player2;

        if (currentPlayer.points > 0) {
            currentPlayer.points--;
        } else if (currentPlayer.games > 0) {
            currentPlayer.games--;
            this.state.player1.points = 3;
            this.state.player2.points = 3;
            this.switchServer();
        } else if (currentPlayer.sets > 0) {
            currentPlayer.sets--;
            this.state.player1.games = 5;
            this.state.player2.games = 5;
            this.state.player1.points = 3;
            this.state.player2.points = 3;
        }

        this.updateDisplay();
    }

    public resetMatch(): void {
        this.state = {
            player1: { points: 0, games: 0, sets: 0 },
            player2: { points: 0, games: 0, sets: 0 },
            scoreHistory: [],
            server: 1,
            matchWinner: null,
            isTieBreak: false
        };
        this.updateDisplay();
    }

    public updatePlayerNames(): void {
        const player1Input = document.getElementById('player1Name') as HTMLInputElement;
        const player2Input = document.getElementById('player2Name') as HTMLInputElement;

        const player1Name = player1Input.value.trim() || 'Player 1';
        const player2Name = player2Input.value.trim() || 'Player 2';

        // Update scoreboard
        document.getElementById('player1NameScore')!.querySelector('span')!.textContent = player1Name;
        document.getElementById('player2NameScore')!.querySelector('span')!.textContent = player2Name;

        // Update controls
        document.getElementById('player1Control')!.textContent = player1Name;
        document.getElementById('player2Control')!.textContent = player2Name;
    }

    public updateMatchSettings(): void {
        const gamesSelect = document.getElementById('gamesPerSet') as HTMLSelectElement;
        const setsSelect = document.getElementById('setsToWin') as HTMLSelectElement;

        this.config.gamesPerSet = parseInt(gamesSelect.value);
        this.config.setsToWin = parseInt(setsSelect.value);
    }

    public updateTheme(): void {
        const themeSelect = document.getElementById('bgTheme') as HTMLSelectElement;
        this.config.theme = themeSelect.value;
        this.applyTheme();
    }

    private applyTheme(): void {
        const theme = this.themes[this.config.theme];
        if (theme) {
            document.documentElement.style.setProperty('--bg-gradient', theme.bg);
            document.documentElement.style.setProperty('--text-color', theme.text);
        }
    }

    private updateDisplay(): void {
        // Update game scores (points)
        document.getElementById('gameScore1')!.textContent =
            this.getGameScoreDisplay(this.state.player1.points, this.state.player2.points);
        document.getElementById('gameScore2')!.textContent =
            this.getGameScoreDisplay(this.state.player2.points, this.state.player1.points);

        // Update current games
        document.getElementById('games1')!.textContent = this.state.player1.games.toString();
        document.getElementById('games2')!.textContent = this.state.player2.games.toString();

        // Update set history headers and cells
        this.updateSetHistory();

        // Update server indicator
        document.getElementById('serve1')!.classList.toggle('active', this.state.server === 1);
        document.getElementById('serve2')!.classList.toggle('active', this.state.server === 2);

        // Update winner display
        const winnerDiv = document.getElementById('winner')!;
        if (this.state.matchWinner) {
            const playerNameEl = document.getElementById(`player${this.state.matchWinner}NameScore`)?.querySelector('span');
            const playerName = playerNameEl?.textContent || `Player ${this.state.matchWinner}`;
            winnerDiv.textContent = `🏆 ${playerName} Wins the Match! 🏆`;
            winnerDiv.style.display = 'block';
        } else {
            winnerDiv.style.display = 'none';
        }
    }

    private updateSetHistory(): void {
        // Update set headers
        const setHeadersContainer = document.getElementById('set-headers-container')!;
        setHeadersContainer.innerHTML = '';

        for (let i = 0; i < this.state.scoreHistory.length; i++) {
            const headerDiv = document.createElement('div');
            headerDiv.textContent = `Set ${i + 1}`;
            setHeadersContainer.appendChild(headerDiv);
        }

        // Update player 1 set history
        const player1SetsContainer = document.getElementById('player1-sets-container')!;
        player1SetsContainer.innerHTML = '';

        for (let i = 0; i < this.state.scoreHistory.length; i++) {
            const setCell = document.createElement('div');
            setCell.className = 'set-history-cell';
            setCell.textContent = this.state.scoreHistory[i].player1.toString();
            player1SetsContainer.appendChild(setCell);
        }

        // Update player 2 set history
        const player2SetsContainer = document.getElementById('player2-sets-container')!;
        player2SetsContainer.innerHTML = '';

        for (let i = 0; i < this.state.scoreHistory.length; i++) {
            const setCell = document.createElement('div');
            setCell.className = 'set-history-cell';
            setCell.textContent = this.state.scoreHistory[i].player2.toString();
            player2SetsContainer.appendChild(setCell);
        }
    }
}

// Initialize the scorer
const scorer = new TennisScorer();

// Global functions for button clicks
function scorePoint(player: 1 | 2): void {
    scorer.scorePoint(player);
}

function removePoint(player: 1 | 2): void {
    scorer.removePoint(player);
}

function resetMatch(): void {
    scorer.resetMatch();
}

function updatePlayerNames(): void {
    scorer.updatePlayerNames();
}

function updateMatchSettings(): void {
    scorer.updateMatchSettings();
}

function updateTheme(): void {
    scorer.updateTheme();
}