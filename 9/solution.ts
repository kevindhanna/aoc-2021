import { Grid, Point } from "../lib";

const exampleInput =`2199943210
3987894921
9856789892
8767896789
9899965678`;

class FloorMap extends Grid {};
export const parseInput = (input: string): FloorMap => {
    return new FloorMap(input);
}

const isLowest = (map: FloorMap, point: Point): boolean => {
    const val = map.strongGet(point);
    const neighbourVals = map.findNeighbours(point).map(p => map.strongGet(p));
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
        const neighbours = map.findNeighbours(current, (p) => map.strongGet(p) !== 9).filter(n => !basin.map(p => p.join()).includes(n.join()));
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
