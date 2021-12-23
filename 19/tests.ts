import { Testable } from "../lib";
import { Point } from "./rot3D";
import {
    euclidDistance,
    findEquivalents,
    removeOffset,
    hasOverlap,
    isSamePoint,
    overlappingBeacons,
    parseInput,
    runA,
    manhattanDist,
} from "./solution";
import { equivalentBeacons, exampleBeacons, fullExampleInput, overlappingScanners } from "./testInputs";

export const tests: Testable<any, any>[] = [
    {
        description: "finds the euclidean distance between two beacons",
        input: [[-1, -1, 1], [-2,-3,-3]],
        result: 4.58258,
        fn: (input: [Point, Point]) => euclidDistance(input[0], input[1]),
    },
    {
        description: "it should work either way",
        input: [[-2,-3,-3], [-1, -1, 1]],
        result: 4.58258,
        fn: (input: [Point, Point]) => euclidDistance(input[0], input[1]),
    },
    {
        description: "determines if two points are the same",
        input: [[8,0,7],[-8,-7,0]],
        result: true,
        fn: (input: Point[]) => isSamePoint(input[0], input[1]),
    },
    {
        description: "determines if two points are the same",
        input: [[8,0,7],[-8,-7,0]],
        result: true,
        fn: (input: Point[]) => isSamePoint(input[0], input[1]),
    },
    {
        description: "detects scanner overlap",
        input: overlappingScanners,
        result: true,
        fn: (input: string) => {
            const scanners = parseInput(input);
            return hasOverlap(scanners[0], scanners[1]);
        },
    },
    {
        description: "finds overlapping beacons",
        input: overlappingScanners,
        result: new Set(exampleBeacons.split("\n")),
        fn: (input: string) => {
            const scanners = parseInput(input);
            const overlaps = overlappingBeacons(scanners[0], scanners[1]);
            return overlaps.a;
        },
    },
    {
        description: "finds beacon equivalents",
        input: overlappingScanners,
        result: equivalentBeacons(),
        fn: (input: string) => {
            const scanners = parseInput(input);
            const overlaps = overlappingBeacons(scanners[0], scanners[1]);
            return findEquivalents(overlaps, scanners[0], scanners[1])
        },
    },
    {
        description: "finds the scanner relative position",
        input: overlappingScanners,
        result: [68,-1246,-43],
        fn: (input: string) => {
            const scanners = parseInput(input);
            const overlaps = overlappingBeacons(scanners[0], scanners[1]);
            const equivalents = findEquivalents(overlaps, scanners[0], scanners[1]);
            removeOffset(equivalents, scanners[1])
            return scanners[1].position
        },
    },
    {
        description: "finds the number of beacons",
        input: fullExampleInput,
        result: 79,
        fn: (input: string) => runA(parseInput(input)),
    },
    {
        description: "It finds the manhattan number",
        input: [[1105,-1205,1229], [-92,-2380,-20]],
        result: 3621,
        fn: (input: Point[]) => manhattanDist(input[0], input[1]),
    }
]
