export const Header = () => (
  <header className="relative z-10 shrink-0 p-4 text-center">
    <h1
      className="text-5xl text-foreground mb-1"
      style={{ fontFamily: 'var(--font-handwritten)' }}
    >
      I see it!
    </h1>
    <div className="flex items-center justify-center gap-4">
      <div className="h-px w-16 bg-linear-to-r from-transparent to-border" />
      <span className="text-xs text-muted-foreground uppercase tracking-[0.3em]">
        Gathering Game
      </span>
      <div className="h-px w-16 bg-linear-to-l from-transparent to-border" />
    </div>
  </header>
);
