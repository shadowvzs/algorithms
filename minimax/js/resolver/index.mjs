// import { uniq, delayPromise } from '../util/utils.mjs';

const winningCombos = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

export function emptyBoardIndexes(board) {
    return board.filter(value => !isNaN(+value));
}

export function hasWon(board, player) {
    const isWinningCombo = winningCombo => winningCombo.every(cellIdx => board[cellIdx] === player)
    return winningCombos.some(isWinningCombo);
}

// the main minimax function
export function minimax(newBoard, player, { count = 0, player1, player2 }) {
    const availSpots = emptyBoardIndexes(newBoard);
    const newOptions = { count: count + 1, player1, player2 };

    if (hasWon(newBoard, player1)) {
        return { score: -10 };
    } else if (hasWon(newBoard, player2)) {
        return { score: 10 };
    } else if (availSpots.length === 0) {
        return { score: 0 };
    }

    const moves = [];
    for (let i = 0; i < availSpots.length; i++) {
        const move = { index: newBoard[availSpots[i]] };

        newBoard[availSpots[i]] = player;
        if (player == player2) {
            const result = minimax(newBoard, player1, newOptions);
            move.score = result.score;
        } else {
            const result = minimax(newBoard, player2, newOptions);
            move.score = result.score;
        }

        newBoard[availSpots[i]] = move.index;
        moves.push(move);
    }

    let bestMove;
    if (player === player2) {
        let bestScore = Number.MIN_SAFE_INTEGER;
        for (let i = 0; i < moves.length; i++) {
            if (moves[i].score > bestScore) {
                bestScore = moves[i].score;
                bestMove = i;
            }
        }
    } else {
        let bestScore = Number.MAX_SAFE_INTEGER;
        for (let i = 0; i < moves.length; i++) {
            if (moves[i].score < bestScore) {
                bestScore = moves[i].score;
                bestMove = i;
            }
        }
    }

    return moves[bestMove];
}