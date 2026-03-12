import { Outlet, useSearchParams } from 'react-router';
import useConnectPeer from '@/hooks/use-connect-peer';

const ClientLayout = () => {
  const [searchParams] = useSearchParams();
  const roomId = searchParams.get('roomId');
  const { connectToRoom, reconnect, connectionError } = useConnectPeer(roomId);

  return (
    <Outlet
      context={{
        connectToRoom,
        reconnect,
        connectionError,
      }}
    />
  );
};

export default ClientLayout;
