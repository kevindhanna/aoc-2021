import { Testable } from "../lib";

const exampleInput = "16,1,2,0,4,2,7,1,2,14";

export const parseInput = (input: string): number[] => {
    return input.split(",").map(n => parseInt(n));
}

export const runA = (crabs: number[]): number => {
    const sorted = crabs.sort((a, b) => a === b ? 0 : a > b ? 1 : -1 );
    const mean = sorted[crabs.length / 2];
    const fuel = crabs.reduce((f, c) => f + Math.abs(c - mean), 0)
    return fuel
}

const addSteps = (a: number, b: number): number => {
    const n = Math.abs(a - b);
    return (n * (n + 1)) / 2;
}

export const runB = (crabs: number[]): number => {
    const avg = Math.round(crabs.reduce((p, c) => p + c) / crabs.length);

    const fuelFromAvg = crabs.reduce((f, c) => f + addSteps(c, avg), 0);

    // apparently I was one of the unlucky ones who couldn't just slap the mean in,
    // so lets check a few around there to find it quickly.
    // reason being we're looking for min `(fuel + (fuel + 1)) / 2`, where
    // the average gives us min `fuel ** 2`
    let optimum = fuelFromAvg + 1;
    let index = -3;
    while (optimum >= fuelFromAvg && index < 4) {
        optimum = crabs.reduce((f, c) => f + addSteps(c, avg + index), 0)
        ++index
    }

    if (optimum < fuelFromAvg) {
        return optimum
    }
    return fuelFromAvg
}

export const tests: Testable<number[], number>[] = [
    {
        description: "calculate mean fuel required",
        input: parseInput(exampleInput),
        result: 37,
        fn: runA,
    },
    {
        description: "calculate median fuel required",
        input: parseInput(exampleInput),
        result: 168,
        fn: runB,
    },
]
