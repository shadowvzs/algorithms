import { renderElement } from '../util/createElement.mjs';

export const createBoardElement = (props) => {
    const {
        setCellElements,
        onClear,
        onRestart,
        onResolve,
        onSelectCell,
        startAt,
        endAt
    } = props;

    const rows = [];

    for (let rowIdx = 0; rowIdx < 9; rowIdx++) {
        const cells = [];
        for (let cellIdx = 0; cellIdx < 9; cellIdx++) {
            const idx = rowIdx * 9 + cellIdx;
            cells.push({
                tagName: 'div',
                attributes: {
                    className: ['cell', (idx === startAt || idx === endAt) && 'marked'],
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
            }
        ]
    };

    const bottomContainer = {
        tagName: 'div',
        attributes: { className: 'bottom-container' },
        children: [
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