import { usePlanetConfig } from './useGameEngine';

export default function WinScreen({ score, planet, onRestart, onMenu }) {
  const { PLANET_CONFIG } = usePlanetConfig();
  const color = PLANET_CONFIG[planet]?.color || '#00EEFF';

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center z-10"
         style={{ background: 'radial-gradient(ellipse at center, #0a0a2e 0%, #050510 70%)' }}>
      
      <div className="w-20 h-20 rounded-full mb-6 animate-pulse"
           style={{ background: color, boxShadow: `0 0 40px ${color}, 0 0 80px ${color}` }} />
      
      <h2 className="text-3xl sm:text-5xl font-bold tracking-widest mb-3"
          style={{ fontFamily: "'Courier New', monospace", color, textShadow: `0 0 20px ${color}` }}>
        ARRIVED
      </h2>
      
      <p className="text-sm tracking-[0.2em] mb-2"
         style={{ color: '#88AACC', fontFamily: "'Courier New', monospace" }}>
        Welcome to {planet}
      </p>
      
      <div className="my-6 px-6 py-3 rounded"
           style={{ border: `1px solid rgba(${hexToRgb(color)}, 0.3)`, background: `rgba(${hexToRgb(color)}, 0.05)` }}>
        <p className="text-xs tracking-[0.2em] uppercase"
           style={{ color: '#88AACC', fontFamily: "'Courier New', monospace" }}>
          Final Score
        </p>
        <p className="text-2xl font-bold mt-1"
           style={{ fontFamily: "'Courier New', monospace", color }}>
          {score.toLocaleString()}
        </p>
      </div>

      <div className="flex gap-4 mt-4">
        <button
          onClick={onRestart}
          className="px-6 py-2.5 rounded tracking-[0.2em] uppercase text-xs font-bold transition-all hover:scale-105"
          style={{
            fontFamily: "'Courier New', monospace",
            border: `2px solid ${color}`,
            background: 'transparent',
            color,
            boxShadow: `0 0 12px rgba(${hexToRgb(color)}, 0.3)`,
          }}
        >
          Play Again
        </button>
        <button
          onClick={onMenu}
          className="px-6 py-2.5 rounded tracking-[0.2em] uppercase text-xs font-bold transition-all hover:scale-105"
          style={{
            fontFamily: "'Courier New', monospace",
            border: '2px solid #446688',
            background: 'transparent',
            color: '#446688',
          }}
        >
          Menu
        </button>
      </div>
    </div>
  );
}

function hexToRgb(hex) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `${r},${g},${b}`;
}