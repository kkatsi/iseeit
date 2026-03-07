import { pluralize } from '../../../utils/pluralize';

export const PlayerCount = ({
  connectedPlayers,
}: {
  connectedPlayers: number;
}) => (
  <div className="absolute top-8 left-8 bg-card/80 backdrop-blur-sm px-4 py-2 rounded-full border border-border">
    <span className="text-foreground">
      <span className="text-2xl font-bold text-primary">
        {connectedPlayers}
      </span>
      <span className="text-muted-foreground text-sm ml-2">
        {pluralize('player', 'players', connectedPlayers)}
      </span>
    </span>
  </div>
);
