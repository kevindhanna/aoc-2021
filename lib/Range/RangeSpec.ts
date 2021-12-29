import assert from "assert/strict";
import { test, Testable } from "../util";
import { Range } from "./Range";

export const tests: Testable<any, any>[] = [
    {
        description: "is iterable",
        input: new Range(1,5),
        result: true,
        fn: (range: Range) => {
            let current = range.start;
            for (const n of range) {
                assert(n === current);
                ++current;
            }

            return true;
        },
    },
    {
        description: "determines if two ranges overlap",
        input: [new Range(1,2), new Range(2,3)],
        result: true,
        fn: (input: [Range, Range]) => {
            const [r1, r2] = input;
            return r1.overlaps(r2);
        },
    },
    {
        description: "determines if two ranges overlap",
        input: [ new Range(1,2), new Range(3,4)],
        result: false,
        fn: (input: [Range, Range]) => {
            const [r1, r2] = input;
            return r1.overlaps(r2);
        },
    },
    {
        description: "determines if two ranges overlap",
        input: [ new Range(1,2), new Range(4,5)],
        result: false,
        fn: (input: [Range, Range]) => {
            const [r1, r2] = input;
            return r1.overlaps(r2);
        },
    },
    {
        description: "determines if two ranges overlap",
        input: [ new Range(3,4), new Range(1,2)],
        result: false,
        fn: (input: [Range, Range]) => {
            const [r1, r2] = input;
            return r1.overlaps(r2);
        },
    },
    {
        description: "determines if two ranges overlap",
        input: [ new Range(1,4), new Range(1,2)],
        result: true,
        fn: (input: [Range, Range]) => {
            const [r1, r2] = input;
            return r1.overlaps(r2);
        },
    },
    {
        description: "determines if two ranges overlap",
        input: [ new Range(1,2), new Range(1,4)],
        result: true,
        fn: (input: [Range, Range]) => {
            const [r1, r2] = input;
            return r1.overlaps(r2);
        },
    },
    {
        description: "returns the length of the range",
        input: new Range(1,6),
        result: 6,
        fn: (r: Range) => r.length,
    },
    {
        description: "it returns the intersection of two ranges",
        input: [new Range(1,10), new Range(5,15)],
        result: new Range(5,10),
        fn: (input: [Range, Range]) => Range.intersection(input[0], input[1])
    }
];
