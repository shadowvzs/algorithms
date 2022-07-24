import { renderElement } from '../util/createElement.mjs';

export const createBoardElement = (props) => {
    const {
        setCellElements,
        setNumberElements,
        setNumberSelect,
        onClear,
        onRestart,
        onResolve,
        onSelectCell,
        onChooseCellValue
    } = props;

    const rows = [];

    for (let rowIdx = 0; rowIdx < 9; rowIdx++) {
        const cells = [];
        for (let cellIdx = 0; cellIdx < 9; cellIdx++) {
            const idx = rowIdx * 9 + cellIdx;
            cells.push({
                tagName: 'div',
                attributes: {
                    className: 'cell',
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
            {
                tagName: 'div',
                attributes: { className: 'number-suggestion' },
                children: [
                    {
                        tagName: 'p',
                        children: ['Select number: ']
                    },
                    {
                        tagName: 'div',
                        attributes: { ref: setNumberSelect },
                        children: new Array(9).fill(1).map((_, idx) => ({
                            tagName: 'span',
                            attributes: {
                                ref: (el) => setNumberElements(el, idx),
                                onclick: () => onChooseCellValue(idx + 1),
                                'data-nr': idx + 1
                            },
                            children: [idx + 1]
                        }))
                    }
                ]
            },
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