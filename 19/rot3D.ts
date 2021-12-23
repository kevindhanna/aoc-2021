import assert from "assert/strict";

export type Angle = number;
export type Rotation = [Angle, Angle, Angle];
export type Point = [number, number, number];

const PI = Math.PI;
const cos = (n: number) => Math.round(Math.cos(n))
const sin = (n: number) => Math.round(Math.sin(n))

interface RotMatrix {
    Axx: number,
    Axy: number,
    Axz: number,
    Ayx: number,
    Ayy: number,
    Ayz: number,
    Azx: number,
    Azy: number,
    Azz: number,
}

const rotMatrixMemo: Map<string, RotMatrix> = new Map();
const buildRotMatrix = (rot: Rotation): RotMatrix => {
    const memoKey = rot.join(",");
    if (rotMatrixMemo.has(memoKey)) {
        const rotMatrix = rotMatrixMemo.get(memoKey);
        assert(rotMatrix);
        return rotMatrix;
    }
    const radX = asRad(rot[0]);
    const radY = asRad(rot[1]);
    const radZ = asRad(rot[2]);
    const sinX = sin(radX);
    const cosX = cos(radX);
    const sinY = sin(radY);
    const cosY = cos(radY);
    const sinZ = sin(radZ);
    const cosZ = cos(radZ);

    const rotMatrix = {
        Axx: cosY*cosZ || 0,
        Axy: cosY*sinZ*sinX - sinY*cosX || 0,
        Axz: cosY*sinZ*cosX + sinY*sinX || 0,

        Ayx: sinY*cosZ || 0,
        Ayy: sinY*sinZ*sinX + cosY*cosX || 0,
        Ayz: sinY*sinZ*cosX - cosY*sinX || 0,

        Azx: -sinZ || 0,
        Azy: cosZ*sinX || 0,
        Azz: cosZ*cosX || 0,
    };
    rotMatrixMemo.set(memoKey, rotMatrix);
    return rotMatrix;
}

const asRad = (angle: Angle): Angle => angle * (PI/180);
export const rot3D = (point: Point, rot: Rotation): Point => {
    const {
        Axx,
        Axy,
        Axz,
        Ayx,
        Ayy,
        Ayz,
        Azx,
        Azy,
        Azz,
    } = buildRotMatrix(rot);

    const [x, y, z] = point;
    return [
        Axx*x + Axy*y + Axz*z,
        Ayx*x + Ayy*y + Ayz*z,
        Azx*x + Azy*y + Azz*z,
    ];
}
