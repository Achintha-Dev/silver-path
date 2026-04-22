import React, { useEffect, useRef } from 'react'
import videoBg from '../../assets/bg.mp4'

function Body({ children }) {
  const scrollWrapperRef = useRef(null);

  useEffect(() => {
    const wrapper = scrollWrapperRef.current;
    if (!wrapper) return;

    let timeoutId = null;

    const handleScroll = () => {
      wrapper.classList.add('scrolling');

      // dispatch custom event for Navbar to listen to
      window.dispatchEvent(new CustomEvent('bodyScroll', {
        detail: { scrollTop: wrapper.scrollTop }
      }));

      if (timeoutId) window.clearTimeout(timeoutId);

      timeoutId = window.setTimeout(() => {
        // wrapper might be null if component unmounted
        if (wrapper) {
          wrapper.classList.remove('scrolling');
        }
      }, 150);
    };

    wrapper.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      wrapper.removeEventListener('scroll', handleScroll);
      if (timeoutId) window.clearTimeout(timeoutId); // clean up pending timeout
    };
  }, []);

  return (
    <div
      ref={scrollWrapperRef}
      className="h-screen font-sans overflow-y-auto overflow-x-hidden relative scrollbar-auto-hide scrollbar-thin scrollbar-thumb-white-500/20 scrollbar-track-transparent rtl"
    >
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
          />
          <div className="absolute inset-0 bg-black/50 backdrop-blur-" />
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