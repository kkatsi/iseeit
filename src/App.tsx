import { Route, Routes } from 'react-router';
import Connect from './pages/Room/Connect';
import RoomGame from './pages/Room/Game';

import Home from './pages/Home';
import RoomLayout from './layouts/RoomLayout';
import Game from './pages/HostGame';
import HostLayout from './layouts/HostLayout';

function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={<HostLayout />}
      >
        <Route
          index
          element={<Home />}
        />
        <Route
          path="/host-game"
          element={<Game />}
        />
      </Route>

      <Route
        path="/room"
        element={<RoomLayout />}
      >
        <Route
          path="connect"
          element={<Connect />}
        />
        <Route
          path="game"
          element={<RoomGame />}
        />
      </Route>
    </Routes>
  );
}

export default App;
