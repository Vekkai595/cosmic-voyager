export default function GameOverScreen({ score, planet, onRestart, onMenu }) {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center z-10"
         style={{ background: 'radial-gradient(ellipse at center, #1a0505 0%, #050510 70%)' }}>
      
      <div className="text-6xl mb-4">💥</div>
      
      <h2 className="text-3xl sm:text-5xl font-bold tracking-widest mb-3"
          style={{ fontFamily: "'Courier New', monospace", color: '#FF4444', textShadow: '0 0 20px #FF4444, 0 0 40px #880000' }}>
        DESTROYED
      </h2>
      
      <p className="text-sm tracking-[0.2em] mb-2"
         style={{ color: '#886666', fontFamily: "'Courier New', monospace" }}>
        Failed to reach {planet}
      </p>
      
      <div className="my-6 px-6 py-3 rounded"
           style={{ border: '1px solid rgba(255,68,68,0.2)', background: 'rgba(255,68,68,0.05)' }}>
        <p className="text-xs tracking-[0.2em] uppercase"
           style={{ color: '#AA6666', fontFamily: "'Courier New', monospace" }}>
          Distance Score
        </p>
        <p className="text-2xl font-bold mt-1"
           style={{ fontFamily: "'Courier New', monospace", color: '#FF6666' }}>
          {score.toLocaleString()}
        </p>
      </div>

      <div className="flex gap-4 mt-4">
        <button
          onClick={onRestart}
          className="px-6 py-2.5 rounded tracking-[0.2em] uppercase text-xs font-bold transition-all hover:scale-105"
          style={{
            fontFamily: "'Courier New', monospace",
            border: '2px solid #FF4444',
            background: 'transparent',
            color: '#FF4444',
            boxShadow: '0 0 12px rgba(255,68,68,0.2)',
          }}
        >
          Retry
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