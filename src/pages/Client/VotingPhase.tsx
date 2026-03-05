import { useActionState, useState } from 'react';
import { useGameStore } from '../../lib/game-store';
import { usePeerStore } from '../../lib/peer-store';
import type { VotingEvent } from '../../schemas/events';

const VotingPhase = () => {
  const playerId = useGameStore((state) => state.connectedPlayerId);
  const storytellerId = useGameStore((state) => state.round.storytellerId);

  if (playerId === storytellerId) return <div>waiting for players vote...</div>;

  return <PlayersScreen />;
};

const PlayersScreen = () => {
  const { clue, tableCards } = useGameStore((state) => state.round);
  const playerId = useGameStore((state) => state.connectedPlayerId);
  const connection = usePeerStore((state) => state.connections).get(playerId);
  const [submitted, setSubmitted] = useState(false);

  console.log({ clue, tableCards });
  const submitAction = (_: unknown, formData: FormData) => {
    const card = formData.get('card') as string;

    console.log({ card });

    if (!card) return 'Card selection is required';

    connection?.send({
      type: 'VOTING',
      playerId,
      card,
    } satisfies VotingEvent);
    setSubmitted(true);
  };

  const [error, formAction] = useActionState(submitAction, null);

  if (submitted) return 'waiting for others to vote...';

  return (
    <form action={formAction}>
      <span>{clue}</span>
      {tableCards?.map((card, index) => (
        <label
          key={card}
          htmlFor={card}
        >
          <input
            id={card}
            name="card"
            value={card}
            type="radio"
          />
          <span>{index + 1}</span>
          <img
            src={card}
            width={100}
            height={100}
          />
        </label>
      ))}
      <button>submit</button>
      {error && <span>{error}</span>}
    </form>
  );
};

export default VotingPhase;
