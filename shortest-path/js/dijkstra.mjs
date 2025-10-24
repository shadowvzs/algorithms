 /**
   * Dijkstra's Algorithm: Find shortest paths from a start node.
   * @params {string} start - The starting node.
   *         {string[]} nodes - List of all node ids.
   *         {Map<string, Map<string, number>>} adjacencyList - Map of node to its neighbors and edge weights.
   * @returns {{distances: Map<string, number>, previous: Map<string, string|null>}}
 */
export const dijkstra = (nodes, adjacencyList, startNodeId, endNodeId) => {
    if (!nodes.has(startNodeId)) {
        throw new Error(`Start node "${startNodeId}" does not exist.`);
    }

    const distances = new Map();
    const previous = new Map();
    const visited = new Set();

    // Initialize distances and previous
    for (const node of nodes) {
        distances.set(node, Infinity);
        previous.set(node, null);
    }
    distances.set(startNodeId, 0);

    while (visited.size !== nodes.size) {
        // Get the closest unvisited node
        let currentNode = null;
        let smallestDistance = Infinity;

        // get the node with the smallest distance from the node list which is not visited
        for (const [node, dist] of distances.entries()) {
            if (!visited.has(node) && dist < smallestDistance) {
                smallestDistance = dist;
                currentNode = node;
            }
        }

        // if no more reachable nodes, then break
        if (currentNode === null) break; // No reachable nodes remain
        visited.add(currentNode);

        // Update all non visited current node's neighbor distance
        for (const [neighbor, weight] of adjacencyList.get(currentNode)) {
            // only consider unvisited neighbors
            if (!visited.has(neighbor)) {
                const newDistance = distances.get(currentNode) + weight;
                // If new distance is smaller, update it
                if (newDistance < distances.get(neighbor)) {
                    distances.set(neighbor, newDistance);
                    previous.set(neighbor, currentNode);
                }
            }
        }
    }

    // Return distances and previous nodes for path reconstruction
    // start with the end node and get the closest connected node
    // the it will check the closest connected node and check which is closest node to it
    // until it reaches the start node
    const nodePath = [];
    let currentNode = endNodeId;
    while (currentNode !== null) {
        nodePath.unshift(currentNode);
        // get the closest connected node to the current node
        currentNode = previous.get(currentNode);
    }

    let path = null;
    if (nodePath[0] === startNodeId) {
        path = {
            nodePath,
            distance: distances.get(endNodeId)
        };
    }

    return {
        distances,
        previous,
        path
    };
}