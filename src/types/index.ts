export type RoomOutletContextType = {
  connectToRoom: () => Promise<void>;
  reconnect: () => Promise<void>;
  connectionError?: string;
};

export type HostOutletContextType = {
  roomId: string;
};
