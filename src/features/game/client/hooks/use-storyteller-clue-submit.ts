import type { StoryTellerClueEvent } from '@/schemas/events';
import type { DataConnection } from 'peerjs';
import { useActionState } from 'react';

const useStorytellerClueSubmit = (connection?: DataConnection) => {
  const submitAction = (_: unknown, formData: FormData) => {
    const clue = formData.get('clue');
    const card = formData.get('card');

    if (!clue || typeof clue !== 'string') return 'Clue is required';
    if (!card || typeof card !== 'string') return 'Card is required';

    connection?.send({
      type: 'STORYTELLER_CLUE',
      card,
      clue,
    } satisfies StoryTellerClueEvent);

    return null;
  };

  const [error, formAction, isPending] = useActionState(submitAction, null);

  return { error, formAction, isPending };
};

export default useStorytellerClueSubmit;
