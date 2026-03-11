import { useActionState } from 'react';
import { useGameStore } from '@/stores/game-store';
import { usePeerStore } from '@/stores/peer-store';
import type { StoryTellerClueEvent } from '@/schemas/events';

const StoryTellerScreen = () => {
  const playerId = useGameStore((state) => state.connectedPlayerId);
  const connection = usePeerStore((state) => state.connections).get(playerId);
  const cards = useGameStore((state) => state.cards).get(playerId);

  const submitAction = (_: unknown, formData: FormData) => {
    const clue = formData.get('clue');
    if (typeof clue !== 'string' || !clue) return 'Clue is required';

    const card = formData.get('card');
    if (typeof card !== 'string' || !card) return 'Card is required';

    connection?.send({
      type: 'STORYTELLER_CLUE',
      card,
      clue,
    } satisfies StoryTellerClueEvent);
  };
  const [error, formAction] = useActionState(submitAction, null);
  return (
    <form action={formAction}>
      <input
        type="text"
        name="clue"
      />
      {cards?.map((card) => (
        <label
          htmlFor={card}
          key={card}
        >
          <input
            id={card}
            value={card}
            type="radio"
            name="card"
          />
          <img
            src={card}
            alt=""
          />
        </label>
      ))}
      {error && <span>{error}</span>}
    </form>
  );
};

export default StoryTellerScreen;
