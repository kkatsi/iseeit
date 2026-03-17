import { motion } from 'framer-motion';

type Props = {
  cards: string[];
  selectedCard: string | null;
  onSelect: (card: string) => void;
};

const VoteCardGrid = ({ cards, selectedCard, onSelect }: Props) => {
  return (
    <div className="grid grid-cols-3 gap-3">
      {cards.map((card) => {
        const isSelected = selectedCard === card;

        return (
          <motion.label
            key={card}
            className={`relative cursor-pointer rounded-xl overflow-hidden ${
              isSelected
                ? 'border-3 border-accent shadow-[0_0_12px_var(--accent)]'
                : 'border-2 border-border'
            }`}
            animate={{ scale: isSelected ? 1.05 : 1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          >
            <input
              type="radio"
              name="card"
              value={card}
              checked={isSelected}
              onChange={() => onSelect(card)}
              className="sr-only"
            />
            <img
              src={card}
              alt="Card"
              className="w-full aspect-2/3 object-cover pointer-events-none"
            />
          </motion.label>
        );
      })}
    </div>
  );
};

export default VoteCardGrid;
