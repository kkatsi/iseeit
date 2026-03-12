# Client Deal Phase Animation Architecture

This document outlines the implementation strategy for the mobile client's `DealPhase` animation, matching the required "slide down -> pause -> fan out" sequence.

## 1. Visual Requirements & Sequence

The animation is a three-stage sequence for each dealt card:
1.  **Entrance:** Card drops from off-screen top (`y: -100%`) to the top-middle of the screen.
2.  **Showcase:** Card pauses in the top-middle position for 1.5 seconds, allowing the player to look at the newly dealt card.
3.  **Resting (The Fan):** Card moves to the bottom of the screen and rotates into its designated slot in a curved "fan" layout.

*Important:* The cards should deal sequentially (staggered), not all at once.

## 2. Technical Strategy: Framer Motion Variants

We will heavily utilize `framer-motion` variants. A variant driven approach allows us to define the "states" of a card and transition them cleanly using an `AnimatePresence` or orchestration container.

### State Definitions:
*   `initial`: Off-screen top (`y: '-100dvh'`, `rotate: 0`, `scale: 1`).
*   `showcase`: Top-middle of screen (`y: '20dvh'`, `rotate: 0`, `scale: 1.2`).
*   `fan`: Bottom of screen with calculated rotation and X/Y offset to form an arc.

### The Fan Math (Curved Hand Layout)
To achieve the fan look seen in the reference image, each card needs a specific rotation and Y-offset based on its index in the hand.

*   **Rotation:** Cards on the left rotate negatively (e.g., -15deg), center cards are straight (0deg), right cards rotate positively (e.g., +15deg).
*   **Y-Offset (Arc):** Cards at the edges of the hand drop lower than cards in the center to create a convex curve.

```typescript
// Conceptual math for a 6-card hand
const getCardFanTransform = (index: number, totalCards: number) => {
  // Normalize index from -1 (leftmost) to 1 (rightmost)
  const normalizedPos = (index / (totalCards - 1)) * 2 - 1; 
  
  const maxRotation = 15; // degrees
  const arcHeight = 20; // pixels to drop on the edges
  
  return {
    rotate: normalizedPos * maxRotation,
    y: Math.abs(normalizedPos) * arcHeight,
    // x translates naturally if they are in a flex-row, otherwise absolute positioning is needed
  };
};
```

## 3. Implementation Steps

1.  **Component Structure (`src/features/game/client/deal-phase.tsx`):**
    *   Create a container taking up the full viewport height.
    *   Map over the player's personal hand (array of cards).
    *   Render a `motion.div` for each card.

2.  **Animation Orchestration:**
    *   Instead of complex timeouts, use Framer Motion's `keyframes` array for the `animate` prop to handle the sequence automatically.
    
    ```typescript
    animate={{
      y: ['-100dvh', '20dvh', '20dvh', calculateFanY()], // Enter -> Show -> Wait -> Fan
      scale: [1, 1.2, 1.2, 1],
      rotate: [0, 0, 0, calculateFanRotate()]
    }}
    transition={{
      duration: 2.5, // 0.5 enter + 1.5 pause + 0.5 fan
      times: [0, 0.2, 0.8, 1], // The breakpoints of the duration
      delay: index * 0.5, // Stagger based on card index
      ease: "easeInOut"
    }}
    ```

3.  **Synchronization with Host:**
    *   *Crucial Note:* Ensure the timings on the client (`duration` + `delay`) roughly align with the `dealDurationMs` we calculated on the Host side so the Host transitions state exactly when the client finishes fanning the last card.
    *   The Host will dictate the transition out of this phase natively.

4.  **Styling & Polish:**
    *   Use the new `ui/deal-phase-bg.png` texture as the background.
    *   Apply proper z-indexing so the newest card being showcased sits *above* cards already in the fan.
