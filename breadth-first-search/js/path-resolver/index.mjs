import { uniq, delayPromise } from '../util/utils.mjs';

// backtracking logic is in resolve method, which called recursively, go into deeper and deeper into list (DFS)
export class PathResolver {
    constructor(initMap) {
        this.map = initMap;
        this.size = 9;
        this.tree = {};
        this.generatePositionMap(this.size);
    }

    generatePositionMap(size) {
        let x, y;
        for (y = 1; y <= size; y++) {
            for (x = 1; x <= size; x++) {
                const index = (y - 1) * size + x - 1;
                const neighbor = { children: [], value: index };
                if (x > 1) { neighbor.children.push(index - 1); }
                if (x < this.size) { neighbor.children.push(index + 1); }
                if (y > 1) { neighbor.children.push(index - this.size); }
                if (y < this.size) { neighbor.children.push(index + this.size); }
                this.tree[index] = neighbor;
            }
        }

        for (const key in this.tree) {
            this.tree[key].children = this.tree[key].children.map(idx => this.tree[idx]);
        }
    }

    // // just for ui, with delays
    // async resolveAsync(data = null, cb = null, delay = 100) {
    //     if (this.abort) { return null; }
    //     let result = this.analyzeAll(data);
    //     const { unresolved: [firstCellIdx, ...unresolved], map, scoreMap } = result;
    //     const { missingNumbers } = scoreMap[firstCellIdx];
    //     this.steps++;

    //     if (this.steps > this.maxStep) { this.abort = true; return null; }

    //     if (!missingNumbers.length) { return null; }
    //     for (const missingNumber of shuffle(missingNumbers, 10)) {
    //         const newMap = this.setNumber(firstCellIdx, missingNumber, map);
    //         if (cb) {
    //             await delayPromise(delay);
    //             cb(newMap);
    //         }
    //         if (!unresolved.length && this.analyze(firstCellIdx, newMap)) {
    //             return {
    //                 time: Math.round(performance.now() - this.initTime),
    //                 steps: this.steps,
    //                 result: newMap
    //             };
    //         }
    //         result = await this.resolveAsync({ map: newMap, unresolved, scoreMap }, cb, delay);
    //         if (result) { return result; }
    //     }
    //     return null;
    // }

    async resolveAsync(data, cb = null, delay = 100) {
        const { startAt, target } = data;
        const visited = [];
        if (!data.visited || !data.visited.length) {
            data.visited = [[startAt]];
            if (data.startAt === data.target) {
                data.found = true;
                return data;
            }
        }

        const lastVisited = data.visited.slice(-1)[0];
        visited.push(...uniq(lastVisited.map(x => x.children).flat(2)));
        data.visited.push(visited);

        if (cb) {
            await delayPromise(delay);
            cb(data);
        }

        if (visited.some(node => node.value === target)) {
            data.found = true;
            return data;
        }

        if (Object.keys(tree) <= visited.length) {
            return data;
        }

        return this.resolveAsync(data, cb, delay);
    }

    resolve(data) {
        const { startAt, target } = data;
        const visited = [];
        if (!data.visited || !data.visited.length) {
            data.visited = [[startAt]];
            if (data.startAt === data.target) {
                data.found = true;
                return data;
            }
        }

        const lastVisited = data.visited.slice(-1)[0];
        visited.push(...uniq(lastVisited.map(x => x.children).flat(2)));
        data.visited.push(visited);

        if (visited.some(node => node.value === target)) {
            data.found = true;
            return data;
        }

        if (Object.keys(tree) <= visited.length) {
            return data;
        }

        return this.resolve(data);
    }
}


// tree like 
const tree = {
    "10": {
        value: "10",
        left: "4",
        right: "17",
    },
    "4": {
        value: "4",
        left: "1",
        right: "9",
    },
    "17": {
        value: "17",
        left: "12",
        right: "18",
    },
    "1": {
        value: "1",
        left: null,
        right: null,
    },
    "9": {
        value: "9",
        left: null,
        right: null,
    },
    "12": {
        value: "12",
        left: null,
        right: null,
    },
    "18": {
        value: "18",
        left: null,
        right: null,
    },
};

const breadthFirstSearch = (tree, rootNode, searchValue) => {
    const queue = [];
    const path = [];

    queue.push(rootNode);

    while (queue.length > 0) {
        const currentNode = queue[0];
        path.push(currentNode.value);

        if (currentNode.value === searchValue) {
            return path;
        }

        if (currentNode.left !== null) {
            queue.push(tree[currentNode.left]);
        }

        if (currentNode.right !== null) {
            queue.push(tree[currentNode.right]);
        }

        queue.shift();
    }
    console.log('Sorry, no such node found!');
}

breadthFirstSearch(tree, tree["4"], "18");

export default PathResolver;