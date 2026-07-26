import React, { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  rotation: number;
  rotationSpeed: number;
  shape: 'rect' | 'circle' | 'star';
  opacity: number;
}

const CONFETTI_COLORS = [
  '#22d3ee', // Cyan
  '#a855f7', // Purple
  '#10b981', // Emerald
  '#f59e0b', // Amber/Gold
  '#ec4899', // Pink
  '#3b82f6', // Blue
  '#f43f5e', // Rose
];

export const BirthdayConfetti: React.FC<{ isActive?: boolean }> = ({ isActive = true }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!isActive) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    const particles: Particle[] = [];
    const particleCount = Math.min(Math.floor(width / 12), 120);

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height - height,
        vx: (Math.random() - 0.5) * 3,
        vy: Math.random() * 3 + 2,
        size: Math.random() * 10 + 6,
        color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 6,
        shape: Math.random() > 0.4 ? 'rect' : Math.random() > 0.5 ? 'circle' : 'star',
        opacity: Math.random() * 0.7 + 0.3,
      });
    }

    const drawStar = (ctx: CanvasRenderingContext2D, size: number) => {
      ctx.beginPath();
      for (let i = 0; i < 5; i++) {
        ctx.lineTo(
          Math.cos(((18 + i * 72) * Math.PI) / 180) * size,
          -Math.sin(((18 + i * 72) * Math.PI) / 180) * size
        );
        ctx.lineTo(
          Math.cos(((54 + i * 72) * Math.PI) / 180) * (size / 2),
          -Math.sin(((54 + i * 72) * Math.PI) / 180) * (size / 2)
        );
      }
      ctx.closePath();
      ctx.fill();
    };

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.rotation += p.rotationSpeed;

        if (p.y > height + 20) {
          p.y = -20;
          p.x = Math.random() * width;
        }

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.globalAlpha = p.opacity;
        ctx.fillStyle = p.color;

        if (p.shape === 'rect') {
          ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
        } else if (p.shape === 'circle') {
          ctx.beginPath();
          ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
          ctx.fill();
        } else {
          drawStar(ctx, p.size / 2);
        }

        ctx.restore();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isActive]);

  if (!isActive) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
      <canvas ref={canvasRef} className="h-full w-full" />
    </div>
  );
};
