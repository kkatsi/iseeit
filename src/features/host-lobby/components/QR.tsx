import QRCode from 'react-qr-code';

export const QR = ({ roomId }: { roomId: string }) => (
  <div
    onClick={() => {
      navigator.clipboard.writeText(
        `https://192.168.1.163:5173/client/connect?roomId=${roomId}`,
      );
    }}
    className="absolute top-8 right-8 p-5 text-center cursor-pointer z-20"
    style={{
      backgroundColor: 'rgba(222, 200, 165, 0.88)',
      borderRadius: '12px 8px 14px 6px',
      border: '2px solid rgba(180, 155, 120, 0.5)',
      boxShadow:
        '3px 4px 10px rgba(45, 42, 38, 0.25), inset 0 1px 0 rgba(255, 245, 225, 0.4)',
    }}
  >
    <QRCode
      size={120}
      style={{ height: 'auto', maxWidth: '100%', width: '100%' }}
      value={`https://192.168.1.163:5173/client/connect?roomId=${roomId}`}
      viewBox="0 0 100 100"
      fgColor="#3d5a47"
      bgColor="transparent"
    />
    <p className="mt-2 font-handwritten text-lg text-foreground">
      Scan to Join
    </p>
  </div>
);
