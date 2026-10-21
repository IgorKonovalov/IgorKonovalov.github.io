// Data behind the d2-recon diary charts (Diablo II posts, October 2026).
// Every number here was read from the d2-recon repository at the cut-off
// commit of the post that first shows it; the source is named next to each block.

/** Research map status, in order of progress. */
export type MapState = 0 | 1 | 2 | 3 | 4; // not started, planned, findings, draft spec, reviewed

export type Band = 'core' | 'enablers' | 'paths' | 'sim' | 'rules';

export interface MapRow {
  id: string;
  band: Band;
  /** State at each snapshot it was on the map, keyed by snapshot id; a row
   *  absent from a snapshot did not exist on the map then. */
  state: Partial<Record<SnapshotId, MapState>>;
}

export type SnapshotId = 'd1' | 'd3' | 'd4' | 'd6' | 'd8' | 'd11';

/**
 * Cut-off commits: 8faba4f2 (11 Oct 20:39), c8753c82 (13 Oct 19:46), 2c8eb42 (14 Oct 20:50),
 * 33dc648 (16 Oct 17:53), 02d790d (18 Oct 20:10), 483728e (21 Oct 12:11).
 */
export const snapshots: SnapshotId[] = ['d1', 'd3', 'd4', 'd6', 'd8', 'd11'];

/** States from the first snapshot the row was on the map, in snapshot order. */
const s = (...states: MapState[]): Partial<Record<SnapshotId, MapState>> =>
  Object.fromEntries(
    snapshots
      .slice(snapshots.length - states.length)
      .map((id, i) => [id, states[i]]),
  );

// docs/specs/README.md at each cut-off. "findings" = findings written, no spec yet;
// "planned" = an approved plan and no findings.
export const researchMap: MapRow[] = [
  { id: 'rng', band: 'core', state: s(4, 4, 4, 4, 4, 4) },
  { id: 'items/tc', band: 'core', state: s(2, 4, 4, 4, 4, 4) },
  { id: 'items/quality', band: 'core', state: s(0, 2, 4, 4, 4, 4) },
  { id: 'items/affixes', band: 'core', state: s(0, 0, 2, 4, 4, 4) },
  { id: 'items/uniques-sets', band: 'core', state: s(0, 0, 4, 4, 4, 4) },
  { id: 'items/properties', band: 'core', state: s(0, 0, 2, 4, 4, 4) },
  { id: 'monsters/pool', band: 'core', state: s(0, 4, 4, 4, 4, 4) },
  { id: 'monsters/spawn', band: 'core', state: s(0, 2, 4, 4, 4, 4) },
  { id: 'monsters/special', band: 'core', state: s(0, 0, 4, 4, 4, 4) },
  { id: 'drlg/overview', band: 'core', state: s(1, 4, 4, 4, 4, 4) },
  { id: 'drlg/preset', band: 'core', state: s(0, 4, 4, 4, 4, 4) },
  { id: 'drlg/maze', band: 'core', state: s(0, 0, 2, 4, 4, 4) },
  { id: 'drlg/outdoor', band: 'core', state: s(0, 0, 2, 4, 4, 4) },
  { id: 'drlg/warps', band: 'core', state: s(0, 0, 2, 4, 4, 4) },
  { id: 'objects', band: 'core', state: s(0, 0, 1, 4, 4, 4) },
  // Plan 0048 (seed to world) added the Core row `chain` at its Phase 0 review on 20 Oct.
  { id: 'chain', band: 'core', state: s(2) },
  { id: 'data/excel', band: 'enablers', state: s(4, 4, 4, 4, 4, 4) },
  { id: 'data/calc', band: 'enablers', state: s(0, 0, 0, 4, 4, 4) },
  { id: 'data/strings', band: 'enablers', state: s(0, 2, 2, 4, 4, 4) },
  { id: 'rng/seeds', band: 'enablers', state: s(4, 4, 4, 4, 4, 4) },
  { id: 'drlg/collision', band: 'enablers', state: s(0, 0, 4, 4, 4, 4) },
  { id: 'save/d2s', band: 'enablers', state: s(0, 3, 3, 4, 4, 4) },
  // Plan 0040 (room lifecycle) was approved on 16 Oct after the day 6 cut and reviewed on 17 Oct.
  { id: 'drlg/lifecycle', band: 'enablers', state: s(4, 4) },
  { id: 'items/vendors', band: 'paths', state: s(0, 0, 0, 4, 4, 4) },
  { id: 'items/cube', band: 'paths', state: s(0, 0, 0, 4, 4, 4) },
  { id: 'items/sockets-runewords', band: 'paths', state: s(0, 0, 0, 4, 4, 4) },
  { id: 'items/quest-drops', band: 'paths', state: s(0, 0, 0, 4, 4, 4) },
  { id: 'monsters/stats', band: 'paths', state: s(0, 0, 1, 4, 4, 4) },
  { id: 'hirelings', band: 'paths', state: s(0, 0, 0, 4, 4, 4) },
  { id: 'player/creation', band: 'paths', state: s(0, 0, 0, 4, 4, 4) },
  // The Simulation band was added by ADR-0014 on 16 Oct; plan 0037 closed on the 17th,
  // plan 0041 (stats and states) was approved after the day 6 cut and closed on the 17th.
  { id: 'combat/formulas', band: 'sim', state: s(1, 4, 4) },
  { id: 'stats/aggregate', band: 'sim', state: s(4, 4) },
  { id: 'stats/states', band: 'sim', state: s(4, 4) },
  // The Game rules band was added by ADR-0017 (accepted 16 Oct, after the day 6 cut);
  // plans 0042 and 0043 had findings at day 8 and reviewed specs by the 20th.
  { id: 'quests/progression', band: 'rules', state: s(2, 4) },
  { id: 'quests/travel', band: 'rules', state: s(2, 4) },
  { id: 'items/economy', band: 'rules', state: s(2, 4) },
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
  ['14 20:59', 451, 757],
  ['14 21:16', 461, 796],
  ['14 22:37', 506, 772],
  ['14 22:50', 545, 743],
  ['15 02:10', 574, 733],
  ['15 02:44', 587, 732],
  ['15 02:54', 612, 737],
  ['15 03:05', 619, 727],
  ['15 03:29', 629, 739],
  ['15 03:57', 671, 738],
  ['15 04:14', 711, 716],
  ['15 07:39', 718, 733],
  ['15 08:47', 729, 737],
  ['15 08:48', 737, 779],
  ['15 08:54', 746, 782],
  ['15 09:05', 771, 791],
  ['15 09:17', 773, 848],
  ['15 19:08', 774, 890],
  ['15 19:10', 786, 941],
  ['15 19:13', 797, 940],
  ['15 19:25', 801, 982],
  ['15 19:33', 829, 1015],
  ['15 19:38', 829, 1057],
  ['15 19:48', 841, 1064],
  ['15 19:56', 845, 1066],
  ['15 20:13', 845, 1072],
  ['15 20:24', 848, 1095],
  ['15 23:42', 875, 1092],
  ['15 23:54', 886, 1095],
  ['16 00:15', 886, 1094],
  ['16 00:21', 889, 1096],
  ['16 01:43', 905, 1093],
  ['16 02:23', 918, 1098],
  ['16 02:28', 923, 1103],
  ['16 03:49', 956, 1090],
  ['16 06:40', 987, 1065],
  ['16 14:29', 1003, 1072],
  ['16 15:31', 1023, 1075],
  ['16 16:08', 1023, 1152],
  ['16 17:21', 1080, 1181],
  ['16 17:36', 1140, 1189],
  ['16 17:53', 1150, 1189],
  ['16 18:24', 1174, 1194],
  ['16 18:34', 1228, 1208],
  ['16 18:35', 1267, 1217],
  ['16 19:26', 1281, 1238],
  ['16 19:29', 1321, 1250],
  ['16 20:49', 1391, 1257],
  ['16 21:01', 1412, 1263],
  ['16 21:29', 1486, 1263],
  ['16 22:07', 1505, 1269],
  ['16 22:19', 1515, 1306],
  ['16 22:26', 1566, 1314],
  ['16 22:41', 1577, 1319],
  ['17 07:51', 1577, 1367],
  ['17 07:56', 1585, 1375],
  ['17 08:02', 1597, 1380],
  ['17 08:35', 1612, 1432],
  ['17 08:47', 1650, 1434],
  ['17 09:04', 1647, 1430],
  ['17 09:09', 1647, 1512],
  ['17 09:45', 1657, 1536],
  ['17 09:55', 1669, 1539],
  ['17 10:44', 1670, 1729],
  ['17 10:50', 1670, 1796],
  ['17 10:58', 1670, 1808],
  ['17 11:07', 1681, 1816],
  ['17 11:15', 1683, 1826],
  ['17 16:44', 1707, 1827],
  ['17 17:18', 1707, 1838],
  ['17 17:33', 1707, 1839],
  ['17 18:26', 1708, 1849],
  ['17 19:16', 1746, 1858],
  ['17 19:27', 1747, 1870],
  ['17 20:06', 1747, 1871],
  ['17 20:56', 1770, 1884],
  ['18 20:09', 1773, 1896],
  ['19 08:00', 1788, 1907],
  ['19 08:10', 1804, 1923],
  ['19 08:44', 1805, 1924],
  ['19 09:26', 1814, 1929],
  ['20 08:30', 1849, 1953],
  ['20 09:11', 1849, 1955],
  ['20 09:54', 1853, 2032],
  ['20 10:17', 1856, 2059],
  ['20 10:29', 1914, 2070],
  ['20 10:51', 1917, 2110],
  ['20 10:58', 1947, 2125],
  ['20 11:19', 1973, 2133],
  ['20 11:51', 1973, 2188],
  ['20 12:29', 1973, 2189],
  ['20 13:11', 2022, 2217],
  ['20 13:20', 2036, 2266],
  ['20 14:53', 2037, 2268],
  ['20 14:53', 2076, 2308],
  ['20 14:56', 2099, 2293],
  ['20 14:57', 2108, 2300],
  ['20 15:43', 2110, 2302],
  ['20 15:47', 2154, 2360],
  ['20 18:55', 2178, 2374],
  ['20 18:55', 2230, 2414],
  ['20 19:19', 2230, 2416],
  ['20 19:54', 2272, 2450],
  ['20 21:31', 2312, 2484],
  ['20 22:21', 2347, 2508],
  ['20 23:11', 2381, 2538],
  ['21 07:17', 2420, 2570],
  ['21 07:37', 2431, 2581],
  ['21 07:46', 2445, 2586],
  ['21 08:21', 2479, 2619],
  ['21 11:24', 2489, 2628],
  ['21 11:53', 2539, 2667],
  ['21 11:57', 2540, 2667],
];

/** Headline counts at each cut-off (specs map, findings, re/symbols.csv, tools/, plans/done). */
export const progress: { key: string; values: Record<SnapshotId, number> }[] = [
  {
    key: 'reviewed',
    values: { d1: 3, d3: 7, d4: 12, d6: 28, d8: 32, d11: 35 },
  },
  {
    key: 'confirmed',
    values: { d1: 48, d3: 240, d4: 446, d6: 1150, d8: 1773, d11: 2540 },
  },
  {
    key: 'inferred',
    values: { d1: 175, d3: 455, d4: 721, d6: 1189, d8: 1896, d11: 2667 },
  },
  {
    key: 'symbols',
    values: { d1: 278, d3: 626, d4: 1143, d6: 1814, d8: 2772, d11: 3373 },
  },
  {
    key: 'tools',
    values: { d1: 26, d3: 38, d4: 56, d6: 91, d8: 144, d11: 170 },
  },
  { key: 'plans', values: { d1: 5, d3: 14, d4: 19, d6: 36, d8: 39, d11: 44 } },
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
