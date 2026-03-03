import type { PlayersData } from '../lib/game-store';

export const areAllPlayersReady = (playersData: PlayersData) =>
  [...playersData.values()].every((player) => player.isReady);
