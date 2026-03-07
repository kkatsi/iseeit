export const StartGameButton = ({ onClick }: { onClick: () => void }) => (
  <button
    className="group relative"
    onClick={onClick}
  >
    {/* Glow effect */}
    <div className="absolute inset-0 bg-primary/30 rounded-full blur-xl group-hover:bg-primary/50 transition-colors" />

    <div className="relative bg-primary text-primary-foreground px-12 py-4 rounded-full border-2 border-primary-foreground/20 shadow-lg hover:shadow-xl transition-all hover:scale-105">
      <span
        className="text-xl"
        style={{ fontFamily: 'var(--font-handwritten)' }}
      >
        Begin the Journey
      </span>
    </div>
  </button>
);
