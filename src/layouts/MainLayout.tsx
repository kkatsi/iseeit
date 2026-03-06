import { Outlet } from 'react-router';
import PaperBackground from '../components/PaperBackground';

const MainLayout = () => {
  return (
    <>
      <PaperBackground />
      <Outlet />
    </>
  );
};

export default MainLayout;
