import assert from "assert/strict";
import { Testable } from "../lib";

class Dice {
    val: number;
    rolls: number;
    constructor() {
        this.val = 0;
        this.rolls = 0;
    }
    iterate(): number {
        ++this.val;
        if (this.val === 101) {
            this.val = 1;
        }
        ++this.rolls;
        return this.val
    }
    roll(): number {
        return this.iterate() + this.iterate() + this.iterate();
    }
}

export const runA = (positions: [number, number]): number => {
    let p1: PlayerState = [positions[0], 0];
    let p2: PlayerState = [positions[1], 0];
    const d = new Dice();

    while (true) {
        p1 = updatePlayer(p1, d.roll());
        if (p1[1] >= 1000) {
            break
        }
        p2 = updatePlayer(p2, d.roll());
        if (p2[1] >= 1000) {
            break
        }
    }

    let minP = p1;
    if (p2[1] < p1[1]) {
        minP = p2
    }
    return minP[1] * d.rolls
}

type PossibleRoll = 3 | 4 | 5 | 6 | 7 | 8 | 9;
const multipleMap: Record<PossibleRoll, bigint> = {
    "3": 1n,
    "4": 3n,
    "5": 6n,
    "6": 7n,
    "7": 6n,
    "8": 3n,
    "9": 1n,
}
const possibleRolls: PossibleRoll[] = Object.keys(multipleMap).map(n => parseInt(n) as PossibleRoll);

type PlayerState = [number, number];
type State = [PlayerState, PlayerState];

const updatePlayer = (player: PlayerState, roll: number): PlayerState => {
    let [position, score] = player;
    position = position + roll;
    if (position > 10) {
        position = (position % 10) || 1 ;
    }

    score += position;

    return [position, score];
}

const universeMemo: Map<string, [bigint, bigint]> = new Map();
const expandUniverses = (state: State): [bigint, bigint] => {
    let [p1T, p2T] = [0n, 0n]

    const memoKey = state.join("|");
    if (universeMemo.has(memoKey)) {
        return universeMemo.get(memoKey)!;
    }

    const [p1, p2] = state;
    possibleRolls.forEach(r1 => {
        const uP1 = updatePlayer(p1, r1);
        if (uP1[1] >= 21) {
                p1T = p1T + multipleMap[r1];
        } else {
            possibleRolls.forEach(r2 => {
                const uP2 = updatePlayer(p2, r2);
                const rollMultiple = multipleMap[r1] * multipleMap[r2];
                if (uP2[1] >= 21) {
                    p2T = p2T + rollMultiple
                } else {
                    const [ subP1T, subP2T ] = expandUniverses([uP1, uP2]);
                    p1T = p1T + (subP1T * rollMultiple);
                    p2T = p2T + (subP2T * rollMultiple);
                }

            })
        }
    })
    universeMemo.set(memoKey, [p1T, p2T]);
    return [p1T, p2T];
}

export const runB = (positions: [number, number]): bigint => {
    const state: State = [[positions[0], 0], [positions[1],0]];
    const [p1, p2] = expandUniverses(state);

    return p1 > p2 ? p1 : p2;
}

export const parseInput = (input: string): [number, number] => {
    const reg = new RegExp(/\d/g)
    const matches = input.match(reg);
    assert(matches[1] && matches[3])

    return [parseInt(matches[1]), parseInt(matches[3])]
}
const exampleInput = `Player 1 starting position: 4
Player 2 starting position: 8`;
export const tests: Testable<any, any>[] = [
    {
        description: "it returns the value of the next three rolls",
        input: undefined,
        result: 6,
        fn: () => {
            const d = new Dice();
            return d.roll();
        }
    },
    {
        description: "it returns the value of the next three rolls",
        input: undefined,
        result: 15,
        fn: () => {
            const d = new Dice();
            d.roll();
            return d.roll();
        }
    },
    {
        description: "it returns the value of the next three rolls",
        input: undefined,
        result: 24,
        fn: () => {
            const d = new Dice();
            d.roll()
            d.roll()
            return d.roll();
        }
    },
    {
        description: "it rolls the dice and returns its score",
        input: undefined,
        result: [10, 10],
        fn: () => {
            const p: PlayerState = [4, 0];
            const d = new Dice();
            return updatePlayer(p, d.roll());
        }
    },
    {
        description: "it rolls the dice and returns its score",
        input: undefined,
        result: 9,
        fn: () => {
            let p1: PlayerState = [4,0];
            let p2: PlayerState = [8, 0];
            const d = new Dice();
            p1 = updatePlayer(p1, d.roll());
            p2 = updatePlayer(p2, d.roll());
            p1 = updatePlayer(p1, d.roll());
            p2 = updatePlayer(p2, d.roll());
            return p2[1];
        }
    },
    {
        description: "it rolls until a player reaches 1000 points, then returns loser score + n rolls",
        input: exampleInput,
        result: 739785,
        fn: (input: string) => runA(parseInput(input)),
    },
    {
        description: "it finds out how many universes the most successful player wins in",
        input: exampleInput,
        result: 444356092776315n,
        fn: (input: string) => runB(parseInput(input)),
    }
]
