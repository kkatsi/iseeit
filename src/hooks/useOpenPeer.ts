import type { DataConnection } from 'peerjs';
import Peer from 'peerjs';
import { useEffect, useEffectEvent, useState } from 'react';
import { useGameStore } from '../lib/game-store';
import { useLobbyStore } from '../lib/lobby-store';
import { usePeerStore } from '../lib/peer-store';
import { gameEventSchema, type GameEvent } from '../schemas/events';
import useGameOrcestrator from './useGameOrchestrator';

const useOpenPeer = () => {
  const [roomId, setRoomId] = useState<string>();

  const addPlayer = useLobbyStore((state) => state.addPlayer);
  const removePlayer = useLobbyStore((state) => state.removePlayer);
  const setPlayerConnected = useGameStore((state) => state.setPlayerConnected);
  const addConnection = usePeerStore((state) => state.addConnection);
  const removeConnection = usePeerStore((state) => state.removeConnection);
  const { handleGameEvent } = useGameOrcestrator();

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

          addPlayer(event.player);
          break;
        default:
          handleGameEvent(event);
          break;
      }
    },
  );

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

  return roomId;
};

export default useOpenPeer;
