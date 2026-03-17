import { WaitingScreen } from '@/components/waiting-screen';
import { useGameStore } from '@/stores/game-store';
import CardSelectScreen from './components/card-select-screen';

const PlayersSelectCardPhase = () => {
  const playerId = useGameStore((state) => state.connectedPlayerId);
  const storytellerId = useGameStore((state) => state.round.storytellerId);

  if (playerId === storytellerId)
    return <WaitingScreen>Waiting for players to select card...</WaitingScreen>;

  return <CardSelectScreen />;
};

export default PlayersSelectCardPhase;
