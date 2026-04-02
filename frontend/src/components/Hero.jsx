import { motion } from 'framer-motion';
import stageImg from '../assets/stage.png';

// ESLint in this repo doesn't treat `motion.*` JSX element usage as a "use".
void motion;

export default function Hero({ isLoaded }) {
  return (
    <section id="hero" className="relative w-full h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Zoom Effect */}
      <motion.div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${stageImg})` }}
        initial={{ scale: 1.2, filter: 'brightness(0)' }}
        animate={{
          scale: isLoaded ? 1 : 1.2,
          filter: isLoaded ? 'brightness(0.6)' : 'brightness(0)',
        }}
        transition={{ duration: 2.5, ease: 'easeOut' }}
      />

      {/* Overlay gradient to blend with the forest black section below */}
      <div className="absolute inset-0 bg-linear-to-t from-forest via-forest/20 to-forest/60" />

      {/* Main Content */}
      <div className="relative z-10 text-center px-6 w-full max-w-5xl mx-auto flex flex-col items-center">
        <div className="overflow-hidden mb-2 sm:mb-4">
          <motion.h1
            className="text-[3.5rem] xs:text-[4.5rem] sm:text-[6rem] md:text-[8rem] lg:text-[10rem] font-serif text-titli leading-none"
            initial={{ y: '100%' }}
            animate={{ y: isLoaded ? '0%' : '100%' }}
            transition={{ duration: 1.2, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            Titli
          </motion.h1>
        </div>
        <div className="overflow-hidden mb-6 sm:mb-8">
          <motion.h2
            className="text-xl xs:text-2xl sm:text-4xl md:text-5xl lg:text-7xl font-sans font-light tracking-wide text-white/90"
            initial={{ y: '-100%' }}
            animate={{ y: isLoaded ? '0%' : '-100%' }}
            transition={{ duration: 1.2, delay: 1, ease: [0.16, 1, 0.3, 1] }}
          >
            FOUNDATION
          </motion.h2>
        </div>

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
            <span className="h-px w-6 sm:w-8 md:w-16 bg-accent-orange block" />
            <p className="text-sm sm:text-base md:text-xl font-serif text-accent-orange italic">
              A Social Responsibility
            </p>
            <span className="h-px w-6 sm:w-8 md:w-16 bg-accent-orange block" />
          </div>
        </motion.div>
      </div>

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
    </section>
  );
}
