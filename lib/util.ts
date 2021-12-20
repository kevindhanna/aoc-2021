import { strict as assert, deepEqual } from "assert";

export const isNumeric = (val: string) => {
    return /^-?\d+$/.test(val);
}
const RED = "\x1b[31m%s\x1b[0m";
const makeGrey = (s: string) => `\x1b[37m${s}\x1b[0m`
const GREEN = "\x1b[32m%s\x1b[0m";
const logRed = (message: string) => {
    console.log(RED, message);
};
const logGreen = (message: string) => {
    console.log(GREEN, message);
};
export const logBold = (message: string) => {
    console.log("\x1b[1m", message);
}

const logErrors = (...args: any[]) => {
    args.forEach(err => logRed(err));
};

export const assertWithError = (condition: boolean, error: string, exit = false) => {
    try {
        assert(condition);
    } catch (_e) {
        logErrors(error);
        if (exit) {
            process.exitCode = 1
            process.exit();
        }
    }
};

type Asserter = (testName: string, description: string, expected: unknown, actual: unknown) => void;
export const test: Asserter = (
    testName,
    description,
    expected,
    actual,
) => {
    try {
        deepEqual(actual, expected)
    } catch (e) {
        logErrors(
            `${testName} Failed! ${makeGrey(description)}`,
            "Expected:",
            actual,
            "to be equal to:",
            expected
        );
        return;
    }

    logGreen(`${testName} Passed! ${makeGrey(description)}`)
};

export interface Testable<T, U> {
    description: string;
    input: T;
    result: U;
    fn: (input: T) => U;
}

export function strongFind<T>(collection: T[], condition: (candidate: T) => boolean): T {
    const result = collection.find(candidate => condition(candidate));
    assert(result);
    return result;
}

export function strongPop<T>(array: T[]): T {
    const v = array.pop();
    assert(v);
    return v;
}
