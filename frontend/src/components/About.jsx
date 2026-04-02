import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

const wordOpacityRange = (index, total) => {
  const step = 1 / total;
  const start = index * step;
  const end = start + step;
  return [start, end];
};

const ScrollWord = ({ children, progress, range }) => {
  const opacity = useTransform(progress, range, [0.08, 1]);
  const y = useTransform(progress, range, [6, 0]);
  return (
    <motion.span style={{ opacity, y }} className="inline-block mr-[0.25em]">
      {children}
    </motion.span>
  );
};

export default function About() {
  const containerRef = useRef(null);
  const sectionRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start 80%', 'start 20%'],
  });

  const { scrollYProgress: sectionProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  const bgY = useTransform(sectionProgress, [0, 1], ['0%', '-12%']);
  const bgScale = useTransform(sectionProgress, [0, 1], [1.05, 1]);

  const text1 =
    'Established with a deep appreciation for the classical and the contemporary, the Titli Foundation nurtures visionaries in theatre, film, and art. We are a sanctuary for storytellers who dare to push boundaries.';
  const text2 =
    'Our mission extends beyond performance; we believe in art as a tool for immense social responsibility, igniting conversations that reverberate long after the curtains fall.';

  const words1 = text1.split(' ');
  const words2 = text2.split(' ');
  const totalWords = words1.length + words2.length;

  return (
    <section
      id="about"
      ref={sectionRef}
      className="relative w-full min-h-screen flex items-center justify-center py-24 md:py-32 px-4 sm:px-8 md:px-24 overflow-hidden"
    >
      {/* Parallax background faint text */}
      <motion.div
        className="absolute top-1/2 -translate-y-1/2 left-0 w-full overflow-hidden pointer-events-none opacity-[0.025] flex justify-center z-0"
        style={{ y: bgY, scale: bgScale }}
      >
        <span className="text-[8rem] sm:text-[12rem] md:text-[20rem] font-serif uppercase tracking-tighter text-white whitespace-nowrap select-none">
          TITLI
        </span>
      </motion.div>

      {/* Ambient glow blob */}
      <div className="absolute top-1/3 right-0 w-[400px] h-[400px] rounded-full pointer-events-none opacity-60 ambient-glow"
        style={{ background: 'radial-gradient(circle, rgba(41,122,81,0.08) 0%, transparent 70%)' }}
      />

      <div className="max-w-4xl mx-auto w-full relative z-10 pl-0 sm:pl-12 lg:pl-24">

        {/* Section tag */}
        <motion.div
          className="flex items-center gap-4 mb-8"
          initial={{ opacity: 0, x: -60 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        >
          <motion.span
            className="text-xs uppercase tracking-[0.3em] font-sans text-accent-green"
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
          >
            01
          </motion.span>
          <motion.span
            className="h-px bg-accent-green"
            initial={{ width: 0 }}
            whileInView={{ width: 48 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.4 }}
          />
          <h2 className="text-xs md:text-sm uppercase tracking-[0.3em] font-sans text-white/50">The Vision</h2>
        </motion.div>

        {/* Headline reveal */}
        <motion.h3
          className="text-2xl sm:text-3xl md:text-5xl lg:text-7xl font-serif text-white leading-tight mb-10 md:mb-16"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 1.1, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
        >
          An independent{' '}
          <span className="text-titli italic text-stroke-hover transition-colors cursor-default">
            cultural
          </span>{' '}
          community bridging the gap between raw artistic expression and social impact.
        </motion.h3>

        {/* Scroll-animated words */}
        <div
          ref={containerRef}
          className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 font-sans text-white text-base md:text-lg font-light leading-relaxed"
        >
          <p>
            {words1.map((word, i) => (
              <ScrollWord
                key={`w1-${i}`}
                progress={scrollYProgress}
                range={wordOpacityRange(i, totalWords)}
              >
                {word}
              </ScrollWord>
            ))}
          </p>
          <p>
            {words2.map((word, i) => (
              <ScrollWord
                key={`w2-${i}`}
                progress={scrollYProgress}
                range={wordOpacityRange(i + words1.length, totalWords)}
              >
                {word}
              </ScrollWord>
            ))}
          </p>
        </div>

        {/* Bottom counter / decoration */}
        <motion.div
          className="mt-12 md:mt-20 flex items-center gap-4 sm:gap-6 flex-wrap"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          {[
            { num: '12+', label: 'Years of Art' },
            { num: '60+', label: 'Productions' },
            { num: '∞', label: 'Stories Told' },
          ].map((stat, i) => (
            <div key={i} className="flex flex-col items-center border-l border-white/10 pl-4 sm:pl-6 first:border-0 first:pl-0">
              <span className="font-serif text-2xl sm:text-3xl text-titli">{stat.num}</span>
              <span className="text-[8px] sm:text-[9px] uppercase tracking-[0.2em] sm:tracking-[0.3em] text-white/30 font-sans mt-1">{stat.label}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
