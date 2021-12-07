import { Testable } from "../lib";

const exampleInput = `00100
11110
10110
10111
10101
01111
00111
11100
10000
11001
00010
01010`;

const bitAverage = (nums: number[], bit: number): number => {
    return nums.reduce((av, b) => {
        return av += (b >> bit) & 1;
    }, 0) / nums.length
}

const mostAverage = (
    nums: number[],
    bits: number,
    test: (bitAverage: number) => boolean,
): number => {
    let bit = bits - 1;
    while (bit >= 0 && nums.length > 1) {
        const p = bitAverage(nums, bit);
        if (test(p)) {
            nums = nums.filter((n) => n & 1 << bit);
        } else {
            nums = nums.filter((n) => !(n & 1 << bit));
        }
        --bit
    }
    return nums[0];
}

type Input = { nums: number[], bits: number }
export const parseInput = (input: string): Input => {
    const bins = input.split("\n");
    return {
        nums: bins.filter((l) => l !== "")
            .map((l) => parseInt(l, 2)),
        bits: bins[0].length
    };
}
export const runA = ({ nums, bits }: Input): number => {
    let epsilon = 0;
    let bit = bits - 1;
    while (bit >= 0) {
        const p = bitAverage(nums, bit);
        if (p > 1/2) {
            epsilon |= 1 << bit;
        }
        --bit
    }

    const mask = (1 << bits) - 1
    return epsilon * (epsilon ^ mask);
}

export const runB = ({ nums, bits }: Input): number => {
    const ogr = mostAverage(
        nums,
        bits,
        (bitAverage: number) => bitAverage >= 1/2
    );
    const co2r = mostAverage(
        nums,
        bits,
        (bitAverage: number) => bitAverage < 1/2
    );
    return ogr * co2r;
}

export const testsA: Testable[] = [{ input: parseInput(exampleInput), result: 198 }];
export const testsB: Testable[] = [{ input: parseInput(exampleInput), result: 230 }];
