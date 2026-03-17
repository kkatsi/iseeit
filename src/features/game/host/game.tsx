import ErrorBoundary from '@/components/error-boundary';
import useGameOrchestrator from './hooks/use-game-orchestrator';
import DealPhase from './deal-phase';
import PlayersSelectCardPhase from './players-select-card-phase';
import ResultsPhase from './results-phase';
import StorytellerPhase from './storyteller-phase';
import VotingPhase from './voting-phase';

const GamePhase = () => {
  const { phase, transitionFromDeal, transitionToVoting, transitionToResults } =
    useGameOrchestrator();

  switch (phase) {
    case 'CARD_DEAL':
      return <DealPhase onComplete={transitionFromDeal} />;
    case 'STORYTELLER_CLUE':
      return <StorytellerPhase />;
    case 'PLAYERS_SELECT_CARD':
      return <PlayersSelectCardPhase onComplete={transitionToVoting} />;
    case 'VOTING':
      return <VotingPhase onComplete={transitionToResults} />;
    case 'ROUND_RESULTS':
      return <ResultsPhase />;
    default:
      return null;
  }
};

const Game = () => (
  <ErrorBoundary>
    <GamePhase />
  </ErrorBoundary>
);

export default Game;
