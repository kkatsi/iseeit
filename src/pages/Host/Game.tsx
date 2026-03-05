import useGameOrcestrator from '../../hooks/useGameOrchestrator';
import DealPhase from './DealPhase';
import PlayersSelectCardPhase from './PlayersSelectCardPhase';
import ResultsPhase from './ResultsPhase';
import StorytellerPhase from './StorytellerPhase';
import VotingPhase from './VotingPhase';

const Game = () => {
  const { phase } = useGameOrcestrator();

  switch (phase) {
    case 'CARD_DEAL':
      return <DealPhase />;
    case 'STORYTELLER_CLUE':
      return <StorytellerPhase />;
    case 'PLAYERS_SELECT_CARD':
      return <PlayersSelectCardPhase />;
    case 'VOTING':
      return <VotingPhase />;
    case 'ROUND_RESULTS':
      return <ResultsPhase />;
    default:
      return 'nothing';
  }
};

export default Game;
