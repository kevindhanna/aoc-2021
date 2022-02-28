const exampleInput = ` #############
#...........#
###B#C#B#D###
  #A#D#C#A#
  #########`;

const tests = [
    {
        description: "calculates the min sort energy",
        input: exampleInput,
        result: 12521,
        fn: (input: string) => runA(parseInput(input)),
    }
]
