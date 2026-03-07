import QRCode from 'react-qr-code';

export const QR = ({ roomId }: { roomId: string }) => (
  <div className="absolute top-8 right-8">
    <div className="relative bg-card p-6 rounded-lg border-2 border-border">
      {/* Decorative corners */}
      <svg
        className="absolute -top-2 -left-2 w-8 h-8 text-accent"
        viewBox="0 0 32 32"
      >
        <path
          d="M0,16 L0,4 Q0,0 4,0 L16,0"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        />
      </svg>
      <svg
        className="absolute -top-2 -right-2 w-8 h-8 text-accent"
        viewBox="0 0 32 32"
      >
        <path
          d="M32,16 L32,4 Q32,0 28,0 L16,0"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        />
      </svg>
      <svg
        className="absolute -bottom-2 -left-2 w-8 h-8 text-accent"
        viewBox="0 0 32 32"
      >
        <path
          d="M0,16 L0,28 Q0,32 4,32 L16,32"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        />
      </svg>
      <svg
        className="absolute -bottom-2 -right-2 w-8 h-8 text-accent"
        viewBox="0 0 32 32"
      >
        <path
          d="M32,16 L32,28 Q32,32 28,32 L16,32"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        />
      </svg>

      <div
        className="p-3 bg-card rounded-lg border border-border/50 shadow-inner"
        onClick={() => {
          navigator.clipboard.writeText(
            `https://192.168.1.68:5173/client/connect?roomId=${roomId}`,
          );
        }}
      >
        <QRCode
          size={100}
          style={{ height: 'auto', maxWidth: '100%', width: '100%' }}
          value={`https://192.168.1.68:5173/client/connect?roomId=${roomId}`}
          viewBox={`0 0 100 100`}
          fgColor="var(--primary)"
          bgColor="transparent"
        />
      </div>
      <p
        className="text-4xl text-foreground tracking-[0.3em] text-center"
        style={{ fontFamily: 'var(--font-handwritten)' }}
      >
        Join Game!
      </p>
    </div>
  </div>
);
