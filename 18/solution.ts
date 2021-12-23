import assert from "assert/strict";
import { isNumeric, strongPop, strongShift } from "../lib";

export const parseNum = (input: string): string[] => input.split("").filter(c => c !== ",");

export const parseInput = (input: string): string[][] => input.split("\n").filter(l => l !== "").map(n => parseNum(n))

const addStrings = (a: string, b: string): string => {
    return (parseInt(a) + parseInt(b)).toString();
}

const split = (n: number, stack: string[]): string[] => {
    stack.push("[")
    const left = Math.floor(n / 2);
    const right = Math.ceil(n / 2);
    stack.push(left.toString());
    stack.push(right.toString());
    stack.push("]");

    return stack
}

const explode = (stack: string[], squidNum: string[]) => {
    stack.pop(); // bye bracket
    const left = strongShift(squidNum);
    const right = strongShift(squidNum);

    squidNum.shift(); // bracket

    // move left from the current position to find the next number
    const leftStack: string[] = [];
    while (stack.length) {
        const cand = strongPop(stack);
        if (isNumeric(cand)) {
            // if found, add to the left value
            stack.push(addStrings(cand, left));
            break;
        } else {
            leftStack.push(cand)
        }
    }
    // fix up the stack
    while (leftStack.length) {
        stack.push(strongPop(leftStack));
    }

    // same as above, but moving right
    const rightStack: string[] = [];
    while (squidNum.length) {
        const cand = strongShift(squidNum);
        if (isNumeric(cand)) {
            rightStack.push(addStrings(cand, right));
            break;
        } else {
            rightStack.push(cand)
        }
    }
    // here is where the original pair is replaced with a 0
    if (!squidNum.length) {
        // if the squidNum is empty, it's all sitting in the rightStack,
        // so we chuck the 0 on the front
        rightStack.unshift("0")
    } else {
        stack.push("0")
    }
    // fixiung up the stack from the right val add
    while (rightStack.length) {
        stack.push(strongShift(rightStack));
    }
}

const triggerExplosions = (squidNum: string[]): string[] => {
    let stack: string[] = [];
    let depth = 0;
    while (squidNum.length) {
        const char: string = strongShift(squidNum);
        if (char === "[") {
            stack.push(char);
            ++depth
            if (depth === 5) {
                explode(stack, squidNum);
                squidNum = stack.concat(squidNum);
                depth = 0;
                stack = [];
            }
        } else if (char === "]") {
            stack.push(char);
            --depth;
        } else {
            stack.push(char);
        }
    }
    return stack
}

export const reduce = (squidNum: string[]): string[] => {
    squidNum = triggerExplosions(squidNum);

    let stack: string[] = [];
    while (squidNum.length) {
        const char: string = strongShift(squidNum);
        if (char === "[") {
            stack.push(char);
        } else if (char === "]") {
            stack.push(char);
        } else {
            const n = parseInt(char);
            if (n > 9) {
                split(n, stack);
                squidNum = triggerExplosions(stack.concat(squidNum));
                stack = [];
            } else {
                stack.push(char);
            }
        }
    }
    return stack;
}

export const add = (a: string[], b: string[]): string[] => reduce(["[", ...a, ...b, "]"]);

export const sumList = (list: string[][]): string[] => list.reduce((sum, n) => add(sum, n));

export const calcMagnitude = (squidNum: string): number => {
    const pairReg = /\[([0-9]+,[0-9]+)\]/;
    const pairRegExp = new RegExp(pairReg);
    const matchesRegExp = new RegExp(pairReg, "g");

    // while there are pairs of numbers in brackets
    while (squidNum.match(matchesRegExp)?.length) {
        // find the first one
        const res = squidNum.match(pairRegExp)
        assert(res)
        // as [[12], 12]
        const [match, nums] = res;

        const [left, right] = nums.split(",")
        const result = ((parseInt(left) * 3) + (parseInt(right) * 2));
        // replace the matched pair with the calculated magnitude
        squidNum = squidNum.replace(match, result.toString());
    }
    // et viola
    return parseInt(squidNum);
}

// the commas get pulled out as part of parsing the initial squidNum
// so we put them back here to make calculating the magnitude easier
const reinsertCommas = (num: string[]) => num.join(",").replace(/\[,/g, "[").replace(/,\]/g, "]")

export const runA = (nums: string[][]): number => {
    let sum = reinsertCommas(sumList(nums));
    return calcMagnitude(sum)
}

export const runB = (nums: string[][]): number => {
    let max = 0;
    nums.forEach(n1 => {
        nums.forEach(n2 => {
            const sum = add(n1, n2);
            const magnitude = calcMagnitude(reinsertCommas(sum));
            if (magnitude > max) {
                max = magnitude
            }
        })
    })
    return max;
}
