import { useState } from 'react';
import Preloader from './components/Preloader';
import SmoothScroller from './components/SmoothScroller';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ThreadedLine from './components/ThreadedLine';
import About from './components/About';
import CardStackSection from './components/CardStackSection';
import { Events, Members, Gallery, Contact } from './components/Sections';

const sections = [
  { Component: About, id: 'about' },
  { Component: Events, id: 'events' },
  { Component: Members, id: 'members' },
  { Component: Gallery, id: 'gallery' },
  { Component: Contact, id: 'contact' },
];

export default function App() {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <SmoothScroller>
      <div className="bg-forest min-h-screen text-white font-sans selection:bg-titli selection:text-forest">
        <div className="noise-overlay"></div>
        {!isLoaded && <Preloader onComplete={() => setIsLoaded(true)} />}
        
        <div className="relative overflow-hidden sm:overflow-visible">
          <Navbar isLoaded={isLoaded} />
          <ThreadedLine />
          
          <main>
            <Hero isLoaded={isLoaded} />

            {/* Card stacking container */}
            <div className="relative z-20 bg-forest">
              {sections.map(({ Component, id }, index) => (
                <CardStackSection key={id} index={index} totalCards={sections.length}>
                  <div className="bg-forest">
                    <Component />
                  </div>
                </CardStackSection>
              ))}
            </div>
          </main>
          
          <footer className="w-full py-12 border-t border-white/10 text-center relative z-20 bg-[#050908]">
            <div className="flex items-center justify-center gap-4 mb-4">
              <img src="/logo.jpg" alt="Titli Logo" className="w-10 h-10 rounded-full border border-titli/30 object-cover" />
              <h2 className="text-4xl text-titli font-serif italic">Titli</h2>
            </div>
            <p className="text-[10px] uppercase tracking-[0.3em] text-white/40 font-sans">
              © {new Date().getFullYear()} Titli Foundation. A Social Responsibility.
            </p>
          </footer>
        </div>
      </div>
    </SmoothScroller>
  );
}