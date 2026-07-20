import { useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

// ESLint in this repo doesn't treat `motion.*` JSX element usage as a "use".
void motion;

/**
 * CustomCursor — A fluid, context-aware cursor.
 *
 * The outer ring lazily follows the real cursor position via spring physics.
 * The inner dot follows instantly.
 *
 * States driven by data-cursor attributes on interactive elements:
 *   data-cursor="magnetic"  → ring expands to 80px, turns titli-yellow
 *   data-cursor="view"      → ring shows text label (e.g. "View")
 *   data-cursor="text"      → ring shrinks & goes blue-white (hover over text blocks)
 */
export default function CustomCursor() {
  // Raw mouse position (no smoothing — used for inner dot)
  const rawX = useMotionValue(-100);
  const rawY = useMotionValue(-100);

  // Outer ring follows with spring lag
  const springConfig = { stiffness: 180, damping: 22, mass: 0.6 };
  const ringX = useSpring(rawX, springConfig);
  const ringY = useSpring(rawY, springConfig);

  const [state, setState] = useState('default'); // 'default' | 'magnetic' | 'view' | 'text' | 'hidden'
  const [label, setLabel] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const cursorRef = useRef(null);

  const stateRef = useRef('default');
  const labelRef = useRef('');
  const isVisibleRef = useRef(false);

  const updateCursorState = (newState, newLabel = '') => {
    if (stateRef.current !== newState || labelRef.current !== newLabel) {
      stateRef.current = newState;
      labelRef.current = newLabel;
      setState(newState);
      setLabel(newLabel);
    }
  };

  useEffect(() => {
    // Check if we are on desktop/laptop size with a fine pointer (mouse/trackpad)
    const checkIsDesktop = () => {
      const hasFinePointer = window.matchMedia('(pointer: fine)').matches;
      setIsDesktop(window.innerWidth >= 1024 && hasFinePointer);
    };

    checkIsDesktop();
    window.addEventListener('resize', checkIsDesktop);

    const onMove = (e) => {
      rawX.set(e.clientX);
      rawY.set(e.clientY);
      if (!isVisibleRef.current) {
        isVisibleRef.current = true;
        setIsVisible(true);
      }
    };

    const onLeave = () => {
      isVisibleRef.current = false;
      setIsVisible(false);
    };

    const onEnter = () => {
      isVisibleRef.current = true;
      setIsVisible(true);
    };

    // Detect which element the cursor is over
    const onOver = (e) => {
      let el = e.target;
      let depth = 0;
      // Walk up the DOM up to 5 levels max to find data-cursor attribute or interactive element
      while (el && el !== document.body && depth < 5) {
        const c = el.getAttribute?.('data-cursor');
        if (c) {
          const l = el.getAttribute('data-cursor-label') || c.charAt(0).toUpperCase() + c.slice(1);
          updateCursorState(c, l);
          return;
        }
        // Detect interactive elements automatically
        const tag = el.tagName?.toLowerCase();
        if (tag === 'a' || tag === 'button' || el.getAttribute?.('role') === 'button') {
          updateCursorState('magnetic', '');
          return;
        }
        el = el.parentElement;
        depth++;
      }
      updateCursorState('default', '');
    };

    if (isDesktop) {
      document.addEventListener('mousemove', onMove, { passive: true });
      document.addEventListener('mouseleave', onLeave);
      document.addEventListener('mouseenter', onEnter);
      document.addEventListener('mouseover', onOver, { passive: true });
    }

    return () => {
      window.removeEventListener('resize', checkIsDesktop);
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseleave', onLeave);
      document.removeEventListener('mouseenter', onEnter);
      document.removeEventListener('mouseover', onOver);
    };
  }, [rawX, rawY, isDesktop]);

  // State-derived ring styles
  const ringSize = state === 'magnetic' ? 72 : state === 'view' ? 88 : state === 'text' ? 24 : 48;
  const ringBorder = state === 'magnetic'
    ? '1.5px solid rgba(229,252,84,0.8)'
    : state === 'view'
    ? '1.5px solid rgba(255,255,255,0.6)'
    : state === 'text'
    ? '1px solid rgba(255,255,255,0.2)'
    : '1px solid rgba(229,252,84,0.4)';
  const ringBg = state === 'magnetic'
    ? 'rgba(229,252,84,0.06)'
    : state === 'view'
    ? 'rgba(255,255,255,0.04)'
    : 'transparent';

  // Inner dot size
  const dotSize = state === 'magnetic' ? 4 : state === 'text' ? 2 : 5;

  if (!isDesktop) return null;

  return (
    <>
      {/* Outer trailing ring */}
      <motion.div
        ref={cursorRef}
        className="fixed top-0 left-0 pointer-events-none z-100001 flex items-center justify-center will-change-transform transform-gpu"
        style={{
          x: ringX,
          y: ringY,
          translateX: '-50%',
          translateY: '-50%',
          opacity: isVisible ? 1 : 0,
        }}
        animate={{
          width: ringSize,
          height: ringSize,
          borderRadius: '50%',
          border: ringBorder,
          background: ringBg,
        }}
        transition={{ width: { duration: 0.25, ease: 'easeOut' }, height: { duration: 0.25, ease: 'easeOut' }, border: { duration: 0.2 }, default: { duration: 0.2 } }}
      >
        {/* Label text inside ring — only for "view" state */}
        {state === 'view' && label && (
          <motion.span
            className="text-[9px] uppercase tracking-[0.2em] font-sans text-white/80 select-none"
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {label}
          </motion.span>
        )}
      </motion.div>

      {/* Inner crisp dot */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-100001 rounded-full bg-titli transform-gpu"

        style={{
          x: rawX,
          y: rawY,
          translateX: '-50%',
          translateY: '-50%',
          opacity: isVisible ? 1 : 0,
        }}
        animate={{ width: dotSize, height: dotSize }}
        transition={{ duration: 0.15 }}
      />
    </>
  );
}

