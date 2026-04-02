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
    <div className="overflow-hidden">
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
      { label: 'Venue', value: 'Academy of Fine Arts, Kolkata' },
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
      { label: 'Venue', value: 'Nandan Cinema, Kolkata' },
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
      { label: 'Venue', value: 'Titli Foundation Studio, Kolkata' },
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
                >
                  {/* Hover Background Fill */}
                  <motion.div
                    className="absolute inset-0 z-0"
                    style={{ background: `${event.accentColor}08` }}
                    initial={{ scaleX: 0, originX: 0 }}
                    whileHover={{ scaleX: 1 }}
                    transition={{ duration: 0.4, ease: 'easeOut' }}
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
                    <span className="text-sm md:text-lg font-sans text-white/40 group-hover:text-white transition-colors duration-500">
                      {event.date}
                    </span>
                    {/* "View Details" label on hover */}
                    <motion.span
                      className="hidden md:block text-[9px] uppercase tracking-[0.25em] font-sans opacity-0 group-hover:opacity-100 transition-opacity duration-300 px-3 py-1 rounded-full"
                      style={{
                        color: event.accentColor,
                        border: `1px solid ${event.accentColor}40`,
                        background: `${event.accentColor}10`,
                      }}
                    >
                      View Details
                    </motion.span>
                    <motion.span
                      className="text-sm font-sans opacity-0 group-hover:opacity-100 transition-opacity"
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
          className="font-serif text-white/75 text-[14px] md:text-[16px] uppercase tracking-[0.35em] mb-12"
        >
          The souls behind the curtain
        </RevealText>

        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {members.map((member, i) => (
            <motion.div
              key={member.id}
              className="relative group cursor-pointer"
              initial={{ opacity: 0, y: 60, rotate: i % 2 === 0 ? -2 : 2 }}
              whileInView={{ opacity: 1, y: 0, rotate: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ delay: i * 0.12, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -8, transition: { duration: 0.35 } }}
            >
              <div className="relative aspect-3/4 overflow-hidden border border-white/5 group-hover:border-titli/30 transition-colors duration-500">
                {/* Image */}
                <img
                  src={member.img}
                  alt={member.name}
                  className="w-full h-full object-cover filter grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-700 ease-out opacity-60 group-hover:opacity-100"
                />

                {/* Overlay */}
                <div className="absolute inset-0 bg-linear-to-t from-forest via-forest/30 to-transparent group-hover:via-forest/10 transition-all duration-700" />

                {/* Corner ornament */}
                <motion.div
                  className="absolute top-3 right-3 w-6 h-6 border-t border-r border-titli/0 group-hover:border-titli/60 transition-colors duration-500"
                />
                <motion.div
                  className="absolute bottom-3 left-3 w-6 h-6 border-b border-l border-titli/0 group-hover:border-titli/60 transition-colors duration-500"
                />

                {/* Info */}
                <div className="absolute bottom-0 left-0 right-0 p-5 z-10">
                  <div className="border-t border-white/10 pt-4 translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                    <h4 className="font-serif text-xl text-white leading-tight">{member.name}</h4>
                    <p
                      className="font-sans text-[10px] uppercase tracking-widest text-titli mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    >
                      {member.role}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
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
  const sectionRef = useRef(null);
  const [activeCategory, setActiveCategory] = useState('All');

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start end', 'end start'] });

  const bgGlow = useTransform(scrollYProgress, [0, 0.5, 1], ['0%', '-5%', '-10%']);

  // Continuous marquee position (px) so reversing direction feels smooth.
  const stripTrackRef = useRef(null);
  const stripX = useMotionValue(0);
  const loopWidthPxRef = useRef(0); // width of *one* half (because we duplicate the words)

  // Direction + smoothing.
  // For this strip, negative `x` means moving left (same direction as the old 0% -> -8% transform).
  const stripDirRef = useRef(-1); // -1 = moving left, 1 = moving right
  const lastDirRef = useRef(-1);
  const lastDirChangeTimeRef = useRef(0);

  const scrollVelocity = useVelocity(scrollYProgress);
  const smoothScrollVelocity = useSpring(scrollVelocity, {
    stiffness: 120,
    damping: 22,
    mass: 0.8,
  });

  useMotionValueEvent(smoothScrollVelocity, 'change', (v) => {
    const now = performance.now();
    // Cooldown prevents rapid flips while the user jitters between frames.
    if (now - lastDirChangeTimeRef.current < 300) return;
    // Deadzone prevents tiny scroll noise from flipping direction.
    if (Math.abs(v) < 0.015) return;

    // When scrolling down, `scrollYProgress` increases => velocity > 0.
    // We want that to move the strip left (negative x).
    const nextDir = v > 0 ? -1 : 1;
    if (nextDir === lastDirRef.current) return;

    lastDirRef.current = nextDir;
    stripDirRef.current = nextDir;
    lastDirChangeTimeRef.current = now;
  });

  useEffect(() => {
    if (!stripTrackRef.current) return;

    const updateWidths = () => {
      const w = stripTrackRef.current?.getBoundingClientRect().width ?? 0;
      loopWidthPxRef.current = w > 0 ? w / 2 : 0;
    };

    updateWidths();

    const ro = new ResizeObserver(updateWidths);
    ro.observe(stripTrackRef.current);

    return () => ro.disconnect();
  }, []);

  useAnimationFrame((_, deltaMs) => {
    const loopWidth = loopWidthPxRef.current;
    if (!loopWidth) return;

    // Base speed is tuned for a subtle gallery accent.
    const speedPxPerSecond = 26;
    const deltaPx = (speedPxPerSecond * deltaMs) / 1000;

    let nextX = stripX.get() + stripDirRef.current * deltaPx;

    // Wrap seamlessly: track is duplicated twice; loop is one half.
    while (nextX <= -loopWidth) nextX += loopWidth;
    while (nextX > 0) nextX -= loopWidth;

    stripX.set(nextX);
  });

  const filtered = galleryData.filter(
    (img) => activeCategory === 'All' || img.category === activeCategory
  );

  const stripWords = ['Theatre', 'Film', 'Art', 'Culture', 'Story', 'Memory', 'Stage', 'Light', 'Voice'];
  const stripWordsDoubled = [...stripWords, ...stripWords];

  return (
    <section
      id="gallery"
      ref={sectionRef}
      className="relative w-full py-24 md:py-32 px-4 sm:px-8 md:px-24 overflow-hidden"
    >
      {/* Ambient background glow */}
      <motion.div
        className="absolute -right-80 top-1/3 w-[700px] h-[700px] rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(229,252,84,0.04) 0%, transparent 65%)',
          y: bgGlow,
        }}
      />

      <div className="max-w-6xl mx-auto pl-0 sm:pl-12 lg:pl-24 relative z-10">

        {/* Header row */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
          <div>
            <SectionTag number="04" color="#E5FC54" label="Archives" />
            <motion.p
              className="font-serif text-[1.55rem] md:text-[2.1rem] text-white/85 italic leading-relaxed max-w-xl antialiased"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            >
              "Art is not what you see,<br />but what you make others see."
              <span className="block text-[11px] not-italic uppercase tracking-widest text-white/35 font-sans mt-2">
                — Edgar Degas
              </span>
            </motion.p>
          </div>

          {/* Category filter */}
          <motion.div
            className="flex items-center gap-2 border border-white/10 p-1 rounded-full w-max self-start md:self-end"
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            {CATEGORIES.map((cat) => (
              <motion.button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                whileTap={{ scale: 0.94 }}
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

        {/* Masonry-style editorial grid */}
        <AnimatePresence mode="popLayout">
          <motion.div
            key={activeCategory}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 auto-rows-[200px] sm:auto-rows-[240px] lg:auto-rows-[260px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            {filtered.map((img, i) => {
              const isTall = img.size === 'tall';
              const isWide = img.size === 'wide';
              return (
                <motion.div
                  key={img.src}
                  layout
                  className={`
                    relative overflow-hidden group cursor-pointer
                    ${isTall ? 'row-span-2' : ''}
                    ${isWide ? 'sm:col-span-2' : ''}
                  `}
                  initial={{ opacity: 0, scale: 0.96, filter: 'blur(8px)' }}
                  animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                  exit={{ opacity: 0, scale: 0.96, filter: 'blur(8px)' }}
                  transition={{ duration: 0.55, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] }}
                  whileHover={{ zIndex: 10 }}
                >
                  {/* Image */}
                  <img
                    src={img.src}
                    alt={img.alt}
                    className="absolute inset-0 w-full h-full object-cover filter grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-700 ease-out opacity-60 group-hover:opacity-100"
                  />

                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent group-hover:from-black/50 group-hover:via-transparent transition-all duration-700" />

                  {/* Category pill */}
                  <div className="absolute top-4 left-4 z-10">
                    <span
                      className="text-[9px] uppercase tracking-[0.25em] font-sans px-3 py-1 rounded-full border border-titli/0 bg-black/40 text-white/40
                      group-hover:border-titli/50 group-hover:text-titli group-hover:bg-black/60 transition-all duration-500"
                    >
                      {img.category}
                    </span>
                  </div>

                  {/* Caption */}
                  <div className="absolute bottom-0 left-0 right-0 p-5 z-10 translate-y-3 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 ease-out">
                    <div className="border-t border-white/10 pt-3">
                      <p className="text-[11px] uppercase tracking-[0.3em] text-white/80 font-sans">{img.caption}</p>
                    </div>
                  </div>

                  {/* Corner accents */}
                  <div className="absolute top-3 right-3 w-6 h-6 border-t border-r border-white/0 group-hover:border-titli/50 transition-all duration-700" />
                  <div className="absolute bottom-3 left-3 w-6 h-6 border-b border-l border-white/0 group-hover:border-titli/50 transition-all duration-700" />

                  {/* Subtle index number */}
                  <div className="absolute top-4 right-4 z-10 text-[10px] font-sans text-white/10 group-hover:text-white/30 transition-colors duration-500">
                    {String(i + 1).padStart(2, '0')}
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </AnimatePresence>

        {/* Horizontal filmstrip accent */}
        <div className="mt-12 overflow-hidden border-t border-b border-white/5 py-4">
          <motion.div
            ref={stripTrackRef}
            className="flex items-center gap-6 whitespace-nowrap"
            style={{ x: stripX }}
          >
            {stripWordsDoubled.map((word, i) => (
              <span
                key={i}
                className="text-[10px] uppercase tracking-[0.4em] text-white/10 font-sans shrink-0"
              >
                {word} <span className="text-titli/20 mx-3">◆</span>
              </span>
            ))}
          </motion.div>
        </div>

        {/* Bottom label */}
        <motion.p
          className="mt-8 text-[10px] uppercase tracking-[0.4em] text-white/15 font-sans"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.5, delay: 0.4 }}
        >
          Every frame holds a world
        </motion.p>
      </div>
    </section>
  );
}

// ─── Contact Section ───────────────────────────────────────────────────────
export function Contact() {
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
                  { name: 'Twitter', href: '#' },
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

          <form className="relative z-10 flex flex-col gap-5 md:gap-6 w-full h-full p-6 md:p-10 bg-[#0c1410]/80 border border-white/5 backdrop-blur-xl rounded-2xl shadow-2xl justify-between">
            {[
              { label: 'Your Name', type: 'text', placeholder: 'John Doe' },
              { label: 'Email Address', type: 'email', placeholder: 'hello@example.com' },
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
                rows="5"
                className="w-full bg-white/5 border border-white/10 rounded-lg p-4 text-white placeholder-white/20 focus:outline-none focus:border-titli/50 focus:bg-white/10 transition-all duration-300 text-sm font-sans resize-none"
                placeholder="Tell us about your project..."
              />
            </motion.div>

            <motion.button
              type="button"
              className="mt-2 py-4 px-8 border border-titli/30 text-titli font-sans text-[11px] uppercase tracking-[0.2em] hover:bg-titli hover:text-forest transition-all duration-300 w-full rounded-lg overflow-hidden relative group"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <span className="relative z-10">Send Message</span>
              <motion.div
                className="absolute inset-0 bg-titli origin-left"
                initial={{ scaleX: 0 }}
                whileHover={{ scaleX: 1 }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
              />
            </motion.button>
          </form>
        </motion.div>
      </div>
    </section>
  );
}
