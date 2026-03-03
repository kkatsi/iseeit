import { createSearchParams, Navigate, useSearchParams } from 'react-router';
import { usePeerStore } from '../../lib/peer-store';
import type { PlayerReadyEvent } from '../../schemas/events';
import { getFromLocalStorage } from '../../lib/local-storage';
import { localStorageStateKey } from '../../constants';

const Game = () => {
  const { playerId } = getFromLocalStorage(localStorageStateKey);
  const [params] = useSearchParams();
  const connection = usePeerStore((state) => state.connections.get(playerId));

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

  const setPlayerReady = () => {
    connection.send({
      type: 'PLAYER_READY',
      playerId,
    } satisfies PlayerReadyEvent);
  };

  return <button onClick={setPlayerReady}>I'm ready!</button>;
};

export default Game;
