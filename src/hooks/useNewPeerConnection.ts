import Peer from 'peerjs';
import { useEffect } from 'react';
import {
  getFromSessionStorage,
  saveToSessionStorage,
} from '../lib/session-storage';
import type { Player } from '../types';

const useNewPeerConnection = (roomId?: string | null) => {
  useEffect(() => {
    if (!roomId) return;

    const playerSessionId =
      getFromSessionStorage('playerId') || crypto.randomUUID();

    saveToSessionStorage({ name: 'playerId', value: playerSessionId });

    const peer = new Peer();

    peer.on('open', () => {
      const connection = peer.connect(roomId);

      connection.on('open', () => {
        connection.send({
          type: 'JOIN',
          player: {
            id: playerSessionId,
            name: 'Player 2',
            points: 0,
          } satisfies Player,
        });
      });
    });

    return () => {
      peer.destroy();
    };
  }, [roomId]);
};

export default useNewPeerConnection;
