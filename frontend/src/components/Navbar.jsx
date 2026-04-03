import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import MagneticButton from './MagneticButton';

// ESLint in this repo doesn't treat `motion.*` JSX element usage as a "use".
void motion;

const navItems = [
  { name: 'Home', href: '#hero' },
  { name: 'About', href: '#about' },
  { name: 'Events', href: '#events' },
  { name: 'Members', href: '#members' },
  { name: 'Gallery', href: '#gallery' },
  { name: 'Contact', href: '#contact' },
];

export default function Navbar() {
  const [isGalleryActive, setIsGalleryActive] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleGallery = (e) => setIsGalleryActive(e.detail);
    window.addEventListener('gallery-active', handleGallery);
    return () => window.removeEventListener('gallery-active', handleGallery);
  }, []);

  const scrollTo = (href) => {
    setMenuOpen(false);
    setTimeout(() => {
      document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
    }, 50);
  };

  const navItemVariants = {
    initial: { opacity: 0, y: 30, filter: 'blur(10px)' },
    animate: (i) => ({
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      transition: {
        delay: i * 0.1 + 0.2,
        duration: 0.8,
        ease: [0.215, 0.61, 0.355, 1],
      },
    }),
    exit: (i) => ({
      opacity: 0,
      y: 20,
      filter: 'blur(5px)',
      transition: {
        delay: (navItems.length - i) * 0.05,
        duration: 0.4,
        ease: [0.645, 0.045, 0.355, 1],
      },
    }),
  };

  return (
    <>
      {/* ── Universal Top Bar ─────────────────────────────────────────── */}
      <motion.div
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-10 py-5 transition-all duration-500"
        initial={{ y: -100, opacity: 0 }}
        animate={{ 
          y: isGalleryActive ? -120 : 0, 
          opacity: isGalleryActive ? 0 : 1,
          pointerEvents: isGalleryActive ? 'none' : 'auto'
        }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        style={{
          // Always visible navbar, but fully transparent.
          background: 'transparent',
          backdropFilter: 'blur(0px)',
          WebkitBackdropFilter: 'blur(0px)',
          borderBottom: 'none',
        }}
      >
        {/* Logo */}
        <a 
          href="#hero" 
          onClick={(e) => { e.preventDefault(); scrollTo('#hero'); }} 
          className="group flex items-center gap-3 cursor-pointer"
        >
          <div className="relative group">
            <div className="w-10 h-10 rounded-full border border-titli overflow-hidden shadow-[0_0_15px_rgba(229,252,84,0.3)] group-hover:shadow-[0_0_25px_rgba(229,252,84,0.5)] transition-all duration-500">
              <img src="/logo-rounded.png" alt="Logo" className="w-full h-full object-cover origin-center transition-transform duration-500 scale-125 group-hover:scale-150" />
            </div>
            <div className="absolute inset-0 rounded-full bg-titli/10 scale-0 group-hover:scale-150 transition-transform duration-700 blur-2xl -z-10" />
          </div>
          <span className="font-serif italic text-titli text-xl md:text-2xl tracking-tighter opacity-90 group-hover:opacity-100 transition-opacity">Titli</span>
        </a>

        {/* Hamburger Menu Toggle */}
        <MagneticButton strength={0.4}>
        <button
          onClick={() => setMenuOpen((v) => !v)}
          aria-label="Toggle menu"
          className="group relative flex flex-col justify-center items-center w-12 h-12 gap-[6px] rounded-full hover:bg-white/5 transition-all duration-500 overflow-hidden"
          data-cursor="magnetic"
        >
          <motion.span
            className="block w-6 h-[1.5px] bg-titli/80 origin-center"
            animate={{ 
              rotate: menuOpen ? 45 : 0, 
              y: menuOpen ? 4 : 0,
              width: menuOpen ? '24px' : '20px'
            }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          />
          <motion.span
            className="block w-4 h-[1.5px] bg-titli/80"
            animate={{ 
              opacity: menuOpen ? 0 : 1,
              x: menuOpen ? 20 : 0
            }}
            transition={{ duration: 0.3 }}
          />
          <motion.span
            className="block w-6 h-[1.5px] bg-titli/80 origin-center"
            animate={{ 
              rotate: menuOpen ? -45 : 0, 
              y: menuOpen ? -4 : 0,
              width: menuOpen ? '24px' : '28px'
            }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          />
          
          {/* Hover pulse effect */}
          <div className="absolute inset-0 bg-titli/5 scale-0 group-hover:scale-100 transition-transform duration-500 rounded-full -z-10" />
        </button>
        </MagneticButton>
      </motion.div>

      {/* ── Fullscreen Overlay Menu ──────────────────────────────────── */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="fixed inset-0 z-40 flex flex-col items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: 'linear' }}
          >
            {/* Background Blur Overlay */}
            <motion.div 
               className="absolute inset-0 bg-[#080E0B]/95 backdrop-blur-2xl"
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
            />

            {/* Menu Items */}
            <nav className="relative z-10 flex flex-col items-center gap-4 md:gap-8 pt-30 pb-24 px-10">
              {navItems.map((item, i) => (
                <motion.div
                  key={item.name}
                  custom={i}
                  variants={navItemVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  className="overflow-hidden group"
                >
                  <a
                    href={item.href}
                    className="relative block py-2 px-10 text-center"
                    onClick={(e) => { e.preventDefault(); scrollTo(item.href); }}
                    data-cursor="magnetic"
                  >
                    {/* Hover Glow Effect */}
                    <span className="absolute inset-0 bg-titli/0 group-hover:bg-titli/5 blur-2xl rounded-full transition-all duration-500 scale-0 group-hover:scale-110" />
                    
                    <span className="relative flex flex-col items-center">
                      <span className="font-serif text-4xl md:text-6xl text-white/80 md:text-white/40 md:group-hover:text-titli transition-all duration-500 italic lowercase tracking-tighter">
                        {item.name}
                      </span>
                      
                      {/* Animated underline */}
                      <span className="block h-px bg-titli/30 mt-2 w-full md:w-0 md:group-hover:w-full transition-all duration-700 ease-out" />
                      
                      {/* Numbering (aesthetic) */}
                      <span className="absolute -left-4 top-1/2 -translate-y-1/2 font-sans text-[10px] tracking-[0.4em] text-titli/10 group-hover:text-titli/40 transition-colors uppercase">
                        0{i + 1}
                      </span>
                    </span>
                  </a>
                </motion.div>
              ))}
            </nav>

            {/* Bottom Right Footer Info */}
            <motion.div 
              className="absolute bottom-6 right-6 md:bottom-12 md:right-12 z-10 flex flex-col items-end gap-2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8 }}
            >
              <div className="w-12 h-px bg-titli/20" />
              <p className="text-[9px] md:text-xs uppercase tracking-[0.4em] text-white/20 font-sans text-right">
                Titli Foundation<br/>
                <span className="text-titli/40">ESTD 2008</span>
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
