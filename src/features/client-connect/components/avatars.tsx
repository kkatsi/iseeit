import { avatarIds } from '@/config/constants';

interface AvatarsProps {
  unavailableAvatarIds: string[];
  selectedAvatarId?: string;
  onAvatarSelect: (avatarId: string) => void;
}

const Avatars = ({
  unavailableAvatarIds,
  selectedAvatarId,
  onAvatarSelect,
}: AvatarsProps) => {
  return (
    <fieldset className="grid grid-cols-4 gap-3">
      <legend className="sr-only">Choose your avatar</legend>
      {avatarIds.map((avatarId) => {
        const isMine = selectedAvatarId === avatarId;
        const isTaken = !isMine && unavailableAvatarIds.includes(avatarId);

        return (
          <label
            key={avatarId}
            className={[
              'relative aspect-square rounded-2xl border-3 transition-all duration-200',
              isMine
                ? 'border-primary scale-105 shadow-[0_0_12px_rgba(61,90,71,0.4)]'
                : isTaken
                  ? 'border-border opacity-40 cursor-not-allowed'
                  : 'border-[#c4b99a] bg-[rgba(250,247,240,0.8)] cursor-pointer',
            ].join(' ')}
          >
            <input
              type="radio"
              name="avatarId"
              value={avatarId}
              checked={isMine}
              disabled={isTaken}
              onChange={() => onAvatarSelect(avatarId)}
              className="sr-only"
            />
            <img
              src={`/avatars/${avatarId}.png`}
              alt={avatarId}
              className={[
                'w-full h-full object-cover rounded-xl',
                isTaken ? 'grayscale' : '',
              ].join(' ')}
            />
          </label>
        );
      })}
    </fieldset>
  );
};

export default Avatars;
