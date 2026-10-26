import React, { useEffect, useRef } from 'react';

interface HeroRainParticlesProps {
  active: boolean;
  intensity?: 'light' | 'monsoon';
}

export const HeroRainParticles: React.FC<HeroRainParticlesProps> = ({ active, intensity = 'light' }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!active) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.clientHeight || window.innerHeight);

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };

    window.addEventListener('resize', handleResize);

    // Soft gentle drizzle (ঝিরিঝিরি বৃষ্টি, অজোর ধারা নয়)
    const dropCount = 28;
    const drops: Array<{
      x: number;
      y: number;
      length: number;
      speed: number;
      opacity: number;
      wind: number;
    }> = [];

    for (let i = 0; i < dropCount; i++) {
      drops.push({
        x: Math.random() * width,
        y: Math.random() * height,
        length: Math.random() * 8 + 6,
        speed: Math.random() * 1.6 + 2.2, // Slow, peaceful, jhirijhiri
        opacity: Math.random() * 0.16 + 0.08,
        wind: 0.35 + Math.random() * 0.25
      });
    }

    // Gentle floating flower petal particles
    const petals: Array<{
      x: number;
      y: number;
      size: number;
      speedY: number;
      speedX: number;
      rotation: number;
      rotationSpeed: number;
      opacity: number;
    }> = [];

    const petalCount = 8;
    for (let i = 0; i < petalCount; i++) {
      petals.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 5 + 4,
        speedY: Math.random() * 0.7 + 0.3,
        speedX: Math.random() * 0.5 - 0.2,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 1.5,
        opacity: Math.random() * 0.3 + 0.2
      });
    }

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Render rain drops
      ctx.strokeStyle = '#a4c2f4';
      ctx.lineWidth = 1;

      for (let i = 0; i < drops.length; i++) {
        const d = drops[i];
        ctx.beginPath();
        ctx.globalAlpha = d.opacity;
        ctx.moveTo(d.x, d.y);
        ctx.lineTo(d.x + d.wind * 4, d.y + d.length);
        ctx.stroke();

        d.y += d.speed;
        d.x += d.wind;

        if (d.y > height) {
          d.y = -d.length;
          d.x = Math.random() * width;
        }
      }

      // Render floating petals
      ctx.fillStyle = '#e88691';
      for (let i = 0; i < petals.length; i++) {
        const p = petals[i];
        ctx.save();
        ctx.globalAlpha = p.opacity;
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.beginPath();
        ctx.ellipse(0, 0, p.size, p.size * 0.6, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        p.y += p.speedY;
        p.x += p.speedX;
        p.rotation += p.rotationSpeed;

        if (p.y > height) {
          p.y = -10;
          p.x = Math.random() * width;
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [active, intensity]);

  if (!active) return null;

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none z-10 w-full h-full"
      aria-hidden="true"
    />
  );
};
