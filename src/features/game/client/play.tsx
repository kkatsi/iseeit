import { createSearchParams, Navigate, useSearchParams } from 'react-router';
import { LOCAL_STORAGE_STATE_KEY } from '@/config/constants';
import { useGameStore } from '@/stores/game-store';
import { getFromLocalStorage } from '@/lib/local-storage';
import { usePeerStore } from '@/stores/peer-store';
import ErrorBoundary from '@/components/error-boundary';
import DealPhase from './deal-phase';
import StorytellerPhase from './storyteller-phase';
import PlayersSelectCardPhase from './players-select-card-phase';
import VotingPhase from './voting-phase';
import ResultsPhase from './results-phase';
import { WaitingScreen } from '@/components/waiting-screen';

const PlayPhase = () => {
  const { playerId } = getFromLocalStorage(LOCAL_STORAGE_STATE_KEY) || {};
  const [params] = useSearchParams();
  const connection = usePeerStore((state) =>
    state.connections.get(playerId || ''),
  );
  const phase = useGameStore((state) => state.phase);

  if (!connection || !playerId) {
    return (
      <Navigate
        to={{
          pathname: '../connect',
          search: createSearchParams(params).toString(),
        }}
      />
    );
  }

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
      return <WaitingScreen>Waiting for the host to begin...</WaitingScreen>;
  }
};

const Play = () => (
  <ErrorBoundary>
    <PlayPhase />
  </ErrorBoundary>
);

export default Play;
