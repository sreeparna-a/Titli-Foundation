import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Toaster } from 'react-hot-toast';
import Preloader from './components/Preloader';
import SmoothScroller from './components/SmoothScroller';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ThreadedLine from './components/ThreadedLine';
import About from './components/About';
import CardStackSection from './components/CardStackSection';
import SectionDivider from './components/SectionDivider';
import { Events, Members, Gallery, Contact } from './components/Sections';
import CustomCursor from './components/CustomCursor';
import ButterflyParticle from './components/ButterflyParticle';
import MagneticButton from './components/MagneticButton';

void motion;

// ─── Footer ───────────────────────────────────────────────────────────────
function Footer() {
  const [time, setTime] = useState('');

  useEffect(() => {
    const tick = () => {
      setTime(
        new Date().toLocaleTimeString('en-IN', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false,
          timeZone: 'Asia/Kolkata',
        })
      );
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <footer className="w-full relative z-20 bg-[#050908] border-t border-white/5">
      {/* Top decorative line */}
      <motion.div
        className="w-full h-px"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(229,252,84,0.2), rgba(209,124,38,0.15), transparent)' }}
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
      />

      <div className="max-w-7xl mx-auto px-6 md:px-16 py-10 md:py-16">
        {/* Main footer row */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          {/* Logo + tagline */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-4">
              <MagneticButton strength={0.3}>
                <div className="w-12 h-12 rounded-full border border-titli/50 overflow-hidden shadow-[0_0_20px_rgba(229,252,84,0.25)] hover:shadow-[0_0_30px_rgba(229,252,84,0.4)] transition-all duration-500" data-cursor="magnetic">
                  <img src="/logo-rounded.png" alt="Titli Logo" className="w-full h-full object-cover scale-125" />
                </div>
              </MagneticButton>
              <h2 className="text-4xl md:text-5xl text-titli font-serif italic">Titli</h2>
            </div>
            <p className="text-[10px] uppercase tracking-[0.35em] text-white/25 font-sans ml-1">
              Theatre · Film · Art · Social Responsibility
            </p>
          </div>

          {/* Center: Live local time */}
          <div className="flex flex-col items-start md:items-center gap-1">
            <p className="text-[9px] uppercase tracking-[0.4em] text-white/20 font-sans">Rourkela, India</p>
            <p className="font-serif text-2xl md:text-3xl text-white/30 tabular-nums">{time}</p>
            <p className="text-[9px] uppercase tracking-[0.3em] text-titli/30 font-sans">IST — UTC+5:30</p>
          </div>

          {/* Right: Social links  */}
          <div className="flex flex-col gap-3">
            <p className="text-[9px] uppercase tracking-[0.4em] text-white/20 font-sans">Connect</p>
            <div className="flex items-center gap-4">
              {[
                { name: 'Instagram', href: 'https://www.instagram.com/titli_foundation.rourkela/', label: 'IG' },
              ].map((s) => (
                <MagneticButton key={s.name} strength={0.5}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center gap-2 text-white/40 hover:text-titli transition-colors duration-400 font-sans text-xs uppercase tracking-widest"
                    data-cursor="view"
                    data-cursor-label="Visit"
                  >
                    <span className="w-6 h-6 rounded-full border border-white/10 group-hover:border-titli/50 flex items-center justify-center text-[9px] transition-colors duration-400">{s.label}</span>
                    {s.name}
                    <motion.span
                      className="opacity-0 group-hover:opacity-100 transition-opacity text-titli"
                      animate={{ x: [0, 3, 0] }}
                      transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
                    >↗</motion.span>
                  </a>
                </MagneticButton>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-[9px] uppercase tracking-[0.35em] text-white/20 font-sans">
            © {new Date().getFullYear()} Titli Foundation · ESTD 2008
          </p>
          {/* Ornamental dots */}
          <div className="flex items-center gap-2">
            {[0, 1, 2].map((i) => (
              <motion.span
                key={i}
                className="w-1 h-1 rounded-full bg-titli/20"
                animate={{ opacity: [0.2, 0.8, 0.2] }}
                transition={{ duration: 2, repeat: Infinity, delay: i * 0.4 }}
              />
            ))}
          </div>
          <p className="text-[9px] uppercase tracking-[0.35em] text-white/15 font-sans">
            A Social Responsibility
          </p>
        </div>
      </div>
    </footer>
  );
}


// Each section paired with divider props that sit *above* it
const sections = [
  {
    Component: About,
    id: 'about',
    divider: { variant: 'wave', accentColor: '#297a51', label: 'The Vision' },
  },
  {
    Component: Events,
    id: 'events',
    divider: { variant: 'slash', accentColor: '#d17c26', label: 'Curtain Calls' },
  },
  {
    Component: Members,
    id: 'members',
    divider: { variant: 'ripple', accentColor: '#297a51', label: 'The Ensemble' },
  },
  {
    Component: Gallery,
    id: 'gallery',
    divider: { variant: 'tear', accentColor: '#E5FC54', label: 'Archives' },
  },
  {
    Component: Contact,
    id: 'contact',
    divider: { variant: 'curtain', accentColor: '#d17c26', label: 'Say Hello' },
  },
];

export default function App() {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <SmoothScroller>
      {/* Global: custom cursor (desktop only) */}
      <CustomCursor />

      <div className="bg-forest min-h-screen text-white font-sans selection:bg-titli selection:text-forest cursor-none">
        <div className="noise-overlay"></div>
        <Toaster position="bottom-right" gutter={8} toastOptions={{
          style: {
            background: '#0c1410',
            color: '#fff',
            border: '1px solid rgba(255,255,255,0.1)',
            fontFamily: 'serif',
          }
        }} />
        {!isLoaded && <Preloader onComplete={() => setIsLoaded(true)} />}

        {/* Brand signature: animated butterfly - moved to root level */}
        <ButterflyParticle />
        
        <div className="relative overflow-hidden sm:overflow-visible">
          <Navbar isLoaded={isLoaded} />
          <ThreadedLine />
          
          <main>
            <Hero isLoaded={isLoaded} />

            {/* Card stacking container */}
            <div className="relative z-20 bg-forest">
              {sections.map(({ Component, id, divider }, index) => {
                // ESLint in this repo doesn't treat `<Component />` usage as a "use".
                void Component;
                return (
                  <div key={id}>
                    {/* Cinematic section divider */}
                    <SectionDivider
                      variant={divider.variant}
                      accentColor={divider.accentColor}
                      label={divider.label}
                    />

                    <CardStackSection 
                      index={index} 
                      totalCards={sections.length}
                      noOverflow={id === 'gallery'}
                    >
                      <div className="bg-forest">
                        <Component />
                      </div>
                    </CardStackSection>
                  </div>
                );
              })}
            </div>
          </main>
          
          <Footer />
        </div>
      </div>
    </SmoothScroller>
  );
}