import React, { useEffect, useRef } from 'react';
import { AnimationType } from '../types';

interface AnimationCanvasProps {
  activeAnimation: AnimationType;
  onAnimationEnd: () => void;
  isAnimationActive: boolean;
}

interface Snowflake {
  x: number;
  y: number;
  r: number;
  speedY: number;
  speedX: number;
  swayAngle: number;
  swaySpeed: number;
  swayRange: number;
  opacity: number;
  isVector: boolean;
}

interface Balloon {
  x: number;
  baseX: number;
  y: number;
  w: number;
  speedY: number;
  swayAngle: number;
  swaySpeed: number;
  swayRange: number;
  colorStart: string;
  colorEnd: string;
  stringLength: number;
  opacity: number;
  scaleY: number;
  targetScaleY: number;
}

interface Confetti {
  x: number;
  y: number;
  w: number;
  h: number;
  color: string;
  speedY: number;
  speedX: number;
  rotation: number;
  rotationSpeed: number;
  opacity: number;
}

const BALLOON_PALETTES = [
  { start: '#ff6b6b', end: '#d63031' }, // Ruby Red
  { start: '#48dbfb', end: '#0984e3' }, // Ocean Blue
  { start: '#1dd1a1', end: '#10ac84' }, // Emerald Green
  { start: '#feca57', end: '#ff9f43' }, // Amber Yellow
  { start: '#ff9ff3', end: '#f368e0' }, // Violet Pink
  { start: '#a29bfe', end: '#6c5ce7' }, // Purple
  { start: '#ff9f1c', end: '#ff6b6b' }, // Sunset Orange
  { start: '#00d2d3', end: '#00a8ff' }, // Cyan Blue
];

export default function AnimationCanvas({
  activeAnimation,
  onAnimationEnd,
  isAnimationActive,
}: AnimationCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameId = useRef<number | null>(null);

  // Lists of particles kept inside Mutable Refs for 60fps draw speeds
  const snowflakesRef = useRef<Snowflake[]>([]);
  const balloonsRef = useRef<Balloon[]>([]);
  const confettiRef = useRef<Confetti[]>([]);
  const fadeOutAlphaRef = useRef<number>(1.0); // Manage fading transitions
  const isFadingRef = useRef<boolean>(false);

  // Resize canvas helper
  const resizeCanvas = (width: number, height: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.scale(dpr, dpr);
  };

  // ResizeObserver implementation to guarantee responsive re-rendering
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new ResizeObserver((entries) => {
      if (!entries || entries.length === 0) return;
      const { width, height } = entries[0].contentRect;
      resizeCanvas(width, height);
    });

    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  // Set up particles when activeAnimation changes
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const width = canvas.width / (window.devicePixelRatio || 1);
    const height = canvas.height / (window.devicePixelRatio || 1);

    if (activeAnimation === 'snowflakes') {
      isFadingRef.current = false;
      fadeOutAlphaRef.current = 1.0;
      balloonsRef.current = [];
      confettiRef.current = [];

      const list: Snowflake[] = [];
      for (let i = 0; i < 50; i++) {
        // High density initialization across the sky
        list.push({
          x: Math.random() * width,
          y: Math.random() * -height - 20, // Start dispersed above screen for cascade
          r: Math.random() * 5 + 4, // Medium snowflake width
          speedY: Math.random() * 1.5 + 1.2, // Delicate terminal velocities
          speedX: Math.random() * 0.4 - 0.2,
          swayAngle: Math.random() * Math.PI * 2,
          swaySpeed: Math.random() * 0.02 + 0.015,
          swayRange: Math.random() * 1.2 + 0.8,
          opacity: Math.random() * 0.5 + 0.45,
          isVector: Math.random() > 0.4, // Mix detailed vector shapes with simple round circles
        });
      }
      snowflakesRef.current = list;
    } else if (activeAnimation === 'balloons') {
      isFadingRef.current = false;
      fadeOutAlphaRef.current = 1.0;
      snowflakesRef.current = [];
      confettiRef.current = [];

      const list: Balloon[] = [];
      for (let i = 0; i < 30; i++) {
        const p = BALLOON_PALETTES[Math.floor(Math.random() * BALLOON_PALETTES.length)];
        const bX = Math.random() * width;
        list.push({
          x: bX,
          baseX: bX,
          y: height + Math.random() * height + 40, // Dispersed below water level
          w: Math.random() * 10 + 20, // 20px to 30px width
          speedY: -(Math.random() * 1.6 + 1.4), // Float up speeds
          swayAngle: Math.random() * Math.PI * 2,
          swaySpeed: Math.random() * 0.015 + 0.01,
          swayRange: Math.random() * 1.8 + 0.8,
          colorStart: p.start,
          colorEnd: p.end,
          stringLength: Math.random() * 10 + 35,
          opacity: Math.random() * 0.15 + 0.8, // Elegant high transparency gloss
          scaleY: 1.0,
          targetScaleY: 1.0,
        });
      }
      balloonsRef.current = list;
    } else if (activeAnimation === 'confetti') {
      isFadingRef.current = false;
      fadeOutAlphaRef.current = 1.0;
      snowflakesRef.current = [];
      balloonsRef.current = [];

      const list: Confetti[] = [];
      const colors = ['#f43f5e', '#3b82f6', '#10b981', '#eab308', '#a855f7', '#ff7849', '#ec4899'];
      for (let i = 0; i < 60; i++) {
        list.push({
          x: Math.random() * width,
          y: Math.random() * -height - 20,
          w: Math.random() * 6 + 6,
          h: Math.random() * 8 + 10,
          color: colors[Math.floor(Math.random() * colors.length)],
          speedY: Math.random() * 2 + 2,
          speedX: Math.random() * 2 - 1,
          rotation: Math.random() * Math.PI * 2,
          rotationSpeed: Math.random() * 0.1 - 0.05,
          opacity: Math.random() * 0.2 + 0.8,
        });
      }
      confettiRef.current = list;
    } else {
      // Transitioning to none: slowly dissolve leftovers rather than snapping them out!
      isFadingRef.current = true;
    }
  }, [activeAnimation]);

  // Main high-performance render loops
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const render = () => {
      const dpr = window.devicePixelRatio || 1;
      const width = canvas.width / dpr;
      const height = canvas.height / dpr;

      // Clear layout
      ctx.clearRect(0, 0, width, height);

      // Handle fading animations when deactivated
      if (isFadingRef.current) {
        fadeOutAlphaRef.current -= 0.02; // Fade over ~1 second
        if (fadeOutAlphaRef.current <= 0) {
          fadeOutAlphaRef.current = 0;
          isFadingRef.current = false;
          snowflakesRef.current = [];
          balloonsRef.current = [];
          confettiRef.current = [];
        }
      }

      // 1. CHOOSE & RENDER SNOWFLAKES
      if (snowflakesRef.current.length > 0) {
        snowflakesRef.current.forEach((val) => {
          // Update positions
          val.swayAngle += val.swaySpeed;
          const swayX = Math.sin(val.swayAngle) * val.swayRange;
          val.x += val.speedX + swayX * 0.3;
          val.y += val.speedY;

          // Wrap horizontally
          if (val.x < -20) val.x = width + 20;
          if (val.x > width + 20) val.x = -20;

          // If standard loop, respawn finished particles above screen
          if (val.y > height + 20 && !isFadingRef.current) {
            val.y = -20;
            val.x = Math.random() * width;
          }

          // Apply global fade coefficient
          const currentOpacity = val.opacity * fadeOutAlphaRef.current;

          // Drawing mechanics
          if (val.isVector) {
            drawVectorCrystal(ctx, val.x, val.y, val.r, currentOpacity);
          } else {
            // Draw secondary soft circular background snow stars
            ctx.save();
            ctx.beginPath();
            const glow = ctx.createRadialGradient(val.x, val.y, 0, val.x, val.y, val.r);
            glow.addColorStop(0, `rgba(14, 165, 233, ${currentOpacity * 0.95})`);
            glow.addColorStop(0.5, `rgba(59, 130, 246, ${currentOpacity * 0.45})`);
            glow.addColorStop(1, 'rgba(59, 130, 246, 0)');
            ctx.fillStyle = glow;
            ctx.arc(val.x, val.y, val.r, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
          }
        });
      }

      // 2. CHOOSE & RENDER BALLOONS
      if (balloonsRef.current.length > 0) {
        balloonsRef.current.forEach((val) => {
          // Update physics
          val.swayAngle += val.swaySpeed;
          val.x = val.baseX + Math.sin(val.swayAngle) * val.swayRange * 12;
          val.y += val.speedY;

          // Gentle vertical spring bounce stretching!
          val.scaleY += (val.targetScaleY - val.scaleY) * 0.1;
          if (Math.random() < 0.01) {
            val.targetScaleY = 1.05 + Math.random() * 0.05;
          } else if (Math.random() < 0.02) {
            val.targetScaleY = 0.95 + Math.random() * 0.05;
          }

          // Wrap at sides
          if (val.x < -40) {
            val.x = width + 40;
            val.baseX = width + 40;
          }
          if (val.x > width + 40) {
            val.x = -40;
            val.baseX = -40;
          }

          // If standard loop, recycle finished balloons below ground
          if (val.y < -val.w * 3 && !isFadingRef.current) {
            val.y = height + 40 + Math.random() * 40;
            val.baseX = Math.random() * width;
          }

          const currentOpacity = val.opacity * fadeOutAlphaRef.current;
          drawBuoyantBalloon(ctx, val, currentOpacity);
        });
      }

      // 3. CHOOSE & RENDER CONFETTI
      if (confettiRef.current.length > 0) {
        confettiRef.current.forEach((val) => {
          // Update positions and wind swaying factors
          val.y += val.speedY;
          val.x += val.speedX + Math.sin(val.y * 0.025) * 0.65;
          val.rotation += val.rotationSpeed;

          // Wrap horizontally
          if (val.x < -20) val.x = width + 20;
          if (val.x > width + 20) val.x = -20;

          // Recycle finished confetti pieces
          if (val.y > height + 20 && !isFadingRef.current) {
            val.y = -20;
            val.x = Math.random() * width;
          }

          const currentOpacity = val.opacity * fadeOutAlphaRef.current;
          ctx.save();
          ctx.translate(val.x, val.y);
          ctx.rotate(val.rotation);
          ctx.fillStyle = hexToRgb(val.color, currentOpacity);
          ctx.fillRect(-val.w / 2, -val.h / 2, val.w, val.h);
          ctx.restore();
        });
      }

      animationFrameId.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, []);

  // Sub-method to render intricate high-fidelity snowflake crystals
  const drawVectorCrystal = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    r: number,
    opacity: number
  ) => {
    ctx.save();
    ctx.strokeStyle = `rgba(29, 78, 216, ${opacity})`;
    ctx.lineWidth = Math.max(1.2, r / 6.0);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    ctx.beginPath();
    // Symmetric 6 branch lines
    for (let i = 0; i < 6; i++) {
      const angle = (i * Math.PI) / 3;
      const xEnd = x + Math.cos(angle) * r;
      const yEnd = y + Math.sin(angle) * r;
      ctx.moveTo(x, y);
      ctx.lineTo(xEnd, yEnd);

      // Branch details at 60% altitude
      const subBranchLength = r * 0.35;
      const midX = x + Math.cos(angle) * (r * 0.55);
      const midY = y + Math.sin(angle) * (r * 0.55);

      // Left arm split
      const angleL = angle + Math.PI / 4;
      ctx.moveTo(midX, midY);
      ctx.lineTo(midX + Math.cos(angleL) * subBranchLength, midY + Math.sin(angleL) * subBranchLength);

      // Right arm split
      const angleR = angle - Math.PI / 4;
      ctx.moveTo(midX, midY);
      ctx.lineTo(midX + Math.cos(angleR) * subBranchLength, midY + Math.sin(angleR) * subBranchLength);
    }
    ctx.stroke();
    ctx.restore();
  };

  // Sub-method to render beautiful, radial-shaded glossy floating polymer balloons
  const drawBuoyantBalloon = (ctx: CanvasRenderingContext2D, b: Balloon, opacity: number) => {
    const h = b.w * 1.28; // Balloon aspect height
    ctx.save();

    // Move to centroid and rotate slightly based on sway forces
    ctx.translate(b.x, b.y);
    ctx.rotate(Math.sin(b.swayAngle) * 0.05);
    ctx.scale(1.0, b.scaleY);

    // 1. Render winding string
    ctx.beginPath();
    ctx.strokeStyle = `rgba(148, 163, 184, ${opacity * 0.4})`;
    ctx.lineWidth = 1;
    ctx.moveTo(0, h / 2);

    // Bezier curve string dangle
    ctx.bezierCurveTo(
      Math.sin(b.swayAngle * 1.5) * 6, h / 2 + b.stringLength * 0.3,
      -Math.sin(b.swayAngle * 1.5) * 6, h / 2 + b.stringLength * 0.6,
      Math.sin(b.swayAngle) * 2, h / 2 + b.stringLength
    );
    ctx.stroke();

    // 2. Render balloon body using a radial glossy light emitter
    ctx.beginPath();
    ctx.ellipse(0, 0, b.w / 2, h / 2, 0, 0, Math.PI * 2);

    const gradient = ctx.createRadialGradient(
      -b.w * 0.15, -h * 0.18, b.w * 0.06, // Origin highlight
      0, 0, b.w * 0.65                     // Terminus reach
    );
    gradient.addColorStop(0, hexToRgb(b.colorStart, opacity));
    gradient.addColorStop(0.8, hexToRgb(b.colorEnd, opacity));
    gradient.addColorStop(1, hexToRgb(darkenHexColor(b.colorEnd, 0.4), opacity));

    ctx.fillStyle = gradient;
    ctx.fill();

    // 3. Draw little geometric bottom knot tie
    ctx.fillStyle = hexToRgb(b.colorEnd, opacity * 0.9);
    ctx.beginPath();
    ctx.moveTo(-b.w * 0.1, h / 2);
    ctx.lineTo(b.w * 0.1, h / 2);
    ctx.lineTo(0, h / 2 + 5);
    ctx.closePath();
    ctx.fill();

    // 4. Gloss specular highlight spot mapping
    ctx.fillStyle = `rgba(255, 255, 255, ${opacity * 0.45})`;
    ctx.beginPath();
    ctx.ellipse(
      -b.w * 0.14,
      -h * 0.16,
      b.w * 0.11,
      h * 0.07,
      Math.PI / 4,
      0,
      Math.PI * 2
    );
    ctx.fill();

    ctx.restore();
  };

  // Safe color parsing helper: Hex values to CSS rgb
  const hexToRgb = (hex: string, alpha: number) => {
    const clean = hex.replace('#', '');
    const r = parseInt(clean.substring(0, 2), 16);
    const g = parseInt(clean.substring(2, 4), 16);
    const b = parseInt(clean.substring(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };

  // Hex color darkener for rim lighting
  const darkenHexColor = (hex: string, amount: number) => {
    const clean = hex.replace('#', '');
    let r = parseInt(clean.substring(0, 2), 16);
    let g = parseInt(clean.substring(2, 4), 16);
    let b = parseInt(clean.substring(4, 6), 16);

    r = Math.max(0, Math.floor(r * (1 - amount)));
    g = Math.max(0, Math.floor(g * (1 - amount)));
    b = Math.max(0, Math.floor(b * (1 - amount)));

    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
  };

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden z-0"
    >
      <canvas ref={canvasRef} className="absolute inset-0 block" />
    </div>
  );
}
