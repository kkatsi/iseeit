import useGameOrcestrator from '../../hooks/useGameOrchestrator';
import DealPhase from './DealPhase';

const Game = () => {
  const { phase } = useGameOrcestrator();

  switch (phase) {
    case 'CARD_DEAL':
      return <DealPhase />;
    case 'STORYTELLER_CLUE':
      return 'story teller clue';
    default:
      return 'nothing';
  }
};

export default Game;
