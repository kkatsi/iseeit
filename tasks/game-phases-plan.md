# Game Phase System - Dixit-Style

## Context

The game currently has 5 phase types defined (`CARD_DEAL`, `WORD_ANNOUNCEMENT`, `PLAYERS_SELECT_CARD`, `CARD_REVEAL`, `GAME_END`) but only `CARD_DEAL` has any implementation. We need to design and implement the full round lifecycle for a Dixit-style card game played over P2P WebRTC (host is authoritative).

**Prerequisite**: The card pool needs expanding beyond the current 7 cards in `src/constants.ts`. With 6 cards per hand and multiple players, we need significantly more cards (e.g., 84 like original Dixit). This is an asset/content task separate from the logic below.

---

## Phase State Machine

```
CARD_DEAL ──(auto/timer)──> STORYTELLER_CLUE ──(storyteller submits)──> PLAYERS_SELECT_CARD
    ^                                                                          |
    |                                                              (all players submitted)
    |                                                                          v
    +──(no winner)── ROUND_RESULTS <──(all players voted)── VOTING
                          |
                    (winner exists)
                          v
                      GAME_END
```

### Phases Renamed/Added vs Current
- `WORD_ANNOUNCEMENT` → renamed to `STORYTELLER_CLUE`
- `CARD_REVEAL` → removed (merged into `VOTING` — cards are revealed FOR voting)
- `VOTING` → **new** phase
- `ROUND_RESULTS` → **new** phase (shows scores before next round)

---

## Phase Breakdown

| Phase | Who acts | What happens | Transition trigger |
|-------|----------|-------------|-------------------|
| `CARD_DEAL` | Host (auto) | Deal 6 cards initially, or 1 card on subsequent rounds. Sync hands to clients. | Auto after brief delay → `STORYTELLER_CLUE` |
| `STORYTELLER_CLUE` | Storyteller | Storyteller picks a card from hand + types a text clue. Card removed from hand. | Host receives `STORYTELLER_SUBMIT_CLUE` event |
| `PLAYERS_SELECT_CARD` | Non-storytellers | Each picks a card from hand matching the clue. Card removed from hand. Clue visible to all. | All connected non-storytellers submitted |
| `VOTING` | Non-storytellers | All submitted cards (storyteller's + others') shuffled and shown face-up. Non-storytellers vote on which is the storyteller's. Cannot vote for own card. | All connected non-storytellers voted |
| `ROUND_RESULTS` | Display only | Reveal storyteller's card, show who voted for what, show points. Host advances. | Host clicks "Next Round" (or timer) |
| `GAME_END` | Display only | Final scoreboard with winner. | Terminal state |

### Storyteller Rotation
- `playerOrder: string[]` set once at game start (shuffled player IDs)
- Storyteller for round N = `playerOrder[(N - 1) % playerOrder.length]`

### Scoring (standard Dixit)
- If ALL or NOBODY found storyteller's card → storyteller 0pts, everyone else 2pts
- Otherwise → storyteller 3pts, correct voters 3pts
- Bonus: each non-storyteller gets +1pt per vote their submitted card received
- Game ends when any player reaches the score threshold (e.g., 30)

---

## Store Changes

### File: `src/lib/game-store.ts`

Add `RoundState` to cleanly separate round-specific transient data from persistent player data:

```typescript
type GamePhase = 'CARD_DEAL' | 'STORYTELLER_CLUE' | 'PLAYERS_SELECT_CARD' | 'VOTING' | 'ROUND_RESULTS' | 'GAME_END';

type RoundState = {
  storytellerId: string;
  clue: string | null;
  storytellerCard: string | null;
  submittedCards: Map<string, string>;  // playerId → cardURL
  tableCards: string[];                 // shuffled submitted cards (for voting display)
  votes: Map<string, string>;          // voterId → cardURL voted for
  roundScores: Map<string, number> | null;  // points earned THIS round
};
```

Add to store: `roundState`, `playerOrder`, `scoreThreshold`, `setPhase()`, `setRoundState()`, `resetPlayerReadiness()`.

Repurpose `isReady` on `PlayerData` to mean "has submitted action for current phase" (works naturally for tracking per-phase readiness).

### File: `src/lib/card-deal.ts`

Evolve from stateless to a persistent **deck** that depletes across rounds:

```typescript
type DeckState = {
  drawPile: string[];     // cards not yet dealt
  discardPile: string[];  // cards used in previous rounds
};
```

Store `DeckState` in game store. On round start, draw from `drawPile`. When empty, reshuffle `discardPile`.

---

## New Events

### File: `src/schemas/events.ts`

**New client → host events:**

| Event | Sent when | Data |
|-------|-----------|------|
| `STORYTELLER_SUBMIT_CLUE` | Storyteller submits card + clue | `{ playerId, card, clue }` |
| `PLAYER_SELECT_CARD` | Non-storyteller picks a card | `{ playerId, card }` |
| `PLAYER_VOTE` | Non-storyteller votes | `{ playerId, card }` |

**Remove:** `ADD_POINTS` (scoring is computed on host)

**Modify:** `GAME_STATE_SYNC` — restructured for per-player filtering (see below)

---

## Broadcasting: Per-Player Filtered Sync

### Problem
Current `useBroadcastToClients` sends ALL player data (including everyone's cards) to every client. Players must not see each other's hands.

### Solution: `useSyncGameState` hook

Instead of one broadcast, loop over connections and send each player a **filtered** payload:

```typescript
{
  type: 'GAME_STATE_SYNC',
  phase, round,
  you: { /* this player's full data including cards */ },
  players: [ /* all players' public data: name, score, isReady, isConnected — NO cards */ ],
  roundState: {
    storytellerId,
    clue,                          // null until PLAYERS_SELECT_CARD
    tableCards?,                   // only during VOTING and ROUND_RESULTS
    votes?, storytellerCard?,      // only during ROUND_RESULTS
    roundScores?,                  // only during ROUND_RESULTS
  }
}
```

Keep `useBroadcastToClients` for identical broadcasts. Primary sync uses the new per-player hook.

---

## Host Orchestration

### New hook: `useGameOrchestrator` (replaces `useGameSequence` + absorbs `useStartGame` logic)

File: `src/hooks/useGameOrchestrator.ts`

Responsibilities:
1. **`startGame(players)`** — deal 6 cards, set `playerOrder`, init `roundState`, sync, transition to `STORYTELLER_CLUE`
2. **`handleGameEvent(event)`** — handle incoming `STORYTELLER_SUBMIT_CLUE`, `PLAYER_SELECT_CARD`, `PLAYER_VOTE`:
   - Validate: correct phase, correct role, card exists in hand, no duplicate submissions
   - Update store, check if all players submitted, transition phase if so
   - Sync state after each mutation
3. **`advanceToNextRound()`** — check win condition → `GAME_END` or new round (rotate storyteller, deal 1 card, reset `roundState`)

Wire into `useOpenPeer.ts` — route new event types to the orchestrator's `handleGameEvent`.

---

## UI Per Phase

### Host screen (`src/pages/Host/Game.tsx` — shared screen/TV)

| Phase | Shows |
|-------|-------|
| `CARD_DEAL` | "Dealing cards..." + player names |
| `STORYTELLER_CLUE` | "[Name] is the storyteller. Waiting for clue..." |
| `PLAYERS_SELECT_CARD` | Clue displayed. "Players choosing..." + checkmarks for submitted |
| `VOTING` | Clue + grid of face-up table cards. "Vote!" + checkmarks for voted |
| `ROUND_RESULTS` | Highlight storyteller's card, votes breakdown, points. "Next Round" button |
| `GAME_END` | Final scoreboard |

### Client screen (`src/pages/Client/Play.tsx` — player's phone)

| Phase | Storyteller sees | Non-storyteller sees |
|-------|-----------------|---------------------|
| `CARD_DEAL` | "Cards being dealt..." → hand | Same |
| `STORYTELLER_CLUE` | Hand (selectable) + text input + Submit | "Waiting for [Name]'s clue..." + hand (view only) |
| `PLAYERS_SELECT_CARD` | "Waiting for players..." | Clue + hand (selectable) + Submit |
| `VOTING` | "Waiting for votes..." + table cards | Clue + table cards (selectable, own disabled) |
| `ROUND_RESULTS` | Reveal + "+X pts this round" | Same |
| `GAME_END` | Final scoreboard | Same |

### Component structure
- `src/pages/Host/phases/{DealPhase,StorytellerCluePhase,PlayersSelectPhase,VotingPhase,RoundResultsPhase,GameEndPhase}.tsx`
- `src/pages/Client/phases/{DealPhase,StorytellerCluePhase,SelectCardPhase,VotingPhase,RoundResultsPhase,GameEndPhase}.tsx`

---

## Files to Modify

| File | Changes |
|------|---------|
| `src/lib/game-store.ts` | Add `RoundState`, `playerOrder`, `scoreThreshold`, new actions, update phase enum |
| `src/schemas/events.ts` | Add 3 new event schemas, restructure `GAME_STATE_SYNC`, remove `ADD_POINTS` |
| `src/lib/card-deal.ts` | Add deck management (draw pile + discard pile) |
| `src/hooks/useGameOrchestrator.ts` | **New** — full phase orchestration, replaces `useGameSequence` + `useStartGame` |
| `src/hooks/useSyncGameState.ts` | **New** — per-player filtered state sync |
| `src/hooks/useOpenPeer.ts` | Route new events to orchestrator |
| `src/hooks/useConnectPeer.ts` | Handle new `GAME_STATE_SYNC` payload shape |
| `src/hooks/useStartGame.ts` | Remove (absorbed into orchestrator) |
| `src/hooks/useGameSequence.ts` | Remove (absorbed into orchestrator) |
| `src/utils/game-logic.ts` | Add `calculateRoundScores`, `getStorytellerForRound` |
| `src/pages/Host/Game.tsx` | Switch on phase, render phase components |
| `src/pages/Client/Play.tsx` | Switch on phase + role, render phase components |
| `src/pages/Host/phases/*.tsx` | **New** — 6 phase components |
| `src/pages/Client/phases/*.tsx` | **New** — 6 phase components |
| `src/constants.ts` | Expand card pool (prerequisite) |

---

## Verification

1. Start a game with 3+ players (browser tabs)
2. Verify cards are dealt and each client only sees their own hand
3. Storyteller submits clue + card → all clients see clue, phase advances
4. Non-storytellers select cards → phase advances when all submitted
5. Voting phase: table cards shuffled, can't vote for own card
6. Round results: correct reveal, proper scoring
7. Score threshold → game end screen
8. Test reconnection mid-game: client should receive filtered state for current phase
