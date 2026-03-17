import { useNavigate } from 'react-router';
import { createDeck, dealToPlayers } from '@/lib/card-deal';
import { useGameStore, type PlayersDataMap } from '@/stores/game-store';
import type { GameEvent } from '@/schemas/events';
import {
  calculatePlayingOrder,
  calculateScores,
  getStoryteller,
  syncGameState,
} from '@/utils/game-logic';
import { shuffleItems } from '@/utils/shuffle';
import type { LobbyPlayer } from '@/stores/lobby-store';


const useGameOrcestrator = () => {
  const phase = useGameStore((state) => state.phase);
  const setPlayersData = useGameStore((state) => state.setPlayersData);
  const navigate = useNavigate();
  const setRound = useGameStore((state) => state.setRound);
  const setPhase = useGameStore((state) => state.setPhase);
  const setPlayingOrder = useGameStore((state) => state.setOrder);
  const setCards = useGameStore((state) => state.setCards);
  const resetRoundData = useGameStore((state) => state.resetRoundData);
  const setDrawPile = useGameStore((state) => state.setDrawPile);
  const setDiscardPile = useGameStore((state) => state.setDiscardPile);

  const startGame = (players: Map<string, LobbyPlayer>) => {
    const playersData = new Map(
      [...players.entries()].map(([id, player]) => [
        id,
        {
          name: player.name as string,
          avatarId: player.avatarId,
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

    const deck = createDeck();
    const { hands, drawPile } = dealToPlayers([...playersData.keys()], 6, deck);

    setCards(hands);
    setDrawPile(drawPile);
    setDiscardPile([]);

    for (const [playerId] of playersData) {
      syncGameState(playerId);
    }

    navigate('/game');
  };

  const handleGameEvent = (event: GameEvent) => {
    switch (event.type) {
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
          const shuffledCards = shuffleItems([
            ...submittedCards.values(),
            storytellerCard,
          ]);
          setRound({ tableCards: shuffledCards });
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
        }
        break;
      }
      default:
        break;
    }
  };

  const advanceToNextRound = () => {
    const {
      order,
      round,
      playersData,
      scoreThreshhold,
      drawPile,
      discardPile,
      cards,
    } = useGameStore.getState();

    const hasWinner = [...playersData.values()].some(
      (p) => p.score >= scoreThreshhold,
    );

    if (hasWinner) {
      setPhase('GAME_END');
      return;
    }

    // Move played cards to discard pile
    const playedCards: string[] = [];
    if (round.storytellerCard) playedCards.push(round.storytellerCard);
    if (round.submittedCards) {
      for (const card of round.submittedCards.values()) {
        playedCards.push(card);
      }
    }
    const updatedDiscard = [...discardPile, ...playedCards];

    // Deal 1 card per player
    const playerIds = [...playersData.keys()];
    const {
      hands: newCards,
      drawPile: newDrawPile,
      discardPile: newDiscardPile,
    } = dealToPlayers(playerIds, 1, drawPile, updatedDiscard);

    // Remove played cards from hands
    const updatedCards = new Map(cards);
    if (round.storytellerCard) {
      const hand = updatedCards.get(round.storytellerId) || [];
      updatedCards.set(
        round.storytellerId,
        hand.filter((c) => c !== round.storytellerCard),
      );
    }
    if (round.submittedCards) {
      for (const [pid, card] of round.submittedCards) {
        const hand = updatedCards.get(pid) || [];
        updatedCards.set(
          pid,
          hand.filter((c) => c !== card),
        );
      }
    }

    // Merge new cards into existing hands
    for (const [playerId, drawn] of newCards) {
      const existing = updatedCards.get(playerId) || [];
      updatedCards.set(playerId, [...existing, ...drawn]);
    }

    resetRoundData();

    const nextRoundNumber = round.number + 1;

    setPhase('CARD_DEAL');
    setRound({
      number: nextRoundNumber,
      storytellerId: getStoryteller(order, nextRoundNumber),
    });
    setCards(updatedCards);
    setDrawPile(newDrawPile);
    setDiscardPile(newDiscardPile);

    const currentPlayersData = useGameStore.getState().playersData;

    for (const [playerId] of currentPlayersData) {
      syncGameState(playerId);
    }
  };

  const transitionToVoting = () => {
    const currentPlayersData = useGameStore.getState().playersData;
    setPhase('VOTING');
    for (const [playerId] of currentPlayersData) {
      syncGameState(playerId);
    }
  };

  const transitionFromDeal = () => {
    const currentPlayersData = useGameStore.getState().playersData;
    setPhase('STORYTELLER_CLUE');
    for (const [playerId] of currentPlayersData) {
      syncGameState(playerId);
    }
  };

  const transitionToResults = () => {
    const applyRoundScores = useGameStore.getState().applyRoundScores;
    applyRoundScores();
    const currentPlayersData = useGameStore.getState().playersData;
    setPhase('ROUND_RESULTS');
    for (const [playerId] of currentPlayersData) {
      syncGameState(playerId);
    }
  };

  return {
    phase,
    startGame,
    handleGameEvent,
    advanceToNextRound,
    transitionFromDeal,
    transitionToVoting,
    transitionToResults,
  };
};

export default useGameOrcestrator;
