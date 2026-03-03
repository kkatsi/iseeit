import { useGameStore } from '../lib/game-store';
import { areAllPlayersReady } from '../utils/game-logic';

const useHostGame = () => {
  const playersData = useGameStore((state) => state.playersData);

  const hasDealInProgress = !areAllPlayersReady(playersData);

  return {
    hasDealInProgress,
  };
};

export default useHostGame;
