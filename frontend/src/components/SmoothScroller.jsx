import { useEffect } from 'react';
import Lenis from 'lenis';

export default function SmoothScroller({ children }) {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1.2,
      touchMultiplier: 0, // Disable smooth scroll on touch
    });

    // Expose instance so modals can pause smooth scrolling while open.
    window.__lenisInstance = lenis;

    let rafId;

    function raf(time) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
      if (window.__lenisInstance === lenis) delete window.__lenisInstance;
    };
  }, []);

  return <>{children}</>;
}
