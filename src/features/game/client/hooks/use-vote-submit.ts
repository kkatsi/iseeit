import type { VotingEvent } from '@/schemas/events';
import type { DataConnection } from 'peerjs';
import { useActionState } from 'react';

const useVoteSubmit = (
  playerId: string,
  onSubmit: () => void,
  connection?: DataConnection,
) => {
  const submitAction = (_: unknown, formData: FormData) => {
    const card = formData.get('card');

    if (!card || typeof card !== 'string') return 'Card selection is required';

    connection?.send({
      type: 'VOTING',
      playerId,
      card,
    } satisfies VotingEvent);

    onSubmit();
    return null;
  };

  const [error, formAction, isPending] = useActionState(submitAction, null);

  return { error, formAction, isPending };
};

export default useVoteSubmit;
