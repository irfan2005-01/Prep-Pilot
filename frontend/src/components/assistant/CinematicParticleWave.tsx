import { useEffect, useRef } from 'react';
import './cinematic-particle-wave.css';

export type AssistantVisualState = 'idle' | 'listening' | 'thinking' | 'speaking' | 'error';

interface CinematicParticleWaveProps {
  state: AssistantVisualState;
  /** Normalized 0..1 energy from a real audio source, when one is available. */
  audioLevel?: number;
}

interface Particle {
  u: number;
  lane: number;
  phase: number;
  size: number;
  depth: number;
  warm: number;
  seed: number;
}

const TAU = Math.PI * 2;

export function CinematicParticleWave({ state, audioLevel = 0 }: CinematicParticleWaveProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef(state);
  const levelRef = useRef(audioLevel);
  const drawFrameRef = useRef<((now: number) => void) | null>(null);

  useEffect(() => { stateRef.current = state; }, [state]);
  useEffect(() => { levelRef.current = Math.max(0, Math.min(1, audioLevel)); }, [audioLevel]);
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) drawFrameRef.current?.(performance.now());
  }, [state, audioLevel]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d', { alpha: false });
    if (!canvas || !context) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const particles: Particle[] = [];
    let width = 0;
    let height = 0;
    let frame = 0;
    let time = 0;
    let previous = 0;
    let smoothedAudio = 0;

    const resize = () => {
      const bounds = canvas.getBoundingClientRect();
      width = Math.max(1, bounds.width);
      height = Math.max(1, bounds.height);
      const dpr = Math.min(window.devicePixelRatio || 1, width < 600 ? 1.25 : 1.75);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.round(Math.min(3300, Math.max(900, width * (width < 600 ? 2.3 : 3.5))));
      particles.length = 0;
      for (let i = 0; i < count; i++) {
        particles.push({
          u: Math.random(),
          lane: Math.random(),
          phase: Math.random() * TAU,
          size: 0.35 + Math.random() * 1.15,
          depth: Math.random(),
          warm: Math.random(),
          seed: Math.random() * 100,
        });
      }
    };

    const draw = (now: number) => {
      if (!reduceMotion.matches) frame = requestAnimationFrame(draw);
      const dt = Math.min(0.04, Math.max(0, (now - previous) / 1000 || 0));
      previous = now;
      const currentState = stateRef.current;
      const targetAudio = currentState === 'speaking' ? levelRef.current : 0;
      smoothedAudio += (targetAudio - smoothedAudio) * Math.min(1, dt * 5);
      const intensity = currentState === 'listening' ? 1.22 : currentState === 'thinking' ? 1.12 : currentState === 'speaking' ? 1.18 + smoothedAudio * 0.75 : currentState === 'error' ? 0.62 : 0.78;
      const speed = currentState === 'thinking' ? 1.45 : currentState === 'listening' ? 1.3 : currentState === 'speaking' ? 1.18 + smoothedAudio : 0.55;
      if (!reduceMotion.matches) time += dt * speed;

      context.fillStyle = 'rgba(2, 2, 2, 0.24)';
      context.fillRect(0, 0, width, height);
      context.globalCompositeOperation = 'lighter';

      const lowerBand = height * 0.48;
      const amplitude = height * (0.065 + smoothedAudio * 0.035) * intensity;
      for (const p of particles) {
        const x = p.u * width;
        const flow = p.u * TAU * 1.65 - time * (0.42 + p.depth * 0.25) + p.phase;
        const ridge = Math.sin(flow) * 0.53 + Math.sin(flow * 0.49 + p.seed) * 0.31 + Math.cos(flow * 1.7 - p.phase) * 0.16;
        const envelope = 0.34 + Math.pow(Math.sin(p.u * Math.PI), 0.65) * 0.66;
        const lane = 0.32 + p.lane * 0.68;
        const y = lowerBand + ridge * amplitude * envelope + lane * height * 0.22 + Math.sin(time * 0.35 + p.phase) * 5;
        const alpha = Math.min(0.92, (0.12 + (1 - p.lane) * 0.32 + smoothedAudio * 0.3) * intensity * (0.65 + p.depth * 0.7));
        const radius = p.size * (0.7 + p.depth * 0.8) * (1 + smoothedAudio * 0.65);
        const tint = p.warm > 0.86 ? '255, 226, 180' : p.warm > 0.52 ? '255, 247, 231' : '239, 242, 247';
        context.fillStyle = `rgba(${tint}, ${alpha})`;
        context.beginPath();
        context.arc(x, y, radius, 0, TAU);
        context.fill();
      }

      // Fine luminous filaments give the cloud its layered, flowing silhouette.
      context.globalCompositeOperation = 'screen';
      for (let layer = 0; layer < 5; layer++) {
        context.beginPath();
        for (let i = 0; i <= 180; i++) {
          const u = i / 180;
          const x = u * width;
          const wave = Math.sin(u * TAU * (1.5 + layer * 0.09) - time * 0.48 + layer) * 0.57 + Math.sin(u * TAU * 0.72 + time * 0.25 + layer * 0.8) * 0.3;
          const y = lowerBand + wave * amplitude * (0.9 + layer * 0.11) + height * (0.15 + layer * 0.032);
          if (i === 0) context.moveTo(x, y); else context.lineTo(x, y);
        }
        context.strokeStyle = layer === 2 ? `rgba(255, 239, 213, ${0.035 * intensity})` : `rgba(245, 241, 235, ${0.018 * intensity})`;
        context.lineWidth = layer === 2 ? 1.2 + smoothedAudio : 0.7;
        context.stroke();
      }
      context.globalCompositeOperation = 'source-over';
    };
    drawFrameRef.current = draw;

    resize();
    context.fillStyle = '#020202';
    context.fillRect(0, 0, width, height);
    const observer = new ResizeObserver(resize);
    observer.observe(canvas);
    const handleMotion = () => {
      cancelAnimationFrame(frame);
      previous = 0;
      frame = requestAnimationFrame(draw);
    };
    reduceMotion.addEventListener('change', handleMotion);
    frame = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      reduceMotion.removeEventListener('change', handleMotion);
      context.clearRect(0, 0, width, height);
      drawFrameRef.current = null;
    };
  }, []);

  return <canvas ref={canvasRef} className="cinematic-particle-wave" aria-hidden="true" />;
}
