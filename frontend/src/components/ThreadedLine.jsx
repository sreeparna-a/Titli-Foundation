import { motion, useScroll, useTransform } from 'framer-motion';

export default function ThreadedLine() {
  const { scrollYProgress } = useScroll();
  
  const pathLength = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <div className="fixed top-0 left-4 md:left-12 lg:left-24 bottom-0 w-[4px] z-30 pointer-events-none mix-blend-screen opacity-80 glow-path hidden sm:block">
      <svg 
        className="w-full h-full"
        viewBox="0 0 10 1000" 
        preserveAspectRatio="none"
      >
        <line x1="5" y1="0" x2="5" y2="1000" stroke="#1c2b24" strokeWidth="2" />
        <motion.line 
          x1="5" y1="0" x2="5" y2="1000" 
          stroke="var(--color-titli)" 
          strokeWidth="3" 
          style={{ pathLength }}
        />
      </svg>
    </div>
  );
}
