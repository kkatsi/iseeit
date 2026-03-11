import { Route, Routes } from 'react-router';
import Connect from '@/features/client-connect/pages/connect';
import ClientPlay from '@/features/game/client/play';
import Lobby from '@/features/lobby/pages/lobby';
import Game from '@/features/game/host/game';
import HostLayout from '@/app/layouts/host-layout';
import ClientLayout from '@/app/layouts/client-layout';
import AppLayout from '@/app/layouts/app-layout';

const AppRouter = () => {
  return (
    <Routes>
      <Route
        path="/"
        element={<AppLayout />}
      >
        <Route
          path="/"
          element={<HostLayout />}
        >
          <Route
            index
            element={<Lobby />}
          />
          <Route
            path="/game"
            element={<Game />}
          />
        </Route>

        <Route
          path="/client"
          element={<ClientLayout />}
        >
          <Route
            path="connect"
            element={<Connect />}
          />
          <Route
            path="play"
            element={<ClientPlay />}
          />
        </Route>
      </Route>
    </Routes>
  );
};

export default AppRouter;
