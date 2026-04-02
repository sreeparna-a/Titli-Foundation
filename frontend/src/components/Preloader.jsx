import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

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
        className="absolute top-0 left-0 w-1/2 h-full bg-[#050807] border-r border-[#151f19] z-10"
        initial={{ x: 0 }}
        animate={{ x: progress === 100 ? '-100%' : 0 }}
        transition={{ duration: 1.2, ease: [0.76, 0, 0.24, 1], delay: 0.3 }}
      />
      {/* Right Curtain */}
      <motion.div
        className="absolute top-0 right-0 w-1/2 h-full bg-[#050807] border-l border-[#151f19] z-10"
        initial={{ x: 0 }}
        animate={{ x: progress === 100 ? '100%' : 0 }}
        transition={{ duration: 1.2, ease: [0.76, 0, 0.24, 1], delay: 0.3 }}
      />

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
        <motion.h1 
          className="text-6xl md:text-8xl text-titli font-serif italic tracking-widest mb-6"
          animate={{ textShadow: ["0px 0px 0px #E5FC54", "0px 0px 20px #E5FC54", "0px 0px 0px #E5FC54"] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          Titli
        </motion.h1>
        
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
