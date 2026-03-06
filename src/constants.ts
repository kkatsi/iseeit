export const cardIds = [
  'card-1',
  'card-2',
  'card-3',
  'card-4',
  'card-5',
  'card-6',
  'card-7',
  'card-8',
  'card-9',
  'card-10',
  'card-11',
  'card-12',
  'card-13',
  'card-14',
  'card-15',
  'card-16',
  'card-17',
  'card-18',
  'card-19',
  'card-20',
];

export const LOCAL_STORAGE_STATE_KEY = 'iseeitState';
export const SCORE_THRESHOLD = 40;
export const SLOT_POSITIONS = [
  // Row 1 — top (avoid top-left: player count, top-right: QR code)
  { x: 10, y: 8 },
  { x: 50, y: 6 },
  // Row 2 — upper-mid
  { x: 28, y: 26 },
  { x: 52, y: 30 },
  { x: 8, y: 32 },
  // Row 3 — lower-mid
  { x: 10, y: 55 },
  { x: 35, y: 52 },
  { x: 62, y: 56 },
  { x: 88, y: 53 },
  // Row 4 — bottom
  { x: 20, y: 80 },
  { x: 45, y: 75 },
  { x: 75, y: 82 },
] as const;
export const MAX_PLAYERS = 12;
