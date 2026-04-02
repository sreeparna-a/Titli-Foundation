import { motion, useScroll, useMotionValueEvent, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

const navItems = [
  { name: 'Home', href: '#hero' },
  { name: 'About', href: '#about' },
  { name: 'Events', href: '#events' },
  { name: 'Members', href: '#members' },
  { name: 'Gallery', href: '#gallery' },
  { name: 'Contact', href: '#contact' },
];

export default function Navbar({ isLoaded }) {
  const [hidden, setHidden] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, 'change', (latest) => {
    const previous = scrollY.getPrevious();
    if (latest > previous && latest > 150 && !menuOpen) {
      setHidden(true);
    } else {
      setHidden(false);
    }
  });

  const scrollTo = (href) => {
    setMenuOpen(false);
    setTimeout(() => {
      document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
    }, 50);
  };

  return (
    <>
      {/* ── Desktop pill navbar ─────────────────────────────────────── */}
      <motion.nav
        className="fixed top-0 left-0 right-0 z-40 hidden md:flex justify-center mt-6 px-4"
        initial={{ y: -100, opacity: 0 }}
        animate={{
          y: isLoaded && !hidden ? 0 : -100,
          opacity: isLoaded && !hidden ? 1 : 0,
        }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <div className="flex items-center gap-8 px-8 py-4 bg-[#111A16]/60 backdrop-blur-md rounded-full border border-titli/10 shadow-[0_0_20px_rgba(0,0,0,0.5)]">
          <a href="#hero" className="flex items-center justify-center shrink-0" onClick={(e) => { e.preventDefault(); scrollTo('#hero'); }}>
            <img src="/logo.jpg" alt="Logo" className="w-8 h-8 rounded-full border border-titli/30 hover:scale-110 transition-transform" />
          </a>
          <div className="w-px h-6 bg-white/10" />
          {navItems.map((item) => (
            <a
              key={item.name}
              href={item.href}
              className="text-white/70 hover:text-titli text-xs uppercase tracking-widest font-sans transition-colors duration-300"
              onClick={(e) => { e.preventDefault(); scrollTo(item.href); }}
            >
              {item.name}
            </a>
          ))}
        </div>
      </motion.nav>

      {/* ── Mobile top bar ──────────────────────────────────────────── */}
      <motion.div
        className="fixed top-0 left-0 right-0 z-50 md:hidden flex items-center justify-between px-5 py-4"
        initial={{ y: -60, opacity: 0 }}
        animate={{
          y: isLoaded ? 0 : -60,
          opacity: isLoaded ? 1 : 0,
        }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        style={{ background: 'rgba(11,20,17,0.75)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)' }}
      >
        {/* Logo */}
        <a href="#hero" onClick={(e) => { e.preventDefault(); scrollTo('#hero'); }} className="flex items-center gap-3">
          <img src="/logo.jpg" alt="Logo" className="w-8 h-8 rounded-full border border-titli/30" />
          <span className="font-serif italic text-titli text-lg">Titli</span>
        </a>

        {/* Hamburger */}
        <button
          onClick={() => setMenuOpen((v) => !v)}
          aria-label="Toggle menu"
          className="flex flex-col justify-center items-center w-10 h-10 gap-[5px] rounded-full border border-white/10 hover:border-titli/30 transition-colors"
        >
          <motion.span
            className="block w-5 h-px bg-white/70 origin-center"
            animate={{ rotate: menuOpen ? 45 : 0, y: menuOpen ? 6 : 0 }}
            transition={{ duration: 0.3 }}
          />
          <motion.span
            className="block w-5 h-px bg-white/70"
            animate={{ opacity: menuOpen ? 0 : 1 }}
            transition={{ duration: 0.2 }}
          />
          <motion.span
            className="block w-5 h-px bg-white/70 origin-center"
            animate={{ rotate: menuOpen ? -45 : 0, y: menuOpen ? -6 : 0 }}
            transition={{ duration: 0.3 }}
          />
        </button>
      </motion.div>

      {/* ── Mobile fullscreen menu overlay ─────────────────────────── */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="fixed inset-0 z-40 md:hidden flex flex-col"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            style={{ background: 'rgba(8,14,11,0.97)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)' }}
          >
            {/* Decorative top line */}
            <div className="w-full h-px bg-linear-to-r from-transparent via-titli/20 to-transparent mt-[72px]" />

            <nav className="flex flex-col items-center justify-center flex-1 gap-2 px-8 py-10">
              {navItems.map((item, i) => (
                <motion.a
                  key={item.name}
                  href={item.href}
                  className="w-full text-center py-5 font-serif text-3xl text-white/80 hover:text-titli transition-colors duration-300 border-b border-white/5"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06 + 0.1, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                  onClick={(e) => { e.preventDefault(); scrollTo(item.href); }}
                >
                  {item.name}
                </motion.a>
              ))}
            </nav>

            {/* Bottom hint */}
            <motion.p
              className="text-center text-[10px] uppercase tracking-[0.3em] text-white/20 font-sans pb-10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              Titli Foundation
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
