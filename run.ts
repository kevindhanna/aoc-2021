#!/usr/bin/env node
import {
    assertWithError,
    Testable,
    test,
  logBold,
  isNumeric
} from "./lib";
import Path from "path";
import Fs from "fs";

interface Options {
    testOnly: boolean;
    aOnly: boolean;
    bOnly: boolean;
    runOnly: boolean;
    testIndices: number[];
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
        case "r": {
            options.runOnly = true;
            break;
        }
        default: {
            assertWithError(false, `Invalid command line argument: ${opt}`, true)
        }
    }
    return options;
}

const parseOptions = (args: string[]): Options => {
    let options: Options = {
        testOnly: false,
        aOnly: false,
        bOnly: false,
        runOnly: false,
        testIndices: []
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
        if (isNumeric(arg)) {
            const num = parseInt(arg);
            assertWithError(num > 0, "Test number must be greater than 1", true);
            options.testIndices.push(num);
            return;
        }
        assertWithError(false, `Invalid command line argument: ${arg}`, true)
    })

    return options;
}

const buildArgs = (args: string[]) => {
    let [,, path] = args;
    const [,,, ...rest] = args;
    const options = parseOptions(rest);

    assertWithError(!!path, "Must provide a path to a day!", true);

    if (!Path.isAbsolute(path)) {
        path = Path.join(__dirname, path);
    }

    let input = path.replace("build/", "");
    input = Path.join(input, "input.txt");


    if (!options.testOnly) {
        assertWithError(Fs.existsSync(path), `${path} doesn't exist`, true);
        assertWithError(Fs.existsSync(input), `${input} doesn't exist`, true);
    }

    return {
        day: path,
        inputPath: input,
        options: options,
    };
};

const run = async ({ day, inputPath, options }: Args) => {
    const dayDir = Path.parse(day);
    const { parseInput, tests, runA, runB } =  await import(day);

    if (!options.runOnly) {
        tests.forEach((testable: Testable<unknown, unknown>, i: number) => {
            if (options.testIndices.length) {
                if (options.testIndices.includes(i + 1)) {
                    test(testable, `Day ${dayDir.name}:${i + 1}`);
                }
            } else {
                test(testable, `Day ${dayDir.name}:${i + 1}`);
            }
        });
    }

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
