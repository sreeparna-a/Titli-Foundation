import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

/**
 * CardStackSection — wraps a section so it stacks on top of the previous
 * as the user scrolls, creating a cinematic "card reveal" effect.
 * 
 * @param {number} index - position in stack (0-based)
 * @param {string} bgColor - tailwind or CSS bg for this card
 */
export default function CardStackSection({ children, index, totalCards = 5 }) {
  const ref = useRef(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'start start'],
  });

  // Scale down the card slightly as the next one enters
  const scale = useTransform(scrollYProgress, [0, 1], [0.88 + index * 0.02, 1]);
  const y = useTransform(scrollYProgress, [0, 1], ['8vh', '0vh']);
  const opacity = useTransform(scrollYProgress, [0, 0.3, 1], [0, 0.5, 1]);
  const borderRadius = useTransform(scrollYProgress, [0, 1], [24, 0]);

  return (
    <motion.div
      ref={ref}
      style={{
        scale,
        y,
        opacity,
        borderRadius,
        transformOrigin: 'top center',
      }}
      className="relative will-change-transform overflow-hidden"
    >
      {children}
    </motion.div>
  );
}
