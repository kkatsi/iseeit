import { Outlet } from 'react-router';
import useOpenPeer from '../hooks/useOpenPeer';

const HostLayout = () => {
  const roomId = useOpenPeer();

  return <Outlet context={{ roomId }} />;
};

export default HostLayout;
