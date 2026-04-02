import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

/**
 * SectionDivider — decorative cinematic transition between two sections.
 * @param {string} variant — 'wave' | 'slash' | 'curtain' | 'ripple' | 'tear'
 * @param {string} accentColor — CSS color for accent elements
 * @param {string} label — optional text label to show in the divider
 */
export default function SectionDivider({ variant = 'wave', accentColor = '#E5FC54', label }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });

  const lineWidth = useTransform(scrollYProgress, [0.1, 0.6], ['0%', '100%']);
  const labelOpacity = useTransform(scrollYProgress, [0.2, 0.5], [0, 1]);
  const labelY = useTransform(scrollYProgress, [0.2, 0.5], [12, 0]);
  const orbX = useTransform(scrollYProgress, [0, 1], ['-10%', '10%']);

  return (
    <div ref={ref} className="relative w-full overflow-hidden" style={{ height: variant === 'curtain' ? 120 : 80 }}>

      {/* ── Ambient drifting orb ─── */}
      <motion.div
        className="absolute top-1/2 -translate-y-1/2 left-1/4 w-[300px] h-[300px] rounded-full pointer-events-none"
        style={{
          background: `radial-gradient(circle, ${accentColor}08 0%, transparent 65%)`,
          x: orbX,
        }}
      />

      {/* ── Horizontal accent line with animated reveal ─── */}
      <div className="absolute top-1/2 -translate-y-1/2 left-0 w-full h-px bg-white/5">
        <motion.div
          className="h-full origin-left"
          style={{
            width: lineWidth,
            background: `linear-gradient(90deg, transparent, ${accentColor}40, transparent)`,
          }}
        />
      </div>

      {/* ── Variant-specific decorations ─── */}
      {variant === 'wave' && (
        <svg
          className="absolute top-0 left-0 w-full h-full"
          viewBox="0 0 1200 80"
          preserveAspectRatio="none"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <motion.path
            d="M0,40 C150,10 300,70 450,40 C600,10 750,70 900,40 C1050,10 1150,60 1200,40"
            stroke={accentColor}
            strokeOpacity="0.08"
            strokeWidth="1"
            fill="none"
            initial={{ pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            viewport={{ once: true, margin: '-20px' }}
            transition={{ duration: 1.8, ease: 'easeOut' }}
          />
          <motion.path
            d="M0,50 C200,20 400,80 600,50 C800,20 1000,75 1200,50"
            stroke={accentColor}
            strokeOpacity="0.04"
            strokeWidth="1"
            fill="none"
            initial={{ pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            viewport={{ once: true, margin: '-20px' }}
            transition={{ duration: 2, delay: 0.2, ease: 'easeOut' }}
          />
        </svg>
      )}

      {variant === 'slash' && (
        <svg
          className="absolute top-0 left-0 w-full h-full"
          viewBox="0 0 1200 80"
          preserveAspectRatio="none"
          fill="none"
        >
          {[0.2, 0.45, 0.7].map((x, i) => (
            <motion.line
              key={i}
              x1={1200 * x}
              y1="0"
              x2={1200 * x - 40}
              y2="80"
              stroke={accentColor}
              strokeOpacity={0.12 - i * 0.03}
              strokeWidth="1"
              initial={{ pathLength: 0 }}
              whileInView={{ pathLength: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: i * 0.15, ease: 'easeOut' }}
            />
          ))}
        </svg>
      )}

      {variant === 'curtain' && (
        <svg
          className="absolute top-0 left-0 w-full h-full"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          fill="none"
        >
          <motion.path
            d="M0,60 Q300,120 600,60 Q900,0 1200,60 L1200,120 L0,120 Z"
            fill="#0B1411"
            fillOpacity="0.6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          />
          <motion.path
            d="M0,60 Q300,120 600,60 Q900,0 1200,60"
            stroke={accentColor}
            strokeOpacity="0.10"
            strokeWidth="1"
            fill="none"
            initial={{ pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.6, ease: 'easeOut' }}
          />
        </svg>
      )}

      {variant === 'ripple' && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full border"
              style={{
                borderColor: `${accentColor}20`,
                width: 40 + i * 60,
                height: 40 + i * 60,
                left: '50%',
                top: '50%',
              }}
              initial={{ opacity: 0, scale: 0.5 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: i * 0.15, ease: 'easeOut' }}
            />
          ))}
        </div>
      )}

      {variant === 'tear' && (
        <svg
          className="absolute top-0 left-0 w-full h-full"
          viewBox="0 0 1200 80"
          preserveAspectRatio="none"
          fill="none"
        >
          <motion.path
            d="M0,40 L120,38 L180,45 L260,35 L340,42 L420,36 L520,44 L600,38 L700,46 L800,34 L900,42 L1000,37 L1100,43 L1200,40"
            stroke={accentColor}
            strokeOpacity="0.12"
            strokeWidth="1.5"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.5, ease: 'easeOut' }}
          />
        </svg>
      )}

      {/* ── Centre dot ─── */}
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full"
        style={{ background: accentColor }}
        initial={{ opacity: 0, scale: 0 }}
        whileInView={{ opacity: 0.6, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.4, type: 'spring' }}
      />

      {/* ── Optional label ─── */}
      {label && (
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
          style={{ opacity: labelOpacity, y: labelY }}
        >
          <span
            className="text-[9px] uppercase tracking-[0.4em] font-sans px-4 py-1 rounded-full"
            style={{
              color: `${accentColor}80`,
              border: `1px solid ${accentColor}20`,
              background: 'rgba(11,20,17,0.6)',
              backdropFilter: 'blur(8px)',
            }}
          >
            {label}
          </span>
        </motion.div>
      )}
    </div>
  );
}
