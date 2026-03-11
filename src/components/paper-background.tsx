/* eslint-disable react-hooks/purity */

const PaperBackground = () => {
  return (
    <>
      <div
        className="absolute pointer-events-none"
        style={{ top: 0, right: 0, bottom: 0, left: 0 }}
      >
        {[...Array(50)].map((_, i) => (
          <div
            // eslint-disable-next-line react-x/no-array-index-key
            key={i}
            className="absolute w-1 h-1 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 2}s`,
              backgroundColor: 'rgba(45, 42, 38, 0.2)',
            }}
          />
        ))}
      </div>
      <div
        className="absolute opacity-20 pointer-events-none"
        style={{
          top: 0,
          right: 0,
          bottom: 0,
          left: 0,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />
    </>
  );
};

export default PaperBackground;
