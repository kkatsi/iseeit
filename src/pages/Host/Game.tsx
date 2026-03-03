import useGameOrcestrator from '../../hooks/useGameOrchestrator';
import DealPhase from './DealPhase';
import StorytellerPhase from './StorytellerPhase';

const Game = () => {
  const { phase } = useGameOrcestrator();

  switch (phase) {
    case 'CARD_DEAL':
      return <DealPhase />;
    case 'STORYTELLER_CLUE':
      return <StorytellerPhase />;
    default:
      return 'nothing';
  }
};

export default Game;
