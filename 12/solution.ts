import assert from "assert/strict";
import { strongPop } from "../lib";

const exampleInputA = `start-A
start-b
A-c
A-b
b-d
A-end
b-end`;

const exampleInputB = `dc-end
HN-start
start-kj
dc-start
dc-HN
LN-dc
HN-end
kj-sa
kj-HN
kj-dc`;

const exampleInputC = `fs-end
he-DX
fs-he
start-DX
pj-DX
end-zg
zg-sl
zg-pj
pj-he
RW-he
fs-DX
pj-RW
zg-RW
start-pj
he-WI
zg-he
pj-fs
start-RW`;

interface Node {
    id: string;
    big: boolean;
    edges: Node[];
}
type Graph = Map<string, Node>

const findOrMakeNode = (id: string, map: Graph): Node => {
    if (map.has(id)) {
        return map.get(id) as Node;
    } else {
        const node = {
            id: id,
            big: id === id.toUpperCase(),
            edges: [],
        } as Node;
        map.set(id, node);
        return node;
    }
}

export const parseInput = (input: string): Node => {
    const map: Graph = new Map();
    input.split("\n").filter(e => e !== "").forEach(e => {
        const [startId, endId] = e.split("-");
        const start = findOrMakeNode(startId, map);
        const end = findOrMakeNode(endId, map);
        start.edges.push(end);
        end.edges.push(start);
    });
    const start = map.get("start");
    assert(start)

    return start;
}

type Path = Node[];
const walkPaths = (
    paths: Path[],
    callback: (node: Node, currentPath: Path, newPaths: Path[]) => void
): Path[] => {
    const newPaths: Path[] = [];
    while (paths.length) {
        const path = strongPop<Path>(paths)
        const current = path[0];
        current.edges.forEach(node => callback(node, path, newPaths))
    }
    return newPaths;
}

export const runA = (start: Node): number => {
    let paths: Path[] = [[start]];
    const completedPaths: Path[] = [];

    while (paths.length) {
        paths = walkPaths(paths, (node, currentPath, newPaths) => {
            if (node.id === "end") {
                completedPaths.push([node].concat(currentPath));
            } else if (node.big || !currentPath.includes(node)) {
                newPaths.push([node].concat(currentPath));
            }
        })
    }
    return completedPaths.length;
}

const canVisitSmallNodeTwice = (path: Path): boolean => {
    const smalls = path.filter(n => !n.big);
    const hasDuplicate = smalls.some(small => path.filter(n => n.id === small.id).length === 2);
    return !hasDuplicate;
}

export const runB = (start: Node): number => {
    let paths: Path[] = [[start]];
    const completedPaths: Path[] = [];

    while (paths.length) {
        paths = walkPaths(paths, (node, currentPath, newPaths) => {
            if (node.id === "start") {
                return;
            }
            if (node.id === "end") {
                completedPaths.push([node].concat(currentPath));
            } else if (node.big || !currentPath.includes(node)) {
                newPaths.push([node].concat(currentPath));
            }else if (canVisitSmallNodeTwice(currentPath)) {
                newPaths.push([node].concat(currentPath));
            }
        });
    }
    return completedPaths.length;
}

export const tests = [
    {
        description: "Count paths on small example map",
        input: parseInput(exampleInputA),
        result: 10,
        fn: runA,
    },
    {
        description: "Count paths on medium example map",
        input: parseInput(exampleInputB),
        result: 19,
        fn: runA,
    },
    {
        description: "Count paths on large example map",
        input: parseInput(exampleInputC),
        result: 226,
        fn: runA,
    },
    {
        description: "Count paths on small example map with ability to visit small node twice",
        input: parseInput(exampleInputA),
        result: 36,
        fn: runB,
    },
];
