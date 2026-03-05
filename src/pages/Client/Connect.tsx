import { useActionState, useEffect, useEffectEvent, useState } from 'react';
import {
  createSearchParams,
  useNavigate,
  useOutletContext,
  useSearchParams,
} from 'react-router';
import { LOCAL_STORAGE_STATE_KEY } from '../../constants';
import {
  getFromLocalStorage,
  removeFromLocalStorage,
} from '../../lib/local-storage';
import type { RoomOutletContextType } from '../../types';

const Connect = () => {
  const navigate = useNavigate();
  const [params] = useSearchParams();

  const { connect, reconnect } = useOutletContext<RoomOutletContextType>();

  const reconnectEvent = useEffectEvent(reconnect);
  const navigateEvent = useEffectEvent(() => {
    navigate({
      pathname: '../play',
      search: createSearchParams(params).toString(),
    });
  });

  const currentRoomId = params.get('roomId');

  const [isReconnecting, setReconnecting] = useState<boolean>(false);

  useEffect(() => {
    const stored = getFromLocalStorage(LOCAL_STORAGE_STATE_KEY);

    if (stored?.playerId && stored?.roomId === currentRoomId) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setReconnecting(true);
      reconnectEvent()
        .then(() => {
          navigateEvent();
        })
        .catch(() => {
          removeFromLocalStorage(LOCAL_STORAGE_STATE_KEY);
        });
    }
  }, [currentRoomId]);

  const connectToPeer = async (name: string) => {
    try {
      await connect(name);
      navigate({
        pathname: '../play',
        search: createSearchParams(params).toString(),
      });
    } catch (error) {
      alert(error);
    }
  };

  const submitAction = async (
    _prevState: string | null,
    formData: FormData,
  ) => {
    const name = formData.get('name') as string;
    if (!name) return 'Name is required';

    await connectToPeer(name);

    return null;
  };

  const [error, formAction, isPending] = useActionState(submitAction, null);

  if (isReconnecting) return 'Trying to reconnect...';

  return (
    <form action={formAction}>
      <input
        name="name"
        placeholder="Your name"
      />
      {error && <p>{error}</p>}
      <button
        type="submit"
        disabled={isPending}
      >
        {isPending ? 'Connecting...' : 'Connect'}
      </button>
    </form>
  );
};

export default Connect;
