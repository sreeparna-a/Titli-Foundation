import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import stageImg from '../assets/stage.png';
import SplitText from './SplitText';

// ESLint in this repo doesn't treat `motion.*` JSX element usage as a "use".
void motion;

// Tiny floating dust particles that drift upward (GPU accelerated via CSS keyframes)
const STABLE_PARTICLES = Array.from({ length: 20 }, (_, i) => {
  // Deterministic values based on index to avoid layout shifts / re-renders
  const x = (i * 17 + 7) % 100;
  const delay = (i * 0.4) % 6;
  const duration = 6 + (i % 5) * 1.5;
  const driftX = ((i % 2 === 0 ? 1 : -1) * (15 + (i * 9) % 35)) + 'px';
  const driftY = -(220 + (i * 13) % 180) + 'px';
  const opacity = (0.15 + (i % 4) * 0.08).toFixed(2);
  const size = (1 + (i % 3) * 0.6).toFixed(1) + 'px';

  return { id: i, x, delay, duration, driftX, driftY, opacity, size };
});

function DustParticles() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-5">
      {STABLE_PARTICLES.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-full bg-titli animate-dust-particle transform-gpu"
          style={{
            left: `${p.x}%`,
            bottom: '-10px',
            width: p.size,
            height: p.size,
            '--p-duration': `${p.duration}s`,
            '--p-delay': `${p.delay}s`,
            '--p-drift-x': p.driftX,
            '--p-drift-y': p.driftY,
            '--p-max-opacity': p.opacity,
          }}
        />
      ))}
    </div>
  );
}


export default function Hero({ isLoaded }) {
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end start'] });
  const bgScale = useTransform(scrollYProgress, [0, 1], [1, 1.12]);
  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '15%']);
  const contentY = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);



  return (
    <section
      id="hero"
      ref={sectionRef}
      className="relative w-full h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Background Image with Parallax Zoom */}
      <motion.div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat will-change-transform"
        style={{
          backgroundImage: `url(${stageImg})`,
          scale: bgScale,
          y: bgY,
        }}
        initial={{ scale: 1.2, filter: 'brightness(0)' }}
        animate={{
          scale: isLoaded ? 1 : 1.2,
          filter: isLoaded ? 'brightness(0.5)' : 'brightness(0)',
        }}
        transition={{ duration: 2.5, ease: 'easeOut' }}
      />

      {/* Overlay gradient */}
      <div className="absolute inset-0 bg-linear-to-t from-forest via-forest/25 to-forest/50" />

      {/* Left vignette */}
      <div className="absolute inset-0 bg-linear-to-r from-forest/60 via-transparent to-transparent" />

      {/* Dust particles */}
      {isLoaded && <DustParticles />}

      {/* Main Content */}
      <motion.div
        className="relative z-10 text-center px-6 w-full max-w-5xl mx-auto flex flex-col items-center"
        style={{ y: contentY, opacity: contentOpacity }}
      >
        {/* Main Heading — "Theatre Institute of Technical Learning and Integration" */}
        <div className="overflow-visible mb-2 sm:mb-4 max-w-4xl mx-auto">
          <h1 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif text-titli leading-tight tracking-[0.02em]">
            <SplitText
              text="Theatre Institute of Technical Learning and Integration"
              mode="words"
              stagger={0.06}
              delay={0.6}
              trigger={isLoaded}
              viewport={false}
            />
          </h1>
        </div>

        {/* Subheading — "managed by Titli Foundation" */}
        <div className="overflow-hidden mb-8 sm:mb-10">
          <motion.h2
            className="shimmer-text text-xs xs:text-sm sm:text-base md:text-lg lg:text-xl font-sans font-light tracking-[0.2em] text-white/90 uppercase"
            initial={{ y: '-100%' }}
            animate={{ y: isLoaded ? '0%' : '-100%' }}
            transition={{ duration: 1.2, delay: 1.2, ease: [0.16, 1, 0.3, 1] }}
          >
            managed by Titli Foundation
          </motion.h2>
        </div>

        {/* Tagline */}
        <motion.div
          className="flex flex-col items-center"
          initial={{ opacity: 0, filter: 'blur(10px)' }}
          animate={{ opacity: isLoaded ? 1 : 0, filter: isLoaded ? 'blur(0px)' : 'blur(10px)' }}
          transition={{ duration: 1.5, delay: 1.8 }}
        >
          <p className="text-xs sm:text-sm md:text-lg font-sans text-white/70 tracking-[0.2em] sm:tracking-[0.3em] uppercase mb-2">
            Theatre and Art
          </p>
          <div className="flex items-center gap-3 sm:gap-4">
            <motion.span
              className="h-px bg-accent-orange block"
              initial={{ width: 0 }}
              animate={{ width: isLoaded ? '4rem' : 0 }}
              transition={{ duration: 1.2, delay: 2.2 }}
            />
            <p className="text-[10px] sm:text-base md:text-xl font-serif text-accent-orange italic">
              A Social Responsibility
            </p>
            <motion.span
              className="h-px bg-accent-orange block"
              initial={{ width: 0 }}
              animate={{ width: isLoaded ? '4rem' : 0 }}
              transition={{ duration: 1.2, delay: 2.2 }}
            />
          </div>
        </motion.div>

        {/* Estd. badge */}
        <motion.div
          className="mt-8 flex items-center gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: isLoaded ? 1 : 0 }}
          transition={{ delay: 2.8, duration: 1 }}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-titli/40" />
          <span className="text-[9px] uppercase font-sans tracking-[0.35em] text-titli/40">
            Est. 2008 · Rourkela
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-titli/40" />
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 z-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: isLoaded ? 1 : 0 }}
        transition={{ delay: 2.5, duration: 1 }}
      >
        <span className="text-[10px] uppercase font-sans tracking-[0.2em] text-titli/50">Scroll to Explore</span>
        <div className="w-px h-16 bg-titli/10 relative overflow-hidden">
          <motion.div
            className="w-full bg-titli absolute top-0 left-0"
            animate={{ top: ['-100%', '100%'] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            style={{ height: '30%' }}
          />
        </div>
      </motion.div>

      {/* Bottom vignette to blend into next section */}
      <div className="absolute bottom-0 left-0 right-0 h-48 bg-linear-to-t from-forest to-transparent pointer-events-none" />
    </section>
  );
}
