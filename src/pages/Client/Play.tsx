import { createSearchParams, Navigate, useSearchParams } from 'react-router';
import { LOCAL_STORAGE_STATE_KEY } from '../../constants';
import { useGameStore } from '../../lib/game-store';
import { getFromLocalStorage } from '../../lib/local-storage';
import { usePeerStore } from '../../lib/peer-store';
import DealPhase from './DealPhase';
import StorytellerPhase from './StorytellerPhase';
import PlayersSelectCardPhase from './PlayersSelectCardPhase';
import VotingPhase from './VotingPhase';
import ResultsPhase from './ResultsPhase';

const Play = () => {
  const { playerId } = getFromLocalStorage(LOCAL_STORAGE_STATE_KEY);
  const [params] = useSearchParams();
  const connection = usePeerStore((state) => state.connections.get(playerId));
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
      break;
  }
};

export default Play;
