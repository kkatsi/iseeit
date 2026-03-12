import { type PropsWithChildren } from 'react';

const Announcement = ({ children }: PropsWithChildren) => {
  return (
    <div className="min-h-dvh flex items-center justify-center bg-background">
      <div className="text-center">
        <div className="mx-auto mb-4 w-10 h-10 rounded-full border-4 border-[rgba(61,90,71,0.2)] border-t-[rgba(61,90,71,0.8)] animate-spin" />
        <p className="font-handwritten text-2xl text-foreground">{children}</p>
      </div>
    </div>
  );
};

export default Announcement;
