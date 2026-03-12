import { pluralize } from '@/utils/pluralize';

export const PlayerCount = ({
  connectedPlayers,
}: {
  connectedPlayers: number;
}) => (
  <div
    className="absolute top-8 left-8 px-5 py-2.5"
    style={{
      backgroundColor: 'rgba(222, 200, 165, 0.85)',
      borderRadius: '10px 8px 12px 6px',
      border: '2px solid rgba(180, 155, 120, 0.5)',
      boxShadow:
        '3px 4px 10px rgba(45, 42, 38, 0.25), inset 0 1px 0 rgba(255, 245, 225, 0.4)',
    }}
  >
    <span className="font-handwritten text-[22px] text-foreground">
      <span className="font-bold text-primary">
        {connectedPlayers}
      </span>{' '}
      {pluralize('adventurer', 'adventurers', connectedPlayers)} gathered
    </span>
  </div>
);
