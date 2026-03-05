export type RoomOutletContextType = {
  connect: (name: string) => Promise<void>;
  reconnect: () => Promise<void>;
};

export type HostOutletContextType = {
  roomId: string;
};
