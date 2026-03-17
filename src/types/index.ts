export type RoomOutletContextType = {
  connectToRoom: () => Promise<void>;
  reconnect: () => Promise<void>;
  connectionError?: string;
};

export type HostOutletContextType = {
  roomId: string;
};

export interface PlayerScore {
  id: string;
  name: string;
  avatarId: string;
  previousScore: number;
  roundPoints: number;
  totalScore: number;
}
