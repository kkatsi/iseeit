export const BASE_URL = import.meta.env.VITE_BASE_URL;
export const PEERJS_HANDSHAKE_SERVER_URL = import.meta.env
  .VITE_PEERJS_HANDSHAKE_SERVER_URL;
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

export const avatarIds = [
  'avatar-1',
  'avatar-2',
  'avatar-3',
  'avatar-4',
  'avatar-5',
  'avatar-6',
  'avatar-7',
  'avatar-8',
  'avatar-9',
  'avatar-10',
  'avatar-11',
  'avatar-12',
];

export const LOCAL_STORAGE_STATE_KEY = 'iseeitState';
export const SCORE_THRESHOLD = 40;
export const SLOT_POSITIONS = [
  // Row 1 — top band, below header
  { x: 7, y: 17 },
  { x: 30, y: 21 },
  { x: 52, y: 15 },
  { x: 70, y: 24 },
  // Row 2 — middle band
  { x: 14, y: 44 },
  { x: 38, y: 38 },
  { x: 60, y: 46 },
  { x: 82, y: 40 },
  // Row 3 — lower band
  { x: 9, y: 72 },
  { x: 33, y: 66 },
  { x: 56, y: 76 },
  { x: 78, y: 68 },
] as const;
export const MAX_PLAYERS = 12;
export const HEARTBEAT_INTERVAL = 3000;
export const CONNECTION_TIMEOUT = 15000;

// Deal animation timing (shared between host and client)
export const CLIENT_CARD_DURATION = 2; // seconds per card on client (entrance + showcase + fan)
export const CARD_DEAL_DURATION = 3; // seconds per flying card animation on host
export const DECK_INTRO_DELAY = 1; // seconds before first card flies
export const DEAL_PHASE_BUFFER_MS = 800; // extra buffer for visual comfort/latency
// Shuffle animation timing (host: players-select-card → voting transition)
export const ALL_SUBMITTED_PAUSE_MS = 1500; // pause to show "all players chose" before collecting
export const COLLECT_STAGGER_MS = 300; // delay between each card collecting to center
export const SHUFFLE_ANIMATION_MS = 2000;
export const REVEAL_STAGGER_MS = 800; // delay between each card reveal
export const POST_REVEAL_PAUSE_MS = 1500;
// Voting phase timing
export const VOTING_COMPLETE_DELAY_MS = 3000; // delay before transitioning to ROUND_RESULTS
// Results phase timing
export const RESULTS_PHASE_DURATION_MS = 6500; // total time showing scores before next round
