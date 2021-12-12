import assert from "assert/strict";

export type Point = [number, number];
export class Grid {
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
    neighbourCoords(point: Point): Point[] {
        const [y, x] = point;
         return [
            [y, x-1],
            [y, x+1],
            [y - 1, x],
            [y + 1, x],
        ];
    }
    findNeighbours(point: Point, condition?: (p: Point) => boolean): Point[] {
        return this.neighbourCoords(point).reduce<Point[]>((neighbours, p) => {
            if (this.hasPoint(p)) {
                if (!condition) {
                    neighbours.push(p);
                } else if (condition(p)) {
                    neighbours.push(p);
                }
            }
            return neighbours
        }, []);
    }
    print(): void {
        const printed: number[][] = [];
        const entries = this.map.entries();
        let current = entries.next()
        while (!current.done) {
            const [coordsString, val] = current.value;
            const coords = coordsString.split(",").map(n => parseInt(n)) as [number, number];
            if (!printed[coords[0]]) {
                printed.push([]);
            }
            printed[coords[0]].push(val);
            current = entries.next();
        }
        console.log(printed.map(l => l.join(" ")).join('\n'), '\n')
    }
}
