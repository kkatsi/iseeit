import { useNavigate } from 'react-router';
import { dealCards } from '../lib/card-deal';
import { useGameStore, type PlayersDataMap } from '../lib/game-store';
import type { GameEvent } from '../schemas/events';
import type { Player } from '../schemas/player';
import {
  areAllPlayersReady,
  calculatePlayingOrder,
  getStoryteller,
} from '../utils/game-logic';
import useSyncGameState from './useSyncGameState';

const useGameOrcestrator = () => {
  const phase = useGameStore((state) => state.phase);
  const setPlayersData = useGameStore((state) => state.setPlayersData);
  const setPlayerReady = useGameStore((state) => state.setPlayerReady);
  const navigate = useNavigate();
  const setRound = useGameStore((state) => state.setRound);
  const setPhase = useGameStore((state) => state.setPhase);
  const setPlayingOrder = useGameStore((state) => state.setOrder);
  const setCards = useGameStore((state) => state.setCards);

  const syncGameState = useSyncGameState();

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

    setPlayingOrder(playingOrder);
    setPhase('CARD_DEAL');
    setRound({
      number: 1,
      storytellerId: getStoryteller(playingOrder, 1),
    });

    const cards = dealCards(playersData);
    const playerCards: Map<string, string[]> = new Map();

    for (const [playerId] of playersData) {
      playerCards.set(playerId, cards.get(playerId) || []);
    }

    setCards(playerCards);

    for (const [playerId] of playersData) {
      syncGameState(playerId);
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
          setPhase('STORYTELLER_CLUE');
          for (const [playerId] of currentPlayersData) {
            syncGameState(playerId);
          }
        }
        break;
      default:
        break;
    }
  };

  const advanceToNextRound = () => {
    const { order, round, playersData, scoreThreshhold } =
      useGameStore.getState();

    const hasWinner = [...playersData.values()].some(
      (p) => p.score >= scoreThreshhold,
    );

    if (hasWinner) {
      setPhase('GAME_END');
      return;
    }

    const nextRoundNumber = round.number + 1;

    setPhase('CARD_DEAL');
    setRound({
      number: nextRoundNumber,
      storytellerId: getStoryteller(order, nextRoundNumber),
    });
  };

  return {
    phase,
    startGame,
    handleGameEvent,
    advanceToNextRound,
  };
};

export default useGameOrcestrator;
