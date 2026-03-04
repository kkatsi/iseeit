import Peer from 'peerjs';
import { useEffect, useRef } from 'react';
import { LOCAL_STORAGE_STATE_KEY } from '../constants';
import { useGameStore } from '../lib/game-store';
import { getFromLocalStorage, saveToLocalStorage } from '../lib/local-storage';
import { usePeerStore } from '../lib/peer-store';
import {
  gameEventSchema,
  type GameEvent,
  type JoinedEvent,
} from '../schemas/events';

const useConnectPeer = (roomId?: string | null) => {
  const addConnection = usePeerStore((state) => state.addConnection);
  const removeConnection = usePeerStore((state) => state.removeConnection);
  const setPlayerConnected = useGameStore((state) => state.setPlayerConnected);
  const setPhase = useGameStore((state) => state.setPhase);
  const setCards = useGameStore((state) => state.setCards);
  const setRound = useGameStore((state) => state.setRound);
  const setConnectedPlayerId = useGameStore(
    (state) => state.setConnectedPlayerId,
  );

  const peerRef = useRef<Peer>(undefined);

  useEffect(() => {
    return () => {
      const { playerId } = getFromLocalStorage(LOCAL_STORAGE_STATE_KEY);
      peerRef.current?.destroy();
      removeConnection(playerId);
      setPlayerConnected(playerId, false);
    };
  }, [removeConnection, setPlayerConnected]);

  const handleEvent = (event: GameEvent) => {
    switch (event.type) {
      case 'GAME_STATE_SYNC': {
        const cardsMap = new Map();
        cardsMap.set(event.playerId, event.cards);

        setPhase(event.phase);
        setRound({ storytellerId: event.storytellerId });
        setCards(cardsMap);
        setConnectedPlayerId(event.playerId);
        break;
      }
      default:
        break;
    }
  };

  const connect = async (name: string) => {
    if (!roomId) return;

    const playerId =
      getFromLocalStorage(LOCAL_STORAGE_STATE_KEY)?.playerId ||
      crypto.randomUUID();

    saveToLocalStorage({
      name: LOCAL_STORAGE_STATE_KEY,
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
  };

  return connect;
};

export default useConnectPeer;
