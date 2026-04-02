import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

// ── Simple focus trap + scroll lock ──────────────────────────────────────────
function useModalEffects(isOpen) {
  useEffect(() => {
    if (isOpen) {
      // Pause Lenis so wheel/touchpad scrolling doesn't move the page.
      window.__lenisInstance?.stop?.();

      // Lock scroll on the document (covers browsers where `overflow: hidden`
      // on `body` alone isn't enough).
      const prevBodyOverflow = document.body.style.overflow;
      const prevHtmlOverflow = document.documentElement.style.overflow;
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';

      return () => {
        document.body.style.overflow = prevBodyOverflow;
        document.documentElement.style.overflow = prevHtmlOverflow;
        window.__lenisInstance?.start?.();
      };
    }
  }, [isOpen]);
}

// ── Stagger variants ─────────────────────────────────────────────────────────
const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.4, ease: 'easeOut' } },
  exit:   { opacity: 0, transition: { duration: 0.35, ease: 'easeIn', delay: 0.15 } },
};

const panelVariants = {
  hidden: { y: '100%', opacity: 0, scale: 0.97 },
  visible: {
    y: '0%',
    opacity: 1,
    scale: 1,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
  exit: {
    y: '100%',
    opacity: 0,
    scale: 0.97,
    transition: { duration: 0.45, ease: [0.64, 0, 0.78, 0] },
  },
};

const contentVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07, delayChildren: 0.25 } },
};

const itemVariants = {
  hidden:  { opacity: 0, y: 24, filter: 'blur(6px)' },
  visible: { opacity: 1, y: 0,  filter: 'blur(0px)', transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

// ── Photo carousel ───────────────────────────────────────────────────────────
function PhotoCarousel({ photos, accentColor }) {
  const [active, setActive] = useState(0);
  const [direction, setDirection] = useState(1);

  const go = (next) => {
    setDirection(next > active ? 1 : -1);
    setActive(next);
  };

  const slideVariants = {
    enter:  (d) => ({ x: d > 0 ? '100%' : '-100%', opacity: 0 }),
    center: { x: '0%', opacity: 1, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
    exit:   (d) => ({
      x: d > 0 ? '-100%' : '100%',
      opacity: 0,
      transition: { duration: 0.4, ease: [0.64, 0, 0.78, 0] },
    }),
  };

  return (
    <div className="relative w-full" style={{ aspectRatio: '16/9' }}>
      {/* Main image */}
      <div className="relative w-full h-full overflow-hidden rounded-xl">
        <AnimatePresence custom={direction} mode="popLayout">
          <motion.img
            key={active}
            src={photos[active].src}
            alt={photos[active].caption}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            className="absolute inset-0 w-full h-full object-cover"
          />
        </AnimatePresence>
        {/* Gradient */}
        <div className="absolute inset-0 bg-linear-to-t from-black/70 via-transparent to-transparent rounded-xl pointer-events-none" />
        {/* Caption */}
        <AnimatePresence mode="wait">
          <motion.p
            key={active}
            className="absolute bottom-4 left-5 text-[10px] uppercase tracking-[0.3em] text-white/70 font-sans"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
          >
            {photos[active].caption}
          </motion.p>
        </AnimatePresence>
        {/* Index */}
        <div className="absolute top-4 right-5 text-[10px] font-sans text-white/30">
          {String(active + 1).padStart(2, '0')} / {String(photos.length).padStart(2, '0')}
        </div>
      </div>

      {/* Navigation arrows */}
      {photos.length > 1 && (
        <>
          <button
            onClick={() => go((active - 1 + photos.length) % photos.length)}
            className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/50 border border-white/10 hover:border-white/30 flex items-center justify-center text-white/60 hover:text-white transition-all duration-300 backdrop-blur-md text-sm"
          >
            ←
          </button>
          <button
            onClick={() => go((active + 1) % photos.length)}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/50 border border-white/10 hover:border-white/30 flex items-center justify-center text-white/60 hover:text-white transition-all duration-300 backdrop-blur-md text-sm"
          >
            →
          </button>
        </>
      )}

      {/* Dot indicators */}
      {photos.length > 1 && (
        <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 flex gap-1.5">
          {photos.map((_, i) => (
            <button
              key={i}
              onClick={() => go(i)}
              className="rounded-full transition-all duration-300"
              style={{
                width: i === active ? 20 : 6,
                height: 4,
                background: i === active ? accentColor : 'rgba(255,255,255,0.2)',
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ── Main Modal ───────────────────────────────────────────────────────────────
export default function EventModal({ event, onClose }) {
  const isOpen = !!event;
  useModalEffects(isOpen);
  const closeOnBackdrop = (e) => { if (e.target === e.currentTarget) onClose(); };

  const portalTarget = typeof document !== 'undefined' ? document.body : null;

  const modal = (
    <AnimatePresence>
      {isOpen && event && (
        <motion.div
          className="fixed inset-0 z-100000 flex items-center justify-center p-4 sm:p-6"
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          onClick={closeOnBackdrop}
          style={{
            background: 'rgba(5,9,8,0.85)',
            backdropFilter: 'blur(16px)',
          }}
        >
          {/* Panel */}
          <motion.div
            className="relative w-full sm:max-w-3xl lg:max-w-4xl mx-auto rounded-2xl overflow-hidden"
            style={{
              background: 'linear-gradient(145deg, #0c1410 0%, #0a120e 100%)',
              border: '1px solid rgba(255,255,255,0.06)',
            }}
            variants={panelVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Accent top line */}
            <motion.div
              className="absolute top-0 left-0 right-0 h-px"
              style={{ background: `linear-gradient(90deg, transparent, ${event.accentColor}, transparent)` }}
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.8, delay: 0.3, ease: 'easeOut' }}
            />

            {/* Ambient glow */}
            <div
              className="absolute top-0 left-0 right-0 h-64 pointer-events-none"
              style={{
                background: `radial-gradient(ellipse at 50% -20%, ${event.accentColor}12 0%, transparent 60%)`,
              }}
            />

            {/* Scrollable inner */}
            <div
              className="overflow-y-auto modal-scrollbar max-h-[calc(100vh-2rem)] sm:max-h-[calc(100vh-3rem)]"
              data-lenis-prevent
              style={{ overscrollBehavior: 'contain', touchAction: 'pan-y' }}
            >
              <motion.div
                className="p-6 sm:p-10 flex flex-col gap-8"
                variants={contentVariants}
                initial="hidden"
                animate="visible"
              >
                {/* Header row */}
                <motion.div variants={itemVariants} className="flex items-start justify-between gap-4">
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-3">
                      <span
                        className="text-[9px] uppercase tracking-[0.3em] font-sans px-3 py-1 rounded-full"
                        style={{
                          color: event.accentColor,
                          background: `${event.accentColor}18`,
                          border: `1px solid ${event.accentColor}30`,
                        }}
                      >
                        {event.type}
                      </span>
                      <span className="text-[9px] uppercase tracking-[0.3em] font-sans text-white/30">
                        {event.date}
                      </span>
                    </div>
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif text-white leading-tight">
                      {event.title}
                    </h2>
                  </div>

                  {/* Close button */}
                  <button
                    onClick={onClose}
                    className="shrink-0 w-10 h-10 rounded-full border border-white/10 hover:border-white/30 flex items-center justify-center text-white/40 hover:text-white transition-all duration-300 text-lg"
                  >
                    ✕
                  </button>
                </motion.div>

                {/* Photo carousel */}
                {event.photos && event.photos.length > 0 && (
                  <motion.div variants={itemVariants} className="pb-6">
                    <PhotoCarousel photos={event.photos} accentColor={event.accentColor} />
                  </motion.div>
                )}

                {/* Description */}
                <motion.div variants={itemVariants} className="flex flex-col gap-4">
                  <div className="flex items-center gap-3 mb-2">
                    <span
                      className="h-px w-8"
                      style={{ background: event.accentColor, opacity: 0.4 }}
                    />
                    <span className="text-[9px] uppercase tracking-[0.35em] font-sans text-white/25">About</span>
                  </div>
                  <p className="font-sans text-white/70 text-base leading-relaxed font-light">
                    {event.description}
                  </p>
                </motion.div>

                {/* Details grid */}
                {event.details && (
                  <motion.div
                    variants={itemVariants}
                    className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4 border-t border-white/5"
                  >
                    {event.details.map((d, i) => (
                      <div key={i} className="flex flex-col gap-1">
                        <span className="text-[9px] uppercase tracking-[0.3em] font-sans text-white/25">
                          {d.label}
                        </span>
                        <span className="text-sm font-sans text-white/80">{d.value}</span>
                      </div>
                    ))}
                  </motion.div>
                )}

                {/* CTA */}
                <motion.div variants={itemVariants} className="flex items-center gap-4 pt-2">
                  {event.type === 'Upcoming' && (
                    <motion.button
                      className="py-3 px-8 border font-sans text-[10px] uppercase tracking-[0.2em] rounded-lg relative overflow-hidden group"
                      style={{
                        borderColor: `${event.accentColor}50`,
                        color: event.accentColor,
                      }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <span className="relative z-10">Reserve Your Seat</span>
                      <motion.div
                        className="absolute inset-0 origin-left"
                        style={{ background: event.accentColor }}
                        initial={{ scaleX: 0 }}
                        whileHover={{ scaleX: 1 }}
                        transition={{ duration: 0.4, ease: 'easeOut' }}
                        onAnimationStart={() => {}}
                      />
                      {/* text color hack: cover with colored text on hover */}
                      <motion.span
                        className="absolute inset-0 flex items-center justify-center font-sans text-[10px] uppercase tracking-[0.2em] text-forest z-20 pointer-events-none"
                        initial={{ opacity: 0 }}
                        whileHover={{ opacity: 1 }}
                        transition={{ duration: 0.15, delay: 0.15 }}
                      >
                        Reserve Your Seat
                      </motion.span>
                    </motion.button>
                  )}
                  <button
                    onClick={onClose}
                    className="text-[10px] uppercase tracking-[0.2em] font-sans text-white/30 hover:text-white transition-colors duration-300"
                  >
                    Close
                  </button>
                </motion.div>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return portalTarget ? createPortal(modal, portalTarget) : modal;
}
