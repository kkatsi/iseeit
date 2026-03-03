export type RoomOutletContextType = {
  connect: (name: string) => Promise<void>;
};

export type HostOutletContextType = {
  roomId: string;
};
