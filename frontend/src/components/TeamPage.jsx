import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowLeft } from 'lucide-react';
import MagneticButton from './MagneticButton';

const CATEGORIES = ['All', 'Direction & Curation', 'Performance', 'Production & Design'];

const teamMembers = [
  {
    id: 1,
    name: 'Sreeparna Chatterjee',
    role: 'Artistic Director',
    category: 'Direction & Curation',
    img: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=500&q=80',
    bio: 'With over 15 years in contemporary theatre, Sreeparna has directed award-winning plays across India. Her vision at Titli centers on pushing visual boundaries and exploring the intersection of folklore and modern societal struggles.'
  },
  {
    id: 2,
    name: 'Arjun Das',
    role: 'Theatre Director',
    category: 'Direction & Curation',
    img: 'https://images.unsplash.com/photo-1542282088-fe8426682b8f?auto=format&fit=crop&w=500&q=80',
    bio: 'Arjun is a physical theatre practitioner trained in Lecoq style. He has directed 20+ stage productions and believes in utilizing the body as the primary vehicle of storytelling.'
  },
  {
    id: 3,
    name: 'Mira Banerjee',
    role: 'Film Curator',
    category: 'Direction & Curation',
    img: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=500&q=80',
    bio: "Mira is a film scholar and independent curator. She oversees Titli's cinematic projects and retrospective screenings, aiming to bridge the gap between regional independent filmmakers and global audiences."
  },
  {
    id: 4,
    name: 'Rohan Sen',
    role: 'Visual Artist',
    category: 'Production & Design',
    img: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=500&q=80',
    bio: "Rohan is a multidisciplinary visual artist whose installations explore memory and space. He designs the scenic backdrops and art exhibitions that accompany Titli's live performances."
  },
  {
    id: 5,
    name: 'Tiyasha Roy',
    role: 'Lead Performer',
    category: 'Performance',
    img: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=500&q=80',
    bio: "An actor of extraordinary emotional depth, Tiyasha has been the lead face of Titli's main stage productions since 2018, known for her physical vulnerability and powerful vocal control."
  },
  {
    id: 6,
    name: 'Sourav Dutta',
    role: 'Sound Architect',
    category: 'Production & Design',
    img: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=500&q=80',
    bio: 'A sound designer and composer who creates ambient soundscapes using a mix of traditional acoustic instruments and electronic synthesis. He shapes the auditory worlds of our plays.'
  },
  {
    id: 7,
    name: 'Anindya Mitra',
    role: 'Set Scenographer',
    category: 'Production & Design',
    img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=500&q=80',
    bio: 'Anindya designs spatial structures and set designs that transform minimal spaces into rich, narrative environments. His works focus on sustainable material design.'
  },
  {
    id: 8,
    name: 'Deboleena Bose',
    role: 'Light Designer',
    category: 'Production & Design',
    img: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=500&q=80',
    bio: 'Deboleena treats light as a living character on stage. With a background in fine arts, her lighting designs create high-contrast, emotional landscapes.'
  },
  {
    id: 9,
    name: 'Pritam Sen',
    role: 'Production Head',
    category: 'Production & Design',
    img: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=500&q=80',
    bio: 'Pritam manages the logistics, planning, and execution of all Titli festivals, residencies, and outreach tours. He keeps the gears of the ensemble turning smoothly.'
  },
  {
    id: 10,
    name: 'Sayantan Ghosal',
    role: 'Director of Photography',
    category: 'Production & Design',
    img: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=500&q=80',
    bio: "Sayantan captures the visual essence of Titli's work on digital and analog film. He has shot several award-winning documentaries and short film projects under the Titli banner."
  }
];

export default function TeamPage() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedMember, setSelectedMember] = useState(null);

  // Filtered members list
  const filteredMembers = teamMembers.filter(
    (member) => activeCategory === 'All' || member.category === activeCategory
  );

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
    window.__lenisInstance?.scrollTo(0, { immediate: true });
  }, []);

  // Pause smooth scroll when member modal is open
  useEffect(() => {
    if (selectedMember !== null) {
      window.__lenisInstance?.stop();
    } else {
      window.__lenisInstance?.start();
    }
    return () => {
      window.__lenisInstance?.start();
    };
  }, [selectedMember]);

  const handleBackHome = (e) => {
    e.preventDefault();
    window.history.pushState({}, '', '/');
    window.dispatchEvent(new Event('popstate'));
    // Wait a brief moment for App.jsx to render Home, then scroll to members section
    setTimeout(() => {
      document.querySelector('#members')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  return (
    <div className="relative min-h-screen bg-[#080e0b] text-white pt-20 md:pt-24 pb-16 px-6 sm:px-14 lg:px-28">
      {/* Film Grain & Deco */}
      <div className="film-grain pointer-events-none opacity-[0.02]" />

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
              <span className="text-xs uppercase tracking-[0.3em] font-sans text-titli">03</span>
              <span className="w-12 h-px bg-titli" />
              <h2 className="text-xs md:text-sm uppercase tracking-[0.3em] font-sans text-white/50">The Ensemble</h2>
            </div>
            <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl text-white italic lowercase tracking-tighter leading-tight">
              our team
            </h1>
            <p className="font-sans text-white/40 text-sm md:text-base font-light mt-3 max-w-lg leading-relaxed">
              Meet the visionaries, directors, artists, and creators who shape the multidisciplinary works of Titli.
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
                    setSelectedMember(null);
                  }}
                  className="relative text-[10px] uppercase tracking-widest font-sans px-4 py-2 rounded-full transition-all duration-300 cursor-pointer"
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeTeamCategoryPill"
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

      {/* Team Grid */}
      <div className="max-w-7xl mx-auto pl-0 lg:pl-24 relative z-10 min-h-[400px]">
        <motion.div
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8"
        >
          <AnimatePresence mode="popLayout">
            {filteredMembers.map((member, index) => (
              <motion.div
                layout
                key={member.id}
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="group relative cursor-pointer aspect-3/4 overflow-hidden bg-forest border border-white/10 hover:border-titli/40 hover:shadow-[0_0_30px_rgba(229,252,84,0.15)] transition-all duration-700"
                onClick={() => setSelectedMember(member)}
                data-cursor="view"
              >
                {/* Viewfinder Brackets */}
                <div className="viewfinder-bracket viewfinder-bracket-tl group-hover:border-titli group-hover:translate-x-1 group-hover:translate-y-1 transition-all duration-500" />
                <div className="viewfinder-bracket viewfinder-bracket-tr group-hover:border-titli group-hover:-translate-x-1 group-hover:translate-y-1 transition-all duration-500" />
                <div className="viewfinder-bracket viewfinder-bracket-bl group-hover:border-titli group-hover:translate-x-1 group-hover:-translate-y-1 transition-all duration-500" />
                <div className="viewfinder-bracket viewfinder-bracket-br group-hover:border-titli group-hover:-translate-x-1 group-hover:-translate-y-1 transition-all duration-500" />

                {/* Technical Overlays */}
                <div className="absolute top-4 left-4 right-4 z-10 flex justify-between items-start pointer-events-none">
                  <div className="flex flex-col gap-1">
                    <span className="text-[7px] font-sans text-titli/50 uppercase tracking-[0.3em] flex items-center gap-1">
                      REC <span className="text-red-500 animate-pulse">●</span>
                    </span>
                    <span className="text-[8px] font-sans text-white/20 uppercase tracking-[0.2em]">0{member.id} // PERS</span>
                  </div>
                  <span className="text-[7px] font-sans text-white/30 uppercase tracking-[0.20em]">
                    {member.category}
                  </span>
                </div>

                {/* Image */}
                <img
                  src={member.img}
                  alt={member.name}
                  loading="lazy"
                  className="w-full h-full object-cover scale-100 group-hover:scale-108 opacity-90 group-hover:opacity-100 transition-all duration-700 ease-out"
                />

                {/* Bottom Info Overlay */}
                <div className="absolute inset-x-0 bottom-0 p-6 z-20 bg-linear-to-t from-forest to-transparent">
                  <div className="relative translate-y-0 lg:translate-y-2 lg:group-hover:translate-y-0 transition-transform duration-700 ease-out">
                    <h4 className="font-serif text-xl text-white leading-tight mb-1">{member.name}</h4>
                    <div className="flex items-center gap-2">
                      <span className="w-8 group-hover:w-16 h-px bg-titli/40 group-hover:bg-titli transition-all duration-700" />
                      <p className="font-sans text-[9px] uppercase tracking-[0.3em] text-titli/80">
                        {member.role}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Member Details Modal */}
      <AnimatePresence>
        {selectedMember !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95 backdrop-blur-md"
            onClick={() => setSelectedMember(null)}
          >
            {/* Modal Box */}
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="relative max-w-4xl w-full bg-[#0b1411] border border-white/10 rounded-lg overflow-hidden flex flex-col md:flex-row shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close button */}
              <button
                onClick={() => setSelectedMember(null)}
                className="absolute top-4 right-4 z-30 p-2 rounded-full border border-white/10 text-white/70 hover:text-white hover:bg-white/10 hover:border-white/30 transition-all duration-300 cursor-pointer"
                aria-label="Close modal"
              >
                <X size={16} />
              </button>

              {/* Left Side: Photo */}
              <div className="w-full md:w-1/2 aspect-square md:aspect-auto relative min-h-[300px] md:h-[500px]">
                {/* Viewfinder brackets inside modal */}
                <div className="viewfinder-bracket viewfinder-bracket-tl top-6 left-6" />
                <div className="viewfinder-bracket viewfinder-bracket-tr top-6 right-6" />
                <div className="viewfinder-bracket viewfinder-bracket-bl bottom-6 left-6" />
                <div className="viewfinder-bracket viewfinder-bracket-br bottom-6 right-6" />
                
                <img
                  src={selectedMember.img}
                  alt={selectedMember.name}
                  className="w-full h-full object-cover filter brightness-95"
                />
                <div className="absolute inset-0 bg-linear-to-t from-forest/80 via-transparent to-transparent md:hidden" />
              </div>

              {/* Right Side: Details & Bio */}
              <div className="w-full md:w-1/2 p-6 md:p-10 flex flex-col justify-center bg-forest relative overflow-hidden">
                {/* Decorative record tag */}
                <span className="text-[8px] font-sans text-titli/50 uppercase tracking-[0.4em] mb-4 block">
                  REC ● 0{selectedMember.id} // MEMBERS.PERS
                </span>

                <h2 className="font-serif text-3xl md:text-4xl text-white italic leading-tight mb-2">
                  {selectedMember.name}
                </h2>
                
                <div className="flex items-center gap-3 mb-6">
                  <span className="w-12 h-px bg-titli" />
                  <span className="font-sans text-[10px] uppercase tracking-[0.3em] text-titli font-medium">
                    {selectedMember.role}
                  </span>
                </div>

                <p className="font-sans text-white/70 text-sm md:text-base leading-relaxed mb-6 font-light">
                  {selectedMember.bio}
                </p>

                <div className="mt-4 pt-6 border-t border-white/5 flex justify-between items-center text-[8px] font-sans text-white/30 tracking-widest uppercase">
                  <span>ISO 400</span>
                  <span>{selectedMember.category}</span>
                  <span>4K RAW</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
