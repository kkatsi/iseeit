import type { LobbyPlayer } from '../../../lib/lobby-store';

export const PlayerSlot = ({
  player,
  position,
  slotIndex,
}: {
  player: LobbyPlayer;
  position: { x: number; y: number };
  slotIndex: number;
}) => (
  <div
    key={player.id}
    className="absolute transition-all duration-1000"
    style={{
      left: `${position.x}%`,
      top: `${position.y}%`,
      transform: 'translate(-50%, -50%)',
      animation: `float ${3 + slotIndex * 0.5}s ease-in-out infinite`,
    }}
  >
    <div className="absolute inset-0 -m-4 bg-accent/20 rounded-full blur-xl" />

    <div className="relative">
      <div className="absolute left-1/2 -top-8 w-px h-8 bg-linear-to-b from-transparent via-foreground/30 to-foreground/50" />

      <div className="relative bg-card/90 backdrop-blur-sm rounded-2xl p-4 border-2 border-accent/30 shadow-lg min-w-25">
        <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-accent/50 rounded-full" />

        <img
          src={`/avatars/${player.avatarId}.png`}
          alt={player.name}
          className="w-24 h-24 rounded-full border-3 border-accent/20 mx-auto mb-2 object-cover"
        />

        <p
          className="text-center text-foreground text-xl"
          style={{ fontFamily: 'var(--font-handwritten)' }}
        >
          {player.name}
        </p>

        <div className="flex justify-center mt-2">
          <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
        </div>
      </div>

      <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-1 h-4 bg-accent/50 rounded-full" />
    </div>
  </div>
);
