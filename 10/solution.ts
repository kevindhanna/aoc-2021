const exampleInput = `[({(<(())[]>[[{[]{<()<>>
[(()[<>])]({[<{<<[]>>(
{([(<{}[<>[]}>{[]{[(<()>
(((({<>}<{<{<>}{[]{[]{}
[[<[([]))<([[{}[[()]]]
[{[{({}]{}}([{[{{{}}([]
{<[[]]>}<{[{[{[]{()[[[]
[<(<(<(<{}))><([]([]()
<{([([[(<>()){}]>(<<{{
<{([{{}}[<[[[<>{}]]]>[]]`;

type Opener = "[" | "{" | "(" | "<";
type Closer = "]" | "}" | ")" | ">";
type Instruction = Opener | Closer;
type InstructionSet = Instruction[]
type Program = InstructionSet[]

export const parseInput = (input: string): Program => input.split("\n").filter(l => l !== "").map(l => l.split("") as unknown as Instruction[]);

const pairsMap: Record<Instruction, Instruction> = {
    "(": ")",
    "[": "]",
    "{": "}",
    "<": ">",
    ")": "(",
    "]": "[",
    "}": "{",
    ">": "<",
}

const isOpener = (i: Instruction) => "[{(<".includes(i);
const isMatch = (first: Instruction, second: Instruction) => pairsMap[first] === second;

class CorruptInstructionSet extends Error {
    invalidInstruction: Closer;
    constructor(i: Closer) {
        super();
        this.invalidInstruction = i;
    }
}
const removePairs = (instructionSet: InstructionSet): InstructionSet => {
    let i = 0;
    while (i < instructionSet.length) {
        if (!isOpener(instructionSet[i])) {
            if (!isMatch(instructionSet[i], instructionSet[i -1])) {
                throw new CorruptInstructionSet(instructionSet[i] as Closer)
            }
            instructionSet.splice(i - 1, 2);
            --i
        } else {
            ++i;
        }
    }
    return instructionSet;
}

const errorScoreMap: Record<Closer, number> = {
    ")": 3,
    "]": 57,
    "}": 1197,
    ">": 25137,
}

export const runA = (program: Program): number => {
    return program.reduce<number>((score, instructionSet) => {
        try {
            removePairs(instructionSet);
        } catch(error) {
            if (error instanceof CorruptInstructionSet) {
                score += errorScoreMap[error.invalidInstruction];
            } else {
                throw error
            }
        }

        return score;
    }, 0)
}

const autocompleteScoreMap: Record<Closer, number> = {
    ")": 1,
    "]": 2,
    "}": 3,
    ">": 4,
}

const calculateAutocompleteScore = (instructionSet: InstructionSet): number => {
    let score = 0;

    let index = instructionSet.length - 1;
    while (index >= 0) {
        const instruction = instructionSet[index] as Opener;
        score = (score * 5) + autocompleteScoreMap[pairsMap[instruction] as Closer]
        --index
    }
    return score;
}

export const runB = (program: Program): number => {
    const scores =
        program.map(l => {
            try { return removePairs(l) } catch { return [] }
        })
            .map(calculateAutocompleteScore)
            .filter(s => s > 0);

    scores.sort((a, b) => a - b);
    return scores[Math.floor(scores.length / 2)]
}

export const testsA = [{ input: parseInput(exampleInput), result: 26397 }]
export const testsB = [
    { input: parseInput(exampleInput), result: 288957 },
    { input: parseInput('['), result: 2 },
    { input: parseInput('(['), result: 11 },
    { input: parseInput('[({([[{{'), result: 288957 },
]
