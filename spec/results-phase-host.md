Results phase host

We need a screen for host that displays the results of the round. It should display the following:
Avatars , Names, Previous round scores animating to the current round scores. We need an animation like previous score + the new points and merging both into the current score.Screen and component should be in same concept of the whole game, failytale vibe. Make it like 5-6 seconds displaying the scores then proceed to the next round.

Reorder Plan

Results Phase Reordering Animation - Implementation Plan
Animate the reordering of player rows based on their new total scores after the points merge animation.

Proposed Changes
[Component] Host Results Phase
[MODIFY]
results-phase.tsx
State Changes:
Add isReordered state (boolean).
Sorting Logic:
Update the players calculation to be able to toggle between "previous score" order and "total score" order.
Initially, sort by previousScore.
Animation Strategy:
Add layout prop to the player row motion.div.
Ensure the key is the stable player.id.
Timing Sequence:
T=0s: Display players in initial order (previous score).
T=1s: Show +N points.
T=2.8s: Merge points into total scores (showTotal = true).
T=4.2s: Reorder players to their final positions (isReordered = true).
T=6.5s: Advance to next round.
Verification Plan
Manual Verification
Navigate to /test in the browser.
Observe the sequence:
Players appear.
Points appear.
Scores update.
Players at the boundary (e.g., someone moving from 4th to 3rd) physically slide to their new position.
The podium (top 3) updates reflect the new leaders.
