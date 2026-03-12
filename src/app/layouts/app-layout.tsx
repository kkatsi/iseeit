import { Outlet } from 'react-router';
// import PaperBackground from '../components/PaperBackground';

const AppLayout = () => {
  return (
    <>
      {/* <PaperBackground /> */}
      <Outlet />
    </>
  );
};

export default AppLayout;
