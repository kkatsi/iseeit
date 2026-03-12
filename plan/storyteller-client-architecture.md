# Storyteller Client Screen Architecture

This document outlines the implementation strategy for the Storyteller's phase on the mobile client. It extends the "Fan" layout created in the Deal Phase into a fully interactive selection and submission interface.

## 1. Requirements & Visuals

*   **Background:** The updated muted, ethereal UI background (`/ui/storyteller-phase-bg.png`).
*   **The Hand (Fan):** The 6 dealt cards remain at the bottom of the screen in the convex fan layout.
*   **Interaction (Hover/Focus):** 
    *   As the user drags their finger across the fanned cards (or taps one), the focused card is "pulled" from the fan.
    *   The focused card scales up and moves to the top-middle of the screen (the "Showcase" position from the Deal Phase).
    *   The other cards in the fan dim slightly or shift to make room.
*   **Action (Clue Submission):**
    *   When a card is in the Showcase position, an elegant input field appears below it.
    *   A submit button (styled to match the fairytale aesthetic) allows the Storyteller to lock in their choice and clue.
    *   Once submitted, the screen transitions to a "Waiting for others..." state.

## 2. Technical Strategy: Framer Motion & Touch Handling

### A. The Interactive Fan (Drag / Pan)
Instead of relying on standard CSS `:hover` (which doesn't exist on mobile touchscreens), we need to track the user's touch position.

*   **Approach:** We can use a combination of generic React touch events (`onTouchStart`, `onTouchMove`) or Framer Motion's `onPan` to detect which card the user's finger is currently over.
*   However, a simpler, more robust mobile approach is a **Scrollable or Tappable Carousel/Fan**. 
*   **Refined Mobile Approach (Tap to Focus):** Dragging across a curved fan on mobile can be finicky due to overlapping hitboxes. 
    1.  The user taps a card in the fan.
    2.  That card becomes the `selectedCardIndex` in React state.
    3.  The fan orchestrates: The selected card animates to the Showcase position. The remaining cards adjust their fan math (now calculated for `totalCards - 1`) to close the gap.

### B. Framer Motion Layout Animations
We will use Framer Motion's `layoutId` feature. This is the absolute best way to handle a card moving from a list (the fan) to an isolated focal point (the showcase).

1.  Render the hand strictly as the Fan.
2.  If `selectedCardIndex !== null`, render the focused card in the Showcase container, sharing the same `layoutId` as its spot in the Fan.
3.  Framer Motion will automatically interpolate the position, scale, and rotation seamlessly.

### C. The UI Elements (Fairytale Vibe)
*   **Input Field:** Transparent background, solid bottom border (feather/quill motif if possible), elegant serif font (like Playfair Display or equivalent), subtle glow on focus.
*   **Submit Button:** Soft parchment color, muted text, expanding glowing border on active state.

## 3. Implementation Steps (`src/features/game/client/components/storyteller-screen.tsx`)

1.  **State Management:**
    ```typescript
    const [focusedCardIndex, setFocusedCardIndex] = useState<number | null>(null);
    const [clue, setClue] = useState("");
    ```

2.  **The Fan Container:**
    *   Recalculate `getCardFanTransform` so it can handle gaps or just visually dimming non-selected cards.
    *   Add `onClick={() => setFocusedCardIndex(index)}` to the fan cards.

3.  **The Showcase Container (Top-Middle):**
    *   Conditionally rendered if `focusedCardIndex !== null`.
    *   Displays the large card.
    *   Underneath, conditionally animates in the `<input>` and `<button>`.

4.  **Submission Logic:**
    *   Hook into `useGameStore` to call a `submitClue(cardId, clue)` action.
    *   Disable the interface and show a loading/waiting state while the server processes the transition to the next phase.

## 4. Work Breakdown

1.  Generate/Save the `storyteller-phase-bg.png`.
2.  Create `StorytellerScreen` component skeleton.
3.  Implement the React state (`focusedCardIndex`).
4.  Implement the `layoutId` animation moving a card from the fan arc to the top-center.
5.  Style the clue input and submit button using Tailwind with the fairytale aesthetic.
6.  Connect the submit button to the mock/real game store.
