import assert from "assert/strict";
import { strongFind, Testable } from "../lib";

const exampleInput = `7,4,9,5,11,17,23,2,0,14,21,24,10,16,13,6,15,25,12,22,18,20,8,19,3,26,1

22 13 17 11  0
 8  2 23  4 24
21  9 14 16  7
 6 10  3 18  5
 1 12 20 15 19

 3 15  0  2 22
 9 18 13 17  5
19  8  7 25 23
20 11 10 24  4
14 21 16 12  6

14 21 17 24  4
10 16 15  9 19
18  8 23 26 20
22 11 13  6  5
 2  0 12  3  7`;

type Row = number[];

const getVerticalRow = (rows: Row[], i: number) => {
    return rows.reduce(function(a, c) {
        a.push(c[i])
        return a;
    }, [])
}

const asRows = (r: string): Row[] => {
    const rows = r.split("\n").filter(r => r !== "")
        .map(
        r => r.split(",")
            .filter(n => n !== "")
            .map(
                (n) => parseInt(n)
            ) as Row
    )
    const verticalRows = rows.reduce((prev, _, i, arr) => {
        prev.push(getVerticalRow(arr, i));
        return prev;
    }, [] as Row[])
    return [...rows, ...verticalRows]
}

const asBoard = (b: string): Row[] => {
    return asRows(b.replace(/[" "]+/g, ","))
}

class Board {
    rows: Row[];
    height: number;
    score: number;
    won = false;

    constructor(board: string) {
        this.rows = asBoard(board);
        this.height = this.rows[0].length;
        this.score = 0;
    }

    callNumber(num: number): boolean {
        this.rows = this.rows.map(r => r.filter(n => n !== num))
        if (this.hasWon()) {
            return true;
        }
        return false
    }
    hasWon(): boolean {
        return this.won ||= this.rows.some(r => r.length === 0);
    }
    calculateScore(): number {
        return this.rows.slice(0, this.height)
            .flat()
            .reduce((a, n) => a + n);
    }
}

type Input = { nums: number[], boards: Board[] }
export const parseInput = (raw: string): Input => {
    const [nums, ...boards] = raw.split("\n\n");

    return {
        nums: nums.split(",").map(n => parseInt(n)),
        boards: boards.map((b) => new Board(b)),
    }
}

export const runA = ({ nums, boards }: Input) => {
    let result!: [number, Board];
    nums.some(num => {
        if (boards.some(b => b.callNumber(num))) {
            const winner = strongFind<Board>(boards,(b) => b.hasWon());
            result = [num, winner];
            return true;
        }
    })

    return result[0] * result[1].calculateScore()
}

interface Result {
    num: number | null;
    board: Board | null;
}
export const runB = ({ nums, boards }: Input) => {
    const result: Result = {
        num: null,
        board: null,
    }

    let winners = 0;
    nums.some(num => {
        if (boards.some((board) => {
            if (!board.hasWon() && board.callNumber(num)) {
                ++winners
                if (winners === boards.length) {
                    result.num = num;
                    result.board = board
                    return true;
                }
            }
        })) {
            return true;
        }
    })

    assert(result.num);
    assert(result.board);
    return result.num * result.board.calculateScore()
}
export const testsA: Testable[] = [{ input: parseInput(exampleInput), result: 4512 }];
export const testsB: Testable[] = [{ input: parseInput(exampleInput), result: 1924 }];
