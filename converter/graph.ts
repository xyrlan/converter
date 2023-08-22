import { Converter } from './converters/def';

type Edge = {
    from: string;
    to: string;
    converter: Converter;
};

type Node = {
    type: string;
    edges: Edge[];
};

type Graph = Record<string, Node>;

export function createGraph(converters: Record<string, Converter>): Graph {
    const graph: Graph = {};

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

export function shortestPath(graph: Graph, start: string, end: string): Converter[] | null {
    const visited: Record<string, boolean> = {};
    const queue: { node: string; path: Converter[] }[] = [];

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