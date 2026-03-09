export const Header = () => (
  <header className="relative z-10 shrink-0 p-4 text-center">
    <h1 className="text-7xl text-foreground mb-1 font-handwritten">
      I see it!
    </h1>
    <div className="flex items-center justify-center gap-4">
      <div
        className="h-px w-24"
        style={{
          background:
            'linear-gradient(to right, transparent, var(--border))',
        }}
      />
      <span className="text-2xl text-muted-foreground tracking-widest font-handwritten">
        Gathering Game
      </span>
      <div
        className="h-px w-24"
        style={{
          background:
            'linear-gradient(to left, transparent, var(--border))',
        }}
      />
    </div>
  </header>
);
