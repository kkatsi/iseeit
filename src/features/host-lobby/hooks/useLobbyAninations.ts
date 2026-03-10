import { useAnimationControls } from 'framer-motion';
import { useEffect, useState } from 'react';

const useLobbyAninations = (roomId?: string) => {
  const containerControls = useAnimationControls();
  const uiControls = useAnimationControls();
  const [introComplete, setIntroComplete] = useState(false);

  const isReady = introComplete && !!roomId;

  // Intro: zoom-in & fade-in the castle background on mount
  useEffect(() => {
    containerControls
      .start({
        scale: 1,
        opacity: 1,
        transition: { duration: 1, ease: 'easeOut' },
      })
      .then(() => setIntroComplete(true));
  }, [containerControls]);

  // Reveal UI once both intro is done and roomId is available
  useEffect(() => {
    if (isReady) {
      uiControls.start({
        opacity: 1,
        transition: { duration: 0.8, ease: 'easeInOut' },
      });
    }
  }, [isReady, uiControls]);

  return {
    containerControls,
    uiControls,
    introComplete,
  };
};

export default useLobbyAninations;
