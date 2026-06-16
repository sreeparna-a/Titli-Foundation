import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, ArrowLeft } from 'lucide-react';
import { galleryData } from './Sections';
import MagneticButton from './MagneticButton';

const CATEGORIES = ['All', 'Theatre', 'Film', 'Art'];

export default function GalleryPage() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [lightboxIndex, setLightboxIndex] = useState(null);

  // Filtered gallery data
  const filtered = galleryData.filter(
    (img) => activeCategory === 'All' || img.category === activeCategory
  );

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
    window.__lenisInstance?.scrollTo(0, { immediate: true });
  }, []);

  // Keyboard navigation for lightbox
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (lightboxIndex === null) return;
      if (e.key === 'ArrowRight') {
        setLightboxIndex((prev) => (prev + 1) % filtered.length);
      } else if (e.key === 'ArrowLeft') {
        setLightboxIndex((prev) => (prev - 1 + filtered.length) % filtered.length);
      } else if (e.key === 'Escape') {
        setLightboxIndex(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxIndex, filtered]);

  // Pause smooth scroll & toggle body class when lightbox is open
  useEffect(() => {
    if (lightboxIndex !== null) {
      window.__lenisInstance?.stop();
      document.body.classList.add('lightbox-open');
      window.dispatchEvent(new CustomEvent('lightbox-active', { detail: true }));
    } else {
      window.__lenisInstance?.start();
      document.body.classList.remove('lightbox-open');
      window.dispatchEvent(new CustomEvent('lightbox-active', { detail: false }));
    }
    return () => {
      window.__lenisInstance?.start();
      document.body.classList.remove('lightbox-open');
      window.dispatchEvent(new CustomEvent('lightbox-active', { detail: false }));
    };
  }, [lightboxIndex]);

  const handleBackHome = (e) => {
    e.preventDefault();
    window.history.pushState({}, '', '/');
    window.dispatchEvent(new Event('popstate'));
    // Wait a brief moment for App.jsx to render Home, then scroll to gallery section
    setTimeout(() => {
      document.querySelector('#gallery')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleNext = (e) => {
    e.stopPropagation();
    setLightboxIndex((prev) => (prev + 1) % filtered.length);
  };

  const handlePrev = (e) => {
    e.stopPropagation();
    setLightboxIndex((prev) => (prev - 1 + filtered.length) % filtered.length);
  };

  return (
    <div className="relative min-h-screen bg-[#080e0b] text-white pt-20 md:pt-24 pb-16 px-6 sm:px-14 lg:px-28">
      {/* Film Grain & Deco */}
      <div className="film-grain pointer-events-none opacity-[0.02]" />

      <div className={`transition-all duration-500 ${lightboxIndex !== null ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
        {/* Header section with back button */}
        <div className="max-w-7xl mx-auto mb-16 relative z-10 pl-0 lg:pl-24">
          <div className="mb-10">
            <MagneticButton strength={0.3}>
              <a
                href="/"
                onClick={handleBackHome}
                className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-white/50 hover:text-titli transition-colors duration-300 group"
                data-cursor="magnetic"
              >
                <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
                Back to Home
              </a>
            </MagneticButton>
          </div>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/10 pb-10">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <span className="text-xs uppercase tracking-[0.3em] font-sans text-titli">04</span>
                <span className="w-12 h-px bg-titli" />
                <h2 className="text-xs md:text-sm uppercase tracking-[0.3em] font-sans text-white/50">Archives</h2>
              </div>
              <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl text-white italic lowercase tracking-tighter leading-tight">
                the gallery
              </h1>
              <p className="font-sans text-white/40 text-sm md:text-base font-light mt-3 max-w-lg leading-relaxed">
                Explore our curated library of frames, theatrical scenes, behind-the-scenes moments, and visual art exhibitions.
              </p>
            </div>

            {/* Premium Category Filters */}
            <div className="flex flex-wrap items-center gap-2 border border-white/10 p-1 rounded-full w-max bg-black/20 backdrop-blur-md">
              {CATEGORIES.map((cat) => {
                const isActive = activeCategory === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => {
                      setActiveCategory(cat);
                      setLightboxIndex(null); // Reset lightbox index if category changes
                    }}
                    className="relative text-[10px] uppercase tracking-widest font-sans px-4 py-2 rounded-full transition-all duration-300 cursor-pointer"
                  >
                    {isActive && (
                      <motion.div
                        layoutId="activeCategoryPill"
                        className="absolute inset-0 bg-titli rounded-full"
                        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                      />
                    )}
                    <span className={`relative z-10 ${isActive ? 'text-forest font-medium' : 'text-white/40 hover:text-white'}`}>
                      {cat}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Gallery Grid */}
        <div className="max-w-7xl mx-auto pl-0 lg:pl-24 relative z-10 min-h-[400px]">
          <motion.div
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
          >
            <AnimatePresence mode="popLayout">
              {filtered.map((img, index) => (
                <motion.div
                  layout
                  key={img.src}
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: 20 }}
                  transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                  className="group relative cursor-pointer aspect-4/3 overflow-hidden bg-forest border border-white/10 hover:border-titli/30 hover:shadow-[0_0_30px_rgba(229,252,84,0.1)] transition-all duration-500"
                  onClick={() => setLightboxIndex(index)}
                  data-cursor="view"
                >
                  {/* Viewfinder Brackets */}
                  <div className="viewfinder-bracket viewfinder-bracket-tl group-hover:border-titli group-hover:translate-x-1 group-hover:translate-y-1 transition-all duration-500" />
                  <div className="viewfinder-bracket viewfinder-bracket-tr group-hover:border-titli group-hover:-translate-x-1 group-hover:translate-y-1 transition-all duration-500" />
                  <div className="viewfinder-bracket viewfinder-bracket-bl group-hover:border-titli group-hover:translate-x-1 group-hover:-translate-y-1 transition-all duration-500" />
                  <div className="viewfinder-bracket viewfinder-bracket-br group-hover:border-titli group-hover:-translate-x-1 group-hover:-translate-y-1 transition-all duration-500" />

                  {/* Technical Overlay */}
                  <div className="absolute top-4 left-4 right-4 z-10 flex justify-between items-start pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span className="text-[7px] font-sans text-titli/80 uppercase tracking-widest">
                      FRAME 0{index + 1}
                    </span>
                    <span className="text-[7px] font-sans text-white/30 uppercase tracking-widest">
                      {img.category}
                    </span>
                  </div>

                  {/* Image */}
                  <img
                    src={`${img.src}?q=80&w=800`}
                    alt={img.alt}
                    loading="lazy"
                    className="w-full h-full object-cover scale-100 group-hover:scale-105 transition-transform duration-700 ease-out"
                  />

                  {/* Glassmorphic Caption overlay */}
                  <div className="absolute inset-x-0 bottom-0 p-5 bg-linear-to-t from-black/80 via-black/30 to-transparent flex flex-col justify-end translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                    <span className="text-[8px] uppercase tracking-[0.25em] font-sans text-titli w-max px-2 py-0.5 rounded-full border border-titli/30 bg-titli/5 mb-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                      {img.category}
                    </span>
                    <p className="font-serif text-lg text-white/90 leading-snug italic group-hover:text-white transition-colors">
                      {img.caption}
                    </p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md"
            onClick={() => setLightboxIndex(null)}
          >
            {/* Close Button */}
            <button
              onClick={() => setLightboxIndex(null)}
              className="absolute top-6 right-6 p-2 rounded-full border border-white/10 text-white/70 hover:text-white hover:bg-white/10 hover:border-white/30 transition-all duration-300 cursor-pointer"
              aria-label="Close lightbox"
            >
              <X size={20} />
            </button>

            {/* Left Button */}
            <button
              onClick={handlePrev}
              className="absolute left-4 sm:left-8 p-3 rounded-full border border-white/10 text-white/70 hover:text-white hover:bg-white/10 hover:border-white/30 transition-all duration-300 cursor-pointer"
              aria-label="Previous image"
            >
              <ChevronLeft size={24} />
            </button>

            {/* Content Container */}
            <div
              className="relative max-w-5xl max-h-[80vh] w-full px-4 flex flex-col items-center justify-center gap-4"
            >
              <motion.div
                key={lightboxIndex}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className="relative flex flex-col items-center"
              >
                <img
                  src={filtered[lightboxIndex].src}
                  alt={filtered[lightboxIndex].alt}
                  onClick={(e) => e.stopPropagation()}
                  className="max-h-[70vh] max-w-full object-contain border border-white/10 rounded"
                />
                
                {/* Meta details below image */}
                <div className="w-full text-center mt-4">
                  <span className="text-[9px] uppercase tracking-[0.3em] font-sans text-titli px-2.5 py-0.5 rounded-full border border-titli/40 bg-titli/5 inline-block mb-1.5">
                    {filtered[lightboxIndex].category}
                  </span>
                  <h3 className="font-serif text-2xl md:text-3xl text-white italic">
                    {filtered[lightboxIndex].caption}
                  </h3>
                  <p className="text-[10px] text-white/40 uppercase tracking-widest font-sans mt-1">
                    Frame {lightboxIndex + 1} of {filtered.length}
                  </p>
                </div>
              </motion.div>
            </div>

            {/* Right Button */}
            <button
              onClick={handleNext}
              className="absolute right-4 sm:right-8 p-3 rounded-full border border-white/10 text-white/70 hover:text-white hover:bg-white/10 hover:border-white/30 transition-all duration-300 cursor-pointer"
              aria-label="Next image"
            >
              <ChevronRight size={24} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
