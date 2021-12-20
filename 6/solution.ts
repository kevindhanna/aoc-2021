import { Testable } from "../lib";
export const exampleInput = "3,4,3,1,2"

export const parseInput = (input: string) => {
    return input.replace("\n", "").split(",").map(i => parseInt(i));
}

const fishAccumulators: number[] = [0,0,0,0,0,0,0,0];

const buildFishSets = (fish: number[]): number[] => fish.reduce((acc, f) => {
    if (!acc[f]) {
        acc[f] = 1
    } else {
        acc[f] += 1
    }
    return acc
}, [...fishAccumulators])

const simulate = (fish: number[], days: number) => {
    let fishSets: number[] = buildFishSets(fish)

    let day = 0;
    while (day < days) {
        fishSets = fishSets.reduce((acc, f, i) => {
            if (i === 0) {
                acc[8] = f;
                acc[6] = f;

            } else {
                acc[i - 1] += f;
            }
            return acc
        }, [...fishAccumulators])
        ++day
    }
    return fishSets.reduce((p, n) => p + n)
}

export const runA = (fish: number[]): number => simulate(fish, 80);
export const runB = (fish: number[]): number => simulate(fish, 256);

export const tests: Testable<number[], number>[] = [
    {
        description: "simulate 80 days",
        input: parseInput(exampleInput),
        result: 5934,
        fn: runA,
    },
    {
        description: "simulate 256 days",
        input: parseInput(exampleInput),
        result: 26984457539,
        fn: runB,
    }
];
