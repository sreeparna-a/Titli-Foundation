import { useRef, useState } from 'react';
import { motion } from 'framer-motion';

// ESLint in this repo doesn't treat `motion.*` JSX element usage as a "use".
void motion;

/**
 * MagneticButton — wraps any child in a magnetic pull container.
 *
 * When the cursor enters the defined "zone" (padding around the element),
 * the child glides toward the cursor. On leave it snaps back via spring.
 *
 * Usage:
 *   <MagneticButton>
 *     <button>Click me</button>
 *   </MagneticButton>
 */
export default function MagneticButton({ children, strength = 0.35, className = '' }) {
  const ref = useRef(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [isActive, setIsActive] = useState(false);

  const handleMouseMove = (e) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    setPos({
      x: (e.clientX - cx) * strength,
      y: (e.clientY - cy) * strength,
    });
  };

  const handleMouseLeave = () => {
    setPos({ x: 0, y: 0 });
    setIsActive(false);
  };

  const handleMouseEnter = () => {
    setIsActive(true);
  };

  return (
    <div
      ref={ref}
      className={`relative inline-block ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={handleMouseEnter}
      data-cursor="magnetic"
    >
      <motion.div
        animate={{ x: pos.x, y: pos.y }}
        transition={{
          type: 'spring',
          stiffness: 200,
          damping: 18,
          mass: 0.5,
        }}
      >
        {children}
      </motion.div>

      {/* Subtle glow halo when active */}
      {isActive && (
        <motion.div
          className="absolute inset-0 rounded-full pointer-events-none"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1.5 }}
          exit={{ opacity: 0 }}
          style={{ background: 'radial-gradient(circle, rgba(229,252,84,0.08) 0%, transparent 70%)' }}
          transition={{ duration: 0.4 }}
        />
      )}
    </div>
  );
}
