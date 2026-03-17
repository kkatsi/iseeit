import { useGameStore } from '@/stores/game-store';
import CardSelectScreen from './components/general-card-select-screen';
import { WaitingScreen } from '../../../components/waiting-screen';

const StorytellerPhase = () => {
  const playerId = useGameStore((state) => state.connectedPlayerId);
  const storytellerId = useGameStore((state) => state.round.storytellerId);

  if (playerId === storytellerId)
    return <CardSelectScreen isStoryteller={true} />;

  return <WaitingScreen>Waiting for storyteller's clue...</WaitingScreen>;
};

export default StorytellerPhase;
