# Client Reconnection Bug — Diagnosis & Fix Plan

## The Bug

When a connected player refreshes their browser (pre-game, still in lobby), they land back on the avatar select screen. However, the host no longer recognizes the new connection: avatar taps do nothing, and the lobby doesn't show "an adventurer is approaching."

## Root Cause Analysis

The issue stems from a **race condition between disconnect cleanup and reconnect**, plus a **routing logic error** that sends a reconnecting player down the wrong code path.

### Bug 1: Host removes the player on disconnect before the new connection arrives

In [use-open-peer.ts](file:///Users/kostas/Desktop/personal/iseeit/src/hooks/use-open-peer.ts#L112-L127), when a PeerJS connection closes, the host runs:

```typescript
conn.on('close', () => {
  // ... finds the playerId by connectionId
  removePlayerEvent(currentPlayerId); // ← removes from lobby store
  syncLobbyState();
});
```

When the client refreshes, PeerJS fires `close` on the old connection. The host removes the player from the lobby entirely. Now the player doesn't exist on the host at all.

### Bug 2: `shouldReconnect` blocks `connectToRoom`, but reconnect only works for in-game players

In [use-client-connect.ts](file:///Users/kostas/Desktop/personal/iseeit/src/features/client-connect/hooks/use-client-connect.ts#L29-L32):

```typescript
const shouldReconnect = useMemo(() => {
  const stored = getFromLocalStorage(LOCAL_STORAGE_STATE_KEY);
  return !!(stored?.playerId && stored?.roomId === roomId);
}, [roomId]);
```

If there's a `playerId` + `roomId` in localStorage (which there is — it was saved during the first `connectToRoom`), `shouldReconnect` is `true`. This skips the `connectToRoom` effect (line 67: `if (shouldReconnect) return;`).

Instead, the **reconnect flow** runs, which sends a `RECONNECT` event. But on the host side, `RECONNECT` handler (line 69-83 of `use-open-peer.ts`) checks `playersData` (the **game** store, not the lobby store):

```typescript
case 'RECONNECT': {
  const playersData = useGameStore.getState().playersData;
  if (!playersData.has(event.playerId)) return; // ← silently exits!
  ...
}
```

Since the game hasn't started yet, `playersData` is empty. The host **silently ignores** the reconnect event. The client now has a PeerJS connection open but the host never registered it — hence avatar taps go into the void.

### Bug 3: Illegal React hook call inside `.then()`

In [use-client-connect.ts](file:///Users/kostas/Desktop/personal/iseeit/src/features/client-connect/hooks/use-client-connect.ts#L78):

```typescript
.then(() => {
  const gamePhase = useGameStore((state) => state.phase); // ❌ hooks can't be called here
  if (!!gamePhase) navigateToPlayEvent();
})
```

`useGameStore()` with a selector is a React hook. Calling it inside a `.then()` callback violates React's rules of hooks and will either crash or return stale/undefined data.

## The Fix

### Fix 1: Host — Don't remove lobby players on close if they have `status: 'ready'`

The `conn.on('close')` handler at line 112 of `use-open-peer.ts` already has the right idea for in-game players (the `CONNECTED` handler at line 47 checks `phase`). We should apply the same logic to the outer close handler: only remove the player from the lobby if the game hasn't started **and** they aren't finalized.

**Or simpler:** Remove the duplicate outer `conn.on('close')` entirely. The `CONNECTED` event handler at line 47 already registers its own `close` listener that properly checks the game phase.

### Fix 2: Client — Distinguish pre-game reconnect from in-game reconnect

`shouldReconnect` should only be `true` if the game has actually started. If we're still in the lobby phase, we should treat it as a fresh `connectToRoom` (new connection, re-pick avatar).

**Option A:** Store the game phase in localStorage alongside `playerId` and `roomId`. Only set `shouldReconnect = true` if `stored.phase` exists.

**Option B:** Always call `connectToRoom` first. If the host responds with a `GAME_STATE_SYNC` (meaning the game is in progress), navigate to play. If the host responds with `LOBBY_STATE_SYNC`, stay on the connect page. This is simpler and more robust.

> [!IMPORTANT]
> **I recommend Option B.** It eliminates the bifurcated connect/reconnect logic entirely for the pre-game phase. The host can decide what to do based on whether the playerId exists in its game state.

### Fix 3: Replace illegal hook call with `getState()`

```typescript
// ❌ Before
const gamePhase = useGameStore((state) => state.phase);

// ✅ After  
const gamePhase = useGameStore.getState().phase;
```

## Proposed Changes

### [MODIFY] [use-open-peer.ts](file:///Users/kostas/Desktop/personal/iseeit/src/hooks/use-open-peer.ts)
- Remove or guard the outer `conn.on('close')` at lines 112-127 to prevent premature player removal during a browser refresh.
- Add handling for `CONNECTED` event when the `playerId` already exists in the lobby (treat as a re-join: update the connection reference, re-sync lobby state).

### [MODIFY] [use-client-connect.ts](file:///Users/kostas/Desktop/personal/iseeit/src/features/client-connect/hooks/use-client-connect.ts)
- Fix `useGameStore()` hook call inside `.then()` → use `useGameStore.getState().phase`.
- Refine `shouldReconnect` logic to only trigger for in-game reconnections (Option B: remove the bifurcation, always `connectToRoom` first).

### [MODIFY] [connect.tsx](file:///Users/kostas/Desktop/personal/iseeit/src/features/client-connect/pages/connect.tsx)
- Update the guard logic to reflect the simplified reconnect flow.

---

## Additional Fix: Player Identity on In-Game Reconnect

### The Problem

`WaitingScreen` reads `name` and `avatarId` from the **lobby store** (`useLobbyStore`). During in-game reconnect, the host only sends `GAME_STATE_SYNC`, which populates the **game store** but not the lobby store. The lobby store stays empty on the reconnected client → the `WaitingScreen` shows no avatar or name.

The host has the player's identity in two places:
- **`lobbyStore.players`** — has `name`, `avatarId`, `connectionId`
- **`gameStore.playersData`** — has `name`, `score`, `isConnected` (but **no `avatarId`**)

### The Fix

**Option A (Minimal): Add `name` and `avatarId` to `GAME_STATE_SYNC`**

Add two fields to the existing `GAME_STATE_SYNC` event so the client has everything it needs in one message. The client handler then populates the lobby store (or a dedicated player identity slice) with this data.

```diff
 // events.ts — gameStateSyncSchema
  playerId: z.uuidv4(),
  type: z.literal('GAME_STATE_SYNC'),
+ name: z.string().min(1).max(16),
+ avatarId: z.string().startsWith('avatar-'),
  cards: z.array(z.url()),
```

```diff
 // game-logic.ts — syncGameState
+ const lobbyPlayer = useLobbyStore.getState().players.get(playerId);
  connection.send({
    type: 'GAME_STATE_SYNC',
+   name: lobbyPlayer?.name ?? '',
+   avatarId: lobbyPlayer?.avatarId ?? '',
    phase: phase || 'GAME_END',
    ...
  });
```

```diff
 // use-connect-peer.ts — handleEvent GAME_STATE_SYNC case
+ // Populate lobby store so WaitingScreen can display identity
+ setPlayers(new Map([[event.playerId, {
+   id: event.playerId,
+   connectionId: '',
+   avatarId: event.avatarId,
+   name: event.name,
+   status: 'ready' as const,
+ }]]));
```

**Option B (Also send `LOBBY_STATE_SYNC` alongside):** The host already has `syncLobbyState()`. Call it after `syncGameState()` in the `RECONNECT` handler. This is zero new code, but sends a full player list over the wire (which is fine for a small party game).

> [!TIP]
> **I recommend Option A** since it keeps the reconnect to a single event and the client only needs its own identity, not everyone's.

### Proposed Changes (Option A)

#### [MODIFY] [events.ts](file:///Users/kostas/Desktop/personal/iseeit/src/schemas/events.ts)
- Add `name` and `avatarId` fields to `gameStateSyncSchema`.

#### [MODIFY] [game-logic.ts](file:///Users/kostas/Desktop/personal/iseeit/src/utils/game-logic.ts)
- Read the player's `name` and `avatarId` from `useLobbyStore` and include them in the `GAME_STATE_SYNC` payload.

#### [MODIFY] [use-connect-peer.ts](file:///Users/kostas/Desktop/personal/iseeit/src/hooks/use-connect-peer.ts)
- In the `GAME_STATE_SYNC` handler, populate the lobby store with the reconnecting player's identity so `WaitingScreen` can display it.

---

### Manual Testing
1. **Start dev server** (`npm run dev`)  
2. **Open host** on one browser tab → create a lobby
3. **Open client** on another tab → connect, pick avatar, enter name, submit
4. **Verify** the player appears on the host lobby
5. **Refresh the client tab** (this is the bug repro step)
6. **Verify** the client lands on the avatar select screen and can pick avatars again
7. **Verify** the host lobby shows "an adventurer approaching" for the re-joining player
8. **Re-submit** on the client → verify the player appears correctly on the host lobby again
