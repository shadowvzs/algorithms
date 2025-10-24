export class Controllers {
    constructor(containerElemId, actions) {
        this.actions = actions || {};
        this.containerElemId = containerElemId;
    }
    
    init() {
        this.containerElement = document.querySelector(this.containerElemId);
        this.selectStartNode = this.createSelect('startNodeId');
        this.selectEndNode = this.createSelect('endNodeId');
        this.containerElement.appendChild(this.selectStartNode);
        this.containerElement.appendChild(this.selectEndNode);
        const clearButton = this.createButton('Clear', () => {
            this.actions.onClear();
        });
        const toggleNodeCreation = this.createButton('Create Nodes with Clicks', () => {
            this.actions.onToggleManualNodeCreation();
        });
        const toggleEdgeCreation = this.createButton('Create Edges with Clicks', () => {
            this.actions.onToggleManualEdgeCreation();
        });
        const resetButton = this.createButton('Reset', () => {
            this.actions.onReset();
        });
        const generateNodesButton = this.createButton('Generate Nodes', () => {
            this.actions.onResetNodes();
        });
        const generateEdgesButton = this.createButton('Generate Edges', () => {
            this.actions.onResetEdges();
        });
        const solveButton = this.createButton('Solve', () => {
            this.actions.onSolve(200);
        });

        // onToggleManualNodeCreation
        this.appendChilds([clearButton, toggleNodeCreation, toggleEdgeCreation, resetButton, generateNodesButton, generateEdgesButton, solveButton]);
    }

    appendChilds(elements) {
        for (const elem of elements) {
            this.containerElement.appendChild(elem);
        }
    }

    updateSelectOptions(nodes) {
        this.selectStartNode.innerHTML = '';
        this.selectEndNode.innerHTML = '';

        const startNodes = nodes.filter(n => !n.isEnd);
        const endNodes = nodes.filter(n => !n.isStart);

        for (const node of startNodes) {
            if (node.isStart) {
                this.selectStartNode.value = node.id;
            }
            this.selectStartNode.appendChild(this.createOptions(node, node.isStart));
        }

        for (const node of endNodes) {
            if (node.isEnd) {
                this.selectEndNode.value = node.id;
            }
            this.selectEndNode.appendChild(this.createOptions(node, node.isEnd));
        }
    }

    createSelect(name) {
        const select = document.createElement('select');
        select.name = name;
        const onChange = (e) => {
            this.actions.onNodeChange(name, e.currentTarget.value);
        };
        select.addEventListener('change', onChange);
        return select;
    }

    createButton(text, onClick) {
        const button = document.createElement('button');
        button.textContent = text;
        button.addEventListener('click', onClick);
        return button;

    }

    createOptions(node, isSelected) {
        const option = document.createElement('option');
        option.value = node.id;
        option.textContent = node.id;
        option.selected = isSelected;
        return option;
    }
}