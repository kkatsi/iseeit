import { Route, Routes } from 'react-router';
import Connect from './features/client-connect/pages/Connect';
import ClientPlay from './pages/Client/Play';
import Lobby from './features/host-lobby/pages/Lobby';
import Game from './pages/Host/Game';
import HostLayout from './layouts/HostLayout';
import ClientLayout from './layouts/ClientLayout';
import AppLayout from './layouts/AppLayout';

function App() {
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
}

export default App;
