const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const getDistance = (x1, y1, x2, y2) => Math.round(Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2));

export class Graph {
    get graphData() {
        return {
            nodes: this.nodes,
            edges: this.edges
        };
    }

    constructor(nodes, edges, directed = false) {
        this.directed = directed;
        this.nodes = new Set(nodes || []);
        this.adjacencyList = new Map();
        this.edges = edges || [];
    }

    // Add a node
    addNode(node) {
        if (this.nodes.has(node)) return;
        this.nodes.add(node);
        this.adjacencyList.set(node, new Map());
    }

    // Add an undirected edge (both directions)
    addEdge(node1, node2, weight) {
        if (typeof weight !== 'number' || weight <= 0) {
            throw new Error('Weight must be a positive number');
        }

        // ensure nodes exist
        this.nodes.add(node1);
        this.nodes.add(node2);

        // update adjacency list
        this.adjacencyList.get(node1).set(node2, weight);

        // add to edges list
        this.edges.push({ node1, node2, w: weight });

        if (!this.directed) {
            // add edge (node2 -> node1)
            this.adjacencyList.get(node2).set(node1, weight);
            this.edges.push({ node1: node2, node2: node1, w: weight });
        }
    }

    getWeightMatrix() {
        const matrix = [];
        if (this.directed) {
            throw new Error('Not implemented for directed graphs, there should be verified the edge direction');
        } else {
            const nodes = Array.from(this.nodes);
    
            for (let i = 0; i < nodes.length; i++) {
                matrix[i] = [];
                for (let j = 0; j < nodes.length; j++) {
                    if (i === j) {
                        matrix[i][j] = 0;
                    } else {
                        const weight = this.adjacencyList.get(nodes[i]).get(nodes[j]);
                        matrix[i][j] = weight !== undefined ? weight : Infinity;
                    }
                }
            }
        }

        return matrix;
    }

    // Dirac's theorem: A graph with n vertices (n ≥ 3) is Hamiltonian if every vertex has degree n/2 or greater.
    getIsDirac() {
        const n = this.nodes.size;
        const nodeDegreeArray = this.adjacencyList.values().map(nodes => nodes.size);
        const minNodeDegree = Math.min(nodeDegreeArray);
        return minNodeDegree >= n / 2;
    }

    // Ore's theorem: A graph with n vertices (n ≥ 3) is Hamiltonian if for every pair of non-adjacent vertices, the sum of their degrees is at least n.
    getIsOre() {
        const nodes = Array.from(this.nodes);
        const n = nodes.length;
        for (let i = 0; i < n; i++) {
            for (let j = i + 1; j < n; j++) {
                const nodeA = nodes[i];
                const nodeB = nodes[j];
                if (!this.adjacencyList.get(nodeA).has(nodeB)) {
                    const degreeA = this.adjacencyList.get(nodeA).size;
                    const degreeB = this.adjacencyList.get(nodeB).size;
                    if (degreeA + degreeB < n) {
                        return false;
                    }
                }
            }
        }
        return true;
    }
}

export class GraphWithMeta extends Graph {
    nodeNames = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

    get nodesWithMeta() {
        if (!this.nodes || this.nodes.size === 0) return [];
        const nodes = Array.from(this.nodes.keys());
        return nodes.map(id => ({ id, ...this.nodesMeta.get(id) }));
    }

    get graphData() {
        return {
            nodes: this.nodesWithMeta,
            edges: this.edges
        };
    }

    get nextNodeId() {
        if (this.nodes.size >= this.nodeNames.length) {
            return alert('Maximum node limit reached');
        }
        return this.nodeNames[this.nodes.size];
    }

    constructor(nodes = [], edges = [], directed = false) {
        super(nodes.map(n => n.id), edges, directed);
        this.nodesMeta = new Map(); // id -> { x, y, isStart, isEnd, isHighlighted }
        for (const node of nodes) {
            this.nodesMeta.set(node.id, { x: node.x, y: node.y, isStart: !!node.isStart, isEnd: !!node.isEnd, isHighlighted: !!node.isHighlighted });
        }
    }

    // mark as start or end node
    setMarkNode(nodeId, markedAs) {
        if (!this.nodes.has(nodeId)) {
            throw new Error(`Node "${nodeId}" does not exist.`);
        }
        if (markedAs !== 'start' && markedAs !== 'end') {
            throw new Error(`markedAs must be "start" or "end".`);
        }

        if (markedAs === 'start') {
            if (this.startNodeId) {
                this.nodesMeta.get(this.startNodeId).isStart = false;
            }
            this.startNodeId = nodeId;
            this.nodesMeta.get(nodeId).isStart = true;
        } else if (markedAs === 'end') {
            if (this.endNodeId) {
                this.nodesMeta.get(this.endNodeId).isEnd = false;
            }
            this.endNodeId = nodeId;
            this.nodesMeta.get(nodeId).isEnd = true;
        }
    }

    generateNodes(minX = 50, maxX = 750, minY = 50, maxY = 550, nodeCounter = 8) {
        for (let i = 0; i < nodeCounter; i++) {
            const id = this.nodeNames[i];
            const x = randomInt(minX, maxX);
            const y = randomInt(minY, maxY);
            this.addNode({ id, x, y });
        }
    }

    generateEdges() {
        const nodes = [...this.nodes.keys()];

        // create edges
        for (let i = 0; i < nodes.length; i++) {
            const currentNode = nodes[i];
            const otherNodes = nodes.filter(n => n !== nodes[i]);
            const otherNode = otherNodes[randomInt(0, otherNodes.length - 1)];

            // create 1 edge to each node, randomly
            const edgeExists = this.edges.find(e => (e.node1 === currentNode && e.node2 === otherNode) || (e.node2 === currentNode && e.node1 === otherNode));
            if (edgeExists) continue;
            const currentNodeData = this.nodesMeta.get(currentNode);
            const otherNodeData = this.nodesMeta.get(otherNode);
            const weight = getDistance(currentNodeData.x, currentNodeData.y, otherNodeData.x, otherNodeData.y);
            this.addEdge(currentNode, otherNode, weight);
        }
    }

    addNode(node) {
        const nodeId = node.id || this.nextNodeId;
        super.addNode(nodeId);
        const metaData = {
            x: node.x,
            y: node.y,
            isStart: !!node.isStart,
            isEnd: !!node.isEnd,
            isHighlighted: !!node.isHighlighted
        };
        this.nodesMeta.set(nodeId, metaData);
    }
}
