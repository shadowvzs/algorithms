import { shuffle, delayPromise, isUniq } from '../util/utils.mjs';

// backtracking logic is in resolve method, which called recursively, go into deeper and deeper into list (DFS)
export class Sudoku {
    constructor(initMap) {
        this.map = initMap;
        this.size = 9;
        this.maxNumber = 9;
        this.boxSize = 3;
        this.pos2Map = {};
        this.indexMap = {};
        this.generatePositionMap(this.size);
        this.abort = false;
        this.maxStep = 30000;
    }

    generatePositionMap(size) {
        this.pos2Map = {};
        let x, y;
        for (y = 1; y <= size; y++) {
            for (x = 1; x <= size; x++) {
                if (!this.pos2Map[y]) { this.pos2Map[y] = {}; }
                const index = (y - 1) * size + x - 1;
                this.pos2Map[y][x] = index;
                this.indexMap[index] = [y, x];
            }
        }
    }

    // just for ui, with delays
    async resolveAsync(data = null, cb = null, delay = 100) {
        if (this.abort) { return null; }
        let result = this.analyzeAll(data);
        const { unresolved: [firstCellIdx, ...unresolved], map, scoreMap } = result;
        const { missingNumbers } = scoreMap[firstCellIdx];
        this.steps++;

        if (this.steps > this.maxStep) { this.abort = true; return null; }

        if (!missingNumbers.length) { return null; }
        for (const missingNumber of shuffle(missingNumbers, 10)) {
            const newMap = this.setNumber(firstCellIdx, missingNumber, map);
            if (cb) {
                await delayPromise(delay);
                cb(newMap);
            }
            if (!unresolved.length && this.analyze(firstCellIdx, newMap)) {
                return {
                    time: Math.round(performance.now() - this.initTime),
                    steps: this.steps,
                    result: newMap
                };
            }
            result = await this.resolveAsync({ map: newMap, unresolved, scoreMap }, cb, delay);
            if (result) { return result; }
        }
        return null;
    }


    // recursive method because inside this method we call again this method with changed data (unresolved array is smaller and smaller)
    resolve(data = null) {
        let result = this.analyzeAll(data);
        const { unresolved: [firstCellIdx, ...unresolved], map, scoreMap } = result;
        const { missingNumbers } = scoreMap[firstCellIdx];
        this.steps++;

        if (this.steps > this.maxStep) { this.abort = true; return null; }

        if (!missingNumbers.length) { return null; }
        // we try out all missing the number in current cell (firstCellIdx), we just randomize a bit but this is just optional
        for (const missingNumber of shuffle(missingNumbers, 10)) {

            // this is set a new value, which important because we change the map with this method
            const newMap = this.setNumber(firstCellIdx, missingNumber, map);
            // if this was the last cell, then we analyze if everything ok, if yes then we return back the final result
            if (!unresolved.length && this.analyze(firstCellIdx, newMap)) {
                return {
                    time: Math.round(performance.now() - this.initTime),
                    steps: this.steps,
                    result: newMap
                };
            }
            // if this wasn't the last ccell then we check the next cell, with recursivly call the resolve method, 
            // but the firstCellIdx will be different that time, so this way we travers deeper
            result = this.resolve({ map: newMap, unresolved, scoreMap });

            if (result) { return result; }
        }

        // this called if we tried all missing numbers for cell, but all of them are incorrect, this way we travers upper
        this.abort = false;
        return null;
    }

    setNumber(idx, value, map = this.map) {
        const newMap = [...map];
        newMap[idx] = value;
        return newMap;
    }

    analyzeAll(data = null) {
        if (!data) {
            data = {
                unresolved: [],
                scoreMap: {},
                map: [...this.map]
            };
            this.steps = 0;
            this.initTime = performance.now();
            for (let i = 0; i < data.map.length; i++) {
                if (!data.map[i]) { data.unresolved.push(i); }
            }
            this.abort = false;
        };

        const scoreMap = data.scoreMap;

        data.unresolved.forEach(idx => {
            scoreMap[idx] = this.analyze(idx, data.map);
        });

        // TODO: improve the logic with next unresolved item (maybe should be the 1st in the array)
        // data.unresolved = data.unresolved.filter(x => x.isValid).sort((a, b) => {
        //     const A = scoreMap[a];
        //     const B = scoreMap[b];
        //     return A.totalScore - B.totalScore;
        // });
        data.scoreMap = scoreMap;
        return data;
    }

    analyze(idx, map = this.map) {
        const [y, x] = this.indexMap[idx];
        const data = {
            idx,
            y,
            x,
            horizontal: [],
            vertical: [],
            square: [],
            horizontalIndex: [],
            verticalIndex: [],
            squareIndex: [],
            totalScore: 0,
            usedNumbers: new Set(),
            missingNumbers: [],
            isValid: true,
            value: map[idx]
        };

        const pos2Map = this.pos2Map;
        const arrayKeys = ['horizontal', 'vertical', 'square'];

        // analyze horizontal, vertical, square numbers
        for (let i = 0; i < this.size; i++) {
            const squareX = Math.floor((x - 1) / 3) * 3 + i % 3 + 1;
            const squareY = Math.floor((y - 1) / 3) * 3 + Math.floor(i / 3) + 1;
            const squareIndex = pos2Map[squareY][squareX];
            const hIndex = pos2Map[y][i + 1];
            const vIndex = pos2Map[i + 1][x];
            const values = [
                map[hIndex],
                map[vIndex],
                map[squareIndex],
            ];
            const valuesIndex = [
                hIndex,
                vIndex,
                squareIndex,
            ];
            values.forEach((value, keyIdx) => {
                if (!value) { return; }
                data[arrayKeys[keyIdx]].push(value);
                data[arrayKeys[keyIdx] + 'Index'].push(valuesIndex[keyIdx]);
                data.usedNumbers.add(value);
            });
        }

        data.isValid = arrayKeys.every(x => isUniq(data[x])) && (data.usedNumbers.size < 9 || (
            data.horizontal.length === data.square.length &&
            data.vertical.length === data.square.length &&
            data.square.length === 9
        ));

        if (data.isValid) {
            for (let i = 1; i <= this.maxNumber; i++) {
                if (!data.usedNumbers.has(i)) {
                    data.missingNumbers.push(i);
                }
            }
            data.totalScore = new Set([...data.horizontal, ...data.vertical, ...data.square]).size;
        }
        return { ...data };
    }
}

export default Sudoku;