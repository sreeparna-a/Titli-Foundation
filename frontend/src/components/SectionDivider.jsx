import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { useRef } from 'react';

/**
 * SectionDivider — cinematic animated transition between sections.
 * @param {string} variant  'wave' | 'slash' | 'curtain' | 'ripple' | 'tear'
 * @param {string} accentColor  CSS hex color for accent elements
 * @param {string} label  optional floating label
 */
export default function SectionDivider({ variant = 'wave', accentColor = '#E5FC54', label }) {
  const ref = useRef(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  // Springs for buttery motion
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 60, damping: 20 });

  // Derived transforms
  const lineWidth  = useTransform(smoothProgress, [0.05, 0.65], ['0%', '100%']);
  const lineOpacity = useTransform(smoothProgress, [0, 0.15, 0.85, 1], [0, 1, 1, 0]);
  const orbX       = useTransform(smoothProgress, [0, 1], ['-15%', '15%']);
  const orbOpacity = useTransform(smoothProgress, [0, 0.2, 0.8, 1], [0, 0.8, 0.8, 0]);
  const labelY     = useTransform(smoothProgress, [0.2, 0.5], [14, 0]);
  const labelOp    = useTransform(smoothProgress, [0.2, 0.5], [0, 1]);

  const height = variant === 'curtain' ? 140 : variant === 'ripple' ? 100 : 80;

  return (
    <div
      ref={ref}
      className="relative w-full overflow-hidden pointer-events-none select-none"
      style={{ height }}
    >
      {/* ── Drifting ambient orb ─────────────────────────────────────── */}
      <motion.div
        className="absolute top-1/2 -translate-y-1/2 left-1/4 w-[340px] h-[340px] rounded-full"
        style={{
          background: `radial-gradient(circle, ${accentColor}0A 0%, transparent 68%)`,
          x: orbX,
          opacity: orbOpacity,
        }}
      />

      {/* ── Base hairline ──────────────────────────────────────────────── */}
      <div className="absolute top-1/2 -translate-y-1/2 left-0 w-full h-px bg-white/3">
        {/* Animated shimmer sweep */}
        <motion.div
          className="absolute top-0 left-0 h-full"
          style={{
            width: lineWidth,
            opacity: lineOpacity,
            background: `linear-gradient(90deg, transparent, ${accentColor}55, ${accentColor}22, transparent)`,
          }}
        />
      </div>

      {/* ══════════════════════════════════════════════════════════════════
          VARIANT: WAVE — dual sinusoidal paths drawn with scroll
         ══════════════════════════════════════════════════════════════════ */}
      {variant === 'wave' && (
        <svg
          className="absolute inset-0 w-full h-full"
          viewBox="0 0 1200 80"
          preserveAspectRatio="none"
          fill="none"
        >
          {/* Background soft wave */}
          <motion.path
            d="M-50,45 C100,15 250,72 400,45 C550,18 700,72 850,45 C1000,18 1100,62 1250,45"
            stroke={accentColor}
            strokeOpacity={0.05}
            strokeWidth={1.5}
            fill="none"
            initial={{ pathLength: 0, opacity: 0 }}
            whileInView={{ pathLength: 1, opacity: 1 }}
            viewport={{ once: true, margin: '-10px' }}
            transition={{ duration: 2.2, ease: [0.22, 1, 0.36, 1] }}
          />
          {/* Foreground crisper wave */}
          <motion.path
            d="M-50,38 C120,8 280,68 440,38 C600,8 760,68 920,38 C1080,8 1160,55 1250,38"
            stroke={accentColor}
            strokeOpacity={0.10}
            strokeWidth={1}
            strokeDasharray="4 8"
            fill="none"
            initial={{ pathLength: 0, opacity: 0 }}
            whileInView={{ pathLength: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 2.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          />
          {/* Travelling spark dot */}
          <motion.circle
            r={2.5}
            fill={accentColor}
            fillOpacity={0.5}
            initial={{ offsetDistance: '0%', opacity: 0 }}
            whileInView={{ offsetDistance: '100%', opacity: [0, 0.7, 0.7, 0] }}
            viewport={{ once: true }}
            transition={{ duration: 2.4, delay: 0.3, ease: 'easeInOut' }}
            style={{
              offsetPath: "path('M-50,38 C120,8 280,68 440,38 C600,8 760,68 920,38 C1080,8 1160,55 1250,38')",
            }}
          />
          {/* Vertical tick marks */}
          {[0.1, 0.3, 0.5, 0.7, 0.9].map((x, i) => (
            <motion.line
              key={i}
              x1={1200 * x}
              y1={34}
              x2={1200 * x}
              y2={46}
              stroke={accentColor}
              strokeOpacity={0.12}
              strokeWidth={1}
              initial={{ scaleY: 0, opacity: 0 }}
              whileInView={{ scaleY: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.6 + i * 0.08 }}
            />
          ))}
        </svg>
      )}

      {/* ══════════════════════════════════════════════════════════════════
          VARIANT: SLASH — diagonal ruled lines + shutter effect
         ══════════════════════════════════════════════════════════════════ */}
      {variant === 'slash' && (
        <svg
          className="absolute inset-0 w-full h-full"
          viewBox="0 0 1200 80"
          preserveAspectRatio="none"
          fill="none"
        >
          {/* Multiple diagonal lines staggered */}
          {[0.15, 0.28, 0.42, 0.55, 0.68, 0.82].map((fx, i) => (
            <motion.line
              key={i}
              x1={1200 * fx}
              y1={0}
              x2={1200 * fx - 28}
              y2={80}
              stroke={accentColor}
              strokeOpacity={i % 2 === 0 ? 0.11 : 0.06}
              strokeWidth={i % 3 === 0 ? 1.5 : 1}
              initial={{ pathLength: 0, opacity: 0 }}
              whileInView={{ pathLength: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.07, ease: 'easeOut' }}
            />
          ))}
          {/* Wide shutter rect sweep */}
          <motion.rect
            x={0}
            y={36}
            width={1200}
            height={8}
            fill={accentColor}
            fillOpacity={0.04}
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            style={{ transformOrigin: 'left center' }}
          />
        </svg>
      )}

      {/* ══════════════════════════════════════════════════════════════════
          VARIANT: CURTAIN — theatrical drape shape
         ══════════════════════════════════════════════════════════════════ */}
      {variant === 'curtain' && (
        <svg
          className="absolute inset-0 w-full h-full"
          viewBox="0 0 1200 140"
          preserveAspectRatio="none"
          fill="none"
        >
          {/* Filled drape */}
          <motion.path
            d="M0,70 Q200,140 400,70 Q600,0 800,70 Q1000,140 1200,70 L1200,140 L0,140 Z"
            fill="#0B1411"
            fillOpacity={0.55}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
          />
          {/* Stroke ridge */}
          <motion.path
            d="M0,70 Q200,140 400,70 Q600,0 800,70 Q1000,140 1200,70"
            stroke={accentColor}
            strokeOpacity={0.12}
            strokeWidth={1.5}
            fill="none"
            initial={{ pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 2, ease: [0.22, 1, 0.36, 1] }}
          />
          {/* Secondary lighter drape */}
          <motion.path
            d="M0,80 Q300,130 600,75 Q900,20 1200,80"
            stroke={accentColor}
            strokeOpacity={0.05}
            strokeWidth={1}
            strokeDasharray="6 12"
            fill="none"
            initial={{ pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 2.4, delay: 0.25, ease: 'easeOut' }}
          />
          {/* Vertical hanging threads */}
          {[120, 360, 600, 840, 1080].map((x, i) => (
            <motion.line
              key={i}
              x1={x}
              y1={0}
              x2={x}
              y2={55}
              stroke={accentColor}
              strokeOpacity={0.06}
              strokeWidth={1}
              initial={{ scaleY: 0 }}
              whileInView={{ scaleY: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.5 + i * 0.09, ease: 'easeOut' }}
              style={{ transformOrigin: 'top center' }}
            />
          ))}
        </svg>
      )}

      {/* ══════════════════════════════════════════════════════════════════
          VARIANT: RIPPLE — concentric expanding ellipses
         ══════════════════════════════════════════════════════════════════ */}
      {variant === 'ripple' && (
        <svg
          className="absolute inset-0 w-full h-full"
          viewBox="0 0 1200 100"
          preserveAspectRatio="none"
          fill="none"
        >
          {/* Expanding ellipses */}
          {[0, 1, 2, 3].map((i) => (
            <motion.ellipse
              key={i}
              cx={600}
              cy={50}
              rx={80 + i * 120}
              ry={12 + i * 10}
              stroke={accentColor}
              strokeOpacity={0.12 - i * 0.025}
              strokeWidth={i === 0 ? 1.5 : 1}
              fill="none"
              initial={{ scale: 0, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.2, delay: i * 0.15, ease: [0.22, 1, 0.36, 1] }}
              style={{ transformOrigin: '600px 50px' }}
            />
          ))}
          {/* Horizontal radiating dashes */}
          {[[-1, 360, 50], [1, 840, 50]].map(([dir, x, y], i) => (
            <motion.line
              key={i}
              x1={x}
              y1={y}
              x2={dir < 0 ? 20 : 1180}
              y2={y}
              stroke={accentColor}
              strokeOpacity={0.07}
              strokeWidth={1}
              strokeDasharray="3 8"
              initial={{ pathLength: 0 }}
              whileInView={{ pathLength: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.4, delay: 0.4 + i * 0.1, ease: 'easeOut' }}
            />
          ))}
        </svg>
      )}

      {/* ══════════════════════════════════════════════════════════════════
          VARIANT: TEAR — jagged hand-torn paper edge
         ══════════════════════════════════════════════════════════════════ */}
      {variant === 'tear' && (
        <svg
          className="absolute inset-0 w-full h-full"
          viewBox="0 0 1200 80"
          preserveAspectRatio="none"
          fill="none"
        >
          {/* Primary tear line */}
          <motion.path
            d="M0,40 L80,37 L130,45 L200,34 L270,43 L360,36 L430,46 L510,34 L580,42 L660,35 L740,44 L820,33 L900,42 L980,36 L1050,44 L1130,38 L1200,40"
            stroke={accentColor}
            strokeOpacity={0.14}
            strokeWidth={1.5}
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0, opacity: 0 }}
            whileInView={{ pathLength: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.8, ease: [0.22, 1, 0.36, 1] }}
          />
          {/* Secondary subtle echo */}
          <motion.path
            d="M0,46 L90,43 L150,50 L220,40 L300,49 L390,41 L460,50 L540,40 L610,47 L690,40 L770,49 L850,38 L930,47 L1010,41 L1080,49 L1160,43 L1200,46"
            stroke={accentColor}
            strokeOpacity={0.05}
            strokeWidth={1}
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0, opacity: 0 }}
            whileInView={{ pathLength: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 2.2, delay: 0.18, ease: 'easeOut' }}
          />
          {/* Small spike details */}
          {[150, 360, 580, 820, 1050].map((x, i) => (
            <motion.path
              key={i}
              d={`M${x},33 L${x + 8},24 L${x + 16},33`}
              stroke={accentColor}
              strokeOpacity={0.09}
              strokeWidth={1}
              fill="none"
              strokeLinejoin="round"
              initial={{ pathLength: 0 }}
              whileInView={{ pathLength: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.7 + i * 0.1 }}
            />
          ))}
        </svg>
      )}

      {/* ── Floating label ────────────────────────────────────────────── */}
      {label && (
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
          style={{ opacity: labelOp, y: labelY }}
        >
          <motion.span
            className="text-[8px] uppercase tracking-[0.45em] font-sans px-4 py-1 rounded-full"
            style={{
              color: `${accentColor}70`,
              border: `1px solid ${accentColor}18`,
              background: 'rgba(11,20,17,0.7)',
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
            }}
            initial={{ letterSpacing: '0.2em', opacity: 0 }}
            whileInView={{ letterSpacing: '0.45em', opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            {label}
          </motion.span>
        </motion.div>
      )}
    </div>
  );
}
