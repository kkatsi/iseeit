import Peer from 'peerjs';
import { useCallback, useEffect, useEffectEvent, useRef } from 'react';
import {
  gameEventSchema,
  type GameEvent,
  type JoinedEvent,
} from '../schemas/events';
import { usePeerStore } from '../lib/peer-store';
import { useGameStore } from '../lib/game-store';
import { getFromLocalStorage, saveToLocalStorage } from '../lib/local-storage';
import { localStorageStateKey } from '../constants';

const useConnectPeer = (roomId?: string | null) => {
  const addConnection = usePeerStore((state) => state.addConnection);
  const removeConnection = usePeerStore((state) => state.removeConnection);
  const setGameData = useGameStore((state) => state.setGameData);
  const setPlayerConnected = useGameStore((state) => state.setPlayerConnected);
  const peerRef = useRef<Peer>(undefined);

  useEffect(() => {
    return () => {
      const { playerId } = getFromLocalStorage(localStorageStateKey);
      peerRef.current?.destroy();
      removeConnection(playerId);
      setPlayerConnected(playerId, false);
    };
  }, []);

  const connect = useCallback(
    async (name: string) => {
      if (!roomId) return;

      const playerId =
        getFromLocalStorage(localStorageStateKey)?.playerId ||
        crypto.randomUUID();

      saveToLocalStorage({
        name: localStorageStateKey,
        value: { playerId, roomId },
      });

      const peer = new Peer();
      peerRef.current = peer;

      await new Promise((res, rej) => {
        peer.on('open', () => {
          const connection = peer.connect(roomId);
          addConnection(playerId, connection);

          connection.on('open', () => {
            connection.send({
              type: 'JOINED',
              player: {
                id: playerId,
                name,
              },
            } satisfies JoinedEvent);

            connection.on('data', (data) => {
              const result = gameEventSchema.safeParse(data);
              if (!result.success) {
                console.warn('Invalid event:', result.error);
                return;
              }
              handleEvent(result.data);
            });

            res(undefined);
          });
        });

        peer.on('error', (error) => rej(error));
      });
    },
    [roomId, addConnection],
  );

  const handleEvent = useEffectEvent((event: GameEvent) => {
    switch (event.type) {
      case 'GAME_STATE_SYNC':
        setGameData({
          playersData: new Map(
            event.playersData.map((item) => [
              item[0],
              { ...item[1], isConnected: true },
            ]),
          ),
          phase: event.phase,
          round: event.round,
        });
        break;
      default:
        break;
    }
  });

  return connect;
};

export default useConnectPeer;
