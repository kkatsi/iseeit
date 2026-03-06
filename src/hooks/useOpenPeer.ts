import type { DataConnection } from 'peerjs';
import Peer from 'peerjs';
import { useEffect, useEffectEvent, useState } from 'react';
import { useGameStore } from '../lib/game-store';
import { useLobbyStore } from '../lib/lobby-store';
import { usePeerStore } from '../lib/peer-store';
import { gameEventSchema, type GameEvent } from '../schemas/events';
import { syncGameState } from '../utils/game-logic';
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
          addConnection(event.player.id, connection);

          connection.on('close', () => {
            const phase = useGameStore.getState().phase;
            if (!phase) removePlayer(event.player.id);
            removeConnection(event.player.id);
            setPlayerConnected(event.player.id, false);
          });

          addPlayer(event.player, connection.connectionId);
          break;
        case 'RECONNECT': {
          const playersData = useGameStore.getState().playersData;
          if (!playersData.has(event.playerId)) return;

          addConnection(event.playerId, connection);

          connection.on('close', () => {
            removeConnection(event.playerId);
            setPlayerConnected(event.playerId, false);
          });

          setPlayerConnected(event.playerId, true);
          syncGameState(event.playerId);
          break;
        }
        default:
          handleGameEvent(event);
          break;
      }
    },
  );

  const removePlayerEvent = useEffectEvent(removePlayer);

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

      conn.on('close', () => {
        const lobbyPlayers = useLobbyStore.getState().players;

        console.log('open peer');
        console.log({ lobbyPlayers });

        const connections = [...lobbyPlayers.values()].map((playerData) => ({
          connectionId: playerData.connectionId,
          playerId: playerData.id,
        }));
        const currentPlayerId = connections.find(
          (c) => c.connectionId === conn.connectionId,
        )?.playerId;
        console.log({ currentPlayerId });
        if (currentPlayerId) removePlayerEvent(currentPlayerId);
      });
    });

    return () => {
      peer.destroy();
    };
  }, []);

  return roomId;
};

export default useOpenPeer;
