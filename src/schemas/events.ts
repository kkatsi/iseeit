import z from 'zod';
import { playerSchema } from './player';

const joinedEventSchema = z.object({
  type: z.literal('JOINED'),
  player: playerSchema,
});

const playerReadyEventSchema = z.object({
  type: z.literal('PLAYER_READY'),
  playerId: z.uuidv4(),
});

const gameStateSyncSchema = z.object({
  playerId: z.uuidv4(),
  type: z.literal('GAME_STATE_SYNC'),
  cards: z.array(z.string()),
  storytellerId: z.uuidv4(),
  phase: z.enum([
    'CARD_DEAL',
    'STORYTELLER_CLUE',
    'PLAYERS_SELECT_CARD',
    'VOTING',
    'ROUND_RESULTS',
    'GAME_END',
  ]),
});

const storyTellerClueEventSchema = z.object({
  type: z.literal('STORYTELLER_CLUE'),
  clue: z.string(),
  card: z.string(),
});

export const gameEventSchema = z.discriminatedUnion('type', [
  joinedEventSchema,
  playerReadyEventSchema,
  gameStateSyncSchema,
  storyTellerClueEventSchema,
]);

export type GameEvent = z.infer<typeof gameEventSchema>;

export type JoinedEvent = z.infer<typeof joinedEventSchema>;
export type PlayerReadyEvent = z.infer<typeof playerReadyEventSchema>;
export type GameStateSyncEvent = z.infer<typeof gameStateSyncSchema>;
export type StoryTellerClueEvent = z.infer<typeof storyTellerClueEventSchema>;
