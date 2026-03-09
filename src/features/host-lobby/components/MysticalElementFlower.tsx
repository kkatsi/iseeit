export const MysticalElementFlower = () => (
  <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-80">
    <svg
      viewBox="0 0 200 250"
      className="w-full h-full"
      style={{ color: 'rgba(45, 42, 38, 0.1)' }}
    >
      <path
        d="M100,250 L100,150
                   M100,150 Q60,140 40,100 Q30,70 50,50 Q70,30 100,40
                   M100,150 Q140,140 160,100 Q170,70 150,50 Q130,30 100,40
                   M100,40 Q80,20 100,5 Q120,20 100,40
                   M100,130 Q70,120 60,90
                   M100,130 Q130,120 140,90
                   M100,110 Q85,100 75,70
                   M100,110 Q115,100 125,70"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
    <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2">
      <div
        className="w-20 h-20 rounded-full animate-pulse"
        style={{ backgroundColor: 'rgba(196, 147, 122, 0.15)' }}
      />
    </div>
  </div>
);
