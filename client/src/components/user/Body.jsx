import React from 'react'
import { useEffect, useRef } from 'react'
import videoBg from '../../assets/bg.mp4'

function Body({ children }) {
    const scrollWrapperRef = useRef(null);

    // Scrollbar auto-hide logic
  useEffect(() => {
    const wrapper = scrollWrapperRef.current;
    if (!wrapper) return;

    let timeoutId;
    const handleScroll = () => {
      wrapper.classList.add('scrolling');
      // dispatch custom event for Navbar to listen to
      window.dispatchEvent(new CustomEvent('bodyScroll', {
        detail: { scrollTop: wrapper.scrollTop }
      }))
      window.clearTimeout(timeoutId)
      timeoutId = window.setTimeout(() => wrapper.classList.remove('scrolling'), 150);
    };

    wrapper.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      wrapper.removeEventListener('scroll', handleScroll);
      window.clearTimeout(timeoutId);
    };
  }, []);

  return (
    // Page Wrapper
        <div ref={scrollWrapperRef} className="h-screen font-sans overflow-y-auto overflow-x-hidden relative scrollbar-auto-hide scrollbar-thin scrollbar-thumb-white-500/20 scrollbar-track-transparent rtl">
          <div className="ltr">
    
          {/* video Background */}
          <div className="fixed inset-0 -z-10">
          <video
              src={videoBg}
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover"
            >
            </video>
    
            {/* Overlay */}
            <div className="absolute inset-0 bg-black/50 backdrop-blur-[3px]" />
          </div>
        </div>

        {/* Main Content */}
        <div className="relative z-10">
          {children}
        </div>
      </div>
  )
}

export default Body