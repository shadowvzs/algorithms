import { hasWon, minimax, emptyBoardIndexes } from './resolver/index.mjs';
import { createBoardElement } from './components/elements.mjs';
import { delayPromise } from './util/utils.mjs';

export class App {

    constructor(containerSelector) {
        this.container = document.querySelector(containerSelector);
        this.cellElements = [];
        this.currentPlayerElem = null;
        this.emptyBoard = [0, 1, 2, 3, 4, 5, 6, 7, 8];
        this.currentBoard = [...this.emptyBoard];

        this.players = ['X', 'O'];
        this.player = this.players[0];
        this.vsAi = false;
        this.running = true;

        this.start();
    }

    start = () => {
        this.running = true;
        this.currentBoard = [...this.emptyBoard];
        this.render();
    }

    render = () => {
        this.container.innerHTML = '';
        const boardElement = createBoardElement({
            vsAi: this.vsAi,
            onToggleAi: this.onToggleAi,
            setCurrentPlayerElemRef: (el) => this.currentPlayerElem = el,
            setCellElements: (el, idx) => this.cellElements[idx] = el,
            onClear: this.start,
            onRestart: this.start,
            onResolve: this.resolve,
            onSelectCell: this.onSelectCell,
        });

        this.container.appendChild(boardElement);
        this.currentPlayerElem.textContent = this.player;
    }

    onToggleAi = () => {
        this.vsAi = !this.vsAi;
        this.render();
    }

    switchPlayer(player = this.player) {
        return this.players[Number(this.players[0] === player)];
    }

    onSelectCell = (idx, board = this.currentBoard, autoMove = true) => {
        if (!this.running || isNaN(board[idx])) { return false; }
        board[idx] = this.player;
        this.updateCellValue(idx, this.player);
        if (hasWon(board, this.player)) {
            this.running = false;
            setTimeout(() => this.currentPlayerElem.textContent = this.switchPlayer() + ' (Won)', 300);
        } else if (emptyBoardIndexes(board).length < 1) {
            this.running = false;
            setTimeout(() => this.currentPlayerElem.textContent = this.switchPlayer() + ' (Draw)', 300);
        }
        this.player = this.switchPlayer();
        this.currentPlayerElem.textContent = this.player;
        if (this.vsAi && autoMove && emptyBoardIndexes(board).length) {
            const nextMove = minimax([...board], this.player, {
                player1: this.switchPlayer(),
                player2: this.player
            }).index;
            setTimeout(() => this.onSelectCell(nextMove, board, false), 1000);
        }
    }

    updateCellValue(idx, value) {
        const el = this.cellElements[idx];
        if (!el) {
            console.error(`Missing cell element error, idx: ${idx}, value: ${value}`);
            return;
        }

        el.textContent = value || '';
        el.dataset.id = idx;
    }

    resolve = async (quick) => {
        const board = this.currentBoard;
        if (quick) {
            while (emptyBoardIndexes(board).length) {
                const nextMove = minimax(board, this.player, {
                    player1: this.switchPlayer(),
                    player2: this.player
                }).index;
                this.onSelectCell(nextMove);
            }
        } else {
            while (emptyBoardIndexes(board).length) {
                const nextMove = minimax(board, this.player, {
                    player1: this.switchPlayer(),
                    player2: this.player
                }).index;
                await delayPromise(700);
                this.onSelectCell(nextMove);
            }
        }
    }
}
