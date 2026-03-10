import { Outlet, useSearchParams } from 'react-router';
import useConnectPeer from '../hooks/useConnectPeer';

const ClientLayout = () => {
  const [searchParams] = useSearchParams();
  const roomId = searchParams.get('roomId');
  const { connectToRoom, reconnect } = useConnectPeer(roomId);

  return (
    <Outlet
      context={{
        connectToRoom,
        reconnect,
      }}
    />
  );
};

export default ClientLayout;
