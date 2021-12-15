export const exampleInput = `NNCB

CH -> B
HH -> N
CB -> H
NH -> C
HB -> C
HC -> B
HN -> C
NN -> C
BH -> H
NC -> B
NB -> B
BN -> B
BB -> N
BC -> B
CC -> N
CN -> C`;

const swapEnd = (s: string, i: string): string => {
    const arr = [...s];
    arr.splice(1, 1, i)
    return arr.join("");
}
const swapStart = (s: string, i: string): string => {
    const arr = [...s];
    arr[0] = i;
    return arr.join("");
}

type StringCounter = Record<string, number>;
type RuleSet = Record<string, string[]>;
export const parseInput = (input: string): { template: string, rules: RuleSet } => {
    const parts = input.split(/\n\n/);
    const template = parts[0];
    const rules = parts[1].split("\n").reduce<RuleSet>((obj,r) => {
        const [key, add] = r.split(" -> ");
        obj[key] = [swapEnd(key, add), swapStart(key, add)];
        return obj;
    }, {})
    return  { template, rules };
}

const blankCounts = (keys: string[]): StringCounter => {
    return keys.reduce<StringCounter>((obj, k) => {
        obj[k] = 0;
        return obj
    }, {});
}

const iterate = (counts: StringCounter, rules: RuleSet, iterations: number): StringCounter => {
    let step = 0;
    const keys = Object.keys(rules)
    while (step < iterations) {
        const newCounts: StringCounter = blankCounts(keys);

        Object.keys(counts).forEach(key => {
            const [start, end] = rules[key];
            newCounts[start] += counts[key] || 0
            newCounts[end] += counts[key] || 0
        })
        counts = newCounts;
        ++step;
    }
    return counts
}

const countLetters = (counts: StringCounter, start: string, end: string): StringCounter => {
    const pairs = Object.keys(counts);
    const letters = [...new Set(pairs.join("").split(""))];
    const letterCounts = blankCounts(letters);

    letterCounts[start] += 1;
    letterCounts[end] += 1;
    letters.forEach(l => {
        const reg = new RegExp(l, "g")
        pairs.forEach(p => {
            // multiply the count of the pair by the number of times the given letter appears in that pair - i.e. 0, 1 or 2
            letterCounts[l] += counts[p] * (p.match(reg) || []).length
        });
        // each time a letter appears in a pair, it appears in another pair in the opposite position
        // i.e. CB and BH, so we divide by 2
        letterCounts[l] = letterCounts[l] / 2
    });

    return letterCounts;
}

const run = (template: string, rules: RuleSet, iterations: number): number => {
    let pairCounts: StringCounter = {};
    const keys = Object.keys(rules);
    keys.forEach((r) => {
        const matches = template.match(new RegExp(r, "g")) || [];
        pairCounts[r] = matches.length;
    });
    pairCounts = iterate(pairCounts, rules, iterations);

    const start = template[0];
    const end = template[template.length - 1];
    const letterCounts = countLetters(pairCounts, start, end);

    let [max, min] = [letterCounts[start],letterCounts[end]]
    Object.values(letterCounts).forEach(v => {
        if (v > max) {
            max = v;
        }
        if (v < min) {
            min = v;
        }
    })

    return max - min
}

interface RunnerInput { template: string, rules: RuleSet }
interface Runner {
    (input: RunnerInput): number;
}
export const runA: Runner = ({ template, rules }): number => {
    return run(template, rules, 10);
}

export const runB: Runner = ({ template, rules }): number => {
    return run(template, rules, 40);
}

export const testsA = [{ input: parseInput(exampleInput), result: 1588 }];
export const testsB = [{ input: parseInput(exampleInput), result: 2188189693529 }];
