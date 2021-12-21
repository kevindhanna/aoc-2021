import { Testable } from "../lib";
import {
    add,
    calcMagnitude,
    parseNum,
    parseInput,
    reduce,
    runA,
    sumList,
} from "./solution";


const join = (num: string[]): string => {
    let s = num.join(",");
    s = s.replace(/\[,/g, '[')
    s = s.replace(/\,]/g, ']')
    return s
}

const anInput = `[1,1]
[2,2]
[3,3]
[4,4]`;

const aSecondInput = `[1,1]
[2,2]
[3,3]
[4,4]
[5,5]`;

const aThirdInput = `[1,1]
[2,2]
[3,3]
[4,4]
[5,5]
[6,6]`;

const anotherInput = `[[[0,[5,8]],[[1,7],[9,6]]],[[4,[1,2]],[[1,4],2]]]
[[[5,[2,8]],4],[5,[[9,9],0]]]
[6,[[[6,2],[5,6]],[[7,6],[4,7]]]]
[[[6,[0,7]],[0,9]],[4,[9,[9,0]]]]
[[[7,[6,4]],[3,[1,3]]],[[[5,5],1],9]]
[[6,[[7,3],[3,2]]],[[[3,8],[5,7]],4]]
[[[[5,4],[7,7]],8],[[8,3],8]]
[[9,3],[[9,9],[6,[4,9]]]]
[[2,[[7,7],7]],[[5,8],[[9,3],[0,2]]]]
[[[[5,2],5],[8,[3,7]]],[[5,[7,5]],[4,4]]]`;


const oneMore = `[[[0,[4,5]],[0,0]],[[[4,5],[2,6]],[9,5]]]
[7,[[[3,7],[4,3]],[[6,3],[8,8]]]]
[[2,[[0,8],[3,4]]],[[[6,7],1],[7,[1,6]]]]
[[[[2,4],7],[6,[0,5]]],[[[6,8],[2,8]],[[2,1],[4,5]]]]
[7,[5,[[3,8],[1,4]]]]
[[2,[2,2]],[8,[8,1]]]
[2,9]
[1,[[[9,3],9],[[9,0],[0,7]]]]
[[[5,[7,4]],7],1]
[[[[4,2],2],6],[8,7]]`;

const actualLast = `
[[[0,[5,8]],[[1,7],[9,6]]],[[4,[1,2]],[[1,4],2]]]
[[[5,[2,8]],4],[5,[[9,9],0]]]
[6,[[[6,2],[5,6]],[[7,6],[4,7]]]]
[[[6,[0,7]],[0,9]],[4,[9,[9,0]]]]
[[[7,[6,4]],[3,[1,3]]],[[[5,5],1],9]]
[[6,[[7,3],[3,2]]],[[[3,8],[5,7]],4]]
[[[[5,4],[7,7]],8],[[8,3],8]]
[[9,3],[[9,9],[6,[4,9]]]]
[[2,[[7,7],7]],[[5,8],[[9,3],[0,2]]]]
[[[[5,2],5],[8,[3,7]]],[[5,[7,5]],[4,4]]]`;

const joinSumParseInput = (input: string) => join(sumList(parseInput(input)));
const joinReduceParseNum = (input: string) => join(reduce(parseNum(input)));

export const tests: Testable<any, any>[] = [
    {
        description: "does a lot of reduction",
        input: "[[[[[4,3],4],4],[7,[[8,4],9]]],[1,1]]",
        result: "[[[[0,7],4],[[7,8],[6,0]]],[8,1]]",
        fn: joinReduceParseNum,
    },
    {
        description: "does a lot of reduction",
        input: "[[[[0,[4,5]],[0,0]],[[[4,5],[2,6]],[9,5]]],[7,[[[3,7],[4,3]],[[6,3],[8,8]]]]]",
        result: "[[[[4,0],[5,4]],[[7,7],[6,0]]],[[8,[7,7]],[[7,9],[5,0]]]]",
        fn: joinReduceParseNum,
    },
    {
        description: "adds and reduces",
        input: ["[[[[4,3],4],4],[7,[[8,4],9]]]", "[1,1]"],
        result: "[[[[0,7],4],[[7,8],[6,0]]],[8,1]]",
        fn: (input: string[]) => join(add(parseNum(input[0]), parseNum(input[1]))),
    },
    {
        description: "adds together a list of nums",
        input: anInput,
        result: "[[[[1,1],[2,2]],[3,3]],[4,4]]",
        fn: joinSumParseInput,
    },
    {
        description: "adds together another list of nums",
        input: aSecondInput,
        result: "[[[[3,0],[5,3]],[4,4]],[5,5]]",
        fn: joinSumParseInput,
    },
    {
        description: "adds together even more lists of nums",
        input: aThirdInput,
        result: "[[[[5,0],[7,4]],[5,5]],[6,6]]",
        fn: joinSumParseInput,
    },
    {
        description: "adds and reduces",
        input: ["[[[0,[4,5]],[0,0]],[[[4,5],[2,6]],[9,5]]]", "[7,[[[3,7],[4,3]],[[6,3],[8,8]]]]"],
        result: "[[[[4,0],[5,4]],[[7,7],[6,0]]],[[8,[7,7]],[[7,9],[5,0]]]]",
        fn: (input: string[]) => join(add(parseNum(input[0]), parseNum(input[1]))),
    },
    {
        description: "reduces some more",
        input: "[[[[[6,7],[6,7]],[[7,7],[0,7]]],[[[8,7],[7,7]],[[8,8],[8,0]]]],[[[[2,4],7],[6,[0,5]]],[[[6,8],[2,8]],[[2,1],[4,5]]]]]",
        result: "[[[[7,0],[7,7]],[[7,7],[7,8]]],[[[7,7],[8,8]],[[7,7],[8,7]]]]",
        fn: joinReduceParseNum,
    },
    {
        description: "adds together bloody massive lists of numbers",
        input: anotherInput,
        result: "[[[[6,6],[7,6]],[[7,7],[7,0]]],[[[7,7],[7,7]],[[7,8],[9,9]]]]",
        fn: joinSumParseInput,
    },
    {
        description: "I really want to make sure it's working right",
        input: oneMore,
        result: "[[[[8,7],[7,7]],[[8,6],[7,7]]],[[[0,7],[6,6]],[8,7]]]",
        fn: joinSumParseInput,
    },
    {
        description: "calculates the magnitude",
        input: "[9,1]",
        result: 29,
        fn: calcMagnitude
    },
    {
        description: "calculates the magnitude",
        input: "[[1,2],[[3,4],5]]",
        result: 143,
        fn: calcMagnitude
    },
    {
        description: "calculates the magnitude",
        input: "[[[[0,7],4],[[7,8],[6,0]]],[8,1]]",
        result: 1384,
        fn: calcMagnitude
    },
    {
        description: "calculates the magnitude",
        input: "[[[[1,1],[2,2]],[3,3]],[4,4]]",
        result: 445,
        fn: calcMagnitude
    },
    {
        description: "calculates the magnitude",
        input: "[[[[3,0],[5,3]],[4,4]],[5,5]]",
        result: 791,
        fn: calcMagnitude
    },
    {
        description: "calculates the magnitude",
        input: "[[[[5,0],[7,4]],[5,5]],[6,6]]",
        result: 1137,
        fn: calcMagnitude
    },
    {
        description: "calculates the magnitude",
        input: "[[[[8,7],[7,7]],[[8,6],[7,7]]],[[[0,7],[6,6]],[8,7]]]",
        result: 3488,
        fn: calcMagnitude
    },
    {
        description: "it does all the things",
        input: actualLast,
        result: 4140,
        fn: (input: string) => runA(parseInput(input))
    },
]
