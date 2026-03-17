import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useGameStore } from '@/stores/game-store';
import { ordinal } from '@/utils/ordinal';

const ResultsPhase = () => {
  const playerId = useGameStore((state) => state.connectedPlayerId);
  const playersData = useGameStore((state) => state.playersData);
  const { roundScores, number: roundNumber } = useGameStore(
    (state) => state.round,
  );

  const playerData = playersData.get(playerId);
  const roundPoints = roundScores?.get(playerId) ?? 0;
  const totalScore = playerData?.score ?? 0;
  const previousScore = totalScore - roundPoints;

  const { previousRank, currentRank } = useMemo(() => {
    const entries = Array.from(playersData.entries()).map(([id, data]) => {
      const pts = roundScores?.get(id) ?? 0;
      return { id, previousScore: data.score - pts, totalScore: data.score };
    });

    const byPrevious = [...entries].sort(
      (a, b) => b.previousScore - a.previousScore,
    );
    const byTotal = [...entries].sort((a, b) => b.totalScore - a.totalScore);

    return {
      previousRank:
        byPrevious.findIndex((p) => p.id === playerId) + 1 || entries.length,
      currentRank:
        byTotal.findIndex((p) => p.id === playerId) + 1 || entries.length,
    };
  }, [playersData, roundScores, playerId]);

  const rankDelta = previousRank - currentRank;

  if (!playerData) return null;

  return (
    <div className="w-full min-h-dvh flex flex-col items-center justify-center gap-6 px-6 bg-linear-to-b from-amber-50 to-orange-50">
      {/* Header */}
      <motion.h1
        className="font-handwritten text-3xl text-amber-900/80"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        Round {roundNumber} Results
      </motion.h1>

      {/* Avatar */}
      <motion.div
        className="rounded-full overflow-hidden border-4 border-amber-300/60 shadow-lg"
        style={{ width: 96, height: 96 }}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2, type: 'spring', stiffness: 200, damping: 15 }}
      >
        <img
          src={`/avatars/${playerData.avatarId}.png`}
          alt={playerData.name}
          className="w-full h-full object-cover"
        />
      </motion.div>

      {/* Name */}
      <motion.span
        className="font-serif text-xl text-amber-900"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        {playerData.name}
      </motion.span>

      {/* Score change */}
      <motion.div
        className="flex flex-col items-center gap-1"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.45 }}
      >
        <div className="flex items-center gap-3 font-handwritten text-4xl text-amber-900">
          <span className="opacity-60">{previousScore}</span>
          <span className="text-2xl opacity-40">&rarr;</span>
          <span>{totalScore}</span>
        </div>
        {roundPoints > 0 && (
          <span className="font-handwritten text-xl text-emerald-700">
            +{roundPoints} pts
          </span>
        )}
        {roundPoints === 0 && (
          <span className="font-handwritten text-lg text-amber-700/60">
            no points this round
          </span>
        )}
      </motion.div>

      {/* Rank movement */}
      <motion.div
        className="flex flex-col items-center gap-1"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        {rankDelta > 0 ? (
          <>
            <span className="font-handwritten text-lg text-emerald-700">
              You moved up!
            </span>
            <span className="font-serif text-amber-800">
              {ordinal(previousRank)} &rarr; {ordinal(currentRank)}
            </span>
          </>
        ) : rankDelta < 0 ? (
          <>
            <span className="font-handwritten text-lg text-red-700/70">
              You slipped down
            </span>
            <span className="font-serif text-amber-800">
              {ordinal(previousRank)} &rarr; {ordinal(currentRank)}
            </span>
          </>
        ) : (
          <span className="font-handwritten text-lg text-amber-700/70">
            Holding steady at {ordinal(currentRank)}
          </span>
        )}
      </motion.div>
    </div>
  );
};

export default ResultsPhase;
