import {
    parseInput,
    decodePacket,
    decodeLiteralValue,
    runA,
    runB,
} from "./solution"
import { Packet } from "./Packet";
import { makeGreen, Testable } from "../lib"

const parseAndRun = (fn: (input: string) => any) => {
    return (input: string) => {
        return fn(parseInput(input))
    }
}
const returnPacket = (input: string): Packet => {
    const [result, ] = decodePacket(input);
    return result;
}

export const tests: Testable<string, any>[] = [
    {
        description: "Decode literal val string",
        input: "101111111000101",
        result: [2021, ""],
        fn: decodeLiteralValue,
    },
    {
        description: "Decode literal packet to constituent parts",
        input: "D2FE28",
        result: {
            version: 6,
            typeId: 4,
            value: 2021,
        },
        fn: parseAndRun(returnPacket),
    },
    {
        description: "convert hex to binary",
        input: "38006F45291200",
        result: "00111000000000000110111101000101001010010001001000000000",
        fn: parseInput
    },
    {
        description: "Decode operator packet to constituent parts",
        input: "38006F45291200",
        result: {
            version: 1,
            typeId: 6,
            subPackets: [
                {
                    typeId: 4,
                    version: 6,
                    value: 10,
                },
                {
                    typeId: 4,
                    version: 2,
                    value: 20,
                },
            ]
        },
        fn: parseAndRun(returnPacket),
    },
    {
        description: "Decode packet to constituent parts",
        input: "EE00D40C823060",
        result: {
            version: 7,
            typeId: 3,
            subPackets: [
                {
                    typeId: 4,
                    value: 1,
                    version: 2
                },
                {
                    typeId: 4,
                    value: 2,
                    version: 4
                },
                {
                    typeId: 4,
                    value: 3,
                    version: 1
                },
            ]
        },
        fn: parseAndRun(returnPacket),
    },
    {
        description: "Calculate packet version sum",
        input: "8A004A801A8002F478",
        result: 16,
        fn: parseAndRun(runA)
    },
    {
        description: "Calculate packet version sum",
        input: "620080001611562C8802118E34",
        result: 12,
        fn: parseAndRun(runA)
    },
    {
        description: "Calculate packet version sum",
        input: "C0015000016115A2E0802F182340",
        result: 23,
        fn: parseAndRun(runA)
    },
    {
        description: "Calculate packet version sum",
        input: "A0016C880162017C3686B18A3D4780",
        result: 31,
        fn: parseAndRun(runA)
    },
    {
        description: "sums 1 and 2",
        input: "C200B40A82",
        result: 3,
        fn: parseAndRun(runB)
    },
    {
        description: `6 * 9 - ${makeGreen("this one fails for some unknown reason, even though the code passed the puzzle...")}`,
        input: "04005AC33890",
        result: 54,
        fn: parseAndRun(runB)
    },
    {
        description: "min of 7, 8 and 9",
        input: "880086C3E88112",
        result: 7,
        fn: parseAndRun(runB)
    },
    {
        description: "Max of 7, 8, 9",
        input: "CE00C43D881120",
        result: 9,
        fn: parseAndRun(runB)
    },
    {
        description: "5 < 15",
        input: "D8005AC2A8F0",
        result: 1,
        fn: parseAndRun(runB)
    },
    {
        description: "5 > 15",
        input: "F600BC2D8F",
        result: 0,
        fn: parseAndRun(runB)
    },
    {
        description: "5 === 15",
        input: "9C005AC2F8F0",
        result: 0,
        fn: parseAndRun(runB)
    },
    {
        description: "1 + 3 === 2 * 2",
        input: "9C0141080250320F1802104A08",
        result: 1,
        fn: parseAndRun(runB)
    },
];
