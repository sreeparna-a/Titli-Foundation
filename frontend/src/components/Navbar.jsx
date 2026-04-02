import { motion, useScroll, useMotionValueEvent } from 'framer-motion';
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
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious();
    if (latest > previous && latest > 150) {
      setHidden(true);
    } else {
      setHidden(false);
    }
  });

  return (
    <motion.nav 
      className="fixed top-0 left-0 right-0 z-40 flex justify-center mt-6 px-4"
      initial={{ y: -100, opacity: 0 }}
      animate={{ 
        y: isLoaded && !hidden ? 0 : -100,
        opacity: isLoaded && !hidden ? 1 : 0 
      }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      <div className="flex items-center gap-8 px-8 py-4 bg-[#111A16]/60 backdrop-blur-md rounded-full border border-titli/10 shadow-[0_0_20px_rgba(0,0,0,0.5)]">
        <a href="#hero" className="flex items-center justify-center shrink-0">
           <img src="/logo.jpg" alt="Logo" className="w-8 h-8 rounded-full border border-titli/30 hover:scale-110 transition-transform" />
        </a>
        <div className="w-px h-6 bg-white/10"></div>
        {navItems.map((item) => (
          <a
            key={item.name}
            href={item.href}
            className="text-white/70 hover:text-titli text-xs md:text-sm uppercase tracking-widest font-sans transition-colors duration-300"
            onClick={(e) => {
              e.preventDefault();
              document.querySelector(item.href)?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            {item.name}
          </a>
        ))}
      </div>
    </motion.nav>
  );
}
