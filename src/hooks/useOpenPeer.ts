import Peer from 'peerjs';
import type { DataConnection } from 'peerjs';
import { useEffect, useEffectEvent, useState } from 'react';
import { useLobbyStore } from '../lib/lobby-store';
import { usePeerStore } from '../lib/peer-store';
import {
  gameEventSchema,
  type GameEvent,
  type GameStateSyncEvent,
} from '../schemas/events';
import { useGameStore } from '../lib/game-store';

const useOpenPeer = () => {
  const [roomId, setRoomId] = useState<string>();

  const addPlayer = useLobbyStore((state) => state.addPlayer);
  const removePlayer = useLobbyStore((state) => state.removePlayer);
  const setPlayerReady = useGameStore((state) => state.setPlayerReady);
  const setPlayerConnected = useGameStore((state) => state.setPlayerConnected);
  const addConnection = usePeerStore((state) => state.addConnection);
  const removeConnection = usePeerStore((state) => state.removeConnection);

  useEffect(() => {
    const peer = new Peer();

    peer.on('open', (id) => {
      setRoomId(id);
    });

    peer.on('connection', (conn) => {
      conn.on('data', (data) => {
        const result = gameEventSchema.safeParse(data);

        if (!result.success) {
          console.warn('Invalid event:', result.error);
          return;
        }

        handleEvent(result.data, conn);
      });
    });

    return () => {
      peer.destroy();
    };
  }, []);

  const handleEvent = useEffectEvent(
    (event: GameEvent, connection: DataConnection) => {
      switch (event.type) {
        case 'JOINED':
          //store peer connection;
          addConnection(event.player.id, connection);

          //handle connection close
          connection.on('close', () => {
            removePlayer(event.player.id);
            removeConnection(event.player.id);
            setPlayerConnected(event.player.id, false);
          });

          const existingPlayer = useGameStore
            .getState()
            .playersData.get(event.player.id);
          if (!!existingPlayer) {
            const { playersData, phase, round } = useGameStore.getState();
            connection.send({
              type: 'GAME_STATE_SYNC',
              playersData: [...playersData.entries()],
              phase,
              round,
            } satisfies GameStateSyncEvent);
            setPlayerConnected(event.player.id, true);
          } else {
            addPlayer(event.player);
          }
          break;
        case 'ADD_POINTS':
          console.log({ event });
          // addPoints(event.points);
          break;
        case 'PLAYER_READY':
          setPlayerReady(event.playerId, true);
          break;
        default:
          break;
      }
    },
  );

  return roomId;
};

export default useOpenPeer;
