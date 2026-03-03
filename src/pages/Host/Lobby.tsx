import QRCode from 'react-qr-code';
import { useOutletContext } from 'react-router';
import useStartGame from '../../hooks/useStartGame';
import { useLobbyStore } from '../../lib/lobby-store';
import type { HostOutletContextType } from '../../types';

const Lobby = () => {
  const { roomId } = useOutletContext<HostOutletContextType>();

  const players = useLobbyStore((state) => state.players);
  const startGame = useStartGame();

  if (!roomId) return 'loading...';

  const hasEnoughPlayers = players.size >= 2;

  return (
    <>
      <div
        style={{
          height: 'auto',
          margin: '0 auto',
          maxWidth: 64,
          width: '100%',
        }}
      >
        <QRCode
          size={256}
          style={{ height: 'auto', maxWidth: '100%', width: '100%' }}
          value={`https://192.168.1.163:5173/client/connect?roomId=${roomId}`}
          viewBox={`0 0 256 256`}
        />
        <span>{`https://192.168.1.163:5173/client/connect?roomId=${roomId}`}</span>
      </div>
      <div>
        {[...players.entries()].map(([key, item]) => (
          <span key={key}>{item.name}</span>
        ))}
      </div>
      {hasEnoughPlayers && (
        <button onClick={() => startGame(players)}>Start Game</button>
      )}
    </>
  );
};

export default Lobby;
