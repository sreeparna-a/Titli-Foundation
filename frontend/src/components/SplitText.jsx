import { motion } from 'framer-motion';

// ESLint in this repo doesn't treat `motion.*` JSX element usage as a "use".
void motion;

/**
 * SplitText — animates each character or word with a staggered reveal.
 *
 * Props:
 *   text        {string}  — text to split
 *   className   {string}  — class for the container span
 *   charClass   {string}  — class for each character span
 *   delay       {number}  — delay before animation starts (seconds)
 *   mode        {string}  — 'chars' | 'words' (default: 'chars')
 *   stagger     {number}  — stagger between chars/words (seconds)
 *   once        {boolean} — animate only once (default: true)
 *   trigger     {boolean} — when true, trigger animation (works with isLoaded pattern)
 *   viewport    {boolean} — when true, use whileInView (default)
 */
export default function SplitText({
  text = '',
  className = '',
  charClass = '',
  delay = 0,
  mode = 'chars',
  stagger = 0.04,
  once = true,
  trigger,         // if provided, uses animate={trigger ? ... : ...} pattern
  viewport = true, // if false, uses trigger prop instead of viewport
}) {
  const units = mode === 'words' ? text.split(' ') : text.split('');

  const container = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: stagger,
        delayChildren: delay,
      },
    },
  };

  const item = {
    hidden: { y: '110%', opacity: 0, rotateX: 15, filter: 'blur(4px)' },
    show: {
      y: '0%',
      opacity: 1,
      rotateX: 0,
      filter: 'blur(0px)',
      transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] },
    },
  };

  const animateProps = viewport
    ? {
        initial: 'hidden',
        whileInView: 'show',
        viewport: { once, margin: '-60px' },
      }
    : {
        initial: 'hidden',
        animate: trigger ? 'show' : 'hidden',
      };

  return (
    <motion.span
      className={`inline-block overflow-hidden ${className}`}
      variants={container}
      {...animateProps}
      style={{ perspective: '600px' }}
    >
      {units.map((unit, i) => (
        <span
          key={i}
          className="inline-block overflow-hidden"
          style={{ verticalAlign: 'bottom' }}
        >
          <motion.span
            className={`inline-block ${charClass}`}
            variants={item}
            style={{ transformOrigin: 'bottom center' }}
          >
            {unit}
            {/* Add space between words */}
            {mode === 'words' && i < units.length - 1 ? '\u00A0' : ''}
          </motion.span>
        </span>
      ))}
    </motion.span>
  );
}
