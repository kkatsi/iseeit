import type { DataConnection } from 'peerjs';
import type { GameEvent } from '@/schemas/events';

export function sendEvent(connection: DataConnection, event: GameEvent): void {
  connection.send(event);
}
