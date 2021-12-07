import { Testable } from "../lib";

const exampleInput = `forward 5
down 5
forward 8
up 3
down 8
forward 2`;

type Direction = "up" | "down" | "forward";

interface Instruction {
    direction: Direction;
    distance: number;
};

const calculateSimplePosition = (directions: Instruction[]): number => {
    const position = {
        up: 0,
        down: 0,
        forward: 0,
    }
    directions.forEach((i: Instruction) => position[i.direction] += i.distance)

    return (position.down - position.up) * position.forward;
}

const calculateAimedPosition = (directions: Instruction[]): number => {
    const position = {
        aim: 0,
        forward: 0,
        down: 0,
    }
    directions.forEach((i: Instruction) => {
        switch(i.direction) {
            case "up": {
                position.aim -= i.distance;
                break;
            }
            case "down": {
                position.aim += i.distance;
                break;
            }
            case "forward": {
                position.down += (position.aim * i.distance)
                position.forward += i.distance;
                break;
            }
        }
    })

    return position.down * position.forward;
}

export const parseInput = (input: string): Instruction[] => {
    return input.split('\n').map((d) => {
        const direction = d.split(' ');

        return {
            direction: direction[0] as Direction,
            distance: parseInt(direction[1]),
        };
    })
};
export const runA = calculateSimplePosition;
export const runB = calculateAimedPosition;
export const testsA: Testable[] = [{ input: parseInput(exampleInput), result: 150 }];
export const testsB: Testable[] = [{ input: parseInput(exampleInput), result: 900 }];
