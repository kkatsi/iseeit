import { useState } from 'react';
import { useOutletContext } from 'react-router';
import type { RoomOutletContextType } from '../../../types';
import { usePeerStore } from '../../../lib/peer-store';
import { useClientConnect } from '../hooks/useClientConnect';
import Avatars from '../components/Avatars';

const Connect = () => {
  const { connectToRoom, reconnect } =
    useOutletContext<RoomOutletContextType>();

  const playerId = usePeerStore((state) => state.localPlayerId);
  const connection = usePeerStore((state) =>
    playerId ? state.connections.get(playerId) : undefined,
  );

  const {
    handleAvatarTap,
    unavailableAvatarIds,
    selectedAvatarId,
    isLoading,
    submitAction,
    shouldReconnect,
  } = useClientConnect(connectToRoom, reconnect, connection, playerId);
  const [name, setName] = useState('');

  if (shouldReconnect) {
    return (
      <div className="min-h-dvh flex items-center justify-center bg-background">
        <p className="font-handwritten text-2xl text-foreground">
          Returning to the tale...
        </p>
      </div>
    );
  }

  if (!connection) {
    return (
      <div className="min-h-dvh flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="mx-auto mb-4 w-10 h-10 rounded-full border-4 border-[rgba(61,90,71,0.2)] border-t-[rgba(61,90,71,0.8)] animate-spin" />
          <p className="font-handwritten text-2xl text-foreground">
            Entering the realm...
          </p>
        </div>
      </div>
    );
  }

  // if (isFinalized) {
  //   return (
  //     <div className="min-h-dvh flex flex-col items-center justify-center gap-6 bg-background p-6">
  //       <img
  //         src={`/avatars/${selectedAvatarId}.png`}
  //         alt="Your avatar"
  //         className="w-28 h-28 rounded-full border-4 border-primary object-cover"
  //       />
  //       <p className="font-handwritten text-3xl text-foreground">{name}</p>
  //       <p className="font-handwritten text-xl text-muted-foreground animate-pulse">
  //         Waiting for the host to begin...
  //       </p>
  //     </div>
  //   );
  // }

  return (
    <div className="min-h-dvh bg-background p-6 flex flex-col">
      <h1 className="font-handwritten text-3xl text-foreground text-center mb-2">
        Choose Your Character
      </h1>
      <p className="text-center text-muted-foreground text-sm mb-6">
        Pick a name and an avatar to join the adventure
      </p>

      <form
        action={submitAction}
        className="flex flex-col flex-1 gap-6"
      >
        <input
          type="text"
          name="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="What shall we call you?"
          maxLength={16}
          required
          className="w-full px-4 py-3 rounded-xl border-2 border-border bg-card text-foreground font-serif text-lg placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary transition-colors"
        />

        <Avatars
          unavailableAvatarIds={unavailableAvatarIds}
          selectedAvatarId={selectedAvatarId}
          onAvatarSelect={handleAvatarTap}
        />

        {/* Submit */}
        <button
          type="submit"
          disabled={isLoading || !selectedAvatarId}
          className="mt-auto w-full py-4 rounded-full font-handwritten text-2xl text-primary-foreground bg-primary disabled:opacity-40 transition-opacity cursor-pointer"
        >
          Enter the Tale
        </button>
      </form>
    </div>
  );
};

export default Connect;
