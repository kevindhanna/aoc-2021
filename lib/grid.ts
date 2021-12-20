import assert from "assert/strict";

export type Point = [number, number];
export class Grid<T> {
    map: Map<string, T>;
    height: number;
    width: number;

    constructor(input: string, parseFn: (val: string) => T) {
        this.map = new Map();
        const lines = input.split("\n").filter(l => l !== "");
        this.width = lines[0]?.length || 0;
        this.height = lines.length;
        lines.forEach(
            (l, y) => l.split("").forEach(
                (n, x) => {
                    this.set([ y, x ], parseFn(n));
                }
            ),
        );
    }

    set(point: Point, val: T) {
        this.map.set(point.join(), val);
    }
    setString(point: string, val: T) {
        this.map.set(point, val);
    }
    get(point: Point) {
        return this.map.get(point.join());
    }
    stringGet(point: string) {
        return this.map.get(point);
    }
    delete(point: Point) {
        this.map.delete(point.join());
    }
    hasPoint(point: Point): boolean {
        return this.map.has(point.join());
    }
    hasStringPoint(point: string): boolean {
        return this.map.has(point);
    }
    strongGet(point: Point): T {
        const val = this.get(point);
        assert(val !== undefined);
        return val
    }
    strongStringGet(point: string): T {
        const val = this.stringGet(point);
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
    entries() {
        return this.map.entries();
    }
    setHeight(h: number) {
        this.height = h;
    }
    setWidth(w: number) {
        this.width = w;
    }
    asArray(): T[][] {
        const array: T[][] = new Array(this.height);
        const entries = this.map.entries();
        let current = entries.next()
        while (!current.done) {
            const [coordsString, val] = current.value;
            const coords = coordsString.split(",").map(n => parseInt(n)) as [number, number];
            if (!array[coords[0]]) {
                array[coords[0]] = new Array(this.width)
            }
            array[coords[0]][coords[1]] = val;
            current = entries.next();
        }
        return array;
    }
    print(): void {
        console.log(this.asArray().map(l => l.join(" ")).join('\n'), '\n')
    }
}
