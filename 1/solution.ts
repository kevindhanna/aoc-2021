import { Testable } from "../lib";

const exampleInput = [
    199,
    200,
    208,
    210,
    200,
    207,
    240,
    269,
    260,
    263,
];

const countIncreases = (elevations: number[]): number => {
    let acc = 0;
    let prev = elevations.shift() as number;
    while (elevations.length) {
        const next = elevations.shift() as number;
        if (prev < next) {
            ++acc;
        }
        prev = next;
    }

    return acc;
};

const countAveragedIncreases = (elevations: number[]): number => {
    const elWindows: number[] = [];
    elevations.forEach((el, i) => {
        if (elevations[i + 2]) {
            elWindows.push(el + elevations[i + 1] + elevations[i + 2]);
        }
    })
    return countIncreases(elWindows);
}

export const parseInput = (input: string): number[] => input.split('\n').map((i) => parseInt(i));
export const runA = countIncreases;
export const runB = countAveragedIncreases;
export const testsA: Testable[] = [
    { input: [...exampleInput], result: 7 },
];
export const testsB: Testable[] = [
    { input: [...exampleInput], result: 5 },
];
