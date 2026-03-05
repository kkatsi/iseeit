import { useGameStore } from '../../lib/game-store';

const PlayersSelectCardPhase = () => {
  const { clue, storytellerCard } = useGameStore((state) => state.round);

  return (
    <div>
      <span>{clue}</span>
      <img
        src={storytellerCard}
        alt=""
        width={100}
        height={100}
      />
    </div>
  );
};

export default PlayersSelectCardPhase;
