import QRCode from 'react-qr-code';
import useOpenNewPeer from '../hooks/useOpenNewPeer';
import { useStore } from '../store';

const Home = () => {
  const { peer, roomId } = useOpenNewPeer();

  console.log({ peer, roomId });

  const players = useStore((state) => state.players);
  const addPoints = useStore((state) => state.addPointsToPlayer);

  console.log(players.entries());

  if (!roomId) return 'loading...';

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
          value={`https://192.168.1.163:5173/connect?roomId=${roomId}`}
          viewBox={`0 0 256 256`}
        />
        <span>{`https://192.168.1.163:5173/connect?roomId=${roomId}`}</span>
      </div>
      <div>
        {[...players.entries()].map(([key, item]) => (
          <span key={key}>
            {item.name} , Points: {item.points}
          </span>
        ))}
      </div>
      <button onClick={() => addPoints([...players.entries()][0][1].id, 50)}>
        Add points to player 2
      </button>
    </>
  );
};

export default Home;
