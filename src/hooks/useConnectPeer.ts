import Peer from 'peerjs';
import { useEffect, useRef } from 'react';
import { LOCAL_STORAGE_STATE_KEY } from '../constants';
import { useGameStore } from '../lib/game-store';
import { getFromLocalStorage, saveToLocalStorage } from '../lib/local-storage';
import { usePeerStore } from '../lib/peer-store';
import {
  gameEventSchema,
  type ConnectedEvent,
  type GameEvent,
  type ReconnectEvent,
} from '../schemas/events';
import { useLobbyStore, type LobbyPlayer } from '../lib/lobby-store';

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
  const setPlayers = useLobbyStore((state) => state.setPlayers);

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

        const roundScores = new Map();
        roundScores.set(event.playerId, event.roundScore);

        setPhase(event.phase);
        setRound({
          storytellerId: event.storytellerId,
          clue: event.clue,
          tableCards: event.tableCards,
          roundScores,
        });
        setCards(cardsMap);
        setConnectedPlayerId(event.playerId);
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

  const connectToRoom = async () => {
    if (!roomId) return;

    const playerId =
      getFromLocalStorage(LOCAL_STORAGE_STATE_KEY)?.playerId ||
      crypto.randomUUID();

    saveToLocalStorage({
      name: LOCAL_STORAGE_STATE_KEY,
      value: { playerId, roomId },
    });

    setLocalPlayerId(playerId);

    const peer = new Peer();
    peerRef.current = peer;

    await new Promise((res, rej) => {
      peer.on('open', () => {
        const connection = peer.connect(roomId);
        addConnection(playerId, connection);

        connection.on('open', () => {
          connection.send({
            type: 'CONNECTED',
            playerId,
          } satisfies ConnectedEvent);

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

  const reconnect = async () => {
    const stored = getFromLocalStorage(LOCAL_STORAGE_STATE_KEY);
    if (!stored?.playerId || !roomId) return;

    const { playerId } = stored;
    setLocalPlayerId(playerId);

    const peer = new Peer();
    peerRef.current = peer;

    await new Promise((res, rej) => {
      peer.on('open', () => {
        const connection = peer.connect(roomId);
        addConnection(playerId, connection);

        connection.on('open', () => {
          connection.send({
            type: 'RECONNECT',
            playerId,
          } satisfies ReconnectEvent);

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

  return {
    connectToRoom,
    reconnect,
  };
};

export default useConnectPeer;
