import type {
  PlayerSelectsCardEvent,
  StoryTellerClueEvent,
} from '@/schemas/events';
import type { DataConnection } from 'peerjs';
import { useActionState } from 'react';
import { sendEvent } from '@/lib/peer';

const useCardSelectSubmit = (
  actionType: 'STORYTELLER_CLUE' | 'PLAYER_SELECTS_CARD',
  playerId: string,
  onSubmit: () => void,
  connection?: DataConnection,
) => {
  const submitAction = (_: unknown, formData: FormData) => {
    const card = formData.get('card');

    switch (actionType) {
      case 'STORYTELLER_CLUE': {
        const clue = formData.get('clue');
        if (!clue || typeof clue !== 'string') return 'Clue is required';
        if (!card || typeof card !== 'string') return 'Card is required';
        if (connection) sendEvent(connection, { type: 'STORYTELLER_CLUE', card, clue } satisfies StoryTellerClueEvent);
        break;
      }
      case 'PLAYER_SELECTS_CARD': {
        if (!card || typeof card !== 'string') return 'Card is required';
        if (connection) sendEvent(connection, { type: 'PLAYER_SELECTS_CARD', card, playerId } satisfies PlayerSelectsCardEvent);
        break;
      }
    }
    onSubmit();
    return null;
  };

  const [error, formAction, isPending] = useActionState(submitAction, null);

  return { error, formAction, isPending };
};

export default useCardSelectSubmit;
