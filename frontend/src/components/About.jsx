import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

// ESLint in this repo doesn't treat `motion.*` JSX element usage as a "use".
void motion;

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

import aboutImg from '../assets/about_theatre.png';

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
  const photoY = useTransform(sectionProgress, [0, 1], [30, -35]);
  const headlineY = useTransform(sectionProgress, [0, 1], [-15, 15]);

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
        <span className="text-[5rem] xs:text-[7rem] sm:text-[12rem] md:text-[20rem] font-serif uppercase tracking-tighter text-white whitespace-nowrap select-none">
          TITLI
        </span>
      </motion.div>

      {/* Ambient glow blob */}
      <div className="absolute top-1/3 right-0 w-[400px] h-[400px] rounded-full pointer-events-none opacity-60 ambient-glow"
        style={{ background: 'radial-gradient(circle, rgba(41,122,81,0.08) 0%, transparent 70%)' }}
      />

      {/* 2-Column / 3-Row Grid Container */}
      <div className="max-w-6xl mx-auto w-full relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-x-12 lg:gap-x-20 gap-y-4 lg:gap-y-0 items-stretch">
        
        {/* 1. Section Tag */}
        <motion.div
          className="order-1 lg:col-start-6 lg:col-span-7 lg:row-start-1 flex items-center gap-4 mb-4 lg:mb-6"
          initial={{ opacity: 0, x: -40 }}
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

        {/* 2. Headline */}
        <motion.h3
          style={{ y: headlineY }}
          className="order-2 lg:col-start-6 lg:col-span-7 lg:row-start-2 text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-serif text-white leading-tight mb-8"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 1.2, delay: 0.15, ease: 'easeOut' }}
        >
          An independent{' '}
          <span className="text-titli italic md:text-stroke md:text-stroke-hover transition-colors cursor-default">
            cultural
          </span>{' '}
          community bridging the gap between raw artistic expression and social impact.
        </motion.h3>

        {/* 3. Left Column: Interactive Theater Image */}
        <motion.div
          className="order-3 lg:col-span-5 lg:row-start-2 flex justify-center lg:justify-end items-center lg:items-start w-full mb-8 lg:mb-0 lg:h-full"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Main card/image frame with scroll parallax */}
          <motion.div
            style={{ y: photoY }}
            className="relative w-full aspect-4/5 lg:w-auto lg:h-[94%] lg:aspect-3/4 max-w-[380px] lg:max-w-none group"
          >
            
            {/* Viewfinder Brackets with hover contraction */}
            <div className="viewfinder-bracket viewfinder-bracket-tl transition-all duration-500 group-hover:translate-x-1.5 group-hover:translate-y-1.5" />
            <div className="viewfinder-bracket viewfinder-bracket-tr transition-all duration-500 group-hover:-translate-x-1.5 group-hover:translate-y-1.5" />
            <div className="viewfinder-bracket viewfinder-bracket-bl transition-all duration-500 group-hover:translate-x-1.5 group-hover:-translate-y-1.5" />
            <div className="viewfinder-bracket viewfinder-bracket-br transition-all duration-500 group-hover:-translate-x-1.5 group-hover:-translate-y-1.5" />

            {/* Glowing borders behind the image */}
            <div className="absolute inset-0 bg-accent-green/5 rounded-lg blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
            <div className="absolute inset-0 bg-titli/5 rounded-lg blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none delay-100" />
            
            {/* The Image Container with Clip Reveal and Hover Scale */}
            <motion.div
              className="relative w-full h-full overflow-hidden rounded-lg border border-white/10 bg-[#0c1410] select-none shadow-[0_20px_50px_rgba(0,0,0,0.6)]"
              initial={{ clipPath: 'inset(100% 0% 0% 0%)' }}
              whileInView={{ clipPath: 'inset(0% 0% 0% 0%)' }}
              viewport={{ once: true }}
              transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
              whileHover={{ 
                scale: 1.03,
                boxShadow: "0 30px 60px rgba(0,0,0,0.8), 0 0 30px rgba(229,252,84,0.15)",
              }}
            >
              {/* Image itself */}
              <img
                src={aboutImg}
                alt="Titli Cinematic Stage"
                className="w-full h-full object-cover grayscale-15 group-hover:grayscale-0 contrast-105 group-hover:scale-105 transition-all duration-700 ease-out"
                draggable="false"
              />

              {/* Light leak overlay effect */}
              <div className="light-leak opacity-40 group-hover:opacity-75 transition-opacity duration-700" />

              {/* Localized Film Grain */}
              <div className="film-grain" />

              {/* Inner ambient vignette shadow */}
              <div className="absolute inset-0 shadow-[inset_0_0_80px_rgba(0,0,0,0.8)] pointer-events-none" />

              {/* Title tag revealed on hover */}
              <div className="absolute bottom-6 left-6 right-6 z-10 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 ease-out pointer-events-none">
                <p className="text-[10px] uppercase tracking-[0.3em] font-sans text-titli/90">Sanctuary of Stories</p>
                <h4 className="text-sm font-serif italic text-white mt-1">Est. 2008</h4>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* 4. Narrative Content */}
        <div className="order-4 lg:col-start-6 lg:col-span-7 lg:row-start-3 flex flex-col justify-start lg:mt-8">
          
          {/* Scroll-animated words */}
          <div
            ref={containerRef}
            className="font-sans text-white/90 text-base sm:text-lg lg:text-xl font-light leading-relaxed space-y-6 max-w-2xl"
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
            className="mt-10 md:mt-12 flex items-center gap-4 sm:gap-8 flex-wrap"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            {[
              { num: '15+', label: 'Years of Art' },
              { num: '60+', label: 'Productions' },
              { num: '∞', label: 'Stories Told' },
            ].map((stat, i) => (
              <div key={i} className="flex flex-col items-start border-l border-white/10 pl-4 sm:pl-6 first:border-0 first:pl-0">
                <span className="font-serif text-2xl sm:text-3xl lg:text-4xl text-titli">{stat.num}</span>
                <span className="text-[9px] sm:text-[10px] uppercase tracking-[0.25em] text-white/40 font-sans mt-1">{stat.label}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
