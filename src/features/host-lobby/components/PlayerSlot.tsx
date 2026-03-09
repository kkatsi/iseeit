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
    <div
      className="relative p-4 min-w-30 text-center"
      style={{
        backgroundColor: 'rgba(222, 200, 165, 0.88)',
        borderRadius: '12px 8px 14px 6px',
        border: '2px solid rgba(180, 155, 120, 0.5)',
        boxShadow:
          '3px 4px 10px rgba(45, 42, 38, 0.25), inset 0 1px 0 rgba(255, 245, 225, 0.4)',
        transform: `rotate(${(slotIndex % 2 === 0 ? -1 : 1) * (1 + slotIndex * 0.3)}deg)`,
      }}
    >
      {/* Wax seal accent */}
      <div
        className="absolute w-6 h-6 rounded-full -top-2 -right-1.5"
        style={{
          backgroundColor: 'rgba(139, 69, 55, 0.75)',
          boxShadow: 'inset 0 -2px 4px rgba(0,0,0,0.2), 0 1px 3px rgba(0,0,0,0.15)',
        }}
      />
      <img
        src={`/avatars/${player.avatarId}.png`}
        alt={player.name}
        className="mx-auto mb-2 object-cover w-28 h-28 rounded-full"
        style={{
          border: '3px solid rgba(180, 155, 120, 0.6)',
          boxShadow: 'inset 0 0 8px rgba(120, 90, 50, 0.15)',
        }}
      />

      <p className="font-handwritten text-xl text-foreground">
        {player.name}
      </p>
    </div>
  </div>
);
