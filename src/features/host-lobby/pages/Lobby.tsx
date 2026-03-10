import { AnimatePresence, motion } from 'framer-motion';
import { useMemo } from 'react';
import { useOutletContext } from 'react-router';
import { avatarIds, SLOT_POSITIONS } from '../../../constants';
import useGameOrcestrator from '../../../hooks/useGameOrchestrator';
import { useLobbyStore } from '../../../lib/lobby-store';
import type { HostOutletContextType } from '../../../types';
import { EmptyPlayerSlot } from '../components/EmptyPlayerSlot';
import { Header } from '../components/Header';
import Loader from '../components/Loader';
import { PendingPlayerSlot } from '../components/PendingPlayerSlot';
import { PlayerCount } from '../components/PlayerCount';
import { PlayerSlot } from '../components/PlayerSlot';
import { QR } from '../components/QR';
import { StartGameButton } from '../components/StartGameButton';
import useLobbyAnimations from '../hooks/useLobbyAnimations';

const Lobby = () => {
  const { roomId } = useOutletContext<HostOutletContextType>();

  const lobbyPlayers = useLobbyStore((state) => state.players);
  const { startGame } = useGameOrcestrator();

  const { containerControls, introComplete, gameStartTransition, uiControls } =
    useLobbyAnimations(roomId);

  const readyPlayers = useMemo(
    () => [...lobbyPlayers.values()].filter((p) => p.status === 'ready'),
    [lobbyPlayers],
  );

  const handleStartGame = async () => {
    await gameStartTransition();

    const readyMap = new Map(readyPlayers.map((p) => [p.id, p]));
    startGame(readyMap);
  };

  const hasEnoughPlayers = roomId ? readyPlayers.length >= 2 : false;

  return (
    <motion.div
      initial={{ scale: 1.3, opacity: 0 }}
      animate={containerControls}
      className="w-full h-dvh relative overflow-hidden flex flex-col bg-no-repeat bg-cover bg-center"
      style={{ backgroundImage: `url('ui/lobby-bg.jpg')` }}
    >
      <div
        className="z-0 absolute inset-0 w-dvw h-dvh"
        style={{ backgroundColor: 'rgba(245, 240, 230, 0.2)' }}
      />

      <AnimatePresence>
        {introComplete && !roomId && <Loader />}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0 }}
        animate={uiControls}
        className="flex flex-col flex-1 relative z-10"
      >
        {roomId && (
          <>
            <Header />
            <div className="flex-1 relative">
              {SLOT_POSITIONS.map((position, slotIndex) => {
                const player = [...lobbyPlayers.values()].find(
                  (p) => avatarIds.indexOf(p.avatarId) === slotIndex,
                );

                if (player?.status === 'ready') {
                  return (
                    <PlayerSlot
                      key={player.id}
                      player={player}
                      slotIndex={slotIndex}
                      position={position}
                    />
                  );
                }

                if (player?.status === 'pending') {
                  return (
                    <PendingPlayerSlot
                      key={player.id}
                      player={player}
                      slotIndex={slotIndex}
                      position={position}
                    />
                  );
                }

                return (
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
            <PlayerCount connectedPlayers={readyPlayers.length} />
            {hasEnoughPlayers && (
              <footer className="p-8 flex justify-center fixed bottom-0 left-0 w-dvw">
                <StartGameButton onClick={handleStartGame} />
              </footer>
            )}
          </>
        )}
      </motion.div>
    </motion.div>
  );
};

export default Lobby;
