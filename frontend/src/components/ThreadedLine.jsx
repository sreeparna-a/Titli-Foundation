import { motion, useScroll, useTransform } from 'framer-motion';

export default function ThreadedLine() {
  const { scrollYProgress } = useScroll();
  
  const pathLength = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const glowOpacity = useTransform(scrollYProgress, [0, 0.1, 0.9, 1], [0, 1, 1, 0.4]);

  // A hand-crafted winding, calligraphic SVG path
  // It curls, loops, and breathes like a drawn brushstroke
  const artPath = `
    M 30 0
    C 30 40, 10 80, 30 120
    C 55 165, 5 205, 30 250
    C 60 300, 8 340, 30 390
    C 55 440, 15 470, 30 510
    C 48 555, 5 590, 30 640
    C 60 695, 12 730, 30 780
    C 52 835, 8 870, 30 920
    C 58 975, 10 1010, 30 1060
    C 55 1110, 5 1145, 30 1200
    C 60 1260, 12 1295, 30 1350
    C 52 1400, 8 1440, 30 1490
    C 55 1545, 5 1580, 30 1620
    C 60 1680, 10 1720, 30 1770
    C 55 1825, 5 1860, 30 1900
    C 58 1960, 10 2000, 30 2050
    C 55 2100, 5 2140, 30 2200
  `;

  return (
    <div
      className="fixed top-0 left-0 md:left-6 lg:left-16 bottom-0 w-[60px] z-30 pointer-events-none hidden sm:block"
      style={{ mixBlendMode: 'screen' }}
    >
      {/* Background faint static path */}
      <svg
        className="w-full h-full absolute inset-0"
        viewBox="0 0 60 2200"
        preserveAspectRatio="none"
      >
        <path
          d={artPath}
          fill="none"
          stroke="rgba(229,252,84,0.04)"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>

      {/* Animated glowing drawing path */}
      <motion.svg
        className="w-full h-full absolute inset-0"
        viewBox="0 0 60 2200"
        preserveAspectRatio="none"
        style={{ opacity: glowOpacity }}
      >
        <defs>
          <filter id="threadGlow" x="-50%" y="-10%" width="200%" height="120%">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <linearGradient id="pathGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#E5FC54" stopOpacity="0.9" />
            <stop offset="40%" stopColor="#d17c26" stopOpacity="0.8" />
            <stop offset="70%" stopColor="#297a51" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#E5FC54" stopOpacity="0.6" />
          </linearGradient>
        </defs>

        {/* Outer glow layer */}
        <motion.path
          d={artPath}
          fill="none"
          stroke="url(#pathGrad)"
          strokeWidth="4"
          strokeLinecap="round"
          filter="url(#threadGlow)"
          style={{ pathLength }}
        />

        {/* Inner crisp line */}
        <motion.path
          d={artPath}
          fill="none"
          stroke="#E5FC54"
          strokeWidth="1.5"
          strokeLinecap="round"
          style={{ pathLength, opacity: 0.9 }}
        />

        {/* Animated tip dot */}
        <motion.circle
          cx="0"
          cy="0"
          r="4"
          fill="#E5FC54"
          filter="url(#threadGlow)"
          style={{
            offsetPath: `path("${artPath.replace(/\s+/g, ' ').trim()}")`,
            offsetDistance: pathLength,
          }}
        />
      </motion.svg>
    </div>
  );
}
