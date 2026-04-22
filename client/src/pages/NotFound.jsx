import React from 'react';
import { Link } from 'react-router-dom';
import { FaCompass } from 'react-icons/fa';

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[url('https://images.unsplash.com/photo-1506744038136-46273834b3fb')] bg-cover bg-center relative px-6">
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]" />

      <div className="relative z-10 max-w-lg w-full bg-white/5 backdrop-blur-xl border border-white/10 p-10 rounded-3xl shadow-2xl text-center">
        <FaCompass className="text-8xl text-yellow-500/40 mx-auto mb-6 animate-pulse" />
        
        <h1 className="font-['Montserrat'] font-black text-7xl text-white mb-2 tracking-tighter">
          404
        </h1>
        
        <h2 className="text-xl font-bold text-white/90 uppercase tracking-[0.2em] mb-6">
          You've Wandered Off The Path
        </h2>
        
        <p className="text-white/60 mb-8 leading-relaxed">
          The destination you are looking for doesn't exist or has been moved to a secret location. Let's get you back to safety.
        </p>

        <Link
          to="/"
          className="inline-block bg-white/10 hover:bg-white/20 border border-white/20 text-white font-black uppercase tracking-widest px-8 py-4 rounded-xl transition-all transform hover:scale-105 active:scale-95 shadow-xl"
        >
          Return to Base
        </Link>
      </div>
    </div>
  );
};

export default NotFound;