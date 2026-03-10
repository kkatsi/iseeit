import { useActionState, useEffect, useEffectEvent, useMemo } from 'react';
import {
  getFromLocalStorage,
  removeFromLocalStorage,
} from '../../../lib/local-storage';
import { LOCAL_STORAGE_STATE_KEY } from '../../../constants';
import { createSearchParams, useNavigate, useSearchParams } from 'react-router';
import type { DataConnection } from 'peerjs';
import { useLobbyStore } from '../../../lib/lobby-store';

export const useClientConnect = (
  connectToRoom: () => Promise<void>,
  reconnect: () => Promise<void>,
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

  // Derive reconnecting from localStorage check (no setState in effect)
  const shouldReconnect = useMemo(() => {
    const stored = getFromLocalStorage(LOCAL_STORAGE_STATE_KEY);
    return !!(stored?.playerId && stored?.roomId === roomId);
  }, [roomId]);

  const connectToRoomEvent = useEffectEvent(connectToRoom);
  const reconnectEvent = useEffectEvent(reconnect);
  const navigateToPlay = () => {
    navigate({
      pathname: '../play',
      search: createSearchParams(params).toString(),
    });
  };
  const navigateToPlayEvent = useEffectEvent(navigateToPlay);

  const handleAvatarTap = (avatarId: string) => {
    if (!connection || !playerId) return;

    connection.send({
      type: 'AVATAR_SELECT',
      playerId,
      avatarId,
    });
  };

  const finalize = (name: string, avatarId: string) => {
    if (!connection || !playerId) return;

    connection.send({
      type: 'PLAYER_SETUP_COMPLETE',
      playerId,
      name,
      avatarId,
    });
  };

  // Auto-connect on mount (only if not reconnecting)
  useEffect(() => {
    if (shouldReconnect) return;
    connectToRoomEvent().catch((err) =>
      console.error('Connection failed:', err),
    );
  }, [shouldReconnect]);

  // Reconnect flow
  useEffect(() => {
    if (!shouldReconnect) return;
    reconnectEvent()
      .then(() => navigateToPlayEvent())
      .catch(() => removeFromLocalStorage(LOCAL_STORAGE_STATE_KEY));
  }, [shouldReconnect]);

  const handleSubmit = (_: void | null, formData: FormData) => {
    const name = formData.get('name') as string;
    const avatarId = formData.get('avatarId') as string;

    if (!name || !avatarId) return;
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
    shouldReconnect,
  };
};
