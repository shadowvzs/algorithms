import { GraphWithMeta } from './graph.mjs';
import { MapCanvas } from './map-canvas.mjs';
import { Controllers } from './controllers.mjs';
import { dijkstra } from './dijkstra.mjs';

// we use uni directed graph for simplicity
const isDirectedGraph = false;

class App {
    constructor(canvasElemId, controlElemId) {
        this.canvasId = canvasElemId;
        this.controlId = controlElemId;

        // used subclasses
        this.graph = null;
        this.mapCanvas = new MapCanvas(this.canvasId, {
            onCreateNode: this.createNode,
            onCreateEdge: this.createEdge,
            getGraphData: () => this.graph.graphData,
        });
        this.infoElement = null;
        this.controller = null;
    }

    // nodes: { id,    x,     y,  isStart?, isEnd?, isHighlighted? }[]
    generateNodes() {
        if (!this.mapCanvas) {
            console.error('mapCanvas not initialized');
            return;
        }

        // create graph
        this.graph = new GraphWithMeta([], [], isDirectedGraph);

        // seed nodes and edges if not provided
        const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
        const nodeCounter = randomInt(5, 12);
        const canvasWidth = this.mapCanvas.canvas.width;
        const canvasHeight = this.mapCanvas.canvas.height;
        this.graph.generateNodes(50, canvasWidth - 50, 50, canvasHeight - 50, nodeCounter);
            
        // set initial start and end nodes
        const nodeArray = [...this.graph.nodes.keys()];
        this.graph.setMarkNode(nodeArray[0], 'start');
        this.graph.setMarkNode(nodeArray.pop(), 'end');
        const { nodes, edges } = this.graph.graphData;
        this.draw(nodes, edges);
        this.controller.updateSelectOptions(nodes);
        this.drawAsciiMatrix();
    }

    // nodes: { id,    x,     y,  isStart?, isEnd?, isHighlighted? }[]
    generateEdges() {
        if (!this.mapCanvas) {
            console.error('mapCanvas not initialized');
            return;
        }
        
        this.graph.generateEdges();

        const { nodes, edges } = this.graph.graphData;
        this.draw(nodes, edges);
        this.drawAsciiMatrix();
    }

    generateData() {
        this.generateNodes();
        this.generateEdges();
    }

    init() {
        this.mapCanvas.init();

        // Initialize controllers - select elements
        this.controller = new Controllers(this.controlId, {
            // marked start or end node changes
            onNodeChange: this.selectNode,
            // solve button clicked callback
            onSolve: this.solve,
            // clear button clicked callback
            onClear: this.clear,
            // toggle manual node creation
            onToggleManualNodeCreation: this.mapCanvas.toggleManualNodeCreation,
            onToggleManualEdgeCreation: this.mapCanvas.toggleManualEdgeCreation,
            // reset button clicked callback
            onReset: this.reset,
            onResetNodes: () => { this.generateNodes(); },
            onResetEdges: () => { this.generateEdges(); },
        });
        this.controller.init();
        this.generateData();
        this.infoElement = document.querySelector('#info');
    }

    createNode = (x, y) => {
        const newNode = { x, y };
        this.graph.addNode({ x, y });
        const nodeIdList = Array.from(this.graph.nodes);
        if (nodeIdList.length === 1 || !this.graph.startNodeId) {
            this.graph.setMarkNode(nodeIdList[0], 'start');            
        } else if (nodeIdList.length > 1 || !this.graph.endNodeId) {
            this.graph.setMarkNode(nodeIdList.pop(), 'end');
        }
        const { nodes, edges } = this.graph.graphData;
        this.draw(nodes, edges);
        this.drawAsciiMatrix();
    };

    createEdge = (nodeId1, nodeId2, weight) => {
        this.graph.addEdge(nodeId1, nodeId2, weight);
        const { nodes, edges } = this.graph.graphData;
        console.log('createEdge', nodeId1, nodeId2, weight, edges);
        this.draw(nodes, edges);
        this.drawAsciiMatrix();
    };

    toggleManualNodeCreation = () => {
        this.mapCanvas.toggleManualNodeCreation((x, y) => {
            this.graph.addNode({ x, y });
            const { nodes, edges } = this.graph.graphData;
            this.draw(nodes, edges);
        });
    }

    clear = () => {
        this.graph = new GraphWithMeta([], [], isDirectedGraph);
        const { nodes, edges } = this.graph.graphData;
        this.draw(nodes, edges);
    }

    reset = () => {
        this.generateData();
        const { nodes, edges } = this.graph.graphData;
        this.draw(nodes, edges);
    }

    solve = () => {
        const { path } = dijkstra(this.graph.nodes, this.graph.adjacencyList, this.graph.startNodeId, this.graph.endNodeId);
        if (!path) {
            alert('No path found');
            return;
        }

        // highlight the path nodes
        const nodePath = path.nodePath;
        const { nodes, edges } = this.graph.graphData;
        if (edges.length < 2) { return; }

        const startFrom = 0;
        const endAt = nodePath.length - 1;
        edges.forEach(e => e.isHighlighted = false);
        for (let i = startFrom; i < endAt; i++) {
            const node1Id = nodePath[i];
            const node2Id = nodePath[i + 1];
            edges.forEach(e => {
                if (
                    (e.node1 === node1Id && e.node2 === node2Id) || (e.node1 === node2Id && e.node2 === node1Id)
                ) {
                    e.isHighlighted = true;
                }
            });
        }

        this.infoElement.textContent = `Shortest path: ${nodePath.join(' -> ')} (Distance: ${path.distance.toFixed(2)})`;
        this.draw(nodes, edges);
    }

    selectNode = (type, value) => {
        if (type === 'startNodeId') {
            this.graph.setMarkNode(value, 'start');
        } else if (type === 'endNodeId') {
            this.graph.setMarkNode(value, 'end');
        }

        const { nodes, edges } = this.graph.graphData;
        this.controller.updateSelectOptions(nodes);
        this.draw(nodes, edges);
    }

    draw(nodes, edges) {
        this.mapCanvas.draw(nodes, edges);
    }

    drawAsciiMatrix() {
        const matrix = this.graph.getWeightMatrix();
        const matrixContainer = document.querySelector('#matrix');
          const fragment = document.createDocumentFragment();

        for (let i = 0; i < matrix.length; i++) {
            const tableRow = document.createElement('tr');
            fragment.appendChild(tableRow);
            for (let j = 0; j < matrix[i].length; j++) {
                const tableCell = document.createElement('td');
                tableCell.textContent = matrix[i][j] === Infinity ? '∞' : matrix[i][j];
                tableRow.appendChild(tableCell);
            }
        }
        // const matrixFromCharacters = matrix.map(row => {
        //     return '| ' + row.map(v => (v === Infinity ? '∞' : v.toString().padStart(2, ' '))).join(' ') + ' |';
        // }).join('\n');

        matrixContainer.replaceChildren(fragment);
    }
}

const init = () => {
	window.removeEventListener('load', init);
    // Initialize the app with the canvas and control element IDs
	const app = new App('#map-canvas', '#controls');
    app.init();
	console.info('page loaded, app running');
}

window.addEventListener('load', init);