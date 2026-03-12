import type { DataConnection } from 'peerjs';
import Peer from 'peerjs';
import { useEffect, useEffectEvent, useState } from 'react';
import { useGameStore } from '@/stores/game-store';
import { useLobbyStore } from '@/stores/lobby-store';
import { usePeerStore } from '@/stores/peer-store';
import {
  gameEventSchema,
  type GameEvent,
  type LobbyStateSyncEvent,
} from '@/schemas/events';
import { syncGameState } from '@/utils/game-logic';
import useGameOrcestrator from './use-game-orchestrator';

const syncLobbyState = () => {
  const connections = usePeerStore.getState().connections;
  const players = useLobbyStore.getState().players;

  const event = {
    type: 'LOBBY_STATE_SYNC',
    players: [...players.values()],
  } satisfies LobbyStateSyncEvent;

  for (const [, connection] of connections) {
    connection.send(event);
  }
};

const useOpenPeer = () => {
  const [roomId, setRoomId] = useState<string>();

  const addPendingPlayer = useLobbyStore((state) => state.addPendingPlayer);
  const finalizePlayer = useLobbyStore((state) => state.finalizePlayer);
  const removePlayer = useLobbyStore((state) => state.removePlayer);
  const setPlayerConnected = useGameStore((state) => state.setPlayerConnected);
  const setPlayersAvatar = useLobbyStore((state) => state.setPlayersAvatar);
  const addConnection = usePeerStore((state) => state.addConnection);
  const removeConnection = usePeerStore((state) => state.removeConnection);
  const { handleGameEvent } = useGameOrcestrator();

  const handleEvent = useEffectEvent(
    (event: GameEvent, connection: DataConnection) => {
      switch (event.type) {
        case 'CONNECTED':
          addConnection(event.playerId, connection);

          connection.on('close', () => {
            const phase = useGameStore.getState().phase;
            if (!phase) removePlayer(event.playerId);
            removeConnection(event.playerId);
            setPlayerConnected(event.playerId, false);
            syncLobbyState();
          });

          addPendingPlayer(event.playerId, connection.connectionId);
          syncLobbyState();
          break;

        case 'AVATAR_SELECT':
          setPlayersAvatar(event.playerId, event.avatarId);
          syncLobbyState();
          break;

        case 'PLAYER_SETUP_COMPLETE':
          finalizePlayer(event.playerId, event.name, event.avatarId);
          syncLobbyState();
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

        const connections = [...lobbyPlayers.values()].map((playerData) => ({
          connectionId: playerData.connectionId,
          playerId: playerData.id,
        }));
        console.log({ connections });
        const currentPlayerId = connections.find(
          (c) => c.connectionId === conn.connectionId,
        )?.playerId;
        if (currentPlayerId) {
          removePlayerEvent(currentPlayerId);
          syncLobbyState();
        }
      });
    });

    return () => {
      peer.destroy();
    };
  }, []);

  return roomId;
};

export default useOpenPeer;
