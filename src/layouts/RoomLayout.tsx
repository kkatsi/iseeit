import { Outlet, useSearchParams } from 'react-router';
import useConnectPeer from '../hooks/useConnectPeer';

const RoomLayout = () => {
  const [searchParams] = useSearchParams();
  const roomId = searchParams.get('roomId');
  const connect = useConnectPeer(roomId);

  return <Outlet context={{ connect }} />;
};

export default RoomLayout;
