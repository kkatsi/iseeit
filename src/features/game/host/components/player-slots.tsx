import { motion } from 'framer-motion';
import type { PropsWithChildren, ReactNode } from 'react';

const Grid = ({ children, exit }: PropsWithChildren<{ exit?: boolean }>) => (
  <motion.div
    className="flex flex-wrap justify-center gap-6"
    style={{ maxWidth: '960px' }}
    exit={exit ? { opacity: 0 } : undefined}
    transition={exit ? { duration: 0.3 } : undefined}
  >
    {children}
  </motion.div>
);

const Slot = ({ children }: PropsWithChildren) => (
  <div
    className="flex flex-col items-center gap-2"
    style={{ width: '112px' }}
  >
    {children}
  </div>
);

const Label = ({ children }: PropsWithChildren) =>
  children ? (
    <p className="font-handwritten text-base text-primary font-bold">
      {children}
    </p>
  ) : (
    <div style={{ height: '24px' }} />
  );

type CardVariant = 'filled' | 'empty';

const Card = ({
  variant = 'filled',
  children,
}: {
  variant?: CardVariant;
  children?: ReactNode;
}) => {
  const isFilled = variant === 'filled';
  return (
    <div
      className="relative h-48 aspect-2/3 rounded-lg overflow-hidden"
      style={{
        backgroundColor: isFilled
          ? 'rgba(222, 200, 165, 0.88)'
          : 'rgba(222, 200, 165, 0.4)',
        borderRadius: '12px 8px 14px 6px',
        border: isFilled
          ? '2px solid rgba(180, 155, 120, 0.5)'
          : '2px dashed rgba(180, 155, 120, 0.5)',
        boxShadow: isFilled
          ? '3px 4px 10px rgba(45, 42, 38, 0.25), inset 0 1px 0 rgba(255, 245, 225, 0.4)'
          : 'none',
      }}
    >
      {children}
    </div>
  );
};

const CardBack = ({
  id,
  skipEntrance,
}: {
  id: string;
  skipEntrance?: boolean;
}) => (
  <motion.img
    key={`card-${id}`}
    src="/cards/card-back.png"
    alt="Submitted card"
    className="w-full h-full object-cover"
    initial={skipEntrance ? false : { y: '100%', opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    exit={{ scale: 0.3, opacity: 0, y: 20 }}
    transition={{
      type: 'spring',
      stiffness: 180,
      damping: 18,
    }}
  />
);

const CardFace = ({ src, alt }: { src: string; alt: string }) => (
  <motion.img
    src={src}
    alt={alt}
    className="w-full h-full object-cover"
    initial={{ y: '100%', opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    transition={{
      type: 'spring',
      stiffness: 180,
      damping: 18,
    }}
  />
);

const CardEmpty = () => (
  <motion.div
    className="w-full h-full flex items-center justify-center"
    animate={{ opacity: [0.4, 0.7, 0.4] }}
    transition={{
      duration: 3,
      repeat: Infinity,
      ease: 'easeInOut',
    }}
  >
    <span
      className="font-handwritten text-3xl"
      style={{ color: 'rgba(180, 155, 120, 0.6)' }}
    >
      ?
    </span>
  </motion.div>
);

const Avatar = ({
  src,
  name,
  alt,
  isStoryteller,
}: {
  src: string;
  name: string;
  alt: string;
  isStoryteller?: boolean;
}) => (
  <>
    <img
      src={src}
      alt={alt}
      className="w-12 h-12 rounded-full object-cover"
      style={{
        border: isStoryteller
          ? '2px solid rgb(61, 90, 71)'
          : '2px solid rgba(180, 155, 120, 0.6)',
        boxShadow: 'inset 0 0 6px rgba(120, 90, 50, 0.15)',
      }}
    />
    <p
      className="font-handwritten text-lg text-center"
      style={{ color: 'rgba(92, 74, 61, 0.9)' }}
    >
      {name}
    </p>
  </>
);

export const PlayerSlots = Object.assign(Grid, {
  Slot,
  Label,
  Card,
  CardBack,
  CardFace,
  CardEmpty,
  Avatar,
});
