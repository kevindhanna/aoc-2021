import { Grid, Point } from "../lib/grid.js";

const exampleInput = `1163751742
1381373672
2136511328
3694931569
7463417111
1319128137
1359912421
3125421639
1293138521
2311944581`;

export const parseInput = (input: string): Grid<number> => {
    return new Grid<number>(input, parseInt);
}

const asPoint = (p: string): Point => p.split(",").map(n => parseInt(n)) as Point;

class Queue {
    queue: Set<string>;
    constructor() {
        this.queue = new Set([]);
    }
    push(p: Point) {
        this.queue.add(p.join())
    }
    popLowest(map: Grid<number>): Point {
        if (!this.queue.size) {
            throw "Queue Empty"
        }
        let min = this.queue.values().next().value
        this.queue.forEach((p) => {
            if (map.strongStringGet(p) < map.strongStringGet(min)) {
                min = p;
            }
        });
        this.queue.delete(min);
        return asPoint(min);
    }
    empty(): boolean {
        return this.queue.size < 1;
    }
    contains(point: Point): boolean {
        return this.queue.has(point.join());
    }
    length() {
        return this.queue.size;
    }
}

const findShortestPath = (difficultyMap: Grid<number>) => {
    const distanceMap = new Grid("", () => 1);
    const queue = new Queue();
    distanceMap.set([0,0], 0);
    queue.push([0,0])
    const destP: Point = [difficultyMap.height - 1, difficultyMap.width -1];

    while (!queue.empty()) {
        const current = queue.popLowest(distanceMap);
        const currentDistance = distanceMap.strongGet(current);
        difficultyMap.delete(current);
        const neighbours = difficultyMap.findNeighbours(current);
        neighbours.forEach(n => {
            const newDist = currentDistance + difficultyMap.strongGet(n);
            if (distanceMap.hasPoint(n)) {
                const currentDist = distanceMap.strongGet(n);
                if (newDist < currentDist) {
                    distanceMap.set(n, newDist);
                }
            } else {
                distanceMap.set(n, newDist);
            }
            queue.push(n);
        })
    }
    return distanceMap.strongGet(destP);
}

const modVal = (val: number, mod: number): number => {
    val += mod;
    if (val > 9) {
        val -= 9;
    }
    return val;
}

export const multiplyMap = (map: Grid<number>): Grid<number> => {
    const newEntries: [string, number][] = [];
    const entries = map.entries();
    let next = entries.next();

    const height = map.height;
    const width = map.width;

    while (!next.done) {
        const [p, v] = next.value;
        const point = asPoint(p);
        [1,2,3,4].forEach(yMod => {
            const [y,x] = point;
            newEntries.push([
                [y + (yMod * height), x].join(),
                modVal(v, yMod),
            ]);
            [1,2,3,4].forEach(xMod => {
                newEntries.push([
                    [y, x + (xMod * width)].join(),
                    modVal(v, xMod),
                ]);
                newEntries.push([
                    [y + (yMod * height), x + (xMod * width)].join(),
                    modVal(modVal(v, yMod), xMod),
                ]);
            })
        });
        next = entries.next();
    }
    newEntries.forEach(e => {
        const [key, val] = e;
        map.setString(key, val)
    });
    map.setHeight(map.height * 5);
    map.setWidth(map.width * 5);

    return map;
}

export const runA = findShortestPath
export const runB = (difficultyMap: Grid<number>) => findShortestPath(multiplyMap(difficultyMap));

export const tests = [
    {
        description: "Find shortest path",
        input: parseInput(exampleInput),
        result: 40,
        fn: runA,
    },
    {
        description: "Find shortest path in extended map",
        input: parseInput(exampleInput),
        result: 315,
        fn: runB,
    },
];
