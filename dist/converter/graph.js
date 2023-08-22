"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.shortestPath = exports.createGraph = void 0;
function createGraph(converters) {
    const graph = {};
    for (const converterName in converters) {
        const converter = converters[converterName];
        if (!graph[converter.from]) {
            graph[converter.from] = { type: converter.from, edges: [] };
        }
        if (!graph[converter.to]) {
            graph[converter.to] = { type: converter.to, edges: [] };
        }
        graph[converter.from].edges.push({
            from: converter.from,
            to: converter.to,
            converter,
        });
    }
    return graph;
}
exports.createGraph = createGraph;
function shortestPath(graph, start, end) {
    const visited = {};
    const queue = [];
    queue.push({ node: start, path: [] });
    visited[start] = true;
    while (queue.length > 0) {
        const current = queue.shift();
        if (!current) {
            continue;
        }
        const currentNode = graph[current.node];
        if (currentNode.type === end) {
            return current.path;
        }
        for (const edge of currentNode.edges) {
            if (!visited[edge.to]) {
                queue.push({
                    node: edge.to,
                    path: [...current.path, edge.converter],
                });
                visited[edge.to] = true;
            }
        }
    }
    return null;
}
exports.shortestPath = shortestPath;
