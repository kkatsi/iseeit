import Peer from 'peerjs';
import { useEffect, useRef, useState } from 'react';
import {
  CONNECTION_TIMEOUT,
  LOCAL_STORAGE_STATE_KEY,
} from '@/config/constants';
import { useGameStore } from '@/stores/game-store';
import { getFromLocalStorage, saveToLocalStorage } from '@/lib/local-storage';
import { usePeerStore } from '@/stores/peer-store';
import {
  gameEventSchema,
  type ConnectedEvent,
  type GameEvent,
  type ReconnectEvent,
} from '@/schemas/events';
import { useLobbyStore, type LobbyPlayer } from '@/stores/lobby-store';
import { withTimeout } from '@/utils/async';
import { sendEvent } from '@/lib/peer';

const useConnectPeer = (roomId?: string | null) => {
  const addConnection = usePeerStore((state) => state.addConnection);
  const removeConnection = usePeerStore((state) => state.removeConnection);
  const setLocalPlayerId = usePeerStore((state) => state.setLocalPlayerId);
  const setPlayerConnected = useGameStore((state) => state.setPlayerConnected);
  const setPhase = useGameStore((state) => state.setPhase);
  const setCards = useGameStore((state) => state.setCards);
  const setRound = useGameStore((state) => state.setRound);
  const setConnectedPlayerId = useGameStore(
    (state) => state.setConnectedPlayerId,
  );
  const setNewCards = useGameStore((state) => state.setNewCards);
  const setPlayers = useLobbyStore((state) => state.setPlayers);

  const peerRef = useRef<Peer>(undefined);
  const [connectionError, setConnectionError] = useState<string>();

  useEffect(() => {
    return () => {
      const stored = getFromLocalStorage(LOCAL_STORAGE_STATE_KEY);
      peerRef.current?.destroy();
      if (stored?.playerId) {
        removeConnection(stored.playerId);
        setPlayerConnected(stored.playerId, false);
      }
    };
  }, [removeConnection, setPlayerConnected]);

  const handleEvent = (event: GameEvent) => {
    switch (event.type) {
      case 'GAME_STATE_SYNC': {
        const cardsMap = new Map();
        cardsMap.set(event.playerId, event.cards);

        const roundScores = new Map();
        roundScores.set(event.playerId, event.roundScore);

        setPhase(event.phase);
        setRound({
          storytellerId: event.storytellerId,
          clue: event.clue,
          tableCards: event.tableCards,
          ownSubmittedCard: event.ownSubmittedCard,
          roundScores,
        });
        setCards(cardsMap);
        setNewCards(event.newCards ?? event.cards);
        setConnectedPlayerId(event.playerId);

        // Populate lobby store so WaitingScreen can display player identity
        setPlayers(
          new Map([
            [
              event.playerId,
              {
                id: event.playerId,
                connectionId: '',
                avatarId: event.avatarId,
                name: event.name,
                status: 'ready' as const,
              },
            ],
          ]),
        );
        break;
      }
      case 'LOBBY_STATE_SYNC': {
        const playersMap = new Map(
          event.players.map((p) => [p.id, p as LobbyPlayer]),
        );
        setPlayers(playersMap);
        break;
      }
      default:
        break;
    }
  };

  const connectToPeer = async (
    playerId: string,
    initialEvent: ConnectedEvent | ReconnectEvent,
  ) => {
    if (!roomId) return;

    const peer = new Peer();
    peerRef.current = peer;

    await withTimeout(
      new Promise<void>((res, rej) => {
        peer.on('open', () => {
          const connection = peer.connect(roomId);
          addConnection(playerId, connection);

          connection.on('open', () => {
            sendEvent(connection, initialEvent);

            connection.on('data', (data) => {
              const result = gameEventSchema.safeParse(data);
              if (!result.success) {
                console.warn('Invalid event:', result.error);
                return;
              }
              handleEvent(result.data);
            });

            res();
          });
        });

        peer.on('error', (error) => rej(error));
      }),
      CONNECTION_TIMEOUT,
    );
  };

  const connectToRoom = async () => {
    if (!roomId) return;
    setConnectionError(undefined);

    const playerId =
      getFromLocalStorage(LOCAL_STORAGE_STATE_KEY)?.playerId ||
      crypto.randomUUID();

    saveToLocalStorage({
      name: LOCAL_STORAGE_STATE_KEY,
      value: { playerId, roomId },
    });

    setLocalPlayerId(playerId);

    try {
      await connectToPeer(playerId, {
        type: 'CONNECTED',
        playerId,
      } satisfies ConnectedEvent);
    } catch (err) {
      setConnectionError(
        err instanceof Error ? err.message : 'Connection failed',
      );
      throw err;
    }
  };

  const reconnect = async () => {
    const stored = getFromLocalStorage(LOCAL_STORAGE_STATE_KEY);
    if (!stored?.playerId || !roomId) return;

    const { playerId } = stored;
    setLocalPlayerId(playerId);

    try {
      await connectToPeer(playerId, {
        type: 'RECONNECT',
        playerId,
      } satisfies ReconnectEvent);
    } catch (err) {
      setConnectionError(
        err instanceof Error ? err.message : 'Reconnection failed',
      );
      throw err;
    }
  };

  return {
    connectToRoom,
    reconnect,
    connectionError,
  };
};

export default useConnectPeer;
