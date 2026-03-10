import { useAnimationControls } from 'framer-motion';
import { useEffect, useState } from 'react';
import { wait } from '../../../utils/wait';

const useLobbyAnimations = (roomId?: string) => {
  const containerControls = useAnimationControls();
  const uiControls = useAnimationControls();
  const [introComplete, setIntroComplete] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

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

  const gameStartTransition = async () => {
    if (isTransitioning) return;
    setIsTransitioning(true);

    await uiControls.start({
      opacity: 0,
      transition: { duration: 1, ease: 'easeInOut' },
    });

    containerControls.start({
      scale: 4,
      opacity: 0,
      transition: { duration: 0.8, ease: 'easeInOut' },
    });

    await wait(600);
  };

  return {
    containerControls,
    uiControls,
    introComplete,
    gameStartTransition,
  };
};

export default useLobbyAnimations;
