"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findPath = exports.nodes = void 0;
const converters_1 = require("./converters/image/converters");
const converters = [...converters_1.converters];
console.log('Converters', converters);
const nodes = {};
exports.nodes = nodes;
converters.forEach((converter) => {
    nodes[converter.to] = nodes[converter.to] || {
        type: converter.to,
        edges: [],
    };
    nodes[converter.from] = nodes[converter.from] || {
        type: converter.from,
        edges: [],
    };
    nodes[converter.from].edges.push({
        converter,
        from: nodes[converter.from],
        to: nodes[converter.to],
    });
});
console.log('Graph', nodes);
function findPath(start, end) {
    const visited = {};
    const queue = [];
    queue.push({ node: nodes[start], path: [] });
    visited[start] = true;
    while (queue.length > 0) {
        const current = queue.shift();
        console.log('Current', current);
        if (!current) {
            continue;
        }
        if (current.node.type === end) {
            return current.path;
        }
        for (const edge of current.node.edges) {
            if (!visited[edge.to.type]) {
                queue.push({
                    node: edge.to,
                    path: [...current.path, edge],
                });
                visited[edge.to.type] = true;
            }
        }
    }
    return null;
}
exports.findPath = findPath;
