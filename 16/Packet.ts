import assert from "assert/strict";

enum PacketType {
    Sum = 0,
    Literal = 4,
    Product = 1,
    Min = 2,
    Max = 3,
    GreaterThan = 5,
    LessThan = 6,
    Equal = 7,
}

export interface Packet {
    version: number;
    typeId: PacketType;
    subPackets?: Packet[];
    value?: number;
}

export enum LengthType {
    Total = "0",
    Count = "1"
}

const sum = (packet: Packet): Packet => {
    return {
        typeId: PacketType.Literal,
        value: packet.subPackets?.reduce<number>((acc, p) => {
            p = executeCommand(p);
            assert(p.value !== undefined);
            acc += p.value
            return acc;
        }, 0),
        version: packet.version,
    }
}

const product = (packet: Packet): Packet => {
    return {
        typeId: PacketType.Literal,
        value: packet.subPackets?.reduce<number>((acc, p) => {
            p = executeCommand(p);
            assert(p.value !== undefined);
            acc = acc * p.value
            return acc;
        }, 1),
        version: packet.version,
    }
}

const min = (packet: Packet): Packet => {
    assert(packet.subPackets?.length);
    let min: Packet = executeCommand(packet.subPackets[0]);
    packet.subPackets.forEach(p => {
        p = executeCommand(p);
        assert(p.value && min.value);
        if (p.value < min.value) {
            min = p;
        }
    })
    return {
        typeId: PacketType.Literal,
        value: min.value,
        version: packet.version,
    }
}

const max = (packet: Packet): Packet => {
    assert(packet.subPackets?.length);
    let max: Packet = executeCommand(packet.subPackets[0]);
    packet.subPackets.forEach(p => {
        p = executeCommand(p);
        assert(p.value && max.value);
        if (p.value > max.value) {
            max = p;
        }
    })
    return {
        typeId: PacketType.Literal,
        value: max.value,
        version: packet.version,
    }
}

const greaterThan = (packet: Packet): Packet => {
    assert(packet.subPackets?.length === 2);
    const [left, right] = packet.subPackets.map(p => executeCommand(p));
    assert(left.value && right.value);

    return {
        typeId: PacketType.Literal,
        value: left.value > right.value ? 1 : 0,
        version: packet.version,
    }
}

const lessThan = (packet: Packet): Packet => {
    assert(packet.subPackets?.length === 2);
    const [left, right] = packet.subPackets.map(p => executeCommand(p));
    assert(left.value && right.value);

    return {
        typeId: PacketType.Literal,
        value: left.value < right.value ? 1 : 0,
        version: packet.version,
    }
}

const equal = (packet: Packet): Packet => {
    assert(packet.subPackets?.length === 2);
    const [left, right] = packet.subPackets.map(p => executeCommand(p));
    assert(left.value && right.value);

    return {
        typeId: PacketType.Literal,
        value: left.value === right.value ? 1 : 0,
        version: packet.version,
    }
}

export const executeCommand = (packet: Packet): Packet => {
    switch (packet.typeId) {
        case PacketType.Literal: {
            return packet
        }
        case PacketType.Sum: {
            return sum(packet)
        }
        case PacketType.Product: {
            return product(packet)
        }
        case PacketType.Min: {
            return min(packet)
        }
        case PacketType.Max: {
            return max(packet)
        }
        case PacketType.GreaterThan: {
            return greaterThan(packet)
        }
        case PacketType.LessThan: {
            return lessThan(packet)
        }
        case PacketType.Equal: {
            return equal(packet)
        }
    }
}
