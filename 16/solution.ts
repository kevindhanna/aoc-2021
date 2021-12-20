import assert from "assert/strict";
import { Packet, LengthType, executeCommand } from "./Packet";

export const parseInput = (packet: string): string => {
    let bin = BigInt(`0x${packet}`).toString(2)
    while (bin.length % 4) {
        bin = "0".concat(bin);
    }
    return bin;
}

const chompGroup = (s: string): [string, string, string] => {
    const indicator = s.slice(0,1);
    return [indicator, s.slice(1, 5), s.slice(5)];
}

export const decodeLiteralValue = (valString: string): [number, string] => {
    let val = ""
    let looping = true;
    while (looping) {
        const [first, next, rest] = chompGroup(valString);
        val = val.concat(next)
        valString = rest;
        if (first === "0") {
            looping = false;
        }
    }
    return [parseInt(val, 2), valString];
}


export const decodePacket = (packet: string, callback?: (packet: Packet) => void): [Packet, string] => {
    const version = parseInt(packet.slice(0, 3), 2);
    const typeId = parseInt(packet.slice(3, 6), 2);
    let rest = packet.slice(6);

    if (typeId === 4) {
        const [value, tail] = decodeLiteralValue(rest);
        const parsedPacket = { version, typeId, value };
        if (callback) {
            callback(parsedPacket)
        }
        return [parsedPacket, tail];
    }

    const lengthTypeId = rest[0];
    rest = rest.slice(1);
    const subPackets: Packet[] = [];

    if (lengthTypeId === LengthType.Total) {
        const length = parseInt(rest.slice(0, 15), 2);
        rest = rest.slice(15);
        let subPacketString = rest.slice(0, length);
        rest = rest.slice(length)
        while (subPacketString.length) {
            const [subPacket, tail] = decodePacket(subPacketString, callback);
            subPackets.push(subPacket);
            subPacketString = tail
        }
    } else {
        const length = parseInt(rest.slice(0, 11), 2);
        rest = rest.slice(11);
        while (subPackets.length < length) {
            const [subPacket, tail] = decodePacket(rest, callback);
            subPackets.push(subPacket);
            rest = tail;
        }
    }
    const parsedPacket = { version, typeId, subPackets };

    if (callback) {
        callback(parsedPacket)
    }
    return [parsedPacket, rest]
}

export const runA = (input: string): number => {
    const versions: number[] = [];
    const callback = (packet: Packet) => versions.push(packet.version);
    decodePacket(input, callback)
    return versions.reduce((a, v) => { a += v; return a }, 0)
}



export const runB = (input: string): number => {
    const [packet,] = decodePacket(input)
    const result = executeCommand(packet);
    assert(result.value !== undefined);
    return result.value
}

