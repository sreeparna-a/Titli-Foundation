import { motion, useScroll, useTransform, useSpring, useMotionValue } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';

// ESLint in this repo doesn't treat `motion.*` JSX element usage as a "use".
void motion;

/**
 * ButterflyParticle — A delicate animated SVG butterfly that floats in
 * the bottom-right corner of the screen. Its wings flap continuously and
 * it drifts gently. As the user scrolls, it rises up the screen.
 *
 * The butterfly is purely decorative and pointer-events-none.
 */

function ButterflyWing({ side = 'left', flapProgress }) {
  // Wing flapping via scaleX transform driven by flapProgress (0–1)
  const scaleX = useTransform(flapProgress, [0, 0.5, 1], side === 'left' ? [1, 0.15, 1] : [-1, -0.15, -1]);
  const opacity = useTransform(flapProgress, [0, 0.5, 1], [0.9, 0.5, 0.9]);

  return (
    <motion.g style={{ scaleX, opacity, transformOrigin: side === 'left' ? 'right center' : 'left center' }}>
      {/* Main wing body */}
      <path
        d={side === 'left'
          ? 'M 20,30 C 0,10 -30,5 -25,25 C -20,42 -5,55 20,50 Z'
          : 'M -20,30 C 0,10 30,5 25,25 C 20,42 5,55 -20,50 Z'}
        fill="rgba(229,252,84,0.18)"
        stroke="rgba(229,252,84,0.5)"
        strokeWidth="0.5"
      />
      {/* Hindwing */}
      <path
        d={side === 'left'
          ? 'M 20,45 C 5,50 -20,65 -10,55 C -2,47 10,45 20,50 Z'
          : 'M -20,45 C -5,50 20,65 10,55 C 2,47 -10,45 -20,50 Z'}
        fill="rgba(209,124,38,0.12)"
        stroke="rgba(209,124,38,0.35)"
        strokeWidth="0.5"
      />
      {/* Wing pattern veins */}
      <path
        d={side === 'left'
          ? 'M 18,32 C 8,20 -14,12 -16,26'
          : 'M -18,32 C -8,20 14,12 16,26'}
        stroke="rgba(229,252,84,0.2)"
        strokeWidth="0.6"
        fill="none"
      />
      {/* Eyespot */}
      <circle
        cx={side === 'left' ? -12 : 12}
        cy={22}
        r={4}
        fill="rgba(41,122,81,0.2)"
        stroke="rgba(229,252,84,0.3)"
        strokeWidth="0.5"
      />
      <circle
        cx={side === 'left' ? -12 : 12}
        cy={22}
        r={1.5}
        fill="rgba(229,252,84,0.4)"
      />
    </motion.g>
  );
}

export default function ButterflyParticle() {
  const { scrollYProgress } = useScroll();

  // Float position — rises as page scrolls
  const y = useTransform(scrollYProgress, [0, 1], ['0vh', '-55vh']);
  const ySpring = useSpring(y, { stiffness: 40, damping: 20 });
  // Fade out only near the very bottom of the page
  const scrollOpacity = useTransform(scrollYProgress, [0.88, 1], [1, 0]);

  const [mounted, setMounted] = useState(false);
  useEffect(() => { const t = setTimeout(() => setMounted(true), 1800); return () => clearTimeout(t); }, []);

  // Continuous gentle drift
  const driftX = useMotionValue(0);
  const driftY = useMotionValue(0);
  const frameRef = useRef(0);

  useEffect(() => {
    let t = 0;
    const tick = () => {
      t += 0.008;
      driftX.set(Math.sin(t * 0.7) * 14);
      driftY.set(Math.cos(t) * 8);
      frameRef.current = requestAnimationFrame(tick);
    };
    frameRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameRef.current);
  }, [driftX, driftY]);

  // Wing flap oscillates using a motion value driven by RAF
  const flapProgress = useMotionValue(0);

  useEffect(() => {
    let t = 0;
    const tick = () => {
      t += 0.03;
      // Sawtooth 0→1→0 for wing flap
      flapProgress.set((Math.sin(t) + 1) / 2);
      requestAnimationFrame(tick);
    };
    const id = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(id);
  }, [flapProgress]);

  // Glow pulse
  const glowScale = useMotionValue(1);
  useEffect(() => {
    let t = 0;
    const tick = () => {
      t += 0.015;
      glowScale.set(1 + Math.sin(t) * 0.3);
      requestAnimationFrame(tick);
    };
    const id = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(id);
  }, [glowScale]);

  // Combine mounted state and scroll-driven opacity
  const finalOpacity = useTransform(scrollOpacity, (v) => (mounted ? v : 0));

  return (
    <motion.div
      className="fixed bottom-20 right-6 md:right-14 pointer-events-none z-60 select-none"
      style={{ y: ySpring, opacity: finalOpacity, x: driftX }}
      initial={{ scale: 0.5 }}
      animate={{ scale: mounted ? 1 : 0.5 }}
      transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
    >
      <motion.div style={{ y: driftY }}>
        {/* Glow backdrop */}
        <motion.div
          className="absolute inset-0 rounded-full blur-2xl"
          style={{
            background: 'radial-gradient(circle, rgba(229,252,84,0.15) 0%, transparent 70%)',
            scale: glowScale,
            width: 80,
            height: 80,
            left: -20,
            top: -10,
          }}
        />

        {/* SVG butterfly — bigger for visibility */}
        <svg
          width="90"
          height="100"
          viewBox="-45 5 90 80"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ filter: 'drop-shadow(0 0 6px rgba(229,252,84,0.4))' }}
        >
          <ButterflyWing side="left" flapProgress={flapProgress} />
          <ButterflyWing side="right" flapProgress={flapProgress} />

          {/* Body */}
          <ellipse cx={0} cy={38} rx={2} ry={14} fill="rgba(229,252,84,0.6)" />
          {/* Head */}
          <circle cx={0} cy={24} r={2.5} fill="rgba(229,252,84,0.7)" />
          {/* Antennae */}
          <path d="M 0,22 C -6,12 -10,6 -8,2" stroke="rgba(229,252,84,0.5)" strokeWidth="0.8" fill="none" strokeLinecap="round" />
          <path d="M 0,22 C 6,12 10,6 8,2" stroke="rgba(229,252,84,0.5)" strokeWidth="0.8" fill="none" strokeLinecap="round" />
          <circle cx={-8} cy={2} r={1.2} fill="rgba(229,252,84,0.6)" />
          <circle cx={8} cy={2} r={1.2} fill="rgba(229,252,84,0.6)" />
        </svg>

        {/* Sparkle trails */}
        {[...Array(4)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-titli/60"
            style={{ bottom: i * 6, right: -4 + i * 2 }}
            animate={{
              opacity: [0, 0.6, 0],
              y: [0, -10, -20],
              scale: [0.5, 1, 0],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              delay: i * 0.35,
              ease: 'easeOut',
            }}
          />
        ))}
      </motion.div>
    </motion.div>
  );
}
