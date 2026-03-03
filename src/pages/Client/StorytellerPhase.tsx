import { useActionState } from 'react';
import { useGameStore } from '../../lib/game-store';
import { usePeerStore } from '../../lib/peer-store';
import type { StoryTellerClueEvent } from '../../schemas/events';

const StorytellerPhase = () => {
  const playerId = useGameStore((state) => state.connectedPlayerId);
  const storytellerId = useGameStore((state) => state.round.storytellerId);

  if (playerId === storytellerId) return <StoryTellerScreen />;

  return <div>waiting for storyteller's clue...</div>;
};

export default StorytellerPhase;

const StoryTellerScreen = () => {
  const playerId = useGameStore((state) => state.connectedPlayerId);
  const connection = usePeerStore((state) => state.connections).get(playerId);
  const cards = useGameStore((state) => state.cards).get(playerId);

  const submitAction = (_: unknown, formData: FormData) => {
    const clue = formData.get('clue') as string;
    const card = formData.get('card') as string;

    if (!clue) return 'Clue is required';
    if (!card) return 'Card is required';

    console.log({ clue, card });

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
