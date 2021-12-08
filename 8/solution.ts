import { strongFind } from "../lib";

const exampleInput = `be cfbegad cbdgef fgaecd cgeb fdcge agebfd fecdb fabcd edb | fdgacbe cefdb cefbgd gcbe
edbfga begcd cbg gc gcadebf fbgde acbgfd abcde gfcbed gfec | fcgedb cgb dgebacf gc
fgaebd cg bdaec gdafb agbcfd gdcbef bgcad gfac gcb cdgabef | cg cg fdcagb cbg
fbegcd cbd adcefb dageb afcb bc aefdc ecdab fgdeca fcdbega | efabcd cedba gadfec cb
aecbfdg fbg gf bafeg dbefa fcge gcbea fcaegb dgceab fcbdga | gecf egdcabf bgf bfgea
fgeab ca afcebg bdacfeg cfaedg gcfdb baec bfadeg bafgc acf | gebdcfa ecba ca fadegcb
dbcfg fgd bdegcaf fgec aegbdf ecdfab fbedc dacgb gdcebf gf | cefg dcbef fcge gbcadfe
bdfegc cbegaf gecbf dfcage bdacg ed bedf ced adcbefg gebcd | ed bcgafe cdgba cbgef
egadfb cdbfeg cegd fecab cgb gbdefca cg fgcdab egfdb bfceg | gbdfcae bgc cg cgb
gcafb gcf dcaebfg ecagb gf abcdeg gaef cafbge fdbac fegbdc | fgae cfgab fg bagce`;

interface Entry {
    patterns: string[];
    value: string[];
}

export const parseInput = (input: string): Entry[]  => {
    return input.split("\n")
        .filter(l => l !== "")
        .reduce<Entry[]>((entries, line) => {
            const [patterns, value] = line.split(" | ").map(
                (seg) => seg.split(" ").map(val => val),
            );
            entries.push({ patterns, value });
            return entries;
        }, []);
}

enum UniqueLengths {
    One = 2,
    Four = 4,
    Seven = 3,
    Eight = 7
}
const isKnownNum = (entry: string): boolean => Object.values(UniqueLengths).includes(entry.length);
export const runA = (entries: Entry[]): number => {
    return entries.reduce<number>((total, e) => {
        return total + e.value.filter(v => isKnownNum(v)).length;
    }, 0);
}

interface Map {
    a: number;
    b: number;
    c: number;
    d: number;
    e: number;
    f: number;
    g: number;
}
const map: Map = {
    a: 1 << 0,
    b: 1 << 1,
    c: 1 << 2,
    d: 1 << 3,
    e: 1 << 4,
    f: 1 << 5,
    g: 1 << 6,
}

const asNumber = (num: string) => num.split("").reduce((val, c) => val + map[c as keyof Map], 0);

const findUniqueLengthNumbers = (patterns: string[]): number[] => {
    const one = strongFind<string>(patterns, (s: string) => s.length === UniqueLengths.One);
    const four = strongFind<string>(patterns, (s: string) => s.length === UniqueLengths.Four);
    const seven = strongFind<string>(patterns, (s: string) => s.length === UniqueLengths.Seven);
    const eight = strongFind<string>(patterns, (s: string) => s.length === UniqueLengths.Eight);
    return [one, four, seven, eight].map(asNumber);
}

export const runB = (entries: Entry[]): number => {
    return entries.reduce<number>((total, entry) => {
        const [one, four, seven, eight] = findUniqueLengthNumbers(entry.patterns);
        const parsedNums = entry.patterns.map(n => asNumber(n));

        let unknownNums = parsedNums.filter(
            n => ![one, four, seven, eight].includes(n)
        );

        const six = strongFind<number>(unknownNums, n => (n | one) === eight);
        unknownNums = unknownNums.filter(n => n !== six);

        const A = (one ^ seven);
        const C = eight ^ six;
        const F = one ^ C;
        const BandD = (seven ^ four);

        const zero = strongFind<number>(unknownNums, n => (n | BandD) === eight);
        unknownNums = unknownNums.filter(n => n !== zero);

        const D = eight ^ zero;
        const topLeft = D ^ BandD;
        const EandG = zero ^ one ^ A ^ topLeft;

        const nine = strongFind<number>(unknownNums, n => (n | EandG) === eight);
        unknownNums = unknownNums.filter(n => n !== nine);

        const three = strongFind<number>(unknownNums, n => (n | topLeft) === nine);
        const five = strongFind<number>(unknownNums, n => (n | C) === nine);
        const two = strongFind<number>(unknownNums, n => (n | topLeft | F) === eight);

        const foundNums = [zero, one, two, three, four, five, six, seven, eight, nine];
        const valueDigits = entry.value.map(v => foundNums.findIndex(n => n === asNumber(v)));
        return total + parseInt(valueDigits.join(""));
    }, 0)
}

export const testsA = [{ input: parseInput(exampleInput), result: 26 }];
export const testsB = [{ input: parseInput(exampleInput), result: 61229 }];
