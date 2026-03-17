import { Outlet } from 'react-router';
import useOpenPeer from './use-open-peer';

const HostLayout = () => {
  const roomId = useOpenPeer();

  return (
      <Outlet context={{ roomId }} />
  );
};

export default HostLayout;
