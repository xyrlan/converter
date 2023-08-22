import { Converter } from './converters/def';
import * as rawConverters from './converters'


const converters = rawConverters as unknown as Record<string, Converter>
console.log('Converters', converters)
type Edge = {
    converter: Converter
    from: Node
    to: Node
}

type Node = {
    type: string
    edges: Edge[]
}

const nodes: Record<string, Node> = {}
Object.keys(converters).forEach((key) => {
    const converter = converters[key as keyof typeof converters]
    nodes[converter.to] = nodes[converter.to] || {
        type: converter.to,
        edges: [],
    }
    nodes[converter.from] = nodes[converter.from] || {
        type: converter.from,
        edges: [],
    }
    nodes[converter.from].edges.push({
        converter,
        from: nodes[converter.from],
        to: nodes[converter.to],
    })
})

export { nodes }


export type Path = Edge[] | null;

export function findPath(start: string, end: string) {
    const visited: Record<string, boolean> = {};
    const queue: { node: Node, path: Edge[] }[] = [];

    queue.push({ node: nodes[start], path: [] });
    visited[start] = true;

    while (queue.length > 0) {
        const current = queue.shift()
        if (!current) {
            continue;
        }

        if (current.node.type === end) {
            return current.path
        }
        for (const edge of current.node.edges) {
            if (!visited[edge.to.type]) {
                queue.push({
                    node: edge.to,
                    path: [...current.path, edge],
                })

                visited[edge.to.type] = true
            }
        }
    }

    return null
}