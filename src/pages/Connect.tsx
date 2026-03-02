import useNewPeerConnection from '../hooks/useNewPeerConnection';
import { useSearchParams } from 'react-router';

const Connect = () => {
  const [searchParams] = useSearchParams();
  const roomId = searchParams.get('roomId');
  useNewPeerConnection(roomId);

  return <div>Connect</div>;
};

export default Connect;
