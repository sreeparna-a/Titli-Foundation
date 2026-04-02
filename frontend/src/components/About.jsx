import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

const wordOpacityRange = (index, total) => {
  const step = 1 / total;
  const start = index * step;
  const end = start + step;
  return [start, end];
};

const ScrollWord = ({ children, progress, range }) => {
  const opacity = useTransform(progress, range, [0.1, 1]);
  return (
    <motion.span style={{ opacity }} className="inline-block mr-[0.25em]">
      {children}
    </motion.span>
  );
};

export default function About() {
  const containerRef = useRef(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 80%", "start 20%"]
  });

  const text1 = "Established with a deep appreciation for the classical and the contemporary, the Titli Foundation nurtures visionaries in theatre, film, and art. We are a sanctuary for storytellers who dare to push boundaries.";
  const text2 = "Our mission extends beyond performance; we believe in art as a tool for immense social responsibility, igniting conversations that reverberate long after the curtains fall.";
  
  const words1 = text1.split(" ");
  const words2 = text2.split(" ");
  const totalWords = words1.length + words2.length;

  return (
    <section id="about" className="relative w-full min-h-screen flex items-center justify-center py-24 px-4 sm:px-8 md:px-24">
      <div className="max-w-4xl mx-auto w-full relative z-10 pl-0 sm:pl-12 lg:pl-24">
        
        <motion.div 
          className="flex items-center gap-4 mb-8"
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
        >
          <span className="text-xs uppercase tracking-[0.3em] font-sans text-accent-green">01</span>
          <span className="w-12 h-px bg-accent-green"></span>
          <h2 className="text-xs md:text-sm uppercase tracking-[0.3em] font-sans text-white/50">The Vision</h2>
        </motion.div>

        <motion.h3 
          className="text-3xl md:text-5xl lg:text-7xl font-serif text-white leading-tight mb-12"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1, delay: 0.2 }}
        >
          An independent <span className="text-titli italic text-stroke-hover transition-colors">cultural</span> community bridging the gap between raw artistic expression and social impact.
        </motion.h3>

        <div 
          ref={containerRef}
          className="grid grid-cols-1 md:grid-cols-2 gap-12 font-sans text-white text-lg font-light leading-relaxed"
        >
          <p>
            {words1.map((word, i) => (
              <ScrollWord key={`w1-${i}`} progress={scrollYProgress} range={wordOpacityRange(i, totalWords)}>
                {word}
              </ScrollWord>
            ))}
          </p>
          <p>
            {words2.map((word, i) => (
              <ScrollWord key={`w2-${i}`} progress={scrollYProgress} range={wordOpacityRange(i + words1.length, totalWords)}>
                {word}
              </ScrollWord>
            ))}
          </p>
        </div>
      </div>

      {/* Decorative large faint text in background */}
      <div className="absolute top-1/2 -translate-y-1/2 left-0 w-full overflow-hidden pointer-events-none opacity-[0.03] flex justify-center z-0">
        <span className="text-[20rem] font-serif uppercase tracking-tighter text-white whitespace-nowrap">
          TITLI
        </span>
      </div>
    </section>
  );
}
