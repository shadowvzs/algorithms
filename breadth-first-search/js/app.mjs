import PathResolver from './path-resolver/index.mjs';
import { createBoardElement } from './components/elements.mjs';

export class App {

    constructor(containerSelector) {
        this.container = document.querySelector(containerSelector);
        this.cellElements = [];
        this.numberElements = [];

        this.numberSelect = null;
        this.selectedCell = -1;

        this.initMapValues = [];
        this.currentMapValues = [];
        this.start();
    }

    start = () => {
        // generate initial random numbers
        this.startAt = Math.floor(Math.random() * 81);
        this.endAt = Math.floor(Math.random() * 81);
        this.container.innerHTML = '';
        const boardElement = createBoardElement({
            setCellElements: (el, idx) => this.cellElements[idx] = el,
            onClear: this.start,
            onRestart: this.start,
            onResolve: this.resolve,
            onSelectCell: this.selectCell,
            startAt: this.startAt,
            endAt: this.endAt
        });

        this.container.appendChild(boardElement);
    }

    updateCellValue(idx, value) {
        const el = this.cellElements[idx];
        if (!el) {
            console.error(`Missing cell element error, idx: ${idx}, value: ${value}`);
            return;
        }

        if (!Boolean(this.initMapValues[idx]) === el.classList.contains('locked')) {
            el.classList.toggle('locked');
        }

        el.textContent = value || '';
        el.dataset.id = idx;
    }

    resolve = async (quick) => {
        const emptyMap = new Array(81).fill(0);
        const color = `rgba(0, 0, 0, 0.2)`;

        if (quick) {
            const resolver = new PathResolver(emptyMap);
            const solution = resolver.resolve({
                tree: resolver.tree,
                target: this.endAt,
                startAt: resolver.tree[this.startAt],
                found: false
            });

            solution.visited.flat(2).forEach(x => {
                this.cellElements[x.value].style.backgroundColor = color;
            });

            setTimeout(() => {
                alert(`It was solved in ${solution.visited.length} step, start cell #${this.startAt} till the end cell #${this.endAt}`);
            }, 100);
        } else {
            const resolver = new PathResolver(emptyMap);
            const solution = resolver.resolveAsync({
                tree: resolver.tree,
                target: this.endAt,
                startAt: resolver.tree[this.startAt],
                found: false
            }, (result) => {
                const { visited } = result;
                const lastVisited = visited[visited.length - 1];
                lastVisited.forEach(x => {
                    this.cellElements[x.value].style.backgroundColor = color;
                });
            }, 500);

            solution.then((res) => {
                setTimeout(() => {
                    alert(`It was solved in ${res.visited.length} step, start cell #${this.startAt} till the end cell #${this.endAt}`);
                }, 100);
            });
        }
    }
}
