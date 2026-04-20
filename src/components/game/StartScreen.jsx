import { useState } from 'react';
import { usePlanetConfig } from './useGameEngine';

const PLANETS = ['Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn'];

const PLANET_EMOJIS = {
  Mercury: '☿',
  Venus: '♀',
  Mars: '♂',
  Jupiter: '♃',
  Saturn: '♄',
};

export default function StartScreen({ onStart }) {
  const [selected, setSelected] = useState('Mars');
  const { PLANET_CONFIG, DIFFICULTY_LABELS } = usePlanetConfig();

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center z-10"
         style={{ background: 'radial-gradient(ellipse at center, #0a0a2e 0%, #050510 70%)' }}>
      
      {/* Scanline overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-5"
           style={{ background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.03) 2px, rgba(255,255,255,0.03) 4px)' }} />

      <h1 className="text-4xl sm:text-6xl font-bold tracking-widest mb-2"
          style={{ fontFamily: "'Courier New', monospace", color: '#00EEFF', textShadow: '0 0 20px #00EEFF, 0 0 40px #0088AA' }}>
        STAR VOYAGER
      </h1>
      <p className="text-sm sm:text-base tracking-[0.3em] mb-10 uppercase"
         style={{ color: '#4488AA', fontFamily: "'Courier New', monospace" }}>
        Navigate the cosmos
      </p>

      <div className="mb-8 text-center">
        <p className="text-xs tracking-[0.2em] uppercase mb-4"
           style={{ color: '#6688AA', fontFamily: "'Courier New', monospace" }}>
          Select Destination
        </p>
        <div className="flex flex-wrap justify-center gap-3 max-w-md px-4">
          {PLANETS.map((p) => {
            const cfg = PLANET_CONFIG[p];
            const isSelected = selected === p;
            return (
              <button
                key={p}
                onClick={() => setSelected(p)}
                className="relative px-4 py-3 rounded transition-all duration-200 min-w-[100px]"
                style={{
                  fontFamily: "'Courier New', monospace",
                  border: isSelected ? `2px solid ${cfg.color}` : '2px solid rgba(255,255,255,0.1)',
                  background: isSelected ? `rgba(${hexToRgb(cfg.color)}, 0.15)` : 'rgba(255,255,255,0.03)',
                  boxShadow: isSelected ? `0 0 15px rgba(${hexToRgb(cfg.color)}, 0.3), inset 0 0 15px rgba(${hexToRgb(cfg.color)}, 0.1)` : 'none',
                  color: isSelected ? cfg.color : '#667788',
                }}
              >
                <div className="text-xl mb-1">{PLANET_EMOJIS[p]}</div>
                <div className="text-xs font-bold tracking-wider">{p.toUpperCase()}</div>
                <div className="text-[10px] mt-1 opacity-60">{DIFFICULTY_LABELS[p]}</div>
              </button>
            );
          })}
        </div>
      </div>

      <button
        onClick={() => onStart(selected)}
        className="px-8 py-3 rounded tracking-[0.3em] uppercase text-sm font-bold transition-all duration-300 hover:scale-105"
        style={{
          fontFamily: "'Courier New', monospace",
          background: 'transparent',
          border: '2px solid #00EEFF',
          color: '#00EEFF',
          boxShadow: '0 0 15px rgba(0,238,255,0.3), inset 0 0 15px rgba(0,238,255,0.1)',
          textShadow: '0 0 10px #00EEFF',
        }}
      >
        Launch
      </button>

      <div className="mt-8 text-center">
        <p className="text-[10px] tracking-[0.15em]"
           style={{ color: '#445566', fontFamily: "'Courier New', monospace" }}>
          ARROWS / WASD TO MOVE &nbsp;•&nbsp; DODGE THE ASTEROIDS
        </p>
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