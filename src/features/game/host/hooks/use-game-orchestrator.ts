import { useNavigate } from 'react-router';
import { createDeck, dealToPlayers } from '@/lib/card-deal';
import { useGameStore, type PlayersDataMap } from '@/stores/game-store';
import {
  calculatePlayingOrder,
  getStoryteller,
  syncGameState,
} from '@/utils/game-logic';
import type { LobbyPlayer } from '@/stores/lobby-store';

const useGameOrchestrator = () => {
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
    advanceToNextRound,
    transitionFromDeal,
    transitionToVoting,
    transitionToResults,
  };
};

export default useGameOrchestrator;
