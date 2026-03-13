# Waiting Screen Redesign Plan

## Goal
Transform `src/components/waiting-screen.tsx` from a flat layout into a beautiful, fairytale-themed waiting screen that mirrors the lobby's `PlayerSlot` parchment card style.

## Visual Design

The screen is centered vertically and horizontally. It consists of a single "character card" floating mid-screen with a subtle animation, inspired directly by the lobby `PlayerSlot`.

### Layout (top to bottom, inside the card):
1. **Avatar** — Large round image with the vintage border style from `PlayerSlot` (`3px solid rgba(180, 155, 120, 0.6)`, inset box-shadow).
2. **Player Name** — `font-handwritten text-2xl`, same warm brown color as lobby.
3. **Message** — Pulsing opacity text (`children` prop), `font-serif text-base`, muted tone.

### The Card Container (matching `PlayerSlot`):
- Background: `rgba(222, 200, 165, 0.88)` (parchment)
- Asymmetric border-radius: `12px 8px 14px 6px`
- Border: `2px solid rgba(180, 155, 120, 0.5)`
- Box-shadow: `3px 4px 10px rgba(45, 42, 38, 0.25), inset 0 1px 0 rgba(255, 245, 225, 0.4)`
- Wax seal in the top-right corner (the small red circle)

### Animations:
- **Card entrance:** `initial={{ opacity: 0, scale: 0.9, y: 20 }}` → `animate={{ opacity: 1, scale: 1, y: 0 }}`
- **Gentle float:** CSS keyframes `float` animation (reuse existing from lobby)
- **Message pulse:** `animate={{ opacity: [0.4, 1, 0.4] }}` with `repeat: Infinity` (already implemented)

### Full-screen Background:
- Use a subtle muted fairytale background image (e.g., `bg-[url('/ui/waiting-bg.png')]`) or a simple warm gradient (`bg-gradient-to-b from-[#f5f0e6] to-[#e8dcc8]`) to fill the viewport.

## Proposed Changes

### [MODIFY] [waiting-screen.tsx](file:///Users/kostas/Desktop/personal/iseeit/src/components/waiting-screen.tsx)

Rewrite the JSX to use the parchment card container with wax seal, vintage avatar border, handwritten name, and pulsing message. Wrap in `motion.div` for entrance animation and floating effect.

**Key structural change:**
```
Before: flat row of avatar + name + message
After:  centered parchment card → avatar → name → pulsing message (vertically stacked)
```

## Verification

### Manual Testing
1. Run `npm run dev`
2. Navigate to `/test` (which currently renders `StorytellerPhase`)
3. The default (non-storyteller) path should render `<WaitingScreen>` with the parchment card
4. Verify the card visually matches the lobby's `PlayerSlot` style (colors, border-radius, wax seal)
5. Verify the message text pulses smoothly
6. Test on mobile viewport (375×812) to ensure the card is well-centered and doesn't overflow
