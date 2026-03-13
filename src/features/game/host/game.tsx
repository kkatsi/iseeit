import useGameOrcestrator from '@/hooks/use-game-orchestrator';
import DealPhase from './deal-phase';
import PlayersSelectCardPhase from './players-select-card-phase';
import ResultsPhase from './results-phase';
import StorytellerPhase from './storyteller-phase';
import VotingPhase from './voting-phase';

const Game = () => {
  const { phase, transitionFromDeal } = useGameOrcestrator();

  switch (phase) {
    case 'CARD_DEAL':
      return <DealPhase onComplete={transitionFromDeal} />;
    case 'STORYTELLER_CLUE':
      return <StorytellerPhase />;
    case 'PLAYERS_SELECT_CARD':
      return <PlayersSelectCardPhase />;
    case 'VOTING':
      return <VotingPhase />;
    case 'ROUND_RESULTS':
      return <ResultsPhase />;
    default:
      return null;
  }
};

export default Game;
