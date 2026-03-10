export type RoomOutletContextType = {
  connectToRoom: () => Promise<void>;
  reconnect: () => Promise<void>;
};

export type HostOutletContextType = {
  roomId: string;
};
