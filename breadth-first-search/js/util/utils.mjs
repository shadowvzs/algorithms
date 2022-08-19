export const uniq = (array) => {
    return [...new Set(array)];
}

export const delayPromise = (delay) => new Promise(res => { setTimeout(res, delay); });