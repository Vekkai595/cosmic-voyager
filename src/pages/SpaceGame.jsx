import { useState, useCallback } from 'react';
import StartScreen from '../components/game/StartScreen';
import GameCanvas from '../components/game/GameCanvas';
import GameOverScreen from '../components/game/GameOverScreen';
import WinScreen from '../components/game/WinScreen';

export default function SpaceGame() {
  const [screen, setScreen] = useState('start'); // start | playing | gameover | win
  const [planet, setPlanet] = useState('Mars');
  const [finalScore, setFinalScore] = useState(0);

  const handleStart = useCallback((selectedPlanet) => {
    setPlanet(selectedPlanet);
    setScreen('playing');
  }, []);

  const handleGameOver = useCallback((score) => {
    setFinalScore(score);
    setScreen('gameover');
  }, []);

  const handleWin = useCallback((score) => {
    setFinalScore(score);
    setScreen('win');
  }, []);

  const handleRestart = useCallback(() => {
    setScreen('start');
    // Small delay then start
    setTimeout(() => {
      setScreen('playing');
    }, 50);
  }, []);

  const handleMenu = useCallback(() => {
    setScreen('start');
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden" style={{ background: '#050510' }}>
      {screen === 'start' && (
        <StartScreen onStart={handleStart} />
      )}
      {screen === 'playing' && (
        <GameCanvas
          key={`${planet}-${Date.now()}`}
          planet={planet}
          onGameOver={handleGameOver}
          onWin={handleWin}
        />
      )}
      {screen === 'gameover' && (
        <GameOverScreen
          score={finalScore}
          planet={planet}
          onRestart={handleRestart}
          onMenu={handleMenu}
        />
      )}
      {screen === 'win' && (
        <WinScreen
          score={finalScore}
          planet={planet}
          onRestart={handleRestart}
          onMenu={handleMenu}
        />
      )}
    </div>
  );
}