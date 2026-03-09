import { motion, useAnimationControls } from 'framer-motion';
import { useState } from 'react';
import { useOutletContext } from 'react-router';
import { SLOT_POSITIONS } from '../../../constants';
import useGameOrcestrator from '../../../hooks/useGameOrchestrator';
import { useLobbyStore } from '../../../lib/lobby-store';
import type { HostOutletContextType } from '../../../types';
import { EmptyPlayerSlot } from '../components/EmptyPlayerSlot';
import { Header } from '../components/Header';
import { PlayerCount } from '../components/PlayerCount';
import { PlayerSlot } from '../components/PlayerSlot';
import { QR } from '../components/QR';
import { StartGameButton } from '../components/StartGameButton';
import { wait } from '../../../utils/wait';

const Lobby = () => {
  const { roomId } = useOutletContext<HostOutletContextType>();

  const lobbyPlayers = useLobbyStore((state) => state.players);
  const { startGame } = useGameOrcestrator();

  const [isTransitioning, setIsTransitioning] = useState(false);
  const containerControls = useAnimationControls();
  const uiControls = useAnimationControls();

  const handleStartGame = async () => {
    if (isTransitioning) return;
    setIsTransitioning(true);

    await uiControls.start({
      opacity: 0,
      transition: { duration: 1, ease: 'easeInOut' },
    });

    containerControls.start({
      scale: 4,
      opacity: 0,
      transition: { duration: 0.8, ease: 'easeInOut' },
    });

    await wait(600);

    startGame(lobbyPlayers);
  };

  if (!roomId) return 'loading...';

  const hasEnoughPlayers = lobbyPlayers.size >= 2;

  return (
    <motion.div
      animate={containerControls}
      className="w-full h-dvh relative overflow-hidden flex flex-col bg-no-repeat bg-cover bg-center"
      style={{ backgroundImage: `url('ui/lobby-bg.jpg')` }}
    >
      <div
        className="z-0 absolute inset-0 w-dvw h-dvh"
        style={{ backgroundColor: 'rgba(245, 240, 230, 0.2)' }}
      />
      <motion.div
        animate={uiControls}
        className="flex flex-col flex-1 relative z-10"
      >
        <Header />
        <div className="flex-1 relative">
          {/* <MysticalElementFlower /> */}
          {SLOT_POSITIONS.map((position, slotIndex) => {
            const player = [...lobbyPlayers.values()].find(
              (p) => p.slotIndex === slotIndex,
            );
            return player ? (
              <PlayerSlot
                key={player.id}
                player={player}
                slotIndex={slotIndex}
                position={position}
              />
            ) : (
              <EmptyPlayerSlot
                // eslint-disable-next-line react-x/no-array-index-key
                key={slotIndex}
                position={position}
                slotIndex={slotIndex}
              />
            );
          })}
        </div>
        <QR roomId={roomId} />
        <PlayerCount connectedPlayers={lobbyPlayers.size} />
        {hasEnoughPlayers && (
          <footer className="p-8 flex justify-center fixed bottom-0 left-0 w-dvw">
            <StartGameButton onClick={handleStartGame} />
          </footer>
        )}
      </motion.div>
    </motion.div>
  );
};

export default Lobby;
