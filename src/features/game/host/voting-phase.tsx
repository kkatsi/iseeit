import { useGameStore } from '@/stores/game-store';
import { useEffect, useMemo } from 'react';
import { ClueBanner } from './components/clue-banner';
import { NumberBadge } from './components/number-badge';
import { PlayerSlots } from './components/player-slots';
import { ProgressText } from './components/progress-text';
import { VoterAvatar } from './components/voter-avatar';
import { VOTING_COMPLETE_DELAY_MS } from '@/config/constants';

const VotingPhase = ({ onComplete }: { onComplete: () => void }) => {
  const { clue, tableCards, votes, storytellerId, roundScores } = useGameStore(
    (state) => state.round,
  );
  const playersData = useGameStore((state) => state.playersData);

  const votedCount = votes?.size || 0;
  const totalVoters = playersData.size - 1;
  const allVoted = roundScores !== undefined;

  const voters = useMemo(
    () =>
      [...playersData.entries()]
        .map(([id, data]) => ({
          id,
          name: data.name,
          avatarId: data.avatarId,
          isStoryteller: id === storytellerId,
        }))
        .sort((a, b) =>
          a.isStoryteller === b.isStoryteller ? 0 : a.isStoryteller ? 1 : -1,
        ),
    [playersData, storytellerId],
  );

  useEffect(() => {
    if (allVoted) {
      const timer = setTimeout(async () => {
        if (onComplete) onComplete();
      }, VOTING_COMPLETE_DELAY_MS);
      return () => clearTimeout(timer);
    }
  }, [allVoted, onComplete]);

  return (
    <div
      className="w-full bg-center relative bg-cover flex flex-col items-center justify-center gap-6 px-6"
      style={{
        minHeight: '100vh',
        backgroundImage: "url('/ui/voting-bg.png')",
      }}
    >
      <ClueBanner clue={clue} />

      <ProgressText key={allVoted ? 'complete' : 'voting'}>
        {allVoted
          ? 'All votes are in! The enchanted jury has spoken! Let us unveil the truth...'
          : `${votedCount} of ${totalVoters} adventurers have cast their vote...`}
      </ProgressText>

      {tableCards && (
        <PlayerSlots>
          {tableCards.map((cardUrl, index) => (
            <PlayerSlots.Slot key={cardUrl}>
              <PlayerSlots.Label>{null}</PlayerSlots.Label>
              <PlayerSlots.Card variant="filled">
                <PlayerSlots.CardFace
                  src={cardUrl}
                  alt={`Card ${index + 1}`}
                  skipEntrance
                />
              </PlayerSlots.Card>
              <NumberBadge number={index} />
            </PlayerSlots.Slot>
          ))}
        </PlayerSlots>
      )}

      <div
        className="flex flex-wrap justify-center gap-4"
        style={{ marginTop: '8px' }}
      >
        {voters.map((player) => {
          const hasVoted =
            !player.isStoryteller && (votes?.has(player.id) ?? false);

          return (
            <VoterAvatar
              key={player.id}
              player={player}
              hasVoted={hasVoted}
            />
          );
        })}
      </div>
    </div>
  );
};

export default VotingPhase;
