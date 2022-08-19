import { renderElement } from '../util/createElement.mjs';

export const createBoardElement = (props) => {
    const {
        vsAi,
        onToggleAi,
        setCurrentPlayerElemRef,
        setCellElements,
        onClear,
        onRestart,
        onResolve,
        onSelectCell,
    } = props;

    const rows = [];

    for (let rowIdx = 0; rowIdx < 3; rowIdx++) {
        const cells = [];
        for (let cellIdx = 0; cellIdx < 3; cellIdx++) {
            const idx = rowIdx * 3 + cellIdx;
            cells.push({
                tagName: 'div',
                attributes: {
                    className: ['cell'],
                    'data-id': idx,
                    ref: (el) => setCellElements(el, idx),
                    onclick: (ev) => onSelectCell(+ev.target.dataset.id)
                },
                children: []
            });
        }
        rows.push({
            tagName: 'div',
            attributes: { className: 'row' },
            children: cells
        });
    }

    const board = {
        tagName: 'div',
        attributes: { className: 'board' },
        children: rows
    };

    const actionContainer = {
        tagName: 'div',
        attributes: { className: 'action-container' },
        children: [
            {
                tagName: 'button',
                attributes: { onclick: onClear },
                children: ['clear']
            },
            {
                tagName: 'button',
                attributes: { onclick: onRestart },
                children: ['restart']
            },
            {
                tagName: 'button',
                attributes: { onclick: () => onResolve(false) },
                children: ['slow resolve']
            },
            {
                tagName: 'button',
                attributes: { onclick: () => onResolve(true) },
                children: ['fast resolve']
            },
            {
                tagName: 'button',
                attributes: { onclick: () => onToggleAi() },
                children: [vsAi ? 'vs Human' : 'vs Ai']
            }
        ]
    };

    const currentPlayerContainter = {
        tagName: 'div',
        attributes: { className: 'current-player' },
        children: [
            {
                tagName: 'span',
                children: ['Waiting for player: ']
            },
            {
                tagName: 'span',
                attributes: { ref: el => setCurrentPlayerElemRef(el) },
                children: []
            }
        ]
    }

    const bottomContainer = {
        tagName: 'div',
        attributes: { className: 'bottom-container' },
        children: [
            currentPlayerContainter,
            actionContainer
        ]
    };

    const boardContainer = renderElement({
        tagName: 'div',
        attributes: { className: 'board-container' },
        children: [
            board,
            bottomContainer
        ]
    });

    return boardContainer;
}