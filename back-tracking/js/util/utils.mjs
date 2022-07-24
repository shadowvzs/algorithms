// create sudoku board in console
export const createConsoleBoard = (items) => {
    console.log('-----------------------');
    for (let i = 0; i < 9; i++) {
        if (i % 3 === 0 && i > 0) { console.log('|------|-------|------|'); }
        const row = items.slice(i * 9, (i + 1) * 9).join(' ');
        console.log('|' + [row.slice(0, 5), row.slice(6, 11), row.slice(12, 17)].join(' | ') + '|');
    }
    console.log('-----------------------');
};

export const shuffle = (items, amount = 1) => {
    for (let i = 0; i < amount; i++) {
        items = items.sort(() => Math.round(Math.random() * 2) - 1);
    }
    return items;
}

export const uniq = (array) => {
    return [...new Set(array)];
}

export const isUniq = (array) => {
    return [...new Set(array)].length === array.length;
}

export const delayPromise = (delay) => new Promise(res => { setTimeout(res, delay); });