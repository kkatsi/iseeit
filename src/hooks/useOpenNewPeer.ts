import Peer from 'peerjs';
import { useEffect, useRef, useState } from 'react';
import { useStore } from '../store';
import type { Player } from '../types';

const useOpenNewPeer = () => {
  const ref = useRef<Peer>(undefined);
  const [roomId, setRoomId] = useState<string>();

  const addPlayer = useStore((state) => state.addPlayer);
  const removePlayer = useStore((state) => state.removePlayer);

  useEffect(() => {
    const peer = new Peer();

    ref.current = peer;

    peer.on('open', (id) => {
      setRoomId(id);
    });

    peer.on('connection', (conn) => {
      conn.on('data', (data) => {
        const d = data as unknown as { type: 'JOIN' };

        switch (d.type) {
          case 'JOIN':
            const joinData = d as { type: 'JOIN'; player: Player };
            addPlayer(joinData.player);
            break;
          default:
            break;
        }
      });
      conn.on('close', () => {
        removePlayer(conn.connectionId);
      });
    });

    return () => {
      peer.destroy();
    };
  }, []);

  return { peer: ref.current, roomId };
};

export default useOpenNewPeer;
