import z from 'zod';
import { playerSchema } from './player';

const joinedEventSchema = z.object({
  type: z.literal('JOINED'),
  player: playerSchema,
});

const addPointsEventSchema = z.object({
  type: z.literal('ADD_POINTS'),
  playerId: z.uuidv4(),
  points: z.number(),
});

const playerReadyEventSchema = z.object({
  type: z.literal('PLAYER_READY'),
  playerId: z.uuidv4(),
});

const playerDataSchema = z.object({
  score: z.number(),
  cards: z.array(z.string()),
  name: z.string(),
  isReady: z.boolean(),
  isConnected: z.boolean(),
});

const gameStateSyncSchema = z.object({
  type: z.literal('GAME_STATE_SYNC'),
  playersData: z.array(z.tuple([z.uuidv4(), playerDataSchema])),
  // playersData: z.map(z.string(), playerDataSchema),
  phase: z
    .enum([
      'CARD_DEAL',
      'WORD_ANNOUNCEMENT',
      'PLAYERS_SELECT_CARD',
      'CARD_REVEAL',
      'GAME_END',
    ])
    .optional(),
  round: z.number().optional(),
});

export const gameEventSchema = z.discriminatedUnion('type', [
  joinedEventSchema,
  addPointsEventSchema,
  playerReadyEventSchema,
  gameStateSyncSchema,
]);

export type GameEvent = z.infer<typeof gameEventSchema>;

export type JoinedEvent = z.infer<typeof joinedEventSchema>;
export type AddPointsEvent = z.infer<typeof addPointsEventSchema>;
export type PlayerReadyEvent = z.infer<typeof playerReadyEventSchema>;
export type GameStateSyncEvent = z.infer<typeof gameStateSyncSchema>;
export type PlayersData = z.infer<typeof playerDataSchema>;
