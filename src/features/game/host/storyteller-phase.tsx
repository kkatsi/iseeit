import { WaitingScreen } from '@/components/waiting-screen';

const StorytellerPhase = () => {
  return (
    <div
      className="w-full bg-center bg-cover bg-no-repeat"
      style={{
        minHeight: '100vh',
        backgroundImage: "url('/ui/storyteller-phase-bg.png')",
      }}
    >
      <WaitingScreen>Waiting for storyteller's clue...</WaitingScreen>
    </div>
  );
};

export default StorytellerPhase;
