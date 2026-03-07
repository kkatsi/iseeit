export const EmptyPlayerSlot = ({
  position,
  slotIndex,
}: {
  slotIndex: number;
  position: { x: number; y: number };
}) => (
  <div
    key={`empty-${slotIndex}`}
    className="absolute opacity-60"
    style={{
      left: `${position.x}%`,
      top: `${position.y}%`,
      transform: 'translate(-50%, -50%)',
    }}
  >
    <div className="w-16 h-20 border-2 border-dashed border-muted-foreground/30 rounded-2xl flex items-center justify-center">
      <span className="text-2xl text-muted-foreground/30">?</span>
    </div>
  </div>
);
