import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useMemo } from 'react';
import { useOutletContext } from 'react-router';
import { avatarIds, SLOT_POSITIONS } from '@/config/constants';
import useGameOrchestrator from '@/features/game/host/hooks/use-game-orchestrator';
import { useLobbyStore } from '@/stores/lobby-store';
import type { HostOutletContextType } from '@/types';
import { EmptyPlayerSlot } from '../components/empty-player-slot';
import { Header } from '../components/header';
import Loader from '../components/loader';
import { PendingPlayerSlot } from '../components/pending-player-slot';
import { PlayerCount } from '../components/player-count';
import { PlayerSlot } from '../components/player-slot';
import { QR } from '../components/qr';
import { StartGameButton } from '../components/start-game-button';
import useLobbyAnimations from '../hooks/use-lobby-animations';
import { preloadRoute } from '@/utils/preload-route';

const Lobby = () => {
  const { roomId } = useOutletContext<HostOutletContextType>();

  const lobbyPlayers = useLobbyStore((state) => state.players);
  const { startGame } = useGameOrchestrator();

  const { containerControls, introComplete, gameStartTransition, uiControls } =
    useLobbyAnimations(roomId);

  const readyPlayers = useMemo(
    () => [...lobbyPlayers.values()].filter((p) => p.status === 'ready'),
    [lobbyPlayers],
  );

  useEffect(() => {
    if (readyPlayers.length > 0) preloadRoute('game');
  }, [readyPlayers.length]);

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
      style={{ backgroundImage: `url('ui/lobby-bg.png')` }}
    >
      <div
        className="absolute top-0 left-0 w-full z-1 pointer-events-none h-[200px]"
        style={{
          background:
            'linear-gradient(to bottom, rgba(255, 255, 255, 0.7), rgba(255, 255, 255, 0))',
        }}
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
