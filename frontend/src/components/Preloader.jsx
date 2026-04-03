import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

// ESLint in this repo doesn't treat `motion.*` JSX element usage as a "use".
void motion;

export default function Preloader({ onComplete }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 2;
      });
    }, 30);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (progress === 100) {
      const timeout = setTimeout(onComplete, 1500); // Give time for curtain to open
      return () => clearTimeout(timeout);
    }
  }, [progress, onComplete]);

  if (progress === 100) {
     // We still render it during the exit animation, then parent unmounts it
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden">
      {/* Left Curtain */}
      <motion.div
        className="absolute top-0 left-0 w-1/2 h-full z-10 overflow-hidden bg-forest"
        style={{
          backgroundImage: `url('/curtain-texture.png')`,
          backgroundSize: 'cover',
          backgroundPosition: 'right',
          transformOrigin: 'left center'
        }}
        initial={{ x: 0, scaleX: 1, skewX: 0 }}
        animate={{ 
          x: progress === 100 ? '-100%' : 0,
          scaleX: progress === 100 ? 0.6 : 1,
          skewX: progress === 100 ? 2 : 0,
          filter: progress === 100 ? 'brightness(0.5)' : 'brightness(1)'
        }}
        transition={{ duration: 1.8, ease: [0.76, 0, 0.24, 1], delay: 0.2 }}
      >
        {/* Depth & Folds Overlay */}
        <div className="absolute inset-0 bg-linear-to-r from-forest/80 via-transparent to-black/40 pointer-events-none" />
        <div className="absolute inset-0 bg-[repeating-linear-gradient(90deg,transparent,rgba(0,0,0,0.2)_10%,transparent_20%)] opacity-30 pointer-events-none" />
        {/* Center Edge Highlight */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: progress === 100 ? 1 : 0 }}
          className="absolute right-0 top-0 w-[2px] h-full bg-titli/20 shadow-[0_0_20px_rgba(229,252,84,0.3)] z-20" 
        />
      </motion.div>

      {/* Right Curtain */}
      <motion.div
        className="absolute top-0 right-0 w-1/2 h-full z-10 overflow-hidden bg-forest"
        style={{
          backgroundImage: `url('/curtain-texture.png')`,
          backgroundSize: 'cover',
          backgroundPosition: 'left',
          transformOrigin: 'right center'
        }}
        initial={{ x: 0, scaleX: 1, skewX: 0 }}
        animate={{ 
          x: progress === 100 ? '100%' : 0,
          scaleX: progress === 100 ? 0.6 : 1,
          skewX: progress === 100 ? -2 : 0,
          filter: progress === 100 ? 'brightness(0.5)' : 'brightness(1)'
        }}
        transition={{ duration: 1.8, ease: [0.76, 0, 0.24, 1], delay: 0.2 }}
      >
        {/* Depth & Folds Overlay */}
        <div className="absolute inset-0 bg-linear-to-l from-forest/80 via-transparent to-black/40 pointer-events-none" />
        <div className="absolute inset-0 bg-[repeating-linear-gradient(-90deg,transparent,rgba(0,0,0,0.2)_10%,transparent_20%)] opacity-30 pointer-events-none" />
        {/* Center Edge Highlight */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: progress === 100 ? 1 : 0 }}
          className="absolute left-0 top-0 w-[2px] h-full bg-titli/20 shadow-[0_0_20px_rgba(229,252,84,0.3)] z-20" 
        />
      </motion.div>

      {/* Center Content */}
      <motion.div
        className="relative z-20 text-center flex flex-col items-center justify-center"
        initial={{ opacity: 1, scale: 1 }}
        animate={{ 
          opacity: progress === 100 ? 0 : 1,
          scale: progress === 100 ? 1.1 : 1
        }}
        transition={{ duration: 0.8 }}
      >
        <motion.div
           animate={{ filter: ["drop-shadow(0px 0px 0px rgba(229, 252, 84, 0))", "drop-shadow(0px 0px 20px rgba(229, 252, 84, 0.4))", "drop-shadow(0px 0px 0px rgba(229, 252, 84, 0))"] }}
           className="mb-8"
        >
          <div className="w-32 h-32 md:w-48 md:h-48 overflow-hidden rounded-full border border-titli shadow-[0_0_30px_rgba(229,252,84,0.4)]">
            <img 
              src="/logo-rounded.png" 
              alt="Titli Foundation Logo"
              className="w-full h-full object-cover scale-125"
            />
          </div>
        </motion.div>
        
        <div className="h-px w-64 bg-[#1a251e] relative overflow-hidden">
          <motion.div 
            className="absolute top-0 left-0 h-full bg-titli"
            style={{ width: `${progress}%` }}
          />
        </div>
        
        <div className="mt-4 text-xs font-sans tracking-[0.3em] text-titli opacity-60">
          {progress.toString().padStart(3, '0')}%
        </div>
      </motion.div>
    </div>
  );
}
