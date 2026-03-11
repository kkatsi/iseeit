import { useGameStore } from '@/stores/game-store';

const VotingPhase = () => {
  const { clue, tableCards } = useGameStore((state) => state.round);

  return (
    <div>
      <span>{clue}</span>
      {tableCards?.map((card, index) => (
        <div key={card}>
          <span>{index + 1}</span>
          <img
            src={card}
            width={100}
            height={100}
          />
        </div>
      ))}
    </div>
  );
};

export default VotingPhase;
