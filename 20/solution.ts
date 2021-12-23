import { Grid, Point, Testable } from "../lib";

const exampleInput = `..#.#..#####.#.#.#.###.##.....###.##.#..###.####..#####..#....#..#..##..##
#..######.###...####..#..#####..##..#.#####...##.#.#..#.##..#.#......#.###
.######.###.####...#.##.##..#..#..#####.....#.#....###..#.##......#.....#.
.#..#..##..#...##.######.####.####.#.#...#.......#..#.#.#...####.##.#.....
.#..#...##.#.##..#...##.#.##..###.#......#.#.......#.#.#.####.###.##...#..
...####.#..#..#.##.#....##..#.####....##...##..#...#......#.#.......#.....
..##..####..#...#.#.#...##..#.#..###..#####........#..####......#..#

#..#.
#....
##..#
..#..
..###`;

class ImageMap extends Grid<string> {
    constructor() {
        super("", () => "")
    }
    minMax(): {min: Point, max: Point} {
        let min: Point = [0,0];
        let max: Point = [0,0];
        this.map.forEach((_, p) => {
            const point = asPoint(p);
            if (point[0] < min[0] && point[1] < min[1]) {
                min = point;
            }
            if (point[0] > max[0] && point[1] > max[1]) {
                max = point;
            }
        })
        return { min, max };
    }
    asArray(): string[][] {
        const { min, max } = this.minMax();
        const width = max[1] - (0 + min[1])
        const height = max[0] - (0 + min[0])
        const array: string[][] = new Array(height);
        const entries = this.map.entries();
        let current = entries.next()
        while (!current.done) {
            const [coordsString, val] = current.value;
            const coords: Point = asPoint(coordsString);
            const compCoord = [coords[0] + Math.abs(min[0]), coords[1] + Math.abs(min[1])];
            if (!array[compCoord[0]]) {
                array[compCoord[0]] = new Array(width)
            }
            array[compCoord[0]][compCoord[1]] = val;
            current = entries.next();
        }

        return array;
    }
    print(): void {
        console.log(this.asArray().map(l => l.join("")).join('\n'), '\n')
    }
};
interface Input {
    image: ImageMap;
    algo: string;
}
export const parseInput = (input: string): Input => {
    const [algo, image] = input.split("\n\n").filter(l => l !== "");
    const imageMap: ImageMap = new ImageMap();
    image.split("\n").filter(l => l !== "").map(
        (l, i) => l.split("").forEach(((c, j) => {
            imageMap.set([i,j], c);
        }))
    );

    return {
        algo: algo.split("\n").filter(l => l !== "").join(""),
        image: imageMap,
    };
}

// [y,x]
const neighbourMasks = [
    [-1,-1],
    [-1,0],
    [-1,1],
    [0,-1],
    [0,0],
    [0,1],
    [1,-1],
    [1,0],
    [1,1],
];
const neighbourCoords = (point: Point): Point[] => neighbourMasks.map(m => [point[0] + m[0], point[1] + m[1]]);

const applyAlgo = (pixel: Point, algo: string, image: ImageMap, borderChar: "#" | "."): string => {
    const neighbours: Point[] = neighbourCoords(pixel);
    const numString = neighbours.reduce( (s, p) => {
        const char = image.get(p) || borderChar;
        s += char === "#" ? "1" : "0";
        return s;
    }, "");
    return algo[parseInt(numString, 2)];
}

const asPoint = (p: string): Point => p.split(",").map(n => parseInt(n)) as Point;
const asString = (p: Point): string => p.join(",");
const fullMapCoords = (image: ImageMap): Set<string> => {
    const pixels: Set<string> = new Set();
    image.map.forEach((_, key) => {
        neighbourCoords(asPoint(key)).forEach(n => pixels.add(asString(n)))
    })
    return pixels;
}

const iterateImage = (algo: string, image: ImageMap, borderChar: "#" | "."): ImageMap => {
    const iterated = new ImageMap()
    const mapCoords = fullMapCoords(image);
    mapCoords.forEach(p => {
        iterated.setString(p, applyAlgo(asPoint(p), algo, image, borderChar))
    });
    return iterated;
}

const countLit = (image: ImageMap): number => {
    let count = 0;
    image.map.forEach(p => p === "#" ? ++count : null)
    return count;
}

const addBorder = (image: ImageMap, char: "#" | ".") => {
    const borderedImage = new ImageMap();
    const { min, max } = image.minMax();

    const borderMin: Point = [min[0] - 3, min[1] - 3];
    const borderMax: Point = [max[0] + 3, max[1] + 3];
    const current: Point = [borderMin[0], borderMin[1]];
    while (current[0] <= borderMax[0]) {
        while (current[1] <= borderMax[1]) {
            borderedImage.set(current, char);
            current[1] += 1;
        }
        current[1] = borderMin[1];
        ++current[0];
    }
    image.map.forEach((val, key) => {
        borderedImage.setString(key, val)
    });

    return borderedImage;
}

const iterate = (algo: string, image: ImageMap, count: number): ImageMap => {
    let i = 0;
    while (i < count) {
        const borderChar = algo[0] === "." ? "." : i % 2 === 0 ? "." : "#";
        image = addBorder(image, borderChar);
        image = iterateImage(algo, image, borderChar);
        ++i
    }
    return image;
}

export const runA = ({ algo, image}: Input): number => {
    image = iterate(algo, image, 2);
    return countLit(image)
}

export const runB = ({ algo, image}: Input): number => {
    image = iterate(algo, image, 50);
    return countLit(image)
}

export const tests: Testable<string, any>[] = [
    {
        description: "returns the algorithm result for a pixel",
        input: exampleInput,
        result: "#",
        fn: (input: string) => {
            const parsedInput = parseInput(input);
            return applyAlgo([2,2], parsedInput.algo, parsedInput.image, ".")
        },
    },
    {
        description: "counts the lit pixes",
        input: exampleInput,
        result: 10,
        fn: (input: string) => {
            const parsedInput = parseInput(input);
            return countLit(parsedInput.image);
        },
    },
    {
        description: "counts the active pixels after 2 iterations",
        input: exampleInput,
        result: 35,
        fn: (input: string) => runA(parseInput(input)),
    }
]
