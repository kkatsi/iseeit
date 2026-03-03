import type { PlayersDataMap } from '../lib/game-store';
import { shuffleItems } from './shuffle';

export const calculatePlayingOrder = (playersData: PlayersDataMap) => {
  const playerIds = [...playersData.keys()];
  return shuffleItems(playerIds);
};

export const areAllPlayersReady = (playersData: PlayersDataMap) =>
  [...playersData.values()].every((player) => player.isReady);
