/* eslint-disable @typescript-eslint/no-unused-vars */
import QRCode from 'react-qr-code';
import { useOutletContext } from 'react-router';
import { MAX_PLAYERS, SLOT_POSITIONS } from '../../constants';
import useGameOrcestrator from '../../hooks/useGameOrchestrator';
import { useLobbyStore } from '../../lib/lobby-store';
import type { HostOutletContextType } from '../../types';

const Lobby = () => {
  const { roomId } = useOutletContext<HostOutletContextType>();

  const lobbyPlayers = useLobbyStore((state) => state.players);
  const { startGame } = useGameOrcestrator();

  if (!roomId) return 'loading...';

  const hasEnoughPlayers = lobbyPlayers.size >= 2;

  return (
    // <>
    //   <div
    //     style={{
    //       height: 'auto',
    //       margin: '0 auto',
    //       maxWidth: 64,
    //       width: '100%',
    //     }}
    //   >
    //     <QRCode
    //       size={256}
    //       style={{ height: 'auto', maxWidth: '100%', width: '100%' }}
    //       value={`https://192.168.1.163:5173/client/connect?roomId=${roomId}`}
    //       viewBox={`0 0 256 256`}
    //     />
    //     <span>{`https://192.168.1.163:5173/client/connect?roomId=${roomId}`}</span>
    //   </div>
    //   <div>
    //     {[...players.entries()].map(([key, item]) => (
    //       <span key={key}>{item.name}</span>
    //     ))}
    //   </div>
    //   {hasEnoughPlayers && (
    //     <button onClick={() => startGame(players)}>Start Game</button>
    //   )}
    // </>
    <div className="w-full h-dvh relative overflow-hidden flex flex-col">
      {/* Fixed Player Status Bar */}
      {/* <div className="relative z-20 shrink-0">
        <PlayerStatusBar players={connectedPlayers} />
      </div> */}

      {/* Header - fixed height */}
      <header className="relative z-10 shrink-0 p-4 text-center">
        <h1
          className="text-5xl text-foreground mb-1"
          style={{ fontFamily: 'var(--font-handwritten)' }}
        >
          I see it!
        </h1>
        <div className="flex items-center justify-center gap-4">
          <div className="h-px w-16 bg-linear-to-r from-transparent to-border" />
          <span className="text-xs text-muted-foreground uppercase tracking-[0.3em]">
            Gathering Game
          </span>
          <div className="h-px w-16 bg-linear-to-l from-transparent to-border" />
        </div>
      </header>

      {/* Main content - Floating lanterns around mystical center */}
      <div className="flex-1 relative">
        {/* Central mystical element - Ancient tree silhouette */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-80">
          <svg
            viewBox="0 0 200 250"
            className="w-full h-full text-foreground/10"
          >
            <path
              d="M100,250 L100,150 
                   M100,150 Q60,140 40,100 Q30,70 50,50 Q70,30 100,40
                   M100,150 Q140,140 160,100 Q170,70 150,50 Q130,30 100,40
                   M100,40 Q80,20 100,5 Q120,20 100,40
                   M100,130 Q70,120 60,90
                   M100,130 Q130,120 140,90
                   M100,110 Q85,100 75,70
                   M100,110 Q115,100 125,70"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
            />
          </svg>
          {/* Glowing orb at center */}
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <div className="w-20 h-20 rounded-full bg-accent/30 blur-xl animate-pulse" />
            <div className="absolute inset-0 w-20 h-20 rounded-full bg-accent/20 blur-md" />
          </div>
        </div>

        {/* Slot positions — occupied show lanterns, empty show placeholders */}
        {SLOT_POSITIONS.map((pos, slotIndex) => {
          const player = [...lobbyPlayers.values()].find(
            (p) => p.slotIndex + 1 === slotIndex,
          );

          return player ? (
            <div
              key={player.id}
              className="absolute transition-all duration-1000"
              style={{
                left: `${pos.x}%`,
                top: `${pos.y}%`,
                transform: 'translate(-50%, -50%)',
                animation: `float ${3 + slotIndex * 0.5}s ease-in-out infinite`,
              }}
            >
              {/* Lantern glow */}
              <div className="absolute inset-0 -m-4 bg-accent/20 rounded-full blur-xl" />

              {/* Lantern container */}
              <div className="relative">
                {/* String/rope */}
                <div className="absolute left-1/2 -top-8 w-px h-8 bg-linear-to-b from-transparent via-foreground/30 to-foreground/50" />

                {/* Lantern body */}
                <div className="relative bg-card/90 backdrop-blur-sm rounded-2xl p-4 border-2 border-accent/30 shadow-lg min-w-25">
                  {/* Top ornament */}
                  <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-accent/50 rounded-full" />

                  {/* Avatar */}
                  <div className="text-4xl text-center mb-2">a</div>

                  {/* Name */}
                  <p
                    className="text-center text-foreground text-sm"
                    style={{ fontFamily: 'var(--font-handwritten)' }}
                  >
                    {player.name}
                  </p>

                  {/* Ready indicator */}
                  <div className="flex justify-center mt-2">
                    <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                  </div>
                </div>

                {/* Bottom tassel */}
                <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-1 h-4 bg-accent/50 rounded-full" />
              </div>
            </div>
          ) : (
            <div
              key={`empty-${slotIndex}`}
              className="absolute opacity-60"
              style={{
                left: `${pos.x}%`,
                top: `${pos.y}%`,
                transform: 'translate(-50%, -50%)',
              }}
            >
              <div className="w-16 h-20 border-2 border-dashed border-muted-foreground/30 rounded-2xl flex items-center justify-center">
                <span className="text-2xl text-muted-foreground/30">?</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Room code display - ornate frame */}
      <div className="absolute top-8 right-8">
        <div className="relative bg-card p-6 rounded-lg border-2 border-border">
          {/* Decorative corners */}
          <svg
            className="absolute -top-2 -left-2 w-8 h-8 text-accent"
            viewBox="0 0 32 32"
          >
            <path
              d="M0,16 L0,4 Q0,0 4,0 L16,0"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            />
          </svg>
          <svg
            className="absolute -top-2 -right-2 w-8 h-8 text-accent"
            viewBox="0 0 32 32"
          >
            <path
              d="M32,16 L32,4 Q32,0 28,0 L16,0"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            />
          </svg>
          <svg
            className="absolute -bottom-2 -left-2 w-8 h-8 text-accent"
            viewBox="0 0 32 32"
          >
            <path
              d="M0,16 L0,28 Q0,32 4,32 L16,32"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            />
          </svg>
          <svg
            className="absolute -bottom-2 -right-2 w-8 h-8 text-accent"
            viewBox="0 0 32 32"
          >
            <path
              d="M32,16 L32,28 Q32,32 28,32 L16,32"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            />
          </svg>

          <div className="p-3 bg-card rounded-lg border border-border/50 shadow-inner">
            <QRCode
              size={128}
              style={{ height: 'auto', maxWidth: '100%', width: '100%' }}
              value={`https://192.168.1.68:5173/client/connect?roomId=${roomId}`}
              viewBox={`0 0 128 128`}
              fgColor="var(--primary)"
              bgColor="transparent"
            />
          </div>
          <p
            className="text-4xl text-foreground tracking-[0.3em] text-center"
            style={{ fontFamily: 'var(--font-handwritten)' }}
          >
            Join Game!
          </p>
        </div>
      </div>

      {/* Player count */}
      <div className="absolute top-8 left-8 bg-card/80 backdrop-blur-sm px-4 py-2 rounded-full border border-border">
        <span className="text-foreground">
          <span className="text-2xl font-bold text-primary">
            {lobbyPlayers.size}
          </span>
          <span className="text-muted-foreground text-sm ml-2">
            / {MAX_PLAYERS} travelers
          </span>
        </span>
      </div>

      {/* Start game button */}
      <footer className="p-8 flex justify-center">
        <button className="group relative">
          {/* Glow effect */}
          <div className="absolute inset-0 bg-primary/30 rounded-full blur-xl group-hover:bg-primary/50 transition-colors" />

          <div className="relative bg-primary text-primary-foreground px-12 py-4 rounded-full border-2 border-primary-foreground/20 shadow-lg hover:shadow-xl transition-all hover:scale-105">
            <span
              className="text-xl"
              style={{ fontFamily: 'var(--font-handwritten)' }}
            >
              Begin the Journey
            </span>
          </div>
        </button>
      </footer>
    </div>
  );
};

export default Lobby;
