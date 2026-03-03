import useHostGame from '../../hooks/useHostGame';
import { useGameStore } from '../../lib/game-store';

const Game = () => {
  const playersData = useGameStore((state) => state.playersData);
  const { hasDealInProgress } = useHostGame();

  if (hasDealInProgress) return 'The cards are going out to the players...';

  return (
    <>
      <ul>
        {[...playersData.entries()].map(([key, data]) => (
          <li key={key}>
            Id: {key} , Name: {data.name},
            {data.cards.map((card) => (
              <img
                key={card}
                src={card}
                width={100}
                height={100}
              />
            ))}
            , Score: {data.score}, Network state:{' '}
            {data.isConnected ? 'connected' : 'disconnected'}
          </li>
        ))}
      </ul>
    </>
  );
};

export default Game;
