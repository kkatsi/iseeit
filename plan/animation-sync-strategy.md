# Animation Synchronization Strategy: Host vs Client

The `DealPhase` animations on the Host and Client must conclude simultaneously to ensure a seamless transition for the players. Right now, the Client animation is exactly 2 seconds per card (sweet spot), meaning a 6-card hand takes **12 seconds** to deal locally. However, the Host dynamically calculates its dealing time based on the `playerCount`, which causes desyncs.

## 1. The Math Problem (The Desync)

Let's assume there are **4 players** and it's Round 1 (6 cards per player = 24 total cards).

*   **Client Timing:**
    *   6 cards * 2 seconds = **12 seconds** total animation time.
*   **Host Timing (currently):**
    *   `DECK_INTRO_DELAY` (1s) + 
    *   `23 * CARD_DEAL_STAGGER` (0.5s * 23 = 11.5s) + 
    *   `CARD_DEAL_DURATION` (3s) 
    *   = **15.5 seconds** total animation time.

If there were **2 players** (12 total cards):
*   **Client Timing:** **12 seconds** (unchanged, still 6 cards).
*   **Host Timing:** `1s + (11 * 0.5s) + 3s` = **9.5 seconds**.

Because the Host deals cards sequentially to *everyone* (round-robin style), the total Host animation time always varies depending on how many players are in the game. But the Client *always* animates exactly 6 cards. 

## 2. The Solution Strategy

To perfectly sync the Host and the Client, we need to mathematically link the `CARD_DEAL_STAGGER` on the Host to the `CARD_SEQUENCE_DURATION` on the Client, so that the time it takes the Host to deal a full "round" of cards matches the time it takes the Client to animate one card.

### Step A: Align the "Round" Time
If the Client takes `2 seconds` to animate one card, then the Host must deal exactly 1 card to *every* player within that same `2 second` window. 

Therefore, the Host's stagger time must be dynamically derived from the Client's duration and the player count:

```typescript
// IN CONSTANTS
export const CLIENT_CARD_DURATION = 2.0;

// IN HOST CALCULATIONS
const HOST_DEAL_STAGGER = CLIENT_CARD_DURATION / players.size;
// For 4 players: 2.0 / 4 = 0.5s stagger (Perfect!)
// For 8 players: 2.0 / 8 = 0.25s stagger (Cards fly out faster on Host, but Client speed stays exactly the same!)
```

### Step B: Syncing the Start
The Host has a `DECK_INTRO_DELAY` (1 second) before it shoots the first card. The Client must wait that exact same 1 second before dropping its first card.

```typescript
// On Client
delay: DECK_INTRO_DELAY + (index * CLIENT_CARD_DURATION)
```

### Step C: Adding the Client Offset
If we want to be perfectly realistic: Player 1 gets their first card at `0.0s`, Player 2 gets theirs at `0.5s`, Player 3 at `1.0s`, etc. 
If the Client knows its own index (e.g., "I am Player 3"), it can offset its animation start time to perfectly match the moment the Host's flying card hits it!

```typescript
// On Client
const myStaggerOffset = myPlayerIndex * HOST_DEAL_STAGGER;
delay: DECK_INTRO_DELAY + myStaggerOffset + (index * CLIENT_CARD_DURATION)
```

## 3. The Implementation Plan

1.  **Centralize Timings:** Update `src/config/constants.ts` to define the baseline times shared by both Client and Host.
2.  **Update Host Logic:** Refactor `useDealSequence` to calculate `CARD_DEAL_STAGGER` dynamically (`CLIENT_CARD_DURATION / players.size`).
3.  **Update Client Logic:** Ensure the Client's `delay` calculation includes the `DECK_INTRO_DELAY` and its specific player offset so it doesn't start moving before the Host deck intro finishes.
4.  **Confirm the Math:** With these changes, regardless of whether there are 3 players or 12 players, the Host will speed up/slow down its card shooting to guarantee it finishes its 24-card sequence in the exact same `12 seconds` it takes the Client to fan its 6 cards.
