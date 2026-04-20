import { useRef, useCallback, useEffect, useState } from 'react';

const PLANET_CONFIG = {
  Mercury: { distance: 800, meteorRate: 0.015, speedMult: 1.0, color: '#B5B5B5', size: 40 },
  Venus:   { distance: 1200, meteorRate: 0.02, speedMult: 1.15, color: '#E8CDA0', size: 55 },
  Mars:    { distance: 1600, meteorRate: 0.028, speedMult: 1.3, color: '#E05A3A', size: 50 },
  Jupiter: { distance: 2200, meteorRate: 0.038, speedMult: 1.5, color: '#D4A96A', size: 80 },
  Saturn:  { distance: 2600, meteorRate: 0.045, speedMult: 1.65, color: '#E8D59E', size: 70 },
};

const DIFFICULTY_LABELS = {
  Mercury: 'Easy',
  Venus: 'Easy-Medium',
  Mars: 'Medium',
  Jupiter: 'Hard',
  Saturn: 'Hard',
};

function createStar(canvasW, canvasH, fromTop) {
  return {
    x: Math.random() * canvasW,
    y: fromTop ? -5 : Math.random() * canvasH,
    size: Math.random() * 2 + 0.5,
    speed: Math.random() * 1.5 + 0.5,
    brightness: Math.random() * 0.5 + 0.5,
  };
}

function createMeteor(canvasW, speedMult, elapsed) {
  const timeBonus = Math.min(elapsed / 60000, 2);
  const size = Math.random() * 28 + 12;
  return {
    x: Math.random() * (canvasW - 40) + 20,
    y: -size,
    size,
    speed: (Math.random() * 2 + 1.5 + timeBonus) * speedMult,
    rotation: Math.random() * Math.PI * 2,
    rotSpeed: (Math.random() - 0.5) * 0.08,
    vertices: generateAsteroidVertices(size),
  };
}

function generateAsteroidVertices(size) {
  const count = Math.floor(Math.random() * 4) + 6;
  const verts = [];
  for (let i = 0; i < count; i++) {
    const angle = (i / count) * Math.PI * 2;
    const r = size * (0.6 + Math.random() * 0.4);
    verts.push({ x: Math.cos(angle) * r, y: Math.sin(angle) * r });
  }
  return verts;
}

export function usePlanetConfig() {
  return { PLANET_CONFIG, DIFFICULTY_LABELS };
}

export default function useGameEngine(canvasRef, planet, gameState) {
  const stateRef = useRef(null);
  const keysRef = useRef({});
  const animRef = useRef(null);
  const [progress, setProgress] = useState(0);
  const [statusMsg, setStatusMsg] = useState('');
  const [score, setScore] = useState(0);

  const initGame = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const W = canvas.width;
    const H = canvas.height;
    const config = PLANET_CONFIG[planet] || PLANET_CONFIG.Mars;

    const stars = [];
    for (let i = 0; i < 120; i++) stars.push(createStar(W, H, false));

    stateRef.current = {
      ship: { x: W / 2, y: H - 80, width: 30, height: 40 },
      stars,
      meteors: [],
      particles: [],
      distance: 0,
      totalDistance: config.distance,
      config,
      startTime: Date.now(),
      lastMeteorCheck: Date.now(),
      planetVisualSize: 5,
    };
    setProgress(0);
    setScore(0);
    setStatusMsg(`Traveling to ${planet}...`);
  }, [canvasRef, planet]);

  const gameLoop = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    const s = stateRef.current;
    if (!canvas || !ctx || !s) return;

    const W = canvas.width;
    const H = canvas.height;
    const now = Date.now();
    const elapsed = now - s.startTime;
    const { config, ship } = s;

    // Input
    const moveSpeed = 5;
    if (keysRef.current['ArrowLeft'] || keysRef.current['a'] || keysRef.current['A']) {
      ship.x = Math.max(ship.width / 2, ship.x - moveSpeed);
    }
    if (keysRef.current['ArrowRight'] || keysRef.current['d'] || keysRef.current['D']) {
      ship.x = Math.min(W - ship.width / 2, ship.x + moveSpeed);
    }
    if (keysRef.current['ArrowUp'] || keysRef.current['w'] || keysRef.current['W']) {
      ship.y = Math.max(ship.height, ship.y - moveSpeed * 0.7);
    }
    if (keysRef.current['ArrowDown'] || keysRef.current['s'] || keysRef.current['S']) {
      ship.y = Math.min(H - 20, ship.y + moveSpeed * 0.7);
    }

    // Progress
    s.distance += 0.5 * config.speedMult;
    const prog = Math.min(s.distance / s.totalDistance, 1);
    setProgress(prog);
    setScore(Math.floor(s.distance * 10));

    if (prog < 0.25) setStatusMsg(`Traveling to ${planet}...`);
    else if (prog < 0.5) setStatusMsg('Engines at full power...');
    else if (prog < 0.75) setStatusMsg('Halfway there...');
    else if (prog < 0.95) setStatusMsg('Approaching destination...');
    else setStatusMsg(`${planet} in sight!`);

    // Planet visual
    s.planetVisualSize = 5 + prog * (config.size - 5);

    // Spawn meteors
    const timeScale = 1 + Math.min(elapsed / 80000, 1.5);
    if (Math.random() < config.meteorRate * timeScale) {
      s.meteors.push(createMeteor(W, config.speedMult, elapsed));
    }

    // Update stars
    for (const star of s.stars) {
      star.y += star.speed;
      if (star.y > H + 5) Object.assign(star, createStar(W, H, true));
    }

    // Update meteors
    for (let i = s.meteors.length - 1; i >= 0; i--) {
      const m = s.meteors[i];
      m.y += m.speed;
      m.rotation += m.rotSpeed;
      if (m.y > H + m.size * 2) {
        s.meteors.splice(i, 1);
        continue;
      }
      // Collision
      const dx = m.x - ship.x;
      const dy = m.y - ship.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < m.size * 0.6 + ship.width * 0.4) {
        // Spawn explosion particles
        for (let p = 0; p < 20; p++) {
          const angle = Math.random() * Math.PI * 2;
          const spd = Math.random() * 4 + 1;
          s.particles.push({
            x: ship.x, y: ship.y,
            vx: Math.cos(angle) * spd,
            vy: Math.sin(angle) * spd,
            life: 1,
            color: ['#FF4444', '#FF8800', '#FFCC00', '#FFFFFF'][Math.floor(Math.random() * 4)],
          });
        }
        return 'gameover';
      }
    }

    // Update particles
    for (let i = s.particles.length - 1; i >= 0; i--) {
      const p = s.particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.life -= 0.02;
      if (p.life <= 0) s.particles.splice(i, 1);
    }

    // === DRAW ===
    ctx.fillStyle = '#050510';
    ctx.fillRect(0, 0, W, H);

    // Stars
    for (const star of s.stars) {
      ctx.fillStyle = `rgba(255,255,255,${star.brightness})`;
      ctx.fillRect(star.x, star.y, star.size, star.size);
    }

    // Planet in distance
    if (prog > 0.1) {
      const pSize = s.planetVisualSize;
      const planetY = 60 + (1 - prog) * 40;
      ctx.save();
      ctx.beginPath();
      ctx.arc(W / 2, planetY, pSize, 0, Math.PI * 2);
      ctx.fillStyle = config.color;
      ctx.shadowColor = config.color;
      ctx.shadowBlur = pSize * 0.6;
      ctx.fill();
      // Surface detail
      ctx.globalAlpha = 0.3;
      ctx.beginPath();
      ctx.arc(W / 2 - pSize * 0.2, planetY - pSize * 0.15, pSize * 0.6, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255,255,255,0.15)';
      ctx.fill();
      // Saturn rings
      if (planet === 'Saturn' && pSize > 15) {
        ctx.globalAlpha = 0.5;
        ctx.beginPath();
        ctx.ellipse(W / 2, planetY, pSize * 1.8, pSize * 0.35, -0.2, 0, Math.PI * 2);
        ctx.strokeStyle = '#D4C088';
        ctx.lineWidth = 3;
        ctx.shadowBlur = 8;
        ctx.shadowColor = '#D4C088';
        ctx.stroke();
      }
      ctx.restore();
    }

    // Meteors
    for (const m of s.meteors) {
      ctx.save();
      ctx.translate(m.x, m.y);
      ctx.rotate(m.rotation);
      ctx.beginPath();
      ctx.moveTo(m.vertices[0].x, m.vertices[0].y);
      for (let v = 1; v < m.vertices.length; v++) {
        ctx.lineTo(m.vertices[v].x, m.vertices[v].y);
      }
      ctx.closePath();
      ctx.fillStyle = '#6B5B4F';
      ctx.fill();
      ctx.strokeStyle = '#8B7B6F';
      ctx.lineWidth = 1.5;
      ctx.stroke();
      // Glow
      ctx.shadowColor = '#FF6600';
      ctx.shadowBlur = 6;
      ctx.strokeStyle = 'rgba(255,100,0,0.3)';
      ctx.stroke();
      ctx.restore();
    }

    // Ship
    ctx.save();
    ctx.translate(ship.x, ship.y);
    // Engine glow
    ctx.beginPath();
    ctx.moveTo(-8, ship.height * 0.3);
    ctx.lineTo(0, ship.height * 0.3 + 12 + Math.random() * 8);
    ctx.lineTo(8, ship.height * 0.3);
    ctx.fillStyle = `rgba(0,200,255,${0.5 + Math.random() * 0.3})`;
    ctx.shadowColor = '#00CCFF';
    ctx.shadowBlur = 15;
    ctx.fill();
    // Body
    ctx.shadowBlur = 0;
    ctx.beginPath();
    ctx.moveTo(0, -ship.height / 2);
    ctx.lineTo(-ship.width / 2, ship.height / 3);
    ctx.lineTo(-ship.width / 4, ship.height / 2.5);
    ctx.lineTo(ship.width / 4, ship.height / 2.5);
    ctx.lineTo(ship.width / 2, ship.height / 3);
    ctx.closePath();
    ctx.fillStyle = '#C0D8F0';
    ctx.fill();
    ctx.strokeStyle = '#00CCFF';
    ctx.lineWidth = 1.5;
    ctx.shadowColor = '#00CCFF';
    ctx.shadowBlur = 8;
    ctx.stroke();
    // Cockpit
    ctx.beginPath();
    ctx.arc(0, -ship.height * 0.1, 5, 0, Math.PI * 2);
    ctx.fillStyle = '#00EEFF';
    ctx.shadowColor = '#00EEFF';
    ctx.shadowBlur = 10;
    ctx.fill();
    ctx.restore();

    // Particles
    for (const p of s.particles) {
      ctx.save();
      ctx.globalAlpha = p.life;
      ctx.fillStyle = p.color;
      ctx.shadowColor = p.color;
      ctx.shadowBlur = 6;
      ctx.fillRect(p.x - 2, p.y - 2, 4, 4);
      ctx.restore();
    }

    // Check win
    if (prog >= 1) return 'win';
    return 'playing';
  }, [canvasRef, planet]);

  useEffect(() => {
    if (gameState !== 'playing') {
      if (animRef.current) cancelAnimationFrame(animRef.current);
      return;
    }
    initGame();

    const onKey = (down) => (e) => {
      keysRef.current[e.key] = down;
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
        e.preventDefault();
      }
    };
    const kd = onKey(true);
    const ku = onKey(false);
    window.addEventListener('keydown', kd);
    window.addEventListener('keyup', ku);

    return () => {
      window.removeEventListener('keydown', kd);
      window.removeEventListener('keyup', ku);
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [gameState, initGame]);

  const runLoop = useCallback((onEnd) => {
    const tick = () => {
      const result = gameLoop();
      if (result === 'gameover') { onEnd('gameover'); return; }
      if (result === 'win') { onEnd('win'); return; }
      animRef.current = requestAnimationFrame(tick);
    };
    animRef.current = requestAnimationFrame(tick);
  }, [gameLoop]);

  return { progress, statusMsg, score, runLoop, keysRef };
}