import { useNavigate } from 'react-router';
import { useGameStore } from '../lib/game-store';
import type { Player } from '../schemas/player';
import { dealCards } from '../lib/card-deal';

const useStartGame = () => {
  const navigate = useNavigate();
  const setGameData = useGameStore((state) => state.setGameData);

  const startGame = (players: Map<Player['id'], Player>) => {
    const playerIds = [...players.keys()];
    const cards = dealCards(playerIds);

    const playersData = new Map(
      [...players.entries()].map(([id, player]) => [
        id,
        {
          name: player.name,
          isReady: false,
          score: 0,
          cards: cards.get(id) ?? [],
          isConnected: true,
        },
      ]),
    );

    setGameData({ playersData, round: 1, phase: 'CARD_DEAL' });

    navigate('/host-game');
  };

  return startGame;
};

export default useStartGame;
