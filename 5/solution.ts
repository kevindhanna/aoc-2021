import { Testable } from "../lib";

const exampleInput = `0,9 -> 5,9
8,0 -> 0,8
9,4 -> 3,4
2,2 -> 2,1
7,0 -> 7,4
6,4 -> 2,0
0,9 -> 2,9
3,4 -> 1,4
0,0 -> 8,8
5,5 -> 8,2`;

interface Point { x: number, y: number };
interface Line { start: Point, end: Point };

const asPoint = (point: string): Point => {
    const [x, y] = point.split(",").map(n => parseInt(n));
    return { x, y }
};

export const parseInput = (input: string): Line[] => {
    return input.split("\n").filter(l => l !== "").map<Line>((l) => {
        const  [ start, end ] = l.split(" -> ").map(p => asPoint(p));
        return { start, end }
    })
}

class Map{
    map: number[][] = [];

    set(point: Point, v: number) {
        const { x, y } = point;
        if (!this.map[x]) {
            this.map[x] = [];
        }
        if (!this.map[x][y]) {
            this.map[x][y] = 0;
        }
        this.map[x][y] += v;
    }

    countIntersections(): number {
        return this.map.flat().filter(v => v > 1).length
    }
}

const isDiagonal = (line: Line): boolean => {
    const { start, end } = line;
    return start.x !== end.x && start.y !== end.y;
}

const moveTowards = (n: number, dest: number): number => {
    return n > dest ? n - 1 : n < dest ? n + 1 : n
}

const lineValues = (line: Line): Point[] => {
    const { start, end } = line;
    const points = [end];
    let { x, y } = start;
    while (x !== end.x || y !== end.y) {
        points.push({ x, y });
        x = moveTowards(x, end.x)
        y = moveTowards(y, end.y)
    }
    return points;
}

export const runA = (lines: Line[]): number => {
    const map = new Map();
    lines.filter(l => !isDiagonal(l)).forEach(l => {
        const linePoints = lineValues(l);
        linePoints.forEach(c => map.set(c, 1));
    })
    return map.countIntersections();
}

export const runB = (lines: Line[]): number => {
    const map = new Map();
    lines.forEach(l => {
        const linePoints = lineValues(l);
        linePoints.forEach(c => map.set(c, 1));
    })
    return map.countIntersections();
}

export const testsA: Testable[] = [{ input: parseInput(exampleInput), result: 5 }];
export const testsB: Testable[] = [{ input: parseInput(exampleInput), result: 12 }];
