import QRCode from 'react-qr-code';
import useOpenNewPeer from './hooks/useOpenNewPeer';
import { Route, Routes } from 'react-router';
import Home from './pages/Home';
import Connect from './pages/Connect';

function App() {
  return (
    <Routes>
      <Route
        index
        element={<Home />}
      />
      <Route
        path="/connect"
        element={<Connect />}
      />
    </Routes>
  );
}

export default App;
