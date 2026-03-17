import useGameOrchestrator from './hooks/use-game-orchestrator';
import { useGameStore } from '@/stores/game-store';
import { LayoutGroup, motion } from 'framer-motion';
import { PlayerResultRow } from './components/player-result-row';
import { usePlayersResults } from './hooks/use-players-results';
import { useResultsPageTimers } from './hooks/use-results-page-timers';

const ResultsPhase = () => {
  const roundNumber = useGameStore((state) => state.round.number);
  const { advanceToNextRound } = useGameOrchestrator();
  const { showPoints, showTotal } = useResultsPageTimers(advanceToNextRound);
  const { topThree, others } = usePlayersResults();

  return (
    <div
      className="w-full bg-center relative bg-cover flex flex-col items-center justify-start py-12 gap-2 px-6"
      style={{
        minHeight: '100vh',
        backgroundImage: "url('/ui/results-bg.png')",
      }}
    >
      <motion.h1
        className="font-sans text-center shrink-0"
        style={{
          fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
          color: 'rgba(60, 45, 20, 1)',
          textShadow: '0 3px 12px rgba(222, 200, 165, 0.85)',
        }}
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      >
        Round {roundNumber} Results
      </motion.h1>

      <LayoutGroup>
        <div className="w-full max-w-6xl flex flex-col gap-8">
          <div className="flex flex-col gap-5 w-full max-w-2xl mx-auto">
            {topThree.map((player, i) => (
              <PlayerResultRow
                key={player.id}
                index={i}
                isTopThree={true}
                player={player}
                showPoints={showPoints}
                showTotal={showTotal}
              />
            ))}
          </div>

          {others.length > 0 && (
            <div
              className="w-full"
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '12px',
                maxWidth: '1100px',
                margin: '0 auto',
              }}
            >
              {others.map((player, i) => (
                <PlayerResultRow
                  key={player.id}
                  index={i + 3}
                  isTopThree={false}
                  player={player}
                  showPoints={showPoints}
                  showTotal={showTotal}
                />
              ))}
            </div>
          )}
        </div>
      </LayoutGroup>
    </div>
  );
};

export default ResultsPhase;
