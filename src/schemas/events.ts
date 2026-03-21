import z from 'zod';

const joinedEventSchema = z.object({
  type: z.literal('JOINED'),
  player: z.object({
    id: z.uuidv4(),
    connectionId: z.string(),
    avatarId: z.string().startsWith('avatar-'),
    status: z.enum(['pending', 'ready']),
    name: z.string().min(1).max(16).optional(),
  }),
});

const playerSelectsCardEventSchema = z.object({
  type: z.literal('PLAYER_SELECTS_CARD'),
  card: z.string(),
  playerId: z.uuidv4(),
});

const gameStateSyncSchema = z.object({
  playerId: z.uuidv4(),
  type: z.literal('GAME_STATE_SYNC'),
  name: z.string().min(1).max(16),
  avatarId: z.string().startsWith('avatar-'),
  cards: z.array(z.string()),
  storytellerId: z.uuidv4(),
  clue: z.string().max(200).optional(),
  tableCards: z.array(z.string()).optional(),
  ownSubmittedCard: z.string().optional(),
  roundScore: z.number(),
  totalScore: z.number(),
  newCards: z.array(z.string()).optional(),
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
  clue: z.string().min(1).max(200),
  card: z.string(),
});

const votingEventSchema = z.object({
  type: z.literal('VOTING'),
  card: z.string(),
  playerId: z.uuidv4(),
});

const reconnectEventSchema = z.object({
  type: z.literal('RECONNECT'),
  playerId: z.uuidv4(),
});

const connectedEventSchema = z.object({
  type: z.literal('CONNECTED'),
  playerId: z.uuidv4(),
});

const avatarSelectEventSchema = z.object({
  type: z.literal('AVATAR_SELECT'),
  playerId: z.uuidv4(),
  avatarId: z.string().startsWith('avatar-'),
});

const lobbyStateSyncSchema = z.object({
  type: z.literal('LOBBY_STATE_SYNC'),
  players: z.array(
    z.object({
      id: z.uuidv4(),
      connectionId: z.string(),
      avatarId: z.string().startsWith('avatar-'),
      status: z.enum(['pending', 'ready']),
      name: z.string().min(1).max(16).optional(),
    }),
  ),
});

const playerSetupCompleteEventSchema = z.object({
  type: z.literal('PLAYER_SETUP_COMPLETE'),
  playerId: z.uuidv4(),
  name: z.string().min(1).max(16),
  avatarId: z.string().startsWith('avatar-'),
});

export const gameEventSchema = z.discriminatedUnion('type', [
  joinedEventSchema,
  gameStateSyncSchema,
  storyTellerClueEventSchema,
  playerSelectsCardEventSchema,
  votingEventSchema,
  reconnectEventSchema,
  connectedEventSchema,
  avatarSelectEventSchema,
  lobbyStateSyncSchema,
  playerSetupCompleteEventSchema,
]);

export type GameEvent = z.infer<typeof gameEventSchema>;

export type JoinedEvent = z.infer<typeof joinedEventSchema>;
export type GameStateSyncEvent = z.infer<typeof gameStateSyncSchema>;
export type StoryTellerClueEvent = z.infer<typeof storyTellerClueEventSchema>;
export type PlayerSelectsCardEvent = z.infer<
  typeof playerSelectsCardEventSchema
>;
export type VotingEvent = z.infer<typeof votingEventSchema>;
export type ReconnectEvent = z.infer<typeof reconnectEventSchema>;
export type ConnectedEvent = z.infer<typeof connectedEventSchema>;
export type AvatarSelectEvent = z.infer<typeof avatarSelectEventSchema>;
export type LobbyStateSyncEvent = z.infer<typeof lobbyStateSyncSchema>;
export type PlayerSetupCompleteEvent = z.infer<
  typeof playerSetupCompleteEventSchema
>;
