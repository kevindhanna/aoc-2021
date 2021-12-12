import { strict as assert, deepEqual } from "assert";
import Path from "path";

export const isNumeric = (val: string) => {
    return /^-?\d+$/.test(val);
}

const logRed = (message: string) => {
    console.log("\x1b[31m%s\x1b[0m", message);
};
const logGreen = (message: string) => {
    console.log("\x1b[32m%s\x1b[0m", message);
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

type Asserter = (expected: unknown, actual: unknown, path: string, number?: number) => void;
export const test: Asserter = (
    expected,
    actual,
    path,
    number?,
) => {
    const pathDir = Path.parse(path);

    try {
        deepEqual(actual, expected)
    } catch (e) {
        logErrors(
            `Day ${pathDir.name}:${number} failed!`,
            "Expected:",
            actual,
            "to be equal to:",
            expected
        );
        return;
    }

    logGreen(`Day ${pathDir.name}:${number} passed!`)
};

export interface Testable {
    input: any;
    result: number;
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
