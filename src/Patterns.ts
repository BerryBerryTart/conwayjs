export interface PatternType {
  description: string;
  pattern: string;
}

export const PatternList: PatternType[] = [
  {
    description: "Blinker (h) (3x1)",
    pattern: "ooo",
  },
  {
    description: "Blinker (v) (1x3)",
    pattern: `
      .o|
      .o|
      .o
    `,
  },
  {
    description: "Glider (3x3)",
    pattern: `
      .o|
      ..o|
      ooo|
    `,
  },
  {
    description: "Lightweight Spaceship (5x4)",
    pattern: `
      .o..o|
      o|
      o...o|
      oooo
    `,
  },

  {
    description: "Octogon (8x8)",
    pattern: `
      ...oo|
      ..o..o|
      .o....o|
      o......o|
      o......o|
      .o....o|
      ..o..o|
      ...oo|
    `,
  },
  {
    description: "Tumbler (9x7)",
    pattern: `
      .o.....o|
      o.o...o.o|
      o..o.o..o|
      ..o...o|
      ..oo.oo
    `,
  },
  {
    description: "Pulsar (15x15)",
    pattern: `
      ..ooo...ooo|
      .|
      o....o.o....o|
      o....o.o....o|
      o....o.o....o|
      ..ooo...ooo|
      .|
      ..ooo...ooo..|
      o....o.o....o|
      o....o.o....o|
      o....o.o....o|
      .|
      ..ooo...ooo
    `,
  },
  {
    description: "Gosper Glider Gun (36x9)",
    pattern: `
      ........................o|
      ......................o.o|
      ............oo......oo............oo|
      ...........o...o....oo............oo|
      oo........o.....o...oo|
      oo........o...o.oo....o.o|
      ..........o.....o.......o|
      ...........o...o|
      ............oo|
    `,
  },
];
