import { useActionState, useEffect, useEffectEvent, useMemo } from 'react';
import { createSearchParams, useNavigate, useSearchParams } from 'react-router';
import type { DataConnection } from 'peerjs';
import { useLobbyStore } from '@/stores/lobby-store';
import { useGameStore } from '@/stores/game-store';
import { getFromLocalStorage } from '@/lib/local-storage';
import { LOCAL_STORAGE_STATE_KEY } from '@/config/constants';
import { sendEvent } from '@/lib/peer';

export const useClientConnect = (
  connectToRoom: () => Promise<void>,
  connection?: DataConnection,
  playerId?: string,
) => {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const roomId = params.get('roomId');
  const unavailableAvatarIds = useLobbyStore(
    (state) => state.unavailableAvatarIds,
  );
  const selectedAvatarId = useLobbyStore((state) =>
    playerId ? state.players.get(playerId)?.avatarId : undefined,
  );
  const lobbyPlayers = useLobbyStore((state) => state.players);
  const gamePhase = useGameStore((state) => state.phase);

  // True if localStorage suggests a previous session for this room
  const hasExistingSession = useMemo(() => {
    const stored = getFromLocalStorage(LOCAL_STORAGE_STATE_KEY);
    return !!(stored?.playerId && stored?.roomId === roomId);
  }, [roomId]);

  // Keep showing the waiting screen until host responds with sync data
  const isWaitingForSync =
    hasExistingSession && !gamePhase && lobbyPlayers.size === 0;

  const connectToRoomEvent = useEffectEvent(connectToRoom);
  const navigateToPlay = () => {
    navigate({
      pathname: '../play',
      search: createSearchParams(params).toString(),
    });
  };
  const navigateToPlayEvent = useEffectEvent(navigateToPlay);

  const handleAvatarTap = (avatarId: string) => {
    if (!connection || !playerId) return;

    sendEvent(connection, {
      type: 'AVATAR_SELECT',
      playerId,
      avatarId,
    });
  };

  const finalize = (name: string, avatarId: string) => {
    if (!connection || !playerId) return;

    sendEvent(connection, {
      type: 'PLAYER_SETUP_COMPLETE',
      playerId,
      name,
      avatarId,
    });
  };

  // Always connect on mount — host decides whether this is a fresh join or reconnect
  useEffect(() => {
    connectToRoomEvent().catch((err) =>
      console.error('Connection failed:', err),
    );
  }, []);

  // If host responds with GAME_STATE_SYNC, gamePhase gets set → navigate to play
  useEffect(() => {
    if (gamePhase) navigateToPlayEvent();
  }, [gamePhase]);

  const handleSubmit = (_: void | null, formData: FormData) => {
    const name = formData.get('name');
    const avatarId = formData.get('avatarId');

    if (
      !name ||
      !avatarId ||
      typeof name !== 'string' ||
      typeof avatarId !== 'string'
    )
      return;

    finalize(name, avatarId);
    navigateToPlay();
  };

  const [isLoading, submitAction] = useActionState(handleSubmit, null);

  return {
    handleAvatarTap,
    unavailableAvatarIds,
    selectedAvatarId,
    isLoading: !!isLoading,
    submitAction,
    isWaitingForSync,
  };
};
