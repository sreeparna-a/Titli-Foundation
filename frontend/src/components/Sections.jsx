import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
  useMotionValueEvent,
  useMotionValue,
  useAnimationFrame,
  useSpring,
  useVelocity,
} from 'framer-motion';
import { useState, useRef, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { sendMessage } from '../api/api';
import EventModal from './EventModal';

// ESLint in this repo doesn't treat `motion.*` JSX element usage as a "use".
// This ensures `motion` isn't flagged as unused.
void motion;

// ─── Shared Artsy Section Header ────────────────────────────────────────────
function SectionTag({ number, color, label }) {
  return (
    <motion.div
      className="flex items-center gap-4 mb-10 md:mb-16"
      initial={{ opacity: 0, x: -60, skewX: -10 }}
      whileInView={{ opacity: 1, x: 0, skewX: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
    >
      <motion.span
        className="text-xs uppercase tracking-[0.3em] font-sans"
        style={{ color }}
        initial={{ opacity: 0, scale: 0 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        {number}
      </motion.span>
      <motion.span
        className="h-px"
        style={{ backgroundColor: color }}
        initial={{ width: 0 }}
        whileInView={{ width: 48 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.3, ease: 'easeOut' }}
      />
      <h2 className="text-xs md:text-sm uppercase tracking-[0.3em] font-sans text-white/50">{label}</h2>
    </motion.div>
  );
}

// ─── Reveal Text: clips from bottom like a curtain rising ──────────────────
function RevealText({ children, delay = 0, className = '', style = {} }) {
  return (
    <div className="overflow-visible py-1">
      <motion.div
        className={className}
        initial={{ y: '110%', rotateX: 12 }}
        whileInView={{ y: '0%', rotateX: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 1.1, delay, ease: [0.22, 1, 0.36, 1] }}
        style={{ transformOrigin: 'bottom center', display: 'block', ...style }}
      >
        {children}
      </motion.div>
    </div>
  );
}

// ─── Events Data ──────────────────────────────────────────────────────────
const eventsData = [
  {
    id: 1,
    title: 'The Autumn Monologues',
    type: 'Upcoming',
    date: 'Oct 24, 2026',
    color: 'text-titli',
    accentColor: '#E5FC54',
    description:
      'A luminous evening of one-act plays that explore the textures of solitude, grief, and unexpected joy. "The Autumn Monologues" brings together six original pieces by emerging playwrights from across Bengal, performed on an intimate stage shaped like a crescent moon. Each monologue is a universe unto itself — raw, vulnerable, and alive.',
    details: [
      { label: 'Venue', value: 'Academy of Fine Arts, Rourkela' },
      { label: 'Duration', value: '2h 30min (incl. interval)' },
      { label: 'Language', value: 'Bengali / English' },
      { label: 'Directed by', value: 'Sreeparna Chatterjee' },
      { label: 'Genre', value: 'Contemporary Theatre' },
      { label: 'Tickets', value: '₹200 – ₹600' },
    ],
    photos: [
      { src: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=1200&q=80', caption: 'Rehearsal — Act III' },
      { src: 'https://images.unsplash.com/photo-1507924538820-ede94a04019d?auto=format&fit=crop&w=1200&q=80', caption: 'Stage design preview' },
      { src: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?auto=format&fit=crop&w=1200&q=80', caption: 'Cast workshop' },
    ],
  },
  {
    id: 2,
    title: 'Shadows on Film',
    type: 'Previous',
    date: 'Aug 12, 2026',
    color: 'text-[#d17c26]',
    accentColor: '#d17c26',
    description:
      'A curated retrospective of independent Bengali cinema spanning five decades, "Shadows on Film" invited audiences to rediscover lost masterworks and debut shorts in a single breath. With panel discussions, director Q&As, and a photographic exhibition of behind-the-scenes moments, the festival became a pilgrimage for cinephiles.',
    details: [
      { label: 'Venue', value: 'Nandan Cinema, Rourkela' },
      { label: 'Editions shown', value: '14 short films, 6 features' },
      { label: 'Languages', value: 'Bengali, Hindi, Santali' },
      { label: 'Curated by', value: 'Mira Banerjee' },
      { label: 'Genre', value: 'Film Retrospective' },
      { label: 'Footfall', value: '2,400+ visitors' },
    ],
    photos: [
      { src: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?auto=format&fit=crop&w=1200&q=80', caption: 'Screening night' },
      { src: 'https://images.unsplash.com/photo-1594122230689-45899d9e6f69?auto=format&fit=crop&w=1200&q=80', caption: 'Behind the lens' },
      { src: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1200&q=80', caption: "Director's Q&A Panel" },
    ],
  },
  {
    id: 3,
    title: 'Canvas & Curtains',
    type: 'Previous',
    date: 'May 04, 2026',
    color: 'text-[#297a51]',
    accentColor: '#297a51',
    description:
      '"Canvas & Curtains" was a one-week multidisciplinary residency at Titli HQ where visual artists and theatre-makers collided. The result — a hybrid exhibition where paintings became backdrops for live micro-performances, and the audience wandered through a living gallery. It blurred every line we thought we knew about art.',
    details: [
      { label: 'Venue', value: 'Titli Foundation Studio, Rourkela' },
      { label: 'Duration', value: '7-day residency + finale night' },
      { label: 'Artists', value: '12 visual artists, 8 performers' },
      { label: 'Curated by', value: 'Rohan Sen & Arjun Das' },
      { label: 'Genre', value: 'Interdisciplinary Art' },
      { label: 'Footfall', value: '1,800+ visitors' },
    ],
    photos: [
      { src: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&w=1200&q=80', caption: 'Opening night' },
      { src: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1200&q=80', caption: 'Live performance' },
      { src: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=1200&q=80', caption: 'Artist residency' },
    ],
  },
];

const members = [
  { id: 1, name: 'Sreeparna Chatterjee', role: 'Artistic Director', img: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=500&q=80' },
  { id: 2, name: 'Arjun Das', role: 'Theatre Director', img: 'https://images.unsplash.com/photo-1542282088-fe8426682b8f?auto=format&fit=crop&w=500&q=80' },
  { id: 3, name: 'Mira Banerjee', role: 'Film Curator', img: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=500&q=80' },
  { id: 4, name: 'Rohan Sen', role: 'Visual Artist', img: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=500&q=80' },
];

function useWindowSize() {
  const [size, setSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 1200,
  });

  useEffect(() => {
    const handleResize = () => setSize({ width: window.innerWidth });
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return size;
}

// ─── Events Section ────────────────────────────────────────────────────────
export function Events() {
  const [filter, setFilter] = useState('All');
  const [selectedEvent, setSelectedEvent] = useState(null);
  const sectionRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '20%']);

  const filteredEvents = eventsData.filter(
    (e) => filter === 'All' || e.type === filter
  );

  return (
    <>
      <section
        id="events"
        ref={sectionRef}
        className="relative w-full py-24 md:py-32 px-4 sm:px-8 md:px-24 overflow-hidden"
      >
        {/* Subtle parallax ambient shape */}
        <motion.div
          className="absolute -right-40 top-20 w-[500px] h-[500px] rounded-full pointer-events-none"
          style={{
            background: 'radial-gradient(circle, rgba(229,252,84,0.04) 0%, transparent 70%)',
            y: bgY,
          }}
        />

        <div className="max-w-5xl mx-auto pl-0 sm:pl-12 lg:pl-24 relative z-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 md:mb-16 gap-4 md:gap-6">
            <SectionTag number="02" color="#d17c26" label="Curtain Calls" />

            <motion.div
              className="flex items-center gap-2 border border-white/10 p-1 rounded-full w-max"
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            >
              {['All', 'Upcoming', 'Previous'].map((f) => (
                <motion.button
                  key={f}
                  onClick={() => setFilter(f)}
                  whileTap={{ scale: 0.94 }}
                  className={`text-xs uppercase tracking-widest font-sans px-4 py-2 rounded-full transition-colors duration-400 ${
                    filter === f ? 'bg-white text-forest' : 'text-white/50 hover:text-white'
                  }`}
                >
                  {f}
                </motion.button>
              ))}
            </motion.div>
          </div>

          <div className="flex flex-col border-t border-white/10 min-h-[300px]">
            <AnimatePresence mode="popLayout">
              {filteredEvents.map((event, i) => (
                <motion.div
                  key={event.id}
                  layout
                  initial={{ opacity: 0, y: 40, clipPath: 'inset(0 0 100% 0)' }}
                  animate={{ opacity: 1, y: 0, clipPath: 'inset(0 0 0% 0)' }}
                  exit={{ opacity: 0, x: -40, filter: 'blur(8px)', transition: { duration: 0.3 } }}
                  transition={{ duration: 0.6, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                  className="group flex flex-col md:flex-row md:items-center justify-between py-6 md:py-8 border-b border-white/10 cursor-pointer overflow-hidden relative"
                  onClick={() => setSelectedEvent(event)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === 'Enter' && setSelectedEvent(event)}
                  data-cursor="view"
                  data-cursor-label="Open"
                >
                  {/* Background Fill (visible on mobile, hover on desktop) */}
                  <div
                    className="absolute inset-0 z-0 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-500"
                    style={{ background: `${event.accentColor}08` }}
                  />

                  {/* Accent line on left */}
                  <motion.div
                    className="absolute left-0 top-0 bottom-0 w-[2px] z-0"
                    style={{ background: event.accentColor }}
                    initial={{ scaleY: 0 }}
                    whileInView={{ scaleY: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: i * 0.1, ease: 'easeOut' }}
                  />

                  <div className="relative z-10 flex flex-col md:w-1/2 pl-4">
                    <span className={`text-xs uppercase tracking-widest font-sans mb-2 ${event.color}`}>
                      {event.type}
                    </span>
                    <h3 className="text-xl sm:text-2xl md:text-4xl lg:text-5xl font-serif text-white group-hover:tracking-wider transition-all duration-700 ease-out leading-tight">
                      {event.title}
                    </h3>
                  </div>

                  <div className="relative z-10 mt-2 md:mt-0 text-right pr-4 flex items-center gap-3 self-start md:self-auto pl-4 md:pl-0">
                    <span className="text-sm md:text-lg font-sans text-white/60 md:text-white/40 md:group-hover:text-white transition-colors duration-500">
                      {event.date}
                    </span>
                    {/* "View Details" label on hover */}
                    <motion.span
                      className="text-[9px] uppercase tracking-[0.25em] font-sans opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300 px-3 py-1 rounded-full"
                      style={{
                        color: event.accentColor,
                        border: `1px solid ${event.accentColor}40`,
                        background: `${event.accentColor}10`,
                      }}
                    >
                      View Details
                    </motion.span>
                    <motion.span
                      className="text-sm font-sans opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity"
                      style={{ color: event.accentColor }}
                    >
                      →
                    </motion.span>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Bottom narrative text */}
          <motion.p
            className="mt-12 text-[11px] uppercase tracking-[0.4em] text-white/20 font-sans"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.5, delay: 0.4 }}
          >
            Every performance leaves an echo
          </motion.p>
        </div>
      </section>

      {/* Event Modal */}
      <EventModal event={selectedEvent} onClose={() => setSelectedEvent(null)} />
    </>
  );
}

// ─── Members Section ───────────────────────────────────────────────────────
export function Members() {
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start end', 'end start'] });
  const bgX = useTransform(scrollYProgress, [0, 1], ['-5%', '5%']);

  return (
    <section
      id="members"
      ref={sectionRef}
      className="relative w-full py-24 md:py-32 px-4 sm:px-8 md:px-24 overflow-hidden"
    >
      {/* Ambient left glow */}
      <motion.div
        className="absolute -left-60 top-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(41,122,81,0.07) 0%, transparent 70%)',
          x: bgX,
        }}
      />

      <div className="max-w-6xl mx-auto pl-0 sm:pl-12 lg:pl-24 relative z-10">
        <SectionTag number="03" color="#297a51" label="The Ensemble" />

        {/* Narrative blurb */}
        <RevealText
          delay={0.1}
          className="font-serif text-white/50 text-[14px] md:text-[18px] mb-12 max-w-2xl leading-relaxed italic"
        >
          A collective of visionaries, performers, and architects of light. Each frame holds a story, each face a testament to the art of transformation.
        </RevealText>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {members.map((member, i) => (
            <MemberCard key={member.id} member={member} i={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Artsy Member Card Component ──────────────────────────────────────────
function MemberCard({ member, i }) {
  const mouseX = useMotionValue(50);
  const mouseY = useMotionValue(50);

  const xPercent = useTransform(mouseX, (v) => `${v}%`);
  const yPercent = useTransform(mouseY, (v) => `${v}%`);

  const handleMouseMove = (e) => {
    // Only track mouse on devices with hover capability (desktops)
    if (window.matchMedia('(hover: hover)').matches) {
      const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
      const x = (e.clientX - left) / width;
      const y = (e.clientY - top) / height;
      mouseX.set(x * 100);
      mouseY.set(y * 100);
    }
  };

  return (
    <motion.div
      className="relative group cursor-pointer"
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ delay: i * 0.12, duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
      onMouseMove={handleMouseMove}
    >
      {/* Outer Editorial Border */}
      <div className="relative aspect-3/4 overflow-hidden bg-forest border border-white/5 group-hover:border-titli/20 transition-colors duration-700">
        
        {/* Shutter Animation Overlay */}
        <motion.div 
          className="absolute inset-0 z-30 bg-forest flex flex-col"
          initial={{ opacity: 1 }}
          whileInView={{ opacity: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: i * 0.12 + 0.5, ease: [0.76, 0, 0.24, 1] }}
        >
          <div className="shutter-top" />
          <div className="shutter-bottom" />
        </motion.div>

        {/* Localized Film Grain */}
        <div className="film-grain" />

        {/* Viewfinder Brackets */}
        <div className="viewfinder-bracket viewfinder-bracket-tl group-hover:bg-titli/10" />
        <div className="viewfinder-bracket viewfinder-bracket-tr group-hover:bg-titli/10" />
        <div className="viewfinder-bracket viewfinder-bracket-bl group-hover:bg-titli/10" />
        <div className="viewfinder-bracket viewfinder-bracket-br group-hover:bg-titli/10" />

        {/* Technical Metadata Overlays */}
        <div className="absolute top-4 left-0 right-0 px-6 z-10 flex justify-between items-start pointer-events-none">
          <div className="flex flex-col gap-1">
            <span className="text-[7px] font-sans text-titli/30 uppercase tracking-[0.3em]">REC ●</span>
            <span className="text-[8px] font-sans text-white/20 uppercase tracking-[0.2em]">0{member.id} // PERS</span>
          </div>
          <div className="text-right">
            <span className="text-[8px] font-sans text-white/20 uppercase tracking-[0.2em]">TITLI SOFT-ISO 400</span>
          </div>
        </div>

        <div className="absolute bottom-16 left-0 right-0 px-6 z-10 flex justify-between items-end pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          <span className="text-[7px] font-sans text-white/30 uppercase tracking-[0.3em]">1/125s f/2.8</span>
          <span className="text-[7px] font-sans text-white/30 uppercase tracking-[0.3em]">4K RAW</span>
        </div>

        {/* Dynamic Light Leak - Hidden on mobile/touch for performance */}
        <motion.div 
          className="light-leak hidden lg:block"
          style={{ 
            '--x': xPercent,
            '--y': yPercent,
          }}
        />

        {/* Image */}
        <img
          src={member.img}
          alt={member.name}
          loading="lazy"
          className="w-full h-full object-cover filter grayscale-0 lg:grayscale lg:group-hover:grayscale-0 transition-all duration-1000 ease-out scale-110 lg:group-hover:scale-100 opacity-100 lg:opacity-40 lg:group-hover:opacity-100"
        />

        {/* Bottom Info Overlay */}
        <div className="absolute inset-x-0 bottom-0 p-6 z-20 bg-linear-to-t from-forest to-transparent">
          <div className="relative translate-y-0 lg:translate-y-2 lg:group-hover:translate-y-0 transition-transform duration-700 ease-out">
            <h4 className="font-serif text-xl sm:text-2xl text-white leading-tight mb-1">{member.name}</h4>
            <div className="flex items-center gap-2">
              <span className="w-8 h-px bg-titli/40" />
              <p className="font-sans text-[9px] uppercase tracking-[0.3em] text-titli/80">
                {member.role}
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Gallery Section ───────────────────────────────────────────────────────
const galleryData = [
  {
    src: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=1200&q=80',
    alt: 'Theatre stage with dramatic lighting',
    caption: 'A stage lit with memory',
    category: 'Theatre',
    size: 'tall',   // col-span-1, row-span-2
  },
  {
    src: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80',
    alt: 'Art exhibition opening',
    caption: 'Where colour meets purpose',
    category: 'Art',
    size: 'wide',
  },
  {
    src: 'https://images.unsplash.com/photo-1594122230689-45899d9e6f69?auto=format&fit=crop&w=800&q=80',
    alt: 'Cinema frames',
    caption: 'Frames of feeling',
    category: 'Film',
    size: 'normal',
  },
  {
    src: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=800&q=80',
    alt: 'Live performance crowd',
    caption: 'Voices that echo',
    category: 'Theatre',
    size: 'normal',
  },
  {
    src: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&w=800&q=80',
    alt: 'Cultural festival',
    caption: 'Celebration of roots',
    category: 'Art',
    size: 'wide',
  },
  {
    src: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?auto=format&fit=crop&w=800&q=80',
    alt: 'Film screening',
    caption: 'Light through the lens',
    category: 'Film',
    size: 'normal',
  },
];

const CATEGORIES = ['All', 'Theatre', 'Film', 'Art'];

export function Gallery() {
  const containerRef = useRef(null);
  const stickyRef = useRef(null);
  const [activeCategory, setActiveCategory] = useState('All');

  const { width } = useWindowSize();
  const isDesktop = width >= 1024;

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  useMotionValueEvent(scrollYProgress, 'change', (latest) => {
    // Hidden while pinning/horizontal scrolling
    const isActive = isDesktop && latest > 0.01 && latest < 0.99;
    window.dispatchEvent(new CustomEvent('gallery-active', { detail: isActive }));
  });

  const filtered = galleryData.filter(
    (img) => activeCategory === 'All' || img.category === activeCategory
  );

  // Each panel is 100vw wide. We shift the track by (N-1) * 100vw total.
  // scrollYProgress 0→1 maps from 0vw to -(totalSlides-1)*100vw
  const totalSlides = filtered.length;
  const xMove = useTransform(
    scrollYProgress,
    [0, 1],
    [0, -(totalSlides - 1) * 100]
  );
  const xSpring = useSpring(xMove, { stiffness: 55, damping: 22, mass: 0.8 });
  const xTranslate = useTransform(xSpring, (v) => `${v}vw`);

  // Progress bar width
  const barWidth = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);

  // Slide index for the counter
  const [slideIndex, setSlideIndex] = useState(0);
  useEffect(() => {
    return scrollYProgress.on('change', (v) => {
      setSlideIndex(Math.round(v * (totalSlides - 1)));
    });
  }, [scrollYProgress, totalSlides]);

  return (
    <>
      {/* Section label (above the sticky area) */}
      <div id="gallery" className="relative z-10 px-6 sm:px-14 lg:px-28 pt-20 pb-6 bg-forest">
        <motion.div
          className="flex items-center gap-4 mb-4"
          initial={{ opacity: 0, x: -60, skewX: -10 }}
          whileInView={{ opacity: 1, x: 0, skewX: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        >
          <motion.span
            className="text-xs uppercase tracking-[0.3em] font-sans text-titli"
            initial={{ opacity: 0, scale: 0 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            04
          </motion.span>
          <motion.span
            className="h-px bg-titli"
            initial={{ width: 0 }}
            whileInView={{ width: 48 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3, ease: 'easeOut' }}
          />
          <h2 className="text-xs md:text-sm uppercase tracking-[0.3em] font-sans text-white/50">Archives</h2>
        </motion.div>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <motion.p
            className="font-serif text-[1.4rem] md:text-[2rem] text-white/80 italic leading-relaxed max-w-xl"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, delay: 0.15 }}
          >
            "Art is not what you see,<br />but what you make others see."
            <span className="block text-[11px] not-italic uppercase tracking-widest text-white/30 font-sans mt-2">
              — Edgar Degas
            </span>
          </motion.p>

          {/* Category filter */}
          <motion.div
            className="flex items-center gap-2 border border-white/10 p-1 rounded-full w-max"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            {CATEGORIES.map((cat) => (
              <motion.button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                whileTap={{ scale: 0.94 }}
                data-cursor="magnetic"
                className={`text-[10px] uppercase tracking-widest font-sans px-4 py-2 rounded-full transition-all duration-300 ${
                  activeCategory === cat
                    ? 'bg-titli text-forest font-medium'
                    : 'text-white/40 hover:text-white'
                }`}
              >
                {cat}
              </motion.button>
            ))}
          </motion.div>
        </div>

        <motion.p
          className="mt-4 text-[9px] uppercase tracking-[0.4em] text-white/20 font-sans flex items-center gap-2"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
        >
          <span className="w-4 h-px bg-white/20" />
          Scroll to explore
          <span className="w-4 h-px bg-white/20" />
        </motion.p>
      </div>

      {/* Pinned horizontal scroll container OR Vertical Grid */}
      <div
        ref={containerRef}
        style={{ height: isDesktop ? `${totalSlides * 100}vh` : 'auto' }}
        className="relative"
      >
        {isDesktop ? (
          <div ref={stickyRef} className="sticky top-0 h-screen overflow-hidden bg-[#080e0b]">
            {/* Horizontally scrolling track */}
            <motion.div
              className="flex h-full"
              style={{
                width: `${totalSlides * 100}vw`,
                x: xTranslate,
              }}
            >
              {filtered.map((img, i) => (
                <div
                  key={img.src}
                  className="relative shrink-0 w-screen h-full group overflow-hidden"
                >
                  {/* Full-bleed image */}
                  <img
                    src={`${img.src}?q=75`}
                    alt={img.alt}
                    loading="lazy"
                    className="absolute inset-0 w-full h-full object-cover grayscale-0 md:grayscale md:group-hover:grayscale-0 transition-all duration-1000 ease-out scale-105 group-hover:scale-100"
                    style={{ willChange: 'transform' }}
                  />

                  {/* Bottom gradient */}
                  <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent" />
                  {/* Side gradients for depth */}
                  <div className="absolute inset-0 bg-linear-to-r from-black/40 via-transparent to-transparent" />

                  {/* Slide number (top-left) */}
                  <div className="absolute top-8 left-8 md:left-16 z-10 flex items-center gap-3">
                    <span className="font-serif text-[2.5rem] text-white/10 leading-none">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span className="w-px h-8 bg-white/10" />
                    <span className="text-[9px] uppercase tracking-[0.4em] text-white/30 font-sans">{img.category}</span>
                  </div>

                  {/* Caption (bottom-left) */}
                  <div className="absolute bottom-12 left-8 md:left-16 z-10 max-w-lg">
                    <motion.div
                      className="border-l-2 border-titli/60 pl-5"
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: false }}
                      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                    >
                      <p className="font-serif text-2xl md:text-4xl text-white/90 italic mb-2 leading-tight">
                        {img.caption}
                      </p>
                      <span
                        className="text-[9px] uppercase tracking-[0.35em] font-sans px-3 py-1 rounded-full inline-block mt-1"
                        style={{ border: '1px solid rgba(229,252,84,0.3)', color: 'rgba(229,252,84,0.7)', background: 'rgba(229,252,84,0.05)' }}
                      >
                        {img.category}
                      </span>
                    </motion.div>
                  </div>

                  {/* Corner accent */}
                  <div className="absolute bottom-12 right-8 md:right-16 z-10 w-12 h-12 border-b border-r border-titli/20" />
                  <div className="absolute top-8 right-8 md:right-16 z-10 w-12 h-12 border-t border-r border-white/10" />
                </div>
              ))}
            </motion.div>

            {/* HUD overlay: slide counter + progress bar */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 w-64">
              <div className="w-full h-px bg-white/10 relative overflow-hidden rounded-full">
                <motion.div
                  className="absolute top-0 left-0 h-full bg-titli rounded-full"
                  style={{ width: barWidth }}
                />
              </div>
              <div className="flex items-center gap-3">
                <span className="font-serif text-sm text-titli tabular-nums">{String(slideIndex + 1).padStart(2, '0')}</span>
                <span className="text-white/20 text-xs">/</span>
                <span className="text-white/30 text-xs font-sans tabular-nums">{String(totalSlides).padStart(2, '0')}</span>
              </div>
            </div>
          </div>
        ) : (
          /* Mobile/Tablet Vertical Layout */
          <div className="px-6 md:px-14 pb-20 space-y-12">
            {filtered.map((img, i) => (
              <motion.div
                key={img.src}
                className="relative flex flex-col"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.8, delay: i * 0.1 }}
              >
                <div className="relative aspect-video sm:aspect-2/1 overflow-hidden group">
                  <img
                    src={`${img.src}?q=60&w=1200`}
                    alt={img.alt}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent" />
                  <div className="absolute top-4 left-4 font-serif text-2xl text-white/20">
                    {String(i + 1).padStart(2, '0')}
                  </div>
                </div>
                <div className="mt-4 border-l-2 border-titli/60 pl-5">
                  <p className="font-serif text-xl sm:text-2xl text-white/90 italic leading-tight">
                    {img.caption}
                  </p>
                  <span className="text-[10px] uppercase tracking-[0.3em] text-titli/70 font-sans mt-2 block">
                    {img.category}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Bottom accent: filmstrip marquee */}
      <div className="bg-forest py-4 overflow-hidden border-t border-white/5">
        <motion.p
          className="text-[10px] uppercase tracking-[0.4em] text-white/15 font-sans text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.5 }}
        >
          Every frame holds a world
        </motion.p>
      </div>
    </>
  );
}



// ─── Contact Section ───────────────────────────────────────────────────────
export function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      toast.error('All fields are required');
      return;
    }

    setIsSubmitting(true);
    try {
      await sendMessage(formData);
      toast.success("Message sent! We'll get back to you soon.");
      setFormData({ name: '', email: '', message: '' });
    } catch (error) {
      toast.error(error.error || 'Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section
      id="contact"
      className="relative w-full py-20 md:py-32 px-4 sm:px-8 md:px-24 border-t border-white/10 mt-8 md:mt-16 mb-8 md:mb-12 overflow-hidden"
    >
      {/* Background decoration */}
      <motion.div
        className="absolute top-0 left-0 w-full h-full pointer-events-none"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.5 }}
      >
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-titli/3 blur-[120px] rounded-full" />
      </motion.div>

      <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-10 md:gap-24 relative z-10 pl-0 sm:pl-6 lg:pl-24">
        {/* Left Side */}
        <motion.div
          className="flex flex-col md:w-1/2"
          initial={{ opacity: 0, x: -60, filter: 'blur(10px)' }}
          whileInView={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="flex items-center gap-4 mb-8">
            <span className="text-xs uppercase tracking-[0.3em] font-sans text-accent-orange">05</span>
            <motion.span
              className="h-px bg-accent-orange"
              initial={{ width: 0 }}
              whileInView={{ width: 48 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            />
            <h2 className="text-xs md:text-sm uppercase tracking-[0.3em] font-sans text-white/50">Say Hello</h2>
          </div>

          <div className="overflow-hidden mb-6">
            <motion.h2
              className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-serif text-white leading-tight"
              initial={{ y: '100%' }}
              whileInView={{ y: '0%' }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            >
              Let's Create{' '}
              <br />
              <span className="italic text-white/50">Together</span>
            </motion.h2>
          </div>

          <motion.p
            className="font-sans text-white/50 text-base md:text-xl font-light mb-8 md:mb-10 max-w-md"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            Reach out for collaborations, inquiries, or just to say hello. We are always looking for new stories to tell.
          </motion.p>

          <div className="flex flex-col gap-8">
            {[
              { label: 'Email', value: 'titlifoundation@rediffmail.com', href: 'mailto:titlifoundation@rediffmail.com' },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.4 + i * 0.1 }}
              >
                <p className="text-[10px] uppercase tracking-widest text-white/30 mb-2 font-sans">{item.label}</p>
                <a
                  href={item.href}
                  className="text-base md:text-lg text-white hover:text-titli transition-colors duration-300 font-serif group flex items-center gap-2 break-all"
                >
                  {item.value}
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity text-titli text-sm">↗</span>
                </a>
              </motion.div>
            ))}

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <p className="text-[10px] uppercase tracking-widest text-white/30 mb-2 font-sans">Social</p>
              <div className="flex gap-6">
                {[
                  { name: 'Instagram', href: 'https://www.instagram.com/titli_foundation.rourkela/' },
                  { name: 'YouTube', href: 'https://youtube.com/' },
                ].map((s) => (
                  <a
                    key={s.name}
                    href={s.href}
                    target={s.href !== '#' ? '_blank' : undefined}
                    rel={s.href !== '#' ? 'noopener noreferrer' : undefined}
                    className="text-sm text-white/70 hover:text-titli uppercase tracking-widest font-sans transition-colors duration-300 group relative"
                  >
                    {s.name}
                    <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-titli group-hover:w-full transition-all duration-400" />
                  </a>
                ))}
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Right Side: Form */}
        <motion.div
          className="md:w-1/2 relative flex flex-col"
          initial={{ opacity: 0, x: 60, filter: 'blur(10px)' }}
          whileInView={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 bg-titli/5 blur-[100px] rounded-full pointer-events-none z-0" />

          <form onSubmit={handleSubmit} className="relative z-10 flex flex-col gap-5 md:gap-6 w-full h-full p-6 md:p-10 bg-[#0c1410]/80 border border-white/5 backdrop-blur-xl rounded-2xl shadow-2xl justify-between">
            {[
              { label: 'Your Name', type: 'text', placeholder: 'John Doe', name: 'name' },
              { label: 'Email Address', type: 'email', placeholder: 'hello@example.com', name: 'email' },
            ].map((field, i) => (
              <motion.div
                key={field.label}
                className="flex flex-col gap-2"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 + i * 0.1 }}
              >
                <label className="text-[10px] uppercase tracking-widest text-white/40">{field.label}</label>
                <input
                  type={field.type}
                  name={field.name}
                  value={formData[field.name]}
                  onChange={handleChange}
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-lg p-4 text-white placeholder-white/20 focus:outline-none focus:border-titli/50 focus:bg-white/10 transition-all duration-300 text-sm font-sans"
                  placeholder={field.placeholder}
                />
              </motion.div>
            ))}

            <motion.div
              className="flex flex-col gap-2"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <label className="text-[10px] uppercase tracking-widest text-white/40">Message</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows="5"
                className="w-full bg-white/5 border border-white/10 rounded-lg p-4 text-white placeholder-white/20 focus:outline-none focus:border-titli/50 focus:bg-white/10 transition-all duration-300 text-sm font-sans resize-none"
                placeholder="Tell us about your project..."
              />
            </motion.div>

            <motion.button
              type="submit"
              disabled={isSubmitting}
              className={`mt-2 py-4 px-8 border border-titli/30 text-titli font-sans text-[11px] uppercase tracking-[0.2em] hover:bg-titli hover:text-forest transition-all duration-300 w-full rounded-lg overflow-hidden relative group ${isSubmitting ? 'opacity-50' : ''}`}
              whileHover={isSubmitting ? {} : { scale: 1.02 }}
              whileTap={isSubmitting ? {} : { scale: 0.98 }}
              data-cursor="magnetic"
            >
              <span className="relative z-10">{isSubmitting ? 'Sending...' : 'Send Message'}</span>
              {!isSubmitting && (
                <motion.div
                  className="absolute inset-0 bg-titli origin-left"
                  initial={{ scaleX: 0 }}
                  whileHover={{ scaleX: 1 }}
                  transition={{ duration: 0.4, ease: 'easeOut' }}
                />
              )}
            </motion.button>
          </form>
        </motion.div>
      </div>
    </section>
  );
}
