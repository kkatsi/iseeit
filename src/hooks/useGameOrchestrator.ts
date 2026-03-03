import { useRef } from 'react';
import { useNavigate } from 'react-router';
import { dealCards } from '../lib/card-deal';
import {
  useGameStore,
  type GamePhase,
  type PlayersDataMap,
} from '../lib/game-store';
import type { GameEvent } from '../schemas/events';
import type { Player } from '../schemas/player';
import { areAllPlayersReady, calculatePlayingOrder } from '../utils/game-logic';
import { createIterator } from '../utils/iterator';
import useSyncGameState from './useSyncGameState';

const useGameOrcestrator = () => {
  const phase = useGameStore((state) => state.phase);
  const setPlayersData = useGameStore((state) => state.setPlayersData);
  const setPlayerReady = useGameStore((state) => state.setPlayerReady);
  const navigate = useNavigate();
  const setRound = useGameStore((state) => state.setRound);
  const setPhase = useGameStore((state) => state.setPhase);
  const setPlayingOrder = useGameStore((state) => state.setOrder);

  const syncGameState = useSyncGameState();

  const iterPhases =
    useRef<ReturnType<typeof createIterator<GamePhase>>>(undefined);

  const iterOrder =
    useRef<ReturnType<typeof createIterator<string>>>(undefined);

  const startGame = (players: Map<Player['id'], Player>) => {
    const playersData = new Map(
      [...players.entries()].map(([id, player]) => [
        id,
        {
          name: player.name,
          isReady: false,
          score: 0,
          isConnected: true,
        },
      ]),
    ) satisfies PlayersDataMap;

    setPlayersData(playersData);

    const playingOrder = calculatePlayingOrder(playersData);

    iterOrder.current = createIterator(playingOrder);
    iterPhases.current = createIterator([
      'CARD_DEAL',
      'STORYTELLER_CLUE',
      'PLAYERS_SELECT_CARD',
      'VOTING',
      'ROUND_RESULTS',
    ]);

    const firstStoryTellerId = iterOrder.current.next().value as string;

    setPlayingOrder(playingOrder);
    setPhase('CARD_DEAL');
    setRound({ storytellerId: firstStoryTellerId });

    const cards = dealCards(playersData);

    for (const [playerId] of playersData) {
      const playerCards = cards.get(playerId);
      syncGameState(playerId, playerCards);
    }

    navigate('/game');
  };

  const handleGameEvent = (event: GameEvent) => {
    switch (event.type) {
      case 'PLAYER_READY':
        setPlayerReady(event.playerId, true);

        const currentPlayersData = useGameStore.getState().playersData;
        const currentPhase = useGameStore.getState().phase;

        console.log([...currentPlayersData.entries()]);

        // check if we are at deal phase
        // then check if all players are ready
        // move to the next phase
        if (
          currentPhase === 'CARD_DEAL' &&
          areAllPlayersReady(currentPlayersData)
        ) {
          const nextPhase = iterPhases.current?.next().value;
          console.log('mode to next phase', nextPhase);

          setPhase(nextPhase || 'STORYTELLER_CLUE');
        }
        break;
      default:
        break;
    }
  };

  const advanceToNextRound = () => {
    const nextStoryTeller = iterOrder.current?.next();

    if (nextStoryTeller?.done) {
      iterOrder.current?.reset();
    }

    iterPhases.current?.reset();
    const nextPhase = iterPhases.current?.next().value;

    setPhase(nextPhase || 'GAME_END');
    setRound({ storytellerId: nextStoryTeller?.value as string });
  };

  return {
    phase,
    startGame,
    handleGameEvent,
    advanceToNextRound,
  };
};

export default useGameOrcestrator;
