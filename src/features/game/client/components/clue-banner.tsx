export const ClueBanner = ({ clue }: { clue?: string }) => {
  return (
    <div className="shrink-0 text-center px-6 pt-8 pb-4">
      <p className="text-muted-foreground font-serif text-sm tracking-wide">
        The clue is...
      </p>
      <p className="font-handwritten text-2xl text-foreground mt-1">
        &ldquo;{clue}&rdquo;
      </p>
    </div>
  );
};
