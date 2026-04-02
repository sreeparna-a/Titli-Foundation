import { useState } from 'react';
import Preloader from './components/Preloader';
import SmoothScroller from './components/SmoothScroller';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ThreadedLine from './components/ThreadedLine';
import About from './components/About';
import { Events, Members, Gallery, Contact } from './components/Sections';

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
            <div className="bg-forest relative z-20">
              <About />
              <Events />
              <Members />
              <Gallery />
              <Contact />
            </div>
          </main>
          
          <footer className="w-full py-12 border-t border-white/10 text-center relative z-20 bg-[#050908]">
            <h2 className="text-4xl text-titli font-serif italic mb-4">Titli</h2>
            <p className="text-[10px] uppercase tracking-[0.3em] text-white/40 font-sans">
              © {new Date().getFullYear()} Titli Foundation. A Social Responsibility.
            </p>
          </footer>
        </div>
      </div>
    </SmoothScroller>
  );
}