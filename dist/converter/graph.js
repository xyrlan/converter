"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.findPath = exports.nodes = void 0;
const rawConverters = __importStar(require("./converters"));
const converters = rawConverters;
console.log('Converters', converters);
const nodes = {};
exports.nodes = nodes;
Object.keys(converters).forEach((key) => {
    const converter = converters[key];
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
function findPath(start, end) {
    const visited = {};
    const queue = [];
    queue.push({ node: nodes[start], path: [] });
    visited[start] = true;
    while (queue.length > 0) {
        const current = queue.shift();
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
