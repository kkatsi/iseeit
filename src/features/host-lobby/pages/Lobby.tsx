import { useOutletContext } from 'react-router';
import { SLOT_POSITIONS } from '../../../constants';
import useGameOrcestrator from '../../../hooks/useGameOrchestrator';
import { useLobbyStore } from '../../../lib/lobby-store';
import type { HostOutletContextType } from '../../../types';
import { EmptyPlayerSlot } from '../components/EmptyPlayerSlot';
import { Header } from '../components/Header';
import { MysticalElementFlower } from '../components/MysticalElementFlower';
import { PlayerCount } from '../components/PlayerCount';
import { PlayerSlot } from '../components/PlayerSlot';
import { QR } from '../components/QR';
import { StartGameButton } from '../components/StartGameButton';

const Lobby = () => {
  const { roomId } = useOutletContext<HostOutletContextType>();

  const lobbyPlayers = useLobbyStore((state) => state.players);
  const { startGame } = useGameOrcestrator();

  if (!roomId) return 'loading...';

  const hasEnoughPlayers = lobbyPlayers.size >= 2;

  return (
    <div className="w-full h-dvh relative overflow-hidden flex flex-col">
      <Header />
      <div className="flex-1 relative">
        <MysticalElementFlower />
        {SLOT_POSITIONS.map((position, slotIndex) => {
          const player = [...lobbyPlayers.values()].find(
            (p) => p.slotIndex + 1 === slotIndex,
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
        <footer className="p-8 flex justify-center">
          <StartGameButton onClick={() => startGame(lobbyPlayers)} />
        </footer>
      )}
    </div>
  );
};

export default Lobby;
