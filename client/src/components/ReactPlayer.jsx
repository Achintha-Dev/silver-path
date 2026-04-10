import ReactPlayer from 'react-player/youtube';

export const PageWrapper = ({ children }) => {
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-neutral font-sans">
      
      {/* Background Video Layer */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <ReactPlayer
          url="https://youtu.be/U9N2h3GY7jU?si=UWfHFhcmaI4CryIl"
          playing={true}
          loop={true}
          muted={true}
          width="100%"
          height="100%"
          config={{
            youtube: {
              playerVars: { 
                autoplay: 1, 
                controls: 0, 
                showinfo: 0, 
                rel: 0, 
                modestbranding: 1,
                iv_load_policy: 3,
                mute: 1
              }
            }
          }}
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%) scale(1.5)', // Scale up to ensure cover
            objectFit: 'cover',
          }}
        />
      </div>

      {/* Fallback & Overlay Layer */}
      <div 
        className="absolute inset-0 z-10 bg-cover bg-center bg-no-repeat opacity-40 backdrop-blur-[2px]"
        style={{
          backgroundImage: `url('https://res.cloudinary.com/dscrcucmg/image/upload/v1775744286/Bathalagoda_Lake__Kurunegala_vpzykk.jpg')`,
        }}
      />

      {/* Content Layer */}
      <div className="relative z-20 min-h-screen text-base-content overflow-x-hidden">
        {children}
      </div>
    </div>
  );
};