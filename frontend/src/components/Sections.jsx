import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

const eventsPlaceholder = [
  { id: 1, title: 'The Autumn Monologues', type: 'Upcoming', date: 'Oct 24, 2026', color: 'text-titli' },
  { id: 2, title: 'Shadows on Film', type: 'Previous', date: 'Aug 12, 2026', color: 'text-[#d17c26]' },
  { id: 3, title: 'Canvas & Curtains', type: 'Previous', date: 'May 04, 2026', color: 'text-[#297a51]' },
];

export function Events() {
  const [filter, setFilter] = useState('All');
  
  const filteredEvents = eventsPlaceholder.filter(
    (event) => filter === 'All' || event.type === filter
  );

  return (
    <section id="events" className="relative w-full py-24 px-4 sm:px-8 md:px-24">
      <div className="max-w-5xl mx-auto pl-0 sm:pl-12 lg:pl-24">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-16 gap-6">
          <motion.div 
            className="flex items-center gap-4"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
          >
            <span className="text-xs uppercase tracking-[0.3em] font-sans text-accent-orange">02</span>
            <span className="w-12 h-px bg-accent-orange"></span>
            <h2 className="text-xs md:text-sm uppercase tracking-[0.3em] font-sans text-white/50">Curtain Calls</h2>
          </motion.div>
          
          <motion.div 
            className="flex items-center gap-2 border border-white/10 p-1 rounded-full w-max"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
          >
            {['All', 'Upcoming', 'Previous'].map(f => (
              <button 
                key={f}
                onClick={() => setFilter(f)}
                className={`text-xs uppercase tracking-widest font-sans px-4 py-2 rounded-full transition-colors ${filter === f ? 'bg-white text-forest' : 'text-white/50 hover:text-white'}`}
              >
                {f}
              </button>
            ))}
          </motion.div>
        </div>

        <div className="flex flex-col border-t border-white/10 min-h-[300px]">
          <AnimatePresence mode="popLayout">
            {filteredEvents.map((event, i) => (
              <motion.div 
                key={event.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20, filter: 'blur(10px)' }}
                transition={{ duration: 0.4 }}
                className="group flex flex-col md:flex-row md:items-center justify-between py-8 border-b border-white/10 cursor-pointer overflow-hidden relative"
              >
              {/* Hover Background Effect */}
              <div className="absolute inset-0 bg-white/2 transform -translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out z-0" />
              
              <div className="relative z-10 flex flex-col md:w-1/2">
                <span className={`text-xs uppercase tracking-widest font-sans mb-2 ${event.color}`}>{event.type}</span>
                <h3 className="text-3xl md:text-5xl font-serif text-white group-hover:text-titli group-hover:translate-x-4 transition-all duration-500 ease-out">
                  {event.title}
                </h3>
              </div>
              
              <div className="relative z-10 mt-4 md:mt-0 text-right">
                <span className="text-lg font-sans text-white/40 group-hover:text-white transition-colors">{event.date}</span>
              </div>
            </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

export function Members() {
  return (
    <section id="members" className="relative w-full py-24 px-4 sm:px-8 md:px-24">
       <div className="max-w-6xl mx-auto pl-0 sm:pl-12 lg:pl-24">
          <motion.div 
            className="flex items-center gap-4 mb-16"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <span className="text-xs uppercase tracking-[0.3em] font-sans text-accent-green">03</span>
            <span className="w-12 h-px bg-accent-green"></span>
            <h2 className="text-xs md:text-sm uppercase tracking-[0.3em] font-sans text-white/50">The Members</h2>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[1, 2, 3, 4].map((item, i) => (
              <motion.div
                key={item}
                className="relative group "
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.6 }}
              >
                <div className="aspect-3/4 bg-[#121d17] border border-white/5 p-4 flex flex-col justify-end overflow-hidden transition-all duration-500 hover:border-titli/30">
                  <div className="absolute inset-0 opacity-10 bg-[url('https://images.unsplash.com/photo-1542282088-fe8426682b8f?auto=format&fit=crop&w=500&q=60')] bg-cover bg-center mix-blend-overlay group-hover:scale-110 group-hover:opacity-40 transition-all duration-700 blur-[2px] group-hover:blur-none" />
                  <div className="relative z-10 w-full border-t border-white/10 pt-4 mt-auto opacity-80 group-hover:opacity-100 transition-opacity">
                     <h4 className="font-serif text-xl text-white">Member Name</h4>
                     <p className="font-sans text-xs uppercase tracking-widest text-titli mt-1">Director</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
       </div>
    </section>
  );
}

export function Gallery() {
  return (
    <section id="gallery" className="relative w-full py-24 px-4 sm:px-8 md:px-24 mb-24">
       <div className="max-w-6xl mx-auto pl-0 sm:pl-12 lg:pl-24">
          <motion.div 
            className="flex items-center gap-4 mb-16"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <span className="text-xs uppercase tracking-[0.3em] font-sans text-titli">04</span>
            <span className="w-12 h-px bg-titli"></span>
            <h2 className="text-xs md:text-sm uppercase tracking-[0.3em] font-sans text-white/50">Archives</h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             {/* Large featured */}
             <motion.div 
              className="md:col-span-2 aspect-21/9 bg-linear-to-br from-[#1c2e24] to-[#0a110d] overflow-hidden group relative"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
             >
                <img src="https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=1200&q=80" alt="Theatre stage" className="w-full h-full object-cover filter grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-1000 ease-out opacity-60 group-hover:opacity-100" />
                <div className="absolute inset-0 bg-black/40 group-hover:bg-transparent transition-colors duration-1000" />
             </motion.div>
             <motion.div 
              className="aspect-4/3 bg-linear-to-br from-[#1c2e24] to-[#0a110d] overflow-hidden group relative"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
             >
                <img src="https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=800&q=80" alt="Culture" className="w-full h-full object-cover filter grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-1000 ease-out opacity-60 group-hover:opacity-100" />
             </motion.div>
             <motion.div 
              className="aspect-4/3 bg-linear-to-br from-[#1c2e24] to-[#0a110d] overflow-hidden group relative"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.4 }}
             >
                <img src="https://images.unsplash.com/photo-1594122230689-45899d9e6f69?auto=format&fit=crop&w=800&q=80" alt="Cinema" className="w-full h-full object-cover filter grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-1000 ease-out opacity-60 group-hover:opacity-100" />
             </motion.div>
          </div>
       </div>
    </section>
  );
}

export function Contact() {
  return (
    <section id="contact" className="relative w-full py-24 px-4 sm:px-8 md:px-24 border-t border-white/10 mt-24 mb-12 overflow-hidden">
       <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-16 md:gap-24 relative z-10 pl-0 sm:pl-12 lg:pl-24">
          {/* Left Side: Info */}
          <motion.div 
            className="flex flex-col md:w-1/2"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center gap-4 mb-8">
              <span className="text-xs uppercase tracking-[0.3em] font-sans text-accent-orange">05</span>
              <span className="w-12 h-px bg-accent-orange"></span>
              <h2 className="text-xs md:text-sm uppercase tracking-[0.3em] font-sans text-white/50">Say Hello</h2>
            </div>
            <h2 className="text-4xl md:text-6xl lg:text-7xl font-serif text-white mb-6 leading-tight">Let's Create <br /><span className="italic text-white/50">Together</span></h2>
            <p className="font-sans text-white/50 text-lg md:text-xl font-light mb-8 max-w-md">Reach out for collaborations, inquiries, or just to say hello. We are always looking for new stories to tell.</p>
            
            <div className="flex flex-col gap-6 mt-4">
              <div>
                <p className="text-[10px] uppercase tracking-widest text-white/30 mb-2 font-sans">Email</p>
                <a href="mailto:hello@titlifoundation.com" className="text-lg text-white hover:text-titli transition-colors duration-300 font-serif">titlifoundation@rediffmail.com</a>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-widest text-white/30 mb-2 font-sans">Social</p>
                <div className="flex gap-6">
                  <a href="#" className="text-sm text-white/70 hover:text-titli uppercase tracking-widest font-sans transition-colors duration-300">Instagram</a>
                  <a href="#" className="text-sm text-white/70 hover:text-titli uppercase tracking-widest font-sans transition-colors duration-300">Twitter</a>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Side: Form */}
          <motion.div 
            className="md:w-1/2 relative flex flex-col"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
             {/* Glow blob */}
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 bg-titli/5 blur-[100px] rounded-full pointer-events-none z-0" />
             
             <form className="relative z-10 flex flex-col gap-6 w-full h-full p-8 md:p-10 bg-[#0c1410]/80 border border-white/5 backdrop-blur-xl rounded-2xl shadow-2xl justify-between">
                <div className="flex flex-col gap-2">
                   <label className="text-[10px] uppercase tracking-widest text-white/40">Your Name</label>
                   <input type="text" className="w-full bg-white/5 border border-white/10 rounded-lg p-4 text-white placeholder-white/20 focus:outline-none focus:border-titli/50 focus:bg-white/10 transition-all duration-300 text-sm font-sans" placeholder="John Doe" />
                </div>
                <div className="flex flex-col gap-2 mt-2">
                   <label className="text-[10px] uppercase tracking-widest text-white/40">Email Address</label>
                   <input type="email" className="w-full bg-white/5 border border-white/10 rounded-lg p-4 text-white placeholder-white/20 focus:outline-none focus:border-titli/50 focus:bg-white/10 transition-all duration-300 text-sm font-sans" placeholder="hello@example.com" />
                </div>
                <div className="flex flex-col gap-2 mt-2">
                   <label className="text-[10px] uppercase tracking-widest text-white/40">Message</label>
                   <textarea rows="5" className="w-full bg-white/5 border border-white/10 rounded-lg p-4 text-white placeholder-white/20 focus:outline-none focus:border-titli/50 focus:bg-white/10 transition-all duration-300 text-sm font-sans resize-none" placeholder="Tell us about your project..."></textarea>
                </div>
                <button type="button" className="mt-6 py-4 px-8 border border-titli/30 text-titli font-sans text-[11px] uppercase tracking-[0.2em] hover:bg-titli hover:text-forest transition-colors w-full rounded-lg duration-300">
                   Send Message
                </button>
             </form>
          </motion.div>
       </div>
    </section>
  );
}
