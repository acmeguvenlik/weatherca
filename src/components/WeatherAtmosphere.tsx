'use client';

import React, { useEffect, useRef } from 'react';

import { useTheme } from '@/context/ThemeContext';

interface WeatherAtmosphereProps {
  theme?: 'clear-day' | 'clear-night' | 'cloudy' | 'rain' | 'snow' | 'thunder' | 'fog';
}

export const WeatherAtmosphere: React.FC<WeatherAtmosphereProps> = ({ theme = 'clear-day' }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { theme: appTheme } = useTheme();
  const isLight = appTheme === 'light';

  useEffect(() => {
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

    // Particle setups
    const count = theme === 'rain' ? 80 : theme === 'snow' ? 65 : 25;
    const particles: Array<{
      x: number;
      y: number;
      speedY: number;
      speedX: number;
      size: number;
      opacity: number;
    }> = [];

    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        speedY:
          theme === 'rain'
            ? Math.random() * 8 + 12
            : theme === 'snow'
            ? Math.random() * 1.5 + 0.8
            : Math.random() * 0.4 + 0.1,
        speedX:
          theme === 'rain'
            ? Math.random() * 1.5 - 0.75
            : theme === 'snow'
            ? Math.random() * 1 - 0.5
            : Math.random() * 0.2 - 0.1,
        size:
          theme === 'rain'
            ? Math.random() * 1.8 + 1
            : theme === 'snow'
            ? Math.random() * 3 + 1.2
            : Math.random() * 2 + 1,
        opacity: Math.random() * 0.5 + 0.2,
      });
    }

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      if (theme === 'rain') {
        ctx.strokeStyle = isLight ? 'rgba(56, 189, 248, 0.6)' : 'rgba(186, 230, 253, 0.45)';
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        for (const p of particles) {
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p.x + p.speedX * 2, p.y + p.speedY * 1.8);
          p.x += p.speedX;
          p.y += p.speedY;
          if (p.y > height) {
            p.y = -10;
            p.x = Math.random() * width;
          }
        }
        ctx.stroke();
      } else if (theme === 'snow') {
        for (const p of particles) {
          ctx.fillStyle = isLight
            ? `rgba(125, 211, 252, ${p.opacity * 0.7})`
            : `rgba(240, 249, 255, ${p.opacity * 0.8})`;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();

          p.x += p.speedX + Math.sin(p.y * 0.01) * 0.5;
          p.y += p.speedY;
          if (p.y > height) {
            p.y = -5;
            p.x = Math.random() * width;
          }
        }
      } else if (theme === 'clear-night' && !isLight) {
        // Subtle twinkling stars in dark mode
        for (const p of particles) {
          const shimmer = Math.sin(Date.now() * 0.002 + p.x) * 0.3 + 0.4;
          ctx.fillStyle = `rgba(255, 255, 255, ${shimmer})`;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * 0.8, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [theme, isLight]);

  // Dynamic Background Gradients
  const getGradientClass = () => {
    if (isLight) {
      switch (theme) {
        case 'clear-day':
          return 'from-sky-100 via-blue-50 to-slate-100';
        case 'clear-night':
          return 'from-indigo-100 via-slate-100 to-sky-50';
        case 'rain':
          return 'from-slate-200 via-sky-100 to-slate-100';
        case 'snow':
          return 'from-cyan-100 via-sky-50 to-slate-100';
        case 'thunder':
          return 'from-purple-100 via-slate-200 to-indigo-50';
        case 'fog':
          return 'from-slate-200 via-gray-100 to-slate-100';
        case 'cloudy':
        default:
          return 'from-slate-100 via-sky-50 to-slate-200';
      }
    }

    switch (theme) {
      case 'clear-day':
        return 'from-sky-900 via-indigo-950 to-slate-950';
      case 'clear-night':
        return 'from-slate-950 via-indigo-950 to-[#050711]';
      case 'rain':
        return 'from-slate-900 via-sky-950 to-neutral-950';
      case 'snow':
        return 'from-slate-900 via-cyan-950 to-slate-950';
      case 'thunder':
        return 'from-neutral-950 via-purple-950 to-slate-950';
      case 'fog':
        return 'from-slate-900 via-gray-900 to-slate-950';
      case 'cloudy':
      default:
        return 'from-slate-900 via-slate-950 to-[#070b14]';
    }
  };

  return (
    <div
      className={`fixed inset-0 pointer-events-none -z-10 bg-gradient-to-b ${getGradientClass()} transition-colors duration-700 overflow-hidden`}
    >
      {/* Aurora Borealis Ambient Glow (Canadian aesthetic) */}
      <div
        className={`absolute -top-[20%] left-1/2 -translate-x-1/2 w-[800px] h-[500px] ${
          isLight ? 'bg-sky-400/15' : 'bg-cyan-500/10'
        } rounded-full blur-[140px] opacity-70 animate-pulse`}
      />
      <div
        className={`absolute top-[10%] -left-[10%] w-[600px] h-[400px] ${
          isLight ? 'bg-blue-400/10' : 'bg-indigo-600/10'
        } rounded-full blur-[120px]`}
      />
      <div
        className={`absolute top-[30%] -right-[10%] w-[500px] h-[400px] ${
          isLight ? 'bg-indigo-300/15' : 'bg-purple-600/10'
        } rounded-full blur-[130px]`}
      />

      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full opacity-60" />
    </div>
  );
};
