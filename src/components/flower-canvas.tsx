"use client";
import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";
export type FlowerHandle = { burst: (x?: number, y?: number, big?: boolean) => void };
type Particle = { x: number; y: number; vx: number; vy: number; size: number; rotation: number; spin: number; age: number; life: number; kind: number };
export const FlowerCanvas = forwardRef<FlowerHandle, { disabled?: boolean }>(function FlowerCanvas({ disabled = false }, ref) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const burst = useRef<FlowerHandle["burst"]>(() => {});
  useImperativeHandle(ref, () => ({ burst: (...args) => burst.current(...args) }), []);
  useEffect(() => {
    const el = canvas.current!;
    const ctx = el.getContext("2d")!;
    const sprite = new Image(); sprite.src = "/images/flower.webp";
    let particles: Particle[] = [], frame = 0, previous = 0, width = 0, height = 0;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    function resize() {
      width = innerWidth; height = innerHeight;
      const dpr = Math.min(devicePixelRatio || 1, 2);
      el.width = width * dpr; el.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    function draw(time: number) {
      const dt = Math.min((time - previous) / 16.67 || 1, 2); previous = time;
      ctx.clearRect(0, 0, width, height);
      particles = particles.filter(p => p.age < p.life && p.y < height + 160);
      for (const p of particles) {
        p.age += dt; p.vy += .095 * dt; p.vx *= Math.pow(.994, dt);
        p.x += p.vx * dt; p.y += p.vy * dt; p.rotation += p.spin * dt;
        ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.rotation);
        ctx.globalAlpha = Math.min(1, (p.life - p.age) / 35);
        if (p.kind === 0 && sprite.complete && sprite.naturalWidth) {
          const sway = Math.cos(p.age * .025) * .25 + .75;
          ctx.scale(sway, 1);
          ctx.drawImage(sprite, -p.size / 2, -p.size / 2, p.size, p.size);
        } else {
          ctx.fillStyle = p.kind === 1 ? "#ef9bb8" : "#fff5fa";
          ctx.beginPath(); ctx.ellipse(0, 0, p.size * .28, p.size * .12, .5, 0, Math.PI * 2); ctx.fill();
        }
        ctx.restore();
      }
      if (particles.length) frame = requestAnimationFrame(draw);
      else { frame = 0; previous = 0; }
    }
    burst.current = (x = width / 2, y = height * .6, big = false) => {
      if (reduce.matches || disabled) return;
      const count = innerWidth < 600 ? (big ? 100 : 60) : (big ? 180 : 100);
      for (let i = 0; i < count; i++) {
        const angle = Math.PI + Math.random() * Math.PI;
        const speed = 4 + Math.random() * (big ? 20 : 13);
        particles.push({ x, y, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed - 2,
          size: 18 + Math.random() * 55, rotation: Math.random() * 6, spin: (Math.random() - .5) * .07,
          age: 0, life: 220 + Math.random() * 100, kind: i % 4 === 0 ? 1 : 0 });
      }
      particles = particles.slice(-360);
      if (!frame) frame = requestAnimationFrame(draw);
    };
    resize(); window.addEventListener("resize", resize);
    return () => { cancelAnimationFrame(frame); window.removeEventListener("resize", resize); burst.current = () => {}; };
  }, [disabled]);
  return <canvas ref={canvas} className="flower-canvas" aria-hidden="true" />;
});
