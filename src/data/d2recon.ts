// Data behind the d2-recon diary charts (Diablo II posts, October 2026).
// Every number here was read from the d2-recon repository at the cut-off
// commit of the post that first shows it; the source is named next to each block.

/** Research map status, in order of progress. */
export type MapState = 0 | 1 | 2 | 3 | 4; // not started, planned, findings, draft spec, reviewed

export type Band = 'core' | 'enablers' | 'paths';

export interface MapRow {
  id: string;
  band: Band;
  /** State at each snapshot, keyed by snapshot id. */
  state: Record<SnapshotId, MapState>;
}

export type SnapshotId = 'd1' | 'd3' | 'd4';

/** Cut-off commits: 8faba4f2 (11 Oct 20:39), c8753c82 (13 Oct 19:46), 2c8eb42 (14 Oct 20:50). */
export const snapshots: SnapshotId[] = ['d1', 'd3', 'd4'];

const s = (d1: MapState, d3: MapState, d4: MapState) => ({ d1, d3, d4 });

// docs/specs/README.md at each cut-off. "findings" = findings written, no spec yet;
// "planned" = an approved plan and no findings.
export const researchMap: MapRow[] = [
  { id: 'rng', band: 'core', state: s(4, 4, 4) },
  { id: 'items/tc', band: 'core', state: s(2, 4, 4) },
  { id: 'items/quality', band: 'core', state: s(0, 2, 4) },
  { id: 'items/affixes', band: 'core', state: s(0, 0, 2) },
  { id: 'items/uniques-sets', band: 'core', state: s(0, 0, 4) },
  { id: 'items/properties', band: 'core', state: s(0, 0, 2) },
  { id: 'monsters/pool', band: 'core', state: s(0, 4, 4) },
  { id: 'monsters/spawn', band: 'core', state: s(0, 2, 4) },
  { id: 'monsters/special', band: 'core', state: s(0, 0, 4) },
  { id: 'drlg/overview', band: 'core', state: s(1, 4, 4) },
  { id: 'drlg/preset', band: 'core', state: s(0, 4, 4) },
  { id: 'drlg/maze', band: 'core', state: s(0, 0, 2) },
  { id: 'drlg/outdoor', band: 'core', state: s(0, 0, 2) },
  { id: 'drlg/warps', band: 'core', state: s(0, 0, 2) },
  { id: 'objects', band: 'core', state: s(0, 0, 1) },
  { id: 'data/excel', band: 'enablers', state: s(4, 4, 4) },
  { id: 'data/calc', band: 'enablers', state: s(0, 0, 0) },
  { id: 'data/strings', band: 'enablers', state: s(0, 2, 2) },
  { id: 'rng/seeds', band: 'enablers', state: s(4, 4, 4) },
  { id: 'drlg/collision', band: 'enablers', state: s(0, 0, 4) },
  { id: 'save/d2s', band: 'enablers', state: s(0, 3, 3) },
  { id: 'items/vendors', band: 'paths', state: s(0, 0, 0) },
  { id: 'items/cube', band: 'paths', state: s(0, 0, 0) },
  { id: 'items/sockets-runewords', band: 'paths', state: s(0, 0, 0) },
  { id: 'items/quest-drops', band: 'paths', state: s(0, 0, 0) },
  { id: 'monsters/stats', band: 'paths', state: s(0, 0, 1) },
  { id: 'hirelings', band: 'paths', state: s(0, 0, 0) },
  { id: 'player/creation', band: 'paths', state: s(0, 0, 0) },
];

/**
 * Confirmed [C] and inferred [I] tags in docs/findings, sampled on the first-parent
 * history of main wherever either count changed. Time is "DD HH:MM", 2026-10, +0200.
 */
export type TagPoint = [time: string, confirmed: number, inferred: number];

export const tagSeries: TagPoint[] = [
  ['11 10:31', 0, 0],
  ['11 13:35', 7, 15],
  ['11 15:05', 21, 58],
  ['11 16:00', 28, 59],
  ['11 16:25', 42, 62],
  ['11 17:57', 45, 104],
  ['11 19:06', 48, 148],
  ['11 20:11', 48, 175],
  ['11 22:12', 57, 176],
  ['11 22:23', 57, 176],
  ['12 08:04', 80, 173],
  ['12 08:41', 103, 183],
  ['12 09:02', 104, 184],
  ['12 09:31', 108, 217],
  ['12 09:58', 109, 228],
  ['12 10:16', 117, 278],
  ['12 10:42', 135, 295],
  ['12 11:51', 139, 295],
  ['12 12:21', 159, 291],
  ['12 13:41', 161, 292],
  ['12 14:10', 168, 295],
  ['12 15:19', 168, 320],
  ['12 15:46', 184, 354],
  ['12 15:58', 184, 354],
  ['13 08:05', 196, 348],
  ['13 08:26', 204, 374],
  ['13 08:33', 205, 422],
  ['13 10:11', 206, 448],
  ['13 13:43', 223, 449],
  ['13 15:59', 225, 452],
  ['13 18:56', 229, 453],
  ['13 19:21', 236, 452],
  ['13 19:28', 240, 455],
  ['13 21:15', 279, 429],
  ['13 22:02', 279, 442],
  ['14 08:11', 279, 442],
  ['14 08:49', 282, 443],
  ['14 09:21', 282, 493],
  ['14 09:36', 282, 495],
  ['14 09:49', 290, 536],
  ['14 10:00', 291, 537],
  ['14 10:09', 293, 586],
  ['14 10:20', 293, 587],
  ['14 11:05', 332, 567],
  ['14 13:10', 356, 562],
  ['14 17:35', 376, 560],
  ['14 19:22', 376, 611],
  ['14 19:56', 395, 651],
  ['14 20:36', 402, 691],
  ['14 20:50', 446, 721],
];

/** Headline counts at each cut-off (specs map, findings, re/symbols.csv, tools/, plans/done). */
export const progress: { key: string; values: Record<SnapshotId, number> }[] = [
  { key: 'reviewed', values: { d1: 3, d3: 7, d4: 12 } },
  { key: 'confirmed', values: { d1: 48, d3: 240, d4: 446 } },
  { key: 'inferred', values: { d1: 175, d3: 455, d4: 721 } },
  { key: 'symbols', values: { d1: 278, d3: 626, d4: 1143 } },
  { key: 'tools', values: { d1: 26, d3: 38, d4: 56 } },
  { key: 'plans', values: { d1: 5, d3: 14, d4: 19 } },
];

/**
 * Blood Moor (level 2) as tools/outdoor_replay.py builds it from the level seed,
 * one character per 8x8-tile cell. Each layout was checked against the game's own
 * log of the same seed (0 mismatches). B border or cliff piece, W river, K bridge,
 * D Den of Evil entrance, F other preset (cottages, stones, pond), V no room,
 * O opening to a neighbouring level, . open ground, R road, S shrine.
 */
export interface BloodMoorMap {
  seed: number;
  levelSeed: string;
  rows: string[];
}

export const bloodMoorMaps: BloodMoorMap[] = [
  {
    seed: 12345,
    levelSeed: '015b2e79',
    rows: [
      'BBBBBBBBBBWW',
      'BSSRRRRBB.WW',
      'ORRRBBRS..WW',
      'BFBBBBRDF.WW',
      'BFBBFRRR..WW',
      'B...SRRS..WW',
      'BBBBBBOOOOWW',
    ],
  },
  {
    seed: 777,
    levelSeed: '14ad6889',
    rows: [
      'BBBBBWWBBBBB',
      'BF...WWFBBFB',
      'ORBBBWWSS..O',
      'BRBBBWWFDRRO',
      'BRBBRKKRRRSO',
      'BRRRRWWSBBSB',
      'BBBBBWWBBBBB',
    ],
  },
  {
    seed: 1,
    levelSeed: '6ac69361',
    rows: [
      'VVBBOBB',
      'BBBRRFB',
      'B..RBBB',
      'B.DRBBB',
      'BSRRRRB',
      'BBFBBRB',
      'VBFBBRB',
      'BB.BBRO',
      'B..S..O',
      'B...S.O',
      'BBBSFSB',
      'VVBBBBB',
    ],
  },
  {
    seed: 2026,
    levelSeed: '0775b9ae',
    rows: [
      'BBBBOBB',
      'BFSFR.B',
      'BFBBRFB',
      'BSBBRRB',
      'B.BBBRB',
      'BSBBBRB',
      'B..RRRB',
      'BSDRRRO',
      'B....RO',
      'B.S...O',
      'BBB...B',
      'VVBBBBB',
    ],
  },
];
