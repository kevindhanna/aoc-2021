import assert from "assert/strict";
import { strongPop, strongShift } from "../lib";
import { Point, Rotation, rot3D } from "./rot3D";

export const euclidDistance = (a: Point, b: Point): number => {
    const [a1, a2, a3] = a;
    const [b1, b2, b3] = b;
    const n1 = (a1 - b1) ** 2;
    const n2 = (a2 - b2) ** 2;
    const n3 = (a3 - b3) ** 2;
    return parseFloat(((n1 + n2 + n3) ** 0.5).toFixed(5));
}

type BeaconMap = Map<string, number[]>
export class Scanner {
    beacons: BeaconMap;
    position?: Point;

    constructor(input: string) {
        this.beacons = new Map();
        const points: Point[] = input.split("\n").filter(l => l !== "").map(p => asPoint(p));
        points.forEach(point => {
            this.beacons.set(
                point.join(","),
                points.map(p => euclidDistance(point, p)).filter(d => d !== 0), // filter distance to itself
            );
        })
    }
    transformRelativePosition(position: Point, transform: Rotation) {
        this.position = position;
        const transformed: Map<string, number[]> = new Map()

        this.beacons.forEach((v, b) => {
            const bT = rot3D(asPoint(b), transform);
            const movedB = addVectors(bT, position);
            transformed.set(movedB.join(","), v);
        })
        this.beacons = transformed;
    }
}

const asPoint = (p: string): Point => p.split(",").map(n => parseInt(n)) as Point;
const addVectors = (a: Point, b: Point) => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];

export const parseInput = (input: string): Scanner[] =>
    input.split(/-+ \w+ \d+ -+/g).filter(s => s !== "").map(s => new Scanner(s));

const ROTATIONS: Rotation[] = [
    [180, 180, 180],
    [270, 270, 90],
    [180, 180, 0],
    [270, 90, 270],
    [180, 270, 180],
    [270, 0, 90],
    [180, 270, 0],
    [270, 180, 270],
    [180, 0, 180],
    [270, 90, 90],
    [180, 0, 0],
    [270, 270, 270],
    [180, 90, 180],
    [270, 180, 90],
    [180, 90, 0],
    [270, 0, 270],
    [270, 180, 180],
    [270, 180, 0],
    [270, 270, 180],
    [270, 270, 0],
    [270, 0, 180],
    [270, 0, 0],
    [270, 90, 180],
    [270, 90, 0],
];

const isEqual = (a: Point, b: Point): boolean => {
    return a[0] === b[0] && a[1] === b[1] && a[2] === b[2];
}

export const isSamePoint = (a: Point, b: Point): boolean => ROTATIONS.some(r => isEqual(rot3D(b, r), a));

export const hasOverlap = (a: Scanner, b: Scanner): boolean => {
    const aBeacons = a.beacons.values();
    let bBeacons = b.beacons.values();
    let aCurrent = aBeacons.next();
    let bCurrent = bBeacons.next();
    while (!aCurrent.done) {
        const aNeighbours = aCurrent.value;
        while (!bCurrent.done) {
            const bNeighbours = bCurrent.value;
            const neighbourSet = new Set(aNeighbours.concat(bNeighbours));
            if (neighbourSet.size - aNeighbours.length < 20) {
                return true
            }
            bCurrent = bBeacons.next();
        }
        bBeacons = b.beacons.values();
        bCurrent = bBeacons.next();
        aCurrent = aBeacons.next();
    }
    return false;
}

type Overlaps = { a: Set<string>, b: Set<string> };
export const overlappingBeacons = (a: Scanner, b: Scanner): Overlaps => {
    const aValues = a.beacons.entries();
    let bValues = b.beacons.entries();
    let aBeacon = aValues.next();
    let bBeacon = bValues.next();
    const overlapping: Overlaps = { a: new Set(), b: new Set() };
    while (!aBeacon.done) {
        const [aPoint, aNeighbours] = aBeacon.value;
        while (!bBeacon.done) {
            const [bPoint, bNeighbours] = bBeacon.value;
            if (bNeighbours.some((n => aNeighbours.includes(n)))) {
                if (!overlapping.a.has(aPoint) && !overlapping.b.has(bPoint)) {
                    overlapping.a.add(aPoint);
                    overlapping.b.add(bPoint);
                    break;
                }
            }
            bBeacon = bValues.next();
        }
        bValues = b.beacons.entries();
        bBeacon = bValues.next();
        aBeacon = aValues.next();
    }

    return overlapping;
}

export const findEquivalents = (overlaps: Overlaps, a: Scanner, b: Scanner): Map<string, string> => {
    const equivalents: Map<string,string> = new Map()
    overlaps.a.forEach(Oa => {
        const neighboursA = a.beacons.get(Oa);
        assert(neighboursA);
        [...overlaps.b].find(Ob => {
            const neighboursB = b.beacons.get(Ob)
            assert(neighboursB);
            const nSet = new Set([...neighboursA, ...neighboursB]);
            if (nSet.size - neighboursA.length < 20) {
                equivalents.set(Oa, Ob);
                return true;
            }
            return false;
        })
    })
    return equivalents;
}

export const removeOffset = (equivs: Map<string, string>, b: Scanner) => {
    const entries = equivs.entries();
    const pairs = [];
    pairs.push(entries.next().value);
    pairs.push(entries.next().value);

    const [
        [a1s, b1s],
        [a2s, b2s],
    ] = pairs;
    const a1 = asPoint(a1s)
    const a2 = asPoint(a2s)
    const b1 = asPoint(b1s)
    const b2 = asPoint(b2s)
    const diffA: Point = [a1[0] - a2[0], a1[1] - a2[1], a1[2] - a2[2]];
    const diffB: Point = [b1[0] - b2[0], b1[1] - b2[1], b1[2] - b2[2]];
    const transform = ROTATIONS.find(r => isEqual(rot3D(diffB, r), diffA));
    assert(transform)

    const b1T = rot3D(b1, transform);
    b.transformRelativePosition(
        [a1[0] - b1T[0], a1[1] - b1T[1], a1[2] - b1T[2]],
        transform,
    );
}

const locateScanners = (scanners: Scanner[]): Scanner[] => {
    const zero = strongShift(scanners);
    zero.position = [0,0,0]

    let stack: Scanner[] = [];
    const located: Scanner[] = [];
    while (scanners.length) {
        const next = strongPop(scanners);
        if (hasOverlap(zero, next)) {
            const overlaps = overlappingBeacons(zero, next);
            const equivalents = findEquivalents(overlaps, zero, next);
            if (equivalents.size > 1) {
                removeOffset(equivalents, next);
                next.beacons.forEach((neighbours, beacon) => {
                    zero.beacons.set(beacon, neighbours);
                })
                located.push(next)
            } else {
                stack.push(next);
            }
        } else {
            stack.push(next);
        }
        if (!scanners.length && stack.length) {
            scanners = stack;
            stack = [];
        }
    }
    located.push(zero);
    return located;
}

export const runA = (scanners: Scanner[]): number => {
    const located = locateScanners(scanners);
    const zero = strongPop(located);
    return zero.beacons.size;
}

const { abs } = Math;
export const manhattanDist = (a: Point, b: Point): number => abs(a[0] - b[0]) + abs(a[1] - b[1]) + abs(a[2] - b[2]);

export const runB = (scanners: Scanner[]): number => {
    const located = locateScanners(scanners);
    let max = 0;
    while (located.length) {
        const current = strongPop(located);
        located.forEach(s => {
            assert(current.position);
            assert(s.position);
            const dist = manhattanDist(current.position, s.position);
            if (dist > max) {
                max = dist;
            }
        })
    }
    return max;
}
