import { motion } from 'framer-motion';

// ESLint in this repo doesn't treat `motion.*` JSX element usage as a "use".
void motion;

const curveVariants = (delay) => ({
  initial: {
    d: "M0 0 L100 0 L100 100 Q50 130 0 100 Z"
  },
  animate: {
    d: "M0 0 L100 0 L100 0 Q50 0 0 0 Z",
    transition: {
      duration: 0.8,
      ease: [0.76, 0, 0.24, 1],
      delay: delay
    }
  },
  exit: {
    d: "M0 0 L100 0 L100 100 Q50 130 0 100 Z",
    transition: {
      duration: 0.8,
      ease: [0.76, 0, 0.24, 1],
      delay: delay
    }
  }
});

const brandVariants = {
  initial: {
    opacity: 1,
    scale: 1,
    filter: 'blur(0px)'
  },
  animate: {
    opacity: 0,
    scale: 1.15,
    filter: 'blur(10px)',
    transition: {
      duration: 0.6,
      ease: [0.76, 0, 0.24, 1],
      delay: 0.1
    }
  },
  exit: {
    opacity: 1,
    scale: 1,
    filter: 'blur(0px)',
    transition: {
      duration: 0.6,
      ease: [0.76, 0, 0.24, 1],
      delay: 0.25
    }
  }
};

export default function PageTransition({ children }) {
  return (
    <div className="relative">
      {/* Page Content wrapper */}
      <motion.div
        initial={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0.8, y: -20, scale: 0.98 }}
        transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
        className="w-full relative z-10"
      >
        {children}
      </motion.div>

      {/* Fullscreen Curtain SVGs */}
      <div className="fixed inset-0 pointer-events-none z-100 w-screen h-screen">
        <svg 
          className="absolute inset-0 w-full h-full" 
          viewBox="0 0 100 100" 
          preserveAspectRatio="none"
        >
          {/* Lime Accent Curtain (Peels first on enter, leads on exit) */}
          <motion.path
            variants={curveVariants(0.05)}
            initial="initial"
            animate="animate"
            exit="exit"
            fill="var(--color-titli)"
          />
          {/* Dark Forest Curtain (Peels second on enter, follows on exit) */}
          <motion.path
            variants={curveVariants(0.15)}
            initial="initial"
            animate="animate"
            exit="exit"
            fill="var(--color-forest)"
          />
        </svg>
      </div>

      {/* Brand logo overlay inside the transition */}
      <motion.div
        variants={brandVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        className="fixed inset-0 flex flex-col items-center justify-center z-110 pointer-events-none"
      >
        <div className="flex flex-col items-center gap-4">
          <div className="w-24 h-24 md:w-32 md:h-32 rounded-full border border-titli/40 overflow-hidden shadow-[0_0_35px_rgba(229,252,84,0.3)] bg-forest/90 flex items-center justify-center">
            <img 
              src="/logo-rounded.png" 
              alt="Titli Foundation" 
              className="w-full h-full object-cover scale-125 select-none" 
            />
          </div>
          <div className="flex flex-col items-center">
            <h2 className="font-serif italic text-titli text-4xl md:text-5xl tracking-widest text-shadow-[0_0_20px_rgba(229,252,84,0.2)]">
              titli
            </h2>
            <span className="text-[9px] uppercase tracking-[0.45em] text-white/30 font-sans mt-2">
              theatre · film · art
            </span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
