import { useRef, useEffect, useCallback } from 'react';
import useGameEngine from './useGameEngine';
import GameHUD from './GameHUD';

export default function GameCanvas({ planet, onGameOver, onWin }) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const { progress, statusMsg, score, runLoop } = useGameEngine(canvasRef, planet, 'playing');

  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;
    canvas.width = container.clientWidth;
    canvas.height = container.clientHeight;
  }, []);

  useEffect(() => {
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    return () => window.removeEventListener('resize', resizeCanvas);
  }, [resizeCanvas]);

  const scoreRef = useRef(0);
  scoreRef.current = score;

  useEffect(() => {
    const handleEnd = (result) => {
      if (result === 'gameover') onGameOver(scoreRef.current);
      if (result === 'win') onWin(scoreRef.current);
    };
    const t = setTimeout(() => runLoop(handleEnd), 100);
    return () => clearTimeout(t);
  }, [runLoop, onGameOver, onWin]);

  // Touch controls
  const touchRef = useRef(null);
  const keysFromEngine = useRef(null);

  useEffect(() => {
    // We need access to keysRef from the engine for touch controls
    // We'll handle touch via direct canvas events
  }, []);

  const handleTouchStart = (e) => {
    const touch = e.touches[0];
    touchRef.current = { x: touch.clientX, y: touch.clientY };
  };

  const handleTouchMove = (e) => {
    e.preventDefault();
    if (!touchRef.current) return;
    const touch = e.touches[0];
    const dx = touch.clientX - touchRef.current.x;
    const dy = touch.clientY - touchRef.current.y;
    
    // Simulate key presses via dispatching keyboard events
    const threshold = 5;
    if (Math.abs(dx) > threshold) {
      window.dispatchEvent(new KeyboardEvent('keydown', { key: dx > 0 ? 'ArrowRight' : 'ArrowLeft' }));
      window.dispatchEvent(new KeyboardEvent('keyup', { key: dx > 0 ? 'ArrowLeft' : 'ArrowRight' }));
    }
    if (Math.abs(dy) > threshold) {
      window.dispatchEvent(new KeyboardEvent('keydown', { key: dy > 0 ? 'ArrowDown' : 'ArrowUp' }));
      window.dispatchEvent(new KeyboardEvent('keyup', { key: dy > 0 ? 'ArrowUp' : 'ArrowDown' }));
    }
    touchRef.current = { x: touch.clientX, y: touch.clientY };
  };

  const handleTouchEnd = () => {
    touchRef.current = null;
    ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].forEach(key => {
      window.dispatchEvent(new KeyboardEvent('keyup', { key }));
    });
  };

  return (
    <div ref={containerRef} className="relative w-full h-full overflow-hidden" style={{ background: '#050510' }}>
      <GameHUD progress={progress} score={score} statusMsg={statusMsg} planet={planet} />
      <canvas
        ref={canvasRef}
        className="block w-full h-full"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      />
    </div>
  );
}