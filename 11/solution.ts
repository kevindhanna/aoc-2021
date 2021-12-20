import { Grid, Point, strongPop } from "../lib";

const exampleInput = `5483143223
2745854711
5264556173
6141336146
6357385478
4167524645
2176841721
6882881134
4846848554
5283751526`;

const asPoint = (point: string): Point => point.split(",").map(n => parseInt(n)) as Point;

class OctoMap extends Grid<number> {
    tick(): Point[] {
        const flashed: Point[] = [];
        const entries = this.map.entries();
        let current = entries.next();
        while (!current.done) {
            const [ pointString, value ] = current.value;
            const point = asPoint(pointString)
            if (value === 9) {
                flashed.push(point)
                this.set(point, 0);
            } else {
                this.set(point, value + 1);
            }
            current = entries.next();
        }
        return flashed;
    }
    neighbourCoords(point: Point): Point[] {
        const [y, x] = point;
         return [
            [y, x-1],
            [y, x+1],
            [y - 1, x],
            [y + 1, x],
            [y + 1, x + 1],
            [y - 1, x - 1],
            [y + 1, x - 1],
            [y - 1, x + 1],
        ];
    }
    flash(octo: Point): Point[] {
        const flashed: Point[] = [];
        this.findNeighbours(octo).map(o => {
            const val = this.strongGet(o);
            if (val === 9) {
                flashed.push(o);
                this.set(o, 0);
            } else if (val > 0) {
                this.set(o, val + 1);
            }
        });
        return flashed;
    }
};
export const parseInput = (input: string): OctoMap => {
    return new OctoMap(input, parseInt);
}

export const runA = (octos: OctoMap): number => {
    let tick = 0;
    let totalFlashed = 0;
    while (tick < 100) {
        let flashed = octos.tick();
        while (flashed.length) {
            const octo = strongPop(flashed);
            ++totalFlashed;
            flashed  = flashed.concat(octos.flash(octo));
        }
        ++tick
    }
    return totalFlashed;
}

export const runB = (octos: OctoMap): number => {
    let tick = 0;
    let looping = true;
    while (looping) {
        let flashed = octos.tick();
        let flashedCount = 0;
        while (flashed.length) {
            const octo = strongPop(flashed);
            ++flashedCount;
            flashed  = flashed.concat(octos.flash(octo));
        }
        ++tick
        if (flashedCount === octos.height * octos.width) {
            looping = false;
            return tick;
        }
    }
    throw "Shouldn't get here"
}

export const tests = [
    {
        description: "Count flashed octopodes",
        input: parseInput(exampleInput),
        result: 1656,
        fn: runA,
    },
    {
        description: "Find first simultaneous flash",
        input: parseInput(exampleInput),
        result: 195,
        fn: runB,
    },
];
