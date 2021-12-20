#!/usr/bin/env node
import {
    assertWithError,
    Testable,
    test,
    logBold
} from "./lib";
import Path from "path";
import Fs from "fs";

interface Options {
    testOnly: boolean;
    aOnly: boolean;
    bOnly: boolean;
}

interface Args {
    day: string;
    inputPath: string;
    options: Options;
}

const handleOpt = (opt: string, options: Options): Options => {
    switch(opt) {
        case "t": {
            options.testOnly = true;
            break;
        }
        case "a": {
            options.aOnly = true;
            break;
        }
        case "b": {
            options.bOnly = true;
            break;
        }
        default: {
            assertWithError(false, `Invalid command line argument: ${opt}`, true)
        }
    }
    return options;
}

const parseOptions = (args: string[]): Options => {
    let options = {
        testOnly: false,
        aOnly: false,
        bOnly: false,
    };

    args.forEach((arg) => {
        if (arg.startsWith("--")) {
            const opt = arg.replace("--", "");
            options = handleOpt(opt, options)
            return;
        }
        if (arg.startsWith("-")) {
            const opts = arg.replace("-", "").split("");
            opts.forEach(opt => options = handleOpt(opt, options))
            return;
        }
        assertWithError(false, `Invalid command line argument: ${arg}`, true)
    })

    return options;
}

const buildArgs = (args: string[]) => {
    let [,, path] = args;
    const [,,, ...rest] = args;

    assertWithError(!!path, "Must provide a path to a day!", true);

    if (!Path.isAbsolute(path)) {
        path = Path.join(__dirname, path);
    }

    let input = path.replace("build/", "");
    input = Path.join(input, "input.txt");

    assertWithError(Fs.existsSync(path), `${path} doesn't exist`, true);
    assertWithError(Fs.existsSync(input), `${input} doesn't exist`, true);

    return {
        day: path,
        inputPath: input,
        options: parseOptions(rest)
    };
};

const run = async ({ day, inputPath, options }: Args) => {
    const dayDir = Path.parse(day);
    const { parseInput, tests, runA, runB } =  await import(day);

    tests.forEach(({ description, input, result, fn }: Testable<unknown, unknown>, i: number) => {
        test(`Day ${dayDir.name}:${i}`, description, result, fn(input));
    })

    if (!options.testOnly) {
        const input = Fs.readFileSync(inputPath).toString();
        if (!options.bOnly) {
            const resultA =  runA(parseInput(input));
            logBold(`Day ${dayDir.name}A result: ${resultA}`)
        }
        if (!options.aOnly) {
            const resultB =  runB(parseInput(input));
            logBold(`Day ${dayDir.name}B result: ${resultB}`)
        }
    }
};

run(buildArgs(process.argv));
