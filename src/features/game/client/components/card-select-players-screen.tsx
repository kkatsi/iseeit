import { useActionState, useState } from 'react';
import { useGameStore } from '@/stores/game-store';
import { usePeerStore } from '@/stores/peer-store';
import type { PlayerSelectsCardEvent } from '@/schemas/events';

const PlayersScreen = () => {
  const playerId = useGameStore((state) => state.connectedPlayerId);
  const connection = usePeerStore((state) => state.connections).get(playerId);
  const cards = useGameStore((state) => state.cards).get(playerId);
  const [submitted, setSubmitted] = useState(false);

  const submitAction = (_: unknown, formData: FormData) => {
    const card = formData.get('card');
    if (typeof card !== 'string' || !card) return 'Card is required';

    connection?.send({
      type: 'PLAYER_SELECTS_CARD',
      card,
      playerId,
    } satisfies PlayerSelectsCardEvent);

    setSubmitted(true);
  };
  const [error, formAction] = useActionState(submitAction, null);

  if (submitted)
    return <div>Waiting for other players to select a card...</div>;

  return (
    <form action={formAction}>
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
      <button>Submit</button>
      {error && <span>{error}</span>}
    </form>
  );
};

export default PlayersScreen;
