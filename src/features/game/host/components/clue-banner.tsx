export const ClueBanner = ({ clue }: { clue?: string }) => {
  return (
    <div
      className="text-center px-8 py-4"
      style={{
        backgroundColor: 'rgba(222, 200, 165, 0.9)',
        borderRadius: '12px 8px 14px 6px',
        border: '2px solid rgba(180, 155, 120, 0.5)',
        boxShadow:
          '3px 4px 10px rgba(45, 42, 38, 0.25), inset 0 1px 0 rgba(255, 245, 225, 0.4)',
        maxWidth: '600px',
      }}
    >
      <p
        className="font-handwritten text-lg"
        style={{ color: 'rgba(92, 74, 61, 0.6)' }}
      >
        The clue is...
      </p>
      <p
        className="font-handwritten text-3xl"
        style={{ color: 'rgba(92, 74, 61, 1)' }}
      >
        &ldquo;{clue}&rdquo;
      </p>
    </div>
  );
};
