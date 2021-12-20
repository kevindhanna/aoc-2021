const exampleInput = `6,10
0,14
9,10
0,3
10,4
4,11
6,0
6,12
4,1
0,13
10,12
3,4
3,0
8,4
1,10
2,14
8,10
9,0

fold along y=7
fold along x=5`;

type Point = [number, number];
type Fold = [ "x"|"y", number ]
interface Input {
    coords: Point[];
    folds: Fold[];
}
export const parseInput = (input: string): Input => {
    const parts = input.split(/\n\n/).map(t => t.split('\n'));
    const coords = parts[0].map(c => c.split(',').map(n => parseInt(n)) as Point)
    const folds = parts[1].map(f => f.replace(/fold along /g, ""))
        .map(f => f.split("="))
        .map<Fold>(f => [f[0] as "x"|"y", parseInt(f[1])]);
    return {
        coords,
        folds
    };
}

export const runA = ({ coords, folds }: Input): number => {
    const map: Map<string, boolean> = new Map();
    const [ direction, fold ] = folds[0];
    coords.forEach(p => {
        let [x, y] = p;
        if (direction === "x") {
            if (x > fold) {
                x = fold - (x - fold);
            }
        } else {
            if (y > fold) {
                y = fold - (y - fold);
            }
        }
        map.set([x,y].join(), true);
    });

    return map.size;
}

const print = (map: string[][]): void => {
    const output: string[] = [];
    map.forEach(l => {
        const lineOut: string[] = [];
        l.join().split(",").forEach(v => {
            lineOut.push(v || ".");
        })
        output.push(lineOut.join(""));
    })
    console.log(output.join("\n"));
}

export const runB = ({ coords, folds }: Input): void => {
    const map: string[][] = [];
    coords.forEach(p => {
        let [x, y] = p;
        folds.forEach(f => {
            const [direction, fold] = f;
            if (direction === "x") {
                if (x > fold) {
                    x = fold - (x - fold);
                }
            } else {
                if (y > fold) {
                    y = fold - (y - fold);
                }
            }
        })
        if (!map[y]) {
            map[y] = [];
        }
        map[y][x] = "#"
    });

    print(map);
}

export const tests = [
    {
        description: "Count visible dots",
        input: parseInput(exampleInput),
        result: 17,
        fn: runA,
    }
];
