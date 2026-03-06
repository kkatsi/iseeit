import { Route, Routes } from 'react-router';
import Connect from './pages/Client/Connect';
import ClientPlay from './pages/Client/Play';
import Lobby from './pages/Host/Lobby';
import Game from './pages/Host/Game';
import HostLayout from './layouts/HostLayout';
import ClientLayout from './layouts/ClientLayout';
import MainLayout from './layouts/MainLayout';

function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={<MainLayout />}
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
