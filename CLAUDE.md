# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm run dev` — Start Vite dev server (HTTPS via mkcert, network-accessible)
- `npm run build` — TypeScript check + Vite production build
- `npm run lint` — ESLint (flat config, ESLint 9+)
- `npm run type-check` — TypeScript check without emit
- `npm run preview` — Preview production build

No test framework is configured.

## Architecture

P2P multiplayer card game (Dixit-like) with a host/client architecture using PeerJS for WebRTC connections. The host creates a room, clients join via room ID or QR code.

### Routing (`src/app/router.tsx`)

Uses `createBrowserRouter` with lazy-loaded routes:

- `/` and `/game` — Host routes, wrapped in `HostLayout` (creates PeerJS host via `useOpenPeer`)
- `/client/connect` and `/client/play` — Client routes, wrapped in `ClientLayout` (connects to host via `useConnectPeer`)

Route paths are defined in `src/config/paths.ts`. Layouts pass context to children via React Router's `<Outlet context={...} />`.

### State Management (Zustand)

Three stores in `src/stores/`, all using devtools middleware:

- **`peer-store`** — Maps player IDs to PeerJS DataConnections
- **`lobby-store`** — Player setup state (pending/ready, avatar selection)
- **`game-store`** — Game phases, scores, rounds, card hands

### Game Flow

Phases cycle: `CARD_DEAL → STORYTELLER_CLUE → PLAYERS_SELECT_CARD → VOTING → ROUND_RESULTS → (repeat or GAME_END)`

Host orchestrates via `useGameOrcestrator` hook. Both host and client route to phase-specific components based on store state.

### P2P Events (`src/schemas/events.ts`)

All peer events are validated with Zod schemas (discriminated union on `type` field). Events include player connection, avatar selection, card plays, voting, and state sync.

### Feature Organization

Feature code lives in `src/features/` organized by domain (lobby, game/host, game/client, client-connect), each with `components/`, `hooks/`, and `pages/` subdirs.

## Conventions

- Path alias: `@/*` maps to `src/*`
- Styling: Tailwind CSS v4 with a fairytale/parchment theme (custom colors, Mansalva + Crimson Text fonts)
- TypeScript strict mode with no unused locals/parameters
- Outlet context types defined in `src/types/index.ts`
- Game constants (max players, score threshold, card/avatar IDs) in `src/config/constants.ts`

## Browser Compatibility

The host screen runs on **smart TV browsers** (WebOS, Tizen) which use older rendering engines. When writing styles:

- **No Tailwind color/opacity shorthand** — Do NOT use `bg-[#color]/opacity` syntax (e.g. `bg-[#d4a26a]/20`). TV browsers don't support the CSS `color-mix()` or relative color syntax Tailwind generates for these.
- **Use inline `rgba()` styles instead** — e.g. `style={{ backgroundColor: 'rgba(212, 162, 106, 0.2)' }}`
- **Avoid modern CSS features** that lack wide support: `oklch()`, `color-mix()`, container queries, `:has()` selector, `dvh`/`svh` units. Prefer `vh`/`vw` and `min-height: 100vh` over `min-h-dvh`.
- **Standard Tailwind utility classes are fine** — classes like `flex`, `rounded-xl`, `shadow-lg`, `blur-xl` etc. are safe since they compile to well-supported CSS.
- This applies to **host-side components only** (`src/features/game/host/`, `src/features/lobby/`). Client components run on modern phones and don't have these restrictions.
