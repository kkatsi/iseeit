import { useGameStore } from '../../lib/game-store';

const ResultsPhase = () => {
  const playerId = useGameStore((state) => state.connectedPlayerId);
  const playerData = useGameStore((state) => state.playersData).get(playerId);
  const { roundScores } = useGameStore((state) => state.round);

  return (
    <div>
      <div>
        <span>{playerData?.name}</span>
        <br />
        <span>prevous score: {playerData?.score}</span>
        <span>round's score: {roundScores?.get(playerId)}</span>
      </div>
    </div>
  );
};

export default ResultsPhase;
