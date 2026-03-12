import { useGameStore } from '@/stores/game-store';

const DealPhase = () => {
  const playerId = useGameStore((state) => state.connectedPlayerId);
  const cards = useGameStore((state) => state.cards).get(playerId);

  if (!cards) return 'waiting for cards...';

  return cards.map((card) => (
    <img
      key={card}
      src={card}
      width={100}
      height={100}
    />
  ));
};

export default DealPhase;
