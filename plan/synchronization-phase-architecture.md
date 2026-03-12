# Game State Synchronization: Client-Driven vs. Host-Authoritative

This document outlines the architectural approach for synchronizing game state during purely visual phases (like the Deal Phase in `iseeit`), comparing the current client-driven approach to the industry-standard host-authoritative model.

## 1. The Current Approach: Client-Driven ("Ready" Events)

In the current implementation, the progression of the game depends on explicit signals from every connected client.

*   **Flow:**
    1. Host enters Deal Phase.
    2. Clients play deal animations.
    3. When client animation finishes, client sends a `ready` event to the Host.
    4. Host waits for `ready` events from *all* active clients.
    5. Once all events are received, Host transitions to the next phase.

*   **Advantages:**
    *   Guarantees no player misses the transition, even on slow devices or struggling networks.

*   **Disadvantages (The Risks):**
    *   **The "Hanging" Problem:** If a client disconnects mid-animation, closes the browser, or drops a packet right as the animation finishes, the `ready` event is lost. The Host is stuck waiting indefinitely unless complex timeout or "player disconnected" rescue logic is implemented.
    *   **Security/Manipulation:** Clients dictate game flow. A modified client could send the event instantly to skip the phase, or intentionally withhold it to stall the entire lobby.
    *   **State Fragmentation:** The Host is no longer the single source of truth. It only knows it is in a "waiting" state, relying on external actors to tell it when it's done.
    *   **Network Overhead:** `N` clients all firing WebSocket events simultaneously at the end of every animation phase creates unnecessary spikes in traffic.

## 2. The Recommended Approach: Host-Authoritative State

In multiplayer games (especially "second-screen" party games like Jackbox), the Host or centralized Server should act as the absolute source of truth.

*   **Flow:**
    1. Host calculates the exact duration the animation should take (e.g., `13.5` seconds for Round 1).
    2. Host enters Deal Phase and broadcasts this state to clients.
    3. Host sets an internal timer: `totalAnimationDuration + smallNetworkBuffer`.
    4. Clients receive the state and play their visual animations locally. *They do not report back when finished.*
    5. When the Host's internal timer fires, the Host unilaterally changes the state to `NEXT_PHASE` and broadcasts it.
    6. Clients receive `NEXT_PHASE` and update their UI immediately.

*   **Advantages:**
    *   **Robustness:** The game cannot get stuck waiting on a silent client. Dropped connections don't break the flow.
    *   **Simplicity:** Removes the need to track individual acknowledgment arrays (e.g., `waitingFor: ['p1', 'p2']`) for non-interactive phases.
    *   **Deterministic Control:** The Host knows exactly what is happening and when it will end.
    *   **Reduced Traffic:** Eliminates unnecessary "animation finished" ping-backs from every player.

## 3. Implementation Guide for `iseeit` Deal Phase

Since the deal animation timing is dynamic based on player count and round number, the Host can calculate the wait time deterministically.

### Example Logic (Host Side):

```javascript
// Constants from deal-phase.tsx
const CARD_DEAL_DURATION = 1;
const CARD_DEAL_STAGGER = 0.5;
const DECK_INTRO_DELAY = 1;

// Calculate total duration based on items to deal
const calculateDealDuration = (playerCount, cardsPerPlayer) => {
    const totalCards = playerCount * cardsPerPlayer;
    
    // the max dealIndex is (totalCards - 1)
    const lastCardDealDelay = DECK_INTRO_DELAY + ((totalCards - 1) * CARD_DEAL_STAGGER);
    
    // total time = delay before last card starts + time it takes last card to finish
    const totalDurationSeconds = lastCardDealDelay + CARD_DEAL_DURATION;
    
    return totalDurationSeconds;
};

// ... in your host state manager when entering Deal Phase:
const durationSecs = calculateDealDuration(players.size, roundNumber === 1 ? 6 : 1);
const transitionDelayMs = (durationSecs * 1000) + 1000; // Add 1 second buffer for visual comfort/latency

// Host dictating the transition
setTimeout(() => {
    // Transition to next phase (e.g., PROMPT_PHASE or PLAY_PHASE)
    transitionToNextPhase();
}, transitionDelayMs);
```

## 4. When to use Client "Ready" Events

You *should* still use client-driven events, but reserve them strictly for phases requiring explicit **user input** or decision-making, such as:

*   Waiting for players to submit a drawing.
*   Waiting for everyone to lock in a vote.
*   The initial "Ready up" or "Start Game" confirmation in the lobby.

For passive, visual transitions, let the Host direct the show.
