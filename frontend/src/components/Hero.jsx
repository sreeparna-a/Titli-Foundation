import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import stageImg from '../assets/stage.png';
import SplitText from './SplitText';

// ESLint in this repo doesn't treat `motion.*` JSX element usage as a "use".
void motion;

// Tiny floating dust particles that drift upward
function DustParticles() {
  const PARTICLES = Array.from({ length: 24 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,       // vw %
    delay: Math.random() * 8,      // s
    duration: 6 + Math.random() * 8,
    size: 1 + Math.random() * 2,
    opacity: 0.1 + Math.random() * 0.3,
  }));

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-5">
      {PARTICLES.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-titli"
          style={{
            left: `${p.x}%`,
            bottom: '-10px',
            width: p.size,
            height: p.size,
          }}
          animate={{
            y: [0, -(Math.random() * 300 + 200)],
            opacity: [0, p.opacity, 0],
            x: [0, (Math.random() - 0.5) * 60],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: 'easeOut',
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
        {/* "Titli" — SplitText per-char reveal */}
        <div className="overflow-visible mb-0 sm:mb-1">
          <div className="text-[3.5rem] xs:text-[4.5rem] sm:text-[6rem] md:text-[8rem] lg:text-[10rem] font-serif text-titli leading-none">
            <SplitText
              text="Titli"
              mode="chars"
              stagger={0.08}
              delay={0.8}
              trigger={isLoaded}
              viewport={false}
            />
          </div>
        </div>

        {/* "FOUNDATION" — clean white reveal */}
        <div className="overflow-hidden mb-6 sm:mb-8">
          <motion.h2
            className="shimmer-text text-xl xs:text-2xl sm:text-4xl md:text-5xl lg:text-7xl font-sans font-extralight tracking-[0.25em]"
            initial={{ y: '-100%' }}
            animate={{ y: isLoaded ? '0%' : '-100%' }}
            transition={{ duration: 1.2, delay: 1, ease: [0.16, 1, 0.3, 1] }}
          >
            FOUNDATION
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
            Theatre and Cinema
          </p>
          <div className="flex items-center gap-3 sm:gap-4">
            <motion.span
              className="h-px bg-accent-orange block"
              initial={{ width: 0 }}
              animate={{ width: isLoaded ? '4rem' : 0 }}
              transition={{ duration: 1.2, delay: 2.2 }}
            />
            <p className="text-sm sm:text-base md:text-xl font-serif text-accent-orange italic">
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
