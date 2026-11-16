// The spider's walk clip, copied from the voxel engine's entities library.
// Source: ~/Work/voxel-engine, branch chore-clip-recorder at 4c4e1da5
// (16 Nov 2026), apps/flythrough/assets/entities/spider/spider.rig,
// `clip walk ticks 48 loop`, rate 30 ticks a second.
//
// Each leg key is [tick, rot z, rot y] in degrees, exactly as the rig file
// writes `key <tick> <leg> rot z <a> rot y <b>`. Rot z swings the leg
// forward and back around the hip; rot y lifts it on the forward swing.
// The hip offsets are each leg's `at` from the body pivot and the lengths
// are the x of its `pivot`, both in model voxels.

export type LegKey = readonly [tick: number, rotZ: number, rotY: number];

export interface SpiderLeg {
  name: string;
  side: -1 | 1;
  hip: readonly [x: number, y: number];
  length: number;
  keys: readonly LegKey[];
}

export const SPIDER_RATE = 30;
export const SPIDER_WALK_TICKS = 48;

export const SPIDER_LEGS: readonly SpiderLeg[] = [
  {
    name: 'leg_l1',
    side: -1,
    hip: [-9, -8],
    length: 60,
    keys: [
      [0, 50, 14],
      [4, 59, 12],
      [8, 66, 7],
      [12, 68, 0],
      [16, 66, 0],
      [20, 59, 0],
      [24, 50, 0],
      [28, 41, 0],
      [32, 34, 0],
      [36, 32, 0],
      [40, 34, 7],
      [44, 41, 12],
      [48, 50, 14],
    ],
  },
  {
    name: 'leg_r1',
    side: 1,
    hip: [9, -8],
    length: 60,
    keys: [
      [0, -50, 0],
      [4, -41, 0],
      [8, -34, 0],
      [12, -32, 0],
      [16, -34, -7],
      [20, -41, -12],
      [24, -50, -14],
      [28, -59, -12],
      [32, -66, -7],
      [36, -68, 0],
      [40, -66, 0],
      [44, -59, 0],
      [48, -50, 0],
    ],
  },
  {
    name: 'leg_l2',
    side: -1,
    hip: [-9, -3],
    length: 52,
    keys: [
      [0, 11, 0],
      [4, 4, 0],
      [8, 0, 0],
      [12, 1, 5],
      [16, 7, 11],
      [20, 15, 14],
      [24, 25, 13],
      [28, 32, 9],
      [32, 36, 2],
      [36, 35, 0],
      [40, 29, 0],
      [44, 21, 0],
      [48, 11, 0],
    ],
  },
  {
    name: 'leg_r2',
    side: 1,
    hip: [9, -3],
    length: 52,
    keys: [
      [0, -25, -13],
      [4, -32, -9],
      [8, -36, -2],
      [12, -35, 0],
      [16, -29, 0],
      [20, -21, 0],
      [24, -11, 0],
      [28, -4, 0],
      [32, 0, 0],
      [36, -1, -5],
      [40, -7, -11],
      [44, -15, -14],
      [48, -25, -13],
    ],
  },
  {
    name: 'leg_l3',
    side: -1,
    hip: [-9, 2],
    length: 48,
    keys: [
      [0, -4, 10],
      [4, 1, 4],
      [8, 2, 0],
      [12, -3, 0],
      [16, -11, 0],
      [20, -20, 0],
      [24, -28, 0],
      [28, -33, 0],
      [32, -34, 3],
      [36, -29, 10],
      [40, -21, 13],
      [44, -12, 14],
      [48, -4, 10],
    ],
  },
  {
    name: 'leg_r3',
    side: 1,
    hip: [9, 2],
    length: 48,
    keys: [
      [0, 28, 0],
      [4, 33, 0],
      [8, 34, -3],
      [12, 29, -10],
      [16, 21, -13],
      [20, 12, -14],
      [24, 4, -10],
      [28, -1, -4],
      [32, -2, 0],
      [36, 3, 0],
      [40, 11, 0],
      [44, 20, 0],
      [48, 28, 0],
    ],
  },
  {
    name: 'leg_l4',
    side: -1,
    hip: [-9, 7],
    length: 58,
    keys: [
      [0, -64, 0],
      [4, -66, 1],
      [8, -63, 8],
      [12, -56, 13],
      [16, -46, 14],
      [20, -38, 11],
      [24, -32, 6],
      [28, -30, 0],
      [32, -33, 0],
      [36, -40, 0],
      [40, -50, 0],
      [44, -58, 0],
      [48, -64, 0],
    ],
  },
  {
    name: 'leg_r4',
    side: 1,
    hip: [9, 7],
    length: 58,
    keys: [
      [0, 32, -6],
      [4, 30, 0],
      [8, 33, 0],
      [12, 40, 0],
      [16, 50, 0],
      [20, 58, 0],
      [24, 64, 0],
      [28, 66, -1],
      [32, 63, -8],
      [36, 56, -13],
      [40, 46, -14],
      [44, 38, -11],
      [48, 32, -6],
    ],
  },
];
