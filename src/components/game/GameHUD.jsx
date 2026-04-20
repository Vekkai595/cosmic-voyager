export default function GameHUD({ progress, score, statusMsg, planet }) {
  return (
    <div className="absolute top-0 left-0 right-0 z-10 px-4 pt-3 pointer-events-none">
      {/* Top bar */}
      <div className="flex items-center justify-between mb-2">
        <div style={{ fontFamily: "'Courier New', monospace" }}>
          <span className="text-[10px] tracking-[0.15em] uppercase" style={{ color: '#4488AA' }}>
            Score
          </span>
          <span className="ml-2 text-sm font-bold" style={{ color: '#00EEFF' }}>
            {score.toLocaleString()}
          </span>
        </div>
        <div style={{ fontFamily: "'Courier New', monospace" }}>
          <span className="text-[10px] tracking-[0.15em] uppercase" style={{ color: '#4488AA' }}>
            Dest
          </span>
          <span className="ml-2 text-sm font-bold" style={{ color: '#88CCFF' }}>
            {planet}
          </span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="w-full h-2 rounded-full overflow-hidden"
           style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(0,238,255,0.15)' }}>
        <div
          className="h-full rounded-full transition-all duration-300"
          style={{
            width: `${Math.round(progress * 100)}%`,
            background: 'linear-gradient(90deg, #00AAFF, #00EEFF)',
            boxShadow: '0 0 8px rgba(0,238,255,0.5)',
          }}
        />
      </div>

      {/* Status message */}
      <div className="text-center mt-2">
        <p className="text-[10px] tracking-[0.2em] uppercase animate-pulse"
           style={{ color: '#4488AA', fontFamily: "'Courier New', monospace" }}>
          {statusMsg}
        </p>
      </div>
    </div>
  );
}