import SudokuResolver from './sudoku-resolver/index.mjs';
import { createBoardElement } from './components/elements.mjs';
import { createConsoleBoard } from './util/utils.mjs';

export class App {

    constructor(containerSelector) {
        this.container = document.querySelector(containerSelector);
        this.cellElements = [];
        this.numberElements = [];

        this.numberSelect = null;
        this.selectedCell = -1;

        this.initMapValues = [];
        this.currentMapValues = [];
        this.sudokuResolver = null;
        this.init();
    }

    init() {
        const boardElement = createBoardElement({
            setCellElements: (el, idx) => this.cellElements[idx] = el,
            setNumberSelect: (el) => this.numberSelect = el,
            setNumberElements: (el, idx) => this.numberElements[idx] = el,
            onClear: this.clear,
            onRestart: this.start,
            onResolve: this.resolve,
            onSelectCell: this.selectCell,
            onChooseCellValue: this.chooseCellValue
        });

        this.container.appendChild(boardElement);
        this.start();
    }

    clear = () => {
        const map = new Array(81).fill(0);
        this.sudokuResolver = new SudokuResolver(map);
        this.initMapValues = map;
        this.currentMapValues = map;
        map.forEach((value, idx) => this.updateCellValue(idx, value));
        return map;
    }

    start = () => {
        // generate initial random numbers
        const emptyMap = new Array(81).fill(0);
        const map = [...emptyMap];
        const solution = new SudokuResolver(emptyMap).resolve();
        let initNumbers = 9;
        while (initNumbers > 0) {
            const randomIndex = Math.floor(Math.random() * 80.999);
            if (!map[randomIndex]) {
                map[randomIndex] = solution.result[randomIndex];
                initNumbers--;
            }
        }
        // if you want predefined map then user this
        // const map = [
        //     0, 0, 0,  0, 0, 0,  0, 0, 0,
        //     0, 0, 0,  0, 0, 0,  0, 0, 0,
        //     0, 0, 0,  0, 0, 0,  5, 0, 0,
        //     0, 0, 2,  0, 0, 0,  0, 0, 0,
        //     0, 0, 0,  0, 0, 0,  0, 0, 0,
        //     0, 0, 0,  0, 0, 0,  0, 0, 0,
        //     0, 0, 0,  0, 0, 6,  0, 0, 0,
        //     3, 0, 0,  0, 0, 0,  0, 0, 0,
        //     0, 0, 0,  0, 0, 0,  0, 1, 0,
        // ];


        this.sudokuResolver = new SudokuResolver(map);
        this.initMapValues = map;
        this.currentMapValues = map;
        map.forEach((value, idx) => this.updateCellValue(idx, value));
        return map;
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

    selectCell = (idx) => {
        // cannot change the init values
        if (this.initMapValues[idx]) {
            return;
        }
        if (this.selectedCell > -1) {
            this.cellElements[this.selectedCell].classList.remove('active');
            this.numberElements.forEach(el => el.style.visibility = 'hidden');
        }
        if (this.selectedCell === idx || idx === -1) {
            this.selectedCell = -1;
            this.renderNumber(-1);
            return;
        }
        const { missingNumbers, ...rest } = this.sudokuResolver.analyze(idx, this.currentMapValues);
        if (!missingNumbers.length) {
            return;
        }
        this.renderNumber(idx);
        this.selectedCell = idx;
        this.cellElements[idx].classList.add('active');
        this.numberElements.forEach(el => {
            const nr = parseInt(el.dataset.nr);
            el.style.visibility = missingNumbers.includes(nr) ? 'visible' : 'hidden';
        });

    }

    renderNumber(idx) {
        const parent = this.numberSelect.closest('.number-suggestion');
        if (idx < 0) {
            parent.style.visibility = 'hidden';
            return;
        }
        parent.style.visibility = 'visible';

    }

    chooseCellValue = (value) => {
        const idx = this.selectedCell;
        if (idx < 0) { return; }

        const newMap = this.sudokuResolver.setNumber(idx, value, this.currentMapValues);
        this.sudokuResolver.map = newMap;
        this.updateCellValue(idx, value);
        this.currentMapValues = newMap;
        if (this.sudokuResolver.analyze(idx, newMap).isValid) {
            this.selectCell(-1);
        }
    }

    resolve = async (quick) => {
        if (quick) {
            const solution = this.sudokuResolver.resolve();

            if (!solution) { return alert('This sudoku cannot be resolved!'); }

            const map = solution.result;
            this.currentMapValues = map;
            map.forEach((value, idx) => this.updateCellValue(idx, value));
        } else {
            const stepperMethod = (newMap) => {
                this.currentMapValues = newMap;
                newMap.forEach((value, idx) => this.updateCellValue(idx, value));
            }
            const stepDelay = 50;
            const solution = await this.sudokuResolver.resolveAsync(null, stepperMethod, stepDelay);

            if (!solution) { return alert('This sudoku cannot be resolved!'); }

            const map = solution.result;
            this.currentMapValues = map;
            map.forEach((value, idx) => this.updateCellValue(idx, value));

        }
    }
}
