const getDistance = (x1, y1, x2, y2) => Math.round(Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2));

export class MapCanvas {
    manualNodeCreation = false;
    manualEdgeCreation = false;
    circleRadius = 10;

    constructor(id, actions) {
        this.id = id;
        this.actions = actions || {};
    }

    init() {
        this.canvas = document.querySelector(this.id);
        this.ctx = this.canvas.getContext('2d');
    }

    draw(nodes, edges) {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        for (const edge of edges) {
            const node1 = nodes.find(n => n.id === edge.node1);
            const node2 = nodes.find(n => n.id === edge.node2);
            if (node1 && node2) {
                // draw line
                this.ctx.beginPath();
                this.ctx.moveTo(node1.x, node1.y);
                this.ctx.lineTo(node2.x, node2.y);
                this.ctx.strokeStyle = edge.isHighlighted ? 'orange' : 'black';
                this.ctx.stroke();  
                this.ctx.closePath();
                // draw weight
                const midX = (node1.x + node2.x) / 2;
                const midY = (node1.y + node2.y) / 2;
                this.ctx.fillStyle = 'blue';
                this.ctx.font = "12px serif";
                this.ctx.fillText(edge.w, midX, midY);
            }
        }

        for (const node of nodes) {
            // draw node
            this.ctx.beginPath();
            this.ctx.arc(node.x, node.y, this.circleRadius, 0, 2 * Math.PI);
            if (node.isStart || node.isEnd) {
                this.ctx.fillStyle = 'green';
            } else if (node.isHighlighted) {
                this.ctx.fillStyle = 'orange';
            } else {
                this.ctx.fillStyle = 'blue';
            }
            this.ctx.fill();
            this.ctx.beginPath();
            this.ctx.font = "16px serif";
            this.ctx.fillText(node.id, node.x - 5, node.y - 13);
            this.ctx.closePath();
        }
    }

    toggleManualNodeCreation = () => {
        if (this.manualEdgeCreation) { this.toggleManualEdgeCreation(); }
        this.manualNodeCreation = !this.manualNodeCreation;

        if (this.manualNodeCreation) {
            this.canvas.style.cursor = 'crosshair';
            this.canvas.onclick = (e) => {
                const rect = this.canvas.getBoundingClientRect();
                this.actions.onCreateNode(e.clientX - rect.left, e.clientY - rect.top);
            }
        } else {
            this.canvas.onclick = null;
            this.canvas.style.cursor = 'default';

        }
        return this.manualNodeCreation;
    }

    toggleManualEdgeCreation = () => {
        if (this.manualNodeCreation) { this.toggleManualNodeCreation(); }
        this.manualEdgeCreation = !this.manualEdgeCreation;
        this.selectedNode = []

        if (this.manualEdgeCreation) {
            this.canvas.style.cursor = 'crosshair';
            this.canvas.onclick = (e) => {
                const rect = this.canvas.getBoundingClientRect();
                const currentNode = this.detectNodeAtClickPos(e.clientX - rect.left, e.clientY - rect.top);
                if (!currentNode) { return; }

                if (this.selectedNode.length === 2) {
                    const [node1, node2] = this.selectedNode;
                    const weight = getDistance(node1.data.x, node1.data.y, node2.data.x, node2.data.y);
                    this.selectedNode = [];
                    this.actions.onCreateEdge(node1.id, node2.id, weight);
                }
            }
        } else {
            this.canvas.onclick = null;
            this.canvas.style.cursor = 'default';
        }
        return this.manualEdgeCreation;
    }
    
    detectNodeAtClickPos = (x, y) => {
        const { nodes } = this.actions.getGraphData();
        const accurancyTreshold = this.circleRadius;
        let currentNode = null;

        // search after the closest node to the click position
        // which is within the accurancy treshold
        // if multiple nodes are within the treshold, take the closest one
        nodes.forEach(nodeData => {
            const distance = getDistance(x, y, nodeData.x, nodeData.y);
            if (distance < accurancyTreshold && (!currentNode || distance < currentNode.distance)) {
                currentNode = {
                    id: nodeData.id,
                    distance,
                    data: nodeData
                };
            }
        });

        if (currentNode && (this.selectedNode !== 1 || this.selectedNode[0].id !== currentNode.id)) {
            this.selectedNode.push(currentNode);
        }

        return currentNode;
    }
}
