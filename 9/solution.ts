import assert from "assert/strict";

const exampleInput =`2199943210
3987894921
9856789892
8767896789
9899965678`;


type Point = [number, number];
class FloorMap {
    map: Map<string, number>;
    height: number;
    width: number;

    constructor(input: string) {
        this.map = new Map();
        const lines = input.split("\n").filter(l => l !== "");
        this.width = lines[0].length;
        this.height = lines.length;
        lines.forEach(
            (l, y) => l.split("").forEach(
                (n, x) => {
                    this.set([ y, x ], parseInt(n))
                }
            )
        );
    }

    set(point: Point, val: number) {
        this.map.set(point.join(), val)
    }
    get(point: Point) {
        return this.map.get(point.join())
    }
    hasPoint(point: Point): boolean {
        return this.map.has(point.join());
    }
    strongGet(point: Point): number {
        const val = this.get(point);
        assert(val !== undefined);
        return val
    }
}
export const parseInput = (input: string): FloorMap => {
    return new FloorMap(input);
}

const findNeighbours = (point: Point, map: FloorMap, condition?: (p: Point) => boolean): Point[] => {
    const [ y, x ] = point;
    const neighbourCoords: Point[] = [
        [y, x-1],
        [y, x+1],
        [y - 1, x],
        [y + 1, x],
    ]
    return neighbourCoords.reduce<Point[]>((neighbours, p) => {
        if (map.hasPoint(p)) {
            if (!condition) {
                neighbours.push(p);
            } else if (condition(p)) {
                neighbours.push(p);
            }
        }
        return neighbours
    }, []);
}

const isLowest = (map: FloorMap, point: Point): boolean => {
    const val = map.strongGet(point);
    const neighbourVals = findNeighbours(point, map).map(p => map.strongGet(p));
    return !neighbourVals.some(n => n <= val);
}

export const findLowPoints= (map: FloorMap): Point[] => {
    const lowPoints: Point[] = [];
    let y = 0;
    while (y < map.height) {
        let x = 0;
        while (x < map.width) {
            if (isLowest(map, [y, x])) {
                lowPoints.push([y, x]);
                x += 2;
            } else {
                ++x;
            }
        }
        ++y;
    }
    return lowPoints
}

export const runA = (map: FloorMap) => {
    const lowPoints = findLowPoints(map).map(p => map.strongGet(p));
    return lowPoints.length + lowPoints.reduce<number>((acc, point) => acc += point, 0);
}

const findBasin = (point: Point, map: FloorMap): Point[] => {
    let queue: Point[] = [point];
    let basin: Point[] = [point];
    let looping = true;
    while (looping) {
        const current = queue.pop();
        if (!current) {
            looping = false;
            continue
        }
        const neighbours = findNeighbours(current, map, (p) => map.strongGet(p) !== 9).filter(n => !basin.map(p => p.join()).includes(n.join()));
        basin = basin.concat(neighbours);
        queue = queue.concat(neighbours);
    }

    return basin
}

export const findBasins = (map: FloorMap) => {
    const lowPoints = findLowPoints(map);
    return lowPoints.map((point) => findBasin(point, map))
}

export const runB = (map: FloorMap) => {
    const basins = findBasins(map);
    const threeLargest = basins.sort((a, b) => {
        return b.length - a.length;
    }).slice(0, 3);

    return threeLargest.reduce((acc, b) => acc * b.length, 1);
}

export const testsA = [{ input: parseInput(exampleInput), result: 15 }];
export const testsB = [{ input: parseInput(exampleInput), result: 1134 }];
