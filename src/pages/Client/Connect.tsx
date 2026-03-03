import { useActionState, useEffect, useEffectEvent } from 'react';
import {
  createSearchParams,
  useNavigate,
  useOutletContext,
  useSearchParams,
} from 'react-router';
import type { RoomOutletContextType } from '../../types';
import {
  getFromLocalStorage,
  removeFromLocalStorage,
} from '../../lib/local-storage';
import { localStorageStateKey } from '../../constants';

const Connect = () => {
  const navigate = useNavigate();
  const [params] = useSearchParams();

  const { connect } = useOutletContext<RoomOutletContextType>();

  useEffect(() => {
    (async () => {
      const { playerId, roomId: savedRoomId } =
        getFromLocalStorage(localStorageStateKey);
      const currentRoomId = params.get('roomId');
      if (playerId && savedRoomId === currentRoomId) await connectToPeer('');
      else removeFromLocalStorage(localStorageStateKey);
    })();
  }, []);

  const connectToPeer = useEffectEvent(async (name: string) => {
    try {
      await connect(name);
      navigate({
        pathname: '../play',
        search: createSearchParams(params).toString(),
      });
    } catch (error) {
      alert(error);
    }
  });

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
