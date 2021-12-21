import assert from "assert/strict";
import { Testable } from "../lib";

const exampleInput = "target area: x=20..30, y=-10..-5";

interface TargetArea {
    x: {
        min: number;
        max: number;
    },
    y: {
        min: number;
        max: number;
    }
}
export const parseInput = (input: string): TargetArea  => {
    input = input.replace("target area: ", "");
    let [x, y] = input.split(", ");
    return [x, y].reduce((ta, v) => {
        const [key, coords] = v.split("=");
        const [min, max] = coords.split("..").map(val => parseInt(val));
        ta[key as keyof TargetArea] = { min, max }
        return ta;
    }, { x: { min: 0, max: 0 }, y: { min: 0, max: 0 } });
}

interface Vector {
    x: number;
    y: number;
}

enum Result {
    InFlight = "inFlight",
    Short = "short",
    Long = "long",
    Hit = "hit",
    High = "high",
}

interface ThrowResult {
    result: Result;
    maxY: number;
}

const buildMap = (targetArea: TargetArea): Map<string, string> => {
    const map = new Map();
    let x = targetArea.x.min;
    let y = targetArea.y.max;
    while (x <= targetArea.x.max) {
        while (y >= targetArea.y.min) {
            map.set([x, y].join(), "T");
            --y;
        }
        ++x;
        y = targetArea.y.max
    }
    return map;
}

const printMap = (map: Map<string, string>): void => {
    let maxX = 0;
    let maxY = 0;
    let minY = 0;
    let entries = map.entries();
    let next = entries.next();
    while (!next.done) {
        let [x,y] = next.value[0].split(",").map(n => parseInt(n))
        if (x > maxX) {
            maxX = x;
        }
        if (y > maxY) {
            maxY = y;
        }
        if (y < minY) {
            minY = y;
        }
        next = entries.next();
    }
    const printed: string[][] = [];
    let [x, y] = [0, 0];
    while (y <= ((minY - maxY) * -1)) {
        printed.push([])
        while (x <= maxX) {
            printed[y].push(".")
            ++x
        }
        x = 0;
        ++y
    }
    entries = map.entries();
    next = entries.next();
    while (!next.done) {
        let [x,y] = next.value[0].split(",").map(n => parseInt(n))
        const compY = (y - maxY) * -1
        printed[compY][x] = next.value[1]
        next = entries.next();
    }
    console.log("__________________________________________________________")
    console.log(printed.map(l => l.join(" ")).join("\n"))
    console.log("__________________________________________________________")
}

const inX = (probe: Vector, target: TargetArea): boolean => probe.x >= target.x.min && probe.x <= target.x.max;
const reachedX = (probe: Vector, target: TargetArea): boolean => inX(probe, target) || probe.x >= target.x.min;
const inY = (probe: Vector, target: TargetArea): boolean => probe.y >= target.y.min && probe.y <= target.y.max;
const reachedY = (probe: Vector, target: TargetArea): boolean => probe.y <= target.y.min;

const reachedTarget = (probe: Vector, target: TargetArea): Result => {
    if (inX(probe, target) && inY(probe, target)) {
        return Result.Hit;
    }
    if (probe.x > target.x.max && reachedY(probe, target)) {
        return Result.Long;
    }
    if (probe.x < target.x.min && reachedY(probe, target)) {
        return Result.Short;
    }
    if (reachedX(probe, target) && probe.y < target.y.min) {
        return Result.High;
    }
    return Result.InFlight;
}

type Memo = Map<string, ThrowResult>;
const targetAreaMapMemo: Map<string, Map<string, string>> = new Map()
export const throwProbe = (startingVector: Vector, targetArea: TargetArea, memo: Memo, print = false): ThrowResult => {
    const vector = { x: startingVector.x, y: startingVector.y };
    const resultMemoKey = [vector.x, vector.y].join()

    if (memo.has(resultMemoKey)) {
        const memod = memo.get([vector.x, vector.y].join());
        assert(memod)
        return memod
    }

    let map: Map<string, string> | undefined;
    const targetAreaMemoKey = JSON.stringify(targetArea);
    if (targetAreaMapMemo.has(targetAreaMemoKey)) {
        map = targetAreaMapMemo.get(targetAreaMemoKey);
        assert(map)
    } else {
        map = buildMap(targetArea);
        targetAreaMapMemo.set(targetAreaMemoKey, map)
    }

    const probe = { x: 0, y: 0}
    map.set([probe.x, probe.y].join(), "x")
    let result = Result.InFlight;
    let maxY = 0;
    while (result === Result.InFlight) {
        probe.x += vector.x;
        probe.y += vector.y;
        if (vector.x > 0) {
            vector.x -= 1
        }
        if (probe.y > maxY) {
            maxY = probe.y;
        }
        vector.y -= 1;
        result = reachedTarget(probe, targetArea)
        map.set([probe.x, probe.y].join(), "x")
    }
    if (print) {
        printMap(map);
    }

    memo.set(resultMemoKey, {result, maxY})
    return {result, maxY};
}

const findMinX = (targetArea: TargetArea, memo: Memo): number => {
    const vector = { x: 0, y: 0 };
    let t = throwProbe(vector, targetArea, memo);
    while (t.result === Result.Short) {
        vector.x += 1;
        t = throwProbe(vector, targetArea, memo);
    }
    return vector.x
}

const findMaxYVector = (targetArea: TargetArea, memo: Memo): Vector => {
    const minX = findMinX(targetArea, memo);
    const vector = { x: minX, y: 1 };

    const throws: Vector[] = []
    let looping = true;
    let t: ThrowResult;
    while (looping) {
        t = throwProbe(vector, targetArea, memo);
        switch(t.result) {
            case Result.Short: {
                vector.x += 1;
                break;
            }
            case Result.Long: {
                vector.x -= 1;
                break;
            }
            case Result.Hit: {
                throws.push({ x: vector.x, y: vector.y })
                vector.y += 1;
                break;
            }
            case Result.High: {
                looping = false;
                break
            }
        }
    }

    const winner = throws.pop();
    assert(winner)
    vector.x = winner.x;
    vector.y = winner.y;
    let loop = 0;
    while (loop < 100) {
        vector.y += 1;
        t = throwProbe(vector, targetArea, memo);
        if (t.result === Result.Hit) {
            winner.y = vector.y
        }
        ++loop
    }

    return winner
}

export const runA = (targetArea: TargetArea): number => {
    const memo: Map<string, ThrowResult> = new Map();
    const maxYVector = findMaxYVector(targetArea, memo);
    const result = throwProbe(maxYVector, targetArea, memo);
    return result.maxY;
}

const runOutPossibilities = (vector: Vector, targetArea: TargetArea, vectors: Set<string>, memo: Memo, print = false): void => {
    let looping = true
    let t: ThrowResult;
    while (looping) {
        t = throwProbe({ x: vector.x, y: vector.y }, targetArea, memo, print);
        switch(t.result) {
            case Result.Short: {
                vector.x += 1;
                break;
            }
            case Result.Long: {
                vector.x -= 1;
                break;
            }
            case Result.Hit: {
                vectors.add([vector.x, vector.y].join());
                vector.y -= 1;
                break;
            }
            case Result.High: {
                looping = false;
                break
            }
        }
    }
}

export const runB = (targetArea: TargetArea): number => {
    const memo: Map<string, ThrowResult> = new Map();
    const { y: maxY } = findMaxYVector(targetArea, memo);
    const maxX = targetArea.x.max;
    const minX = findMinX(targetArea, memo)

    const vectors: Set<string> = new Set();
    const vector = { x: maxX + 1, y: maxY + 1 };
    while (vector.x >= minX - 1) {
        while (vector.y >= targetArea.y.min - 1) {
            runOutPossibilities({ x: vector.x, y: vector.y }, targetArea, vectors, memo)
            vector.y -= 1;
        }
        vector.y = maxY;
        vector.x -= 1;
    }

    return vectors.size
}

export const tests: Testable<any,any>[] = [
    {
        description: "Calculates a hit",
        input: parseInput(exampleInput),
        result: Result.Hit,
        fn: (input: TargetArea) => reachedTarget({ x: 20, y: -10 }, input),
    },
    {
        description: "Calculates a hit",
        input: parseInput(exampleInput),
        result: Result.Hit,
        fn: (input: TargetArea) => reachedTarget({ x: 30, y: -5 }, input),
    },
    {
        description: "Calculates a short shot",
        input: parseInput(exampleInput),
        result: Result.Short,
        fn: (input: TargetArea) => reachedTarget({ x: 19, y: -11 }, input),
    },
    {
        description: "Calculates a long shot",
        input: parseInput(exampleInput),
        result: Result.Long,
        fn: (input: TargetArea) => reachedTarget({ x: 31, y: -11 }, input),
    },
    {
        description: "Calculates a high shot",
        input: parseInput(exampleInput),
        result: Result.High    ,
        fn: (input: TargetArea) => reachedTarget({ x: 25, y: -11 }, input),
    },
    {
        description: "Calculates an in flight shot",
        input: parseInput(exampleInput),
        result: Result.InFlight,
        fn: (input: TargetArea) => reachedTarget({ x: 25, y: 10 }, input),
    },
    {
        description: "Calculates an in flight shot",
        input: parseInput(exampleInput),
        result: Result.InFlight,
        fn: (input: TargetArea) => reachedTarget({ x: 25, y: -4 }, input),
    },
    {
        description: "Returns the height for a given vector",
        input: parseInput(exampleInput),
        result: { result: Result.Hit, maxY: 45 },
        fn: (input: TargetArea) => throwProbe({ x: 6, y: 9 }, input, new Map())
    },
    {
        description: "Finds the optimum vector",
        input: parseInput(exampleInput),
        result: 45,
        fn: runA,
    },
    {
        description: "Finds all the vectors",
        input: parseInput(exampleInput),
        result: 112,
        fn: runB,
    },
]
