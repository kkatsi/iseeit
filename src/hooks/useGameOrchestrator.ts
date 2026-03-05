import { useNavigate } from 'react-router';
import { dealCards } from '../lib/card-deal';
import { useGameStore, type PlayersDataMap } from '../lib/game-store';
import type { GameEvent } from '../schemas/events';
import type { Player } from '../schemas/player';
import {
  areAllPlayersReady,
  calculatePlayingOrder,
  calculateScores,
  getStoryteller,
  syncGameState,
} from '../utils/game-logic';
import { shuffleItems } from '../utils/shuffle';

const useGameOrcestrator = () => {
  const phase = useGameStore((state) => state.phase);
  const setPlayersData = useGameStore((state) => state.setPlayersData);
  const setPlayerReady = useGameStore((state) => state.setPlayerReady);
  const navigate = useNavigate();
  const setRound = useGameStore((state) => state.setRound);
  const setPhase = useGameStore((state) => state.setPhase);
  const setPlayingOrder = useGameStore((state) => state.setOrder);
  const setCards = useGameStore((state) => state.setCards);
  const resetRoundData = useGameStore((state) => state.resetRoundData);
  const resetPlayersReady = useGameStore((state) => state.resetPlayersReady);

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
      case 'PLAYER_READY': {
        setPlayerReady(event.playerId, true);

        const currentPlayersData = useGameStore.getState().playersData;
        const currentPhase = useGameStore.getState().phase;

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
      }
      case 'STORYTELLER_CLUE': {
        const currentPlayersData = useGameStore.getState().playersData;

        setRound({
          clue: event.clue,
          storytellerCard: event.card,
        });
        setPhase('PLAYERS_SELECT_CARD');
        for (const [playerId] of currentPlayersData) {
          syncGameState(playerId);
        }
        break;
      }
      case 'PLAYER_SELECTS_CARD': {
        const currentPlayersData = useGameStore.getState().playersData;
        const storytellerCard = useGameStore.getState().round.storytellerCard;
        const submittedCards = new Map(
          useGameStore.getState().round.submittedCards,
        );
        submittedCards?.set(event.playerId, event.card);
        setRound({ submittedCards });

        if (
          submittedCards?.size === currentPlayersData.size - 1 &&
          storytellerCard
        ) {
          console.log('all players submitted');

          setPhase('VOTING');
          const shuffledCards = shuffleItems([
            ...submittedCards.values(),
            storytellerCard,
          ]);
          console.log({ shuffledCards });

          setRound({ tableCards: shuffledCards });

          for (const [playerId] of currentPlayersData) {
            syncGameState(playerId);
          }
        }
        break;
      }
      case 'VOTING': {
        const currentPlayersData = useGameStore.getState().playersData;
        const votes = new Map(useGameStore.getState().round.votes);

        const { storytellerCard, storytellerId, submittedCards } =
          useGameStore.getState().round;

        votes.set(event.playerId, event.card);

        setRound({ votes });

        if (
          votes?.size === currentPlayersData.size - 1 &&
          storytellerCard &&
          submittedCards
        ) {
          setRound({
            roundScores: calculateScores({
              storytellerCard,
              storytellerId,
              submittedCards,
              votes,
            }),
          });
          setPhase('ROUND_RESULTS');

          for (const [playerId] of currentPlayersData) {
            syncGameState(playerId);
          }
        }
        break;
      }
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

    resetRoundData();
    resetPlayersReady();

    const nextRoundNumber = round.number + 1;

    setPhase('CARD_DEAL');
    setRound({
      number: nextRoundNumber,
      storytellerId: getStoryteller(order, nextRoundNumber),
    });

    const currentPlayersData = useGameStore.getState().playersData;

    for (const [playerId] of currentPlayersData) {
      syncGameState(playerId);
    }
  };

  return {
    phase,
    startGame,
    handleGameEvent,
    advanceToNextRound,
  };
};

export default useGameOrcestrator;
