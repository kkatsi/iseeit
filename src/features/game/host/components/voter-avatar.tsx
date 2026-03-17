import { AnimatePresence, motion } from 'framer-motion';

export const VoterAvatar = ({
  player,
  hasVoted,
}: {
  hasVoted: boolean;
  player: {
    id: string;
    name: string;
    avatarId: string;
    isStoryteller: boolean;
  };
}) => {
  return (
    <div
      key={player.id}
      className="flex flex-col items-center gap-1"
    >
      <div className="relative">
        <img
          src={`/avatars/${player.avatarId}.png`}
          alt={player.name}
          className="w-12 h-12 rounded-full object-cover"
          style={{
            border: player.isStoryteller
              ? '2px solid rgb(61, 90, 71)'
              : '2px solid rgba(180, 155, 120, 0.6)',
            boxShadow: 'inset 0 0 6px rgba(120, 90, 50, 0.15)',
          }}
        />
        <AnimatePresence>
          {player.isStoryteller ? (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{
                type: 'spring',
                stiffness: 300,
                damping: 15,
              }}
              className="absolute -bottom-1 -right-1 flex items-center justify-center rounded-full"
              style={{
                width: '20px',
                height: '20px',
                backgroundColor: 'rgb(196, 147, 122)',
                color: 'white',
                fontSize: '12px',
                lineHeight: 1,
              }}
            >
              S
            </motion.div>
          ) : (
            hasVoted && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{
                  type: 'spring',
                  stiffness: 300,
                  damping: 15,
                }}
                className="absolute -bottom-1 -right-1 flex items-center justify-center rounded-full"
                style={{
                  width: '20px',
                  height: '20px',
                  backgroundColor: 'rgba(61, 90, 71, 0.9)',
                  color: 'white',
                  fontSize: '12px',
                  lineHeight: 1,
                }}
              >
                ✓
              </motion.div>
            )
          )}
        </AnimatePresence>
      </div>
      <p
        className="font-handwritten text-sm text-center"
        style={{ color: 'rgba(92, 74, 61, 0.8)' }}
      >
        {player.name}
      </p>
    </div>
  );
};
