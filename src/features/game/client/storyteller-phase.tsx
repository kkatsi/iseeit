import { useGameStore } from '@/stores/game-store';
import StorytellerScreen from './components/storyteller-screen';
import { WaitingScreen } from '../../../components/waiting-screen';

const StorytellerPhase = () => {
  const playerId = useGameStore((state) => state.connectedPlayerId);
  const storytellerId = useGameStore((state) => state.round.storytellerId);

  if (playerId === storytellerId) return <StorytellerScreen />;

  return <WaitingScreen>Waiting for storyteller's clue...</WaitingScreen>;
};

export default StorytellerPhase;
