import React, { useEffect, useRef } from 'react';
import { PlayCircle, Sliders, Repeat, Keyboard } from 'lucide-react';

const HomePage = ({ onSwitchToLogin }) => {
  const taglineRef = useRef(null);
  const inActionRef = useRef(null);
  const cardsRef = useRef(null);
  const howItWorksRef = useRef(null);
  const problemRef = useRef(null);

  useEffect(() => {
    // Single IntersectionObserver for all sections
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('slide-up-and-fade');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        root: null,
        threshold: 0.1,
      }
    );

    // Initial fade-in for the tagline on page load
    const taglineElement = taglineRef.current;
    if (taglineElement) {
      taglineElement.classList.add('fade-in');
    }

    // Observe each section and card
    const sections = [
      inActionRef.current,
      cardsRef.current,
      howItWorksRef.current,
      problemRef.current,
    ].filter(Boolean); // Filter out any null refs

    sections.forEach((section) => {
      // For the cards, observe each individual card
      if (section.classList.contains('features-section')) {
        const cardElements = section.querySelectorAll('.feature-card');
        cardElements.forEach((card) => {
          observer.observe(card);
        });
      } else {
        // For other sections, observe the main section element
        observer.observe(section);
      }
    });

    // Cleanup function
    return () => {
      sections.forEach((section) => {
        if (section.classList.contains('features-section')) {
          const cardElements = section.querySelectorAll('.feature-card');
          cardElements.forEach((card) => observer.unobserve(card));
        } else {
          observer.unobserve(section);
        }
      });
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col text-white relative font-michroma bg-[#0A0A0E] overflow-hidden">
      {/* Dynamic, Subtle Background */}
      <div className="absolute inset-0 z-0 opacity-80">
        <div className="absolute inset-0 bg-repeat animate-pulse-slow-custom" style={{
          backgroundImage: 'radial-gradient(circle, #2C0E3A 1px, transparent 1px), radial-gradient(circle, #4A1A5B 1px, transparent 1px)',
          backgroundSize: '30px 30px',
          backgroundPosition: '0 0, 15px 15px',
        }}></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-900/30 via-transparent to-transparent"></div>
      </div>

      {/* Main Content Container */}
      <div className="relative z-10 flex flex-col items-center p-8 sm:p-12 md:p-16">
        
        {/* Header Section */}
        <header className="w-full text-center mt-12 mb-20 max-w-4xl">
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold text-white leading-tight drop-shadow-[0_0_20px_rgba(255,255,255,0.2)]">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500 animate-text-gradient">BandAid</span>
          </h1>
          <p className="mt-6 text-lg md:text-xl text-gray-300 font-sans tracking-wide max-w-2xl mx-auto opacity-0" ref={taglineRef}>
            Your personal, pocket-sized track generator. Instantly create musical backing for your vocals or compositions.
          </p>
          <button
            onClick={onSwitchToLogin}
            className="mt-12 inline-flex items-center px-10 py-5 rounded-full bg-gradient-to-r from-purple-600 to-pink-500 text-white font-bold text-lg shadow-lg shadow-pink-500/30 transition-all duration-500 transform hover:scale-105 relative overflow-hidden group border-2 border-transparent hover:border-white"
          >
            <span className="relative z-10">Start Creating</span>
            <span className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
          </button>
        </header>

        {/* In Action Section */}
        <section className="w-full max-w-6xl mx-auto my-20 opacity-0" ref={inActionRef}>
            <div className="relative bg-gradient-to-br from-purple-900/30 to-pink-900/20 rounded-3xl p-10 md:p-20 border border-purple-700/50 overflow-hidden">
                <div className="absolute -top-10 -right-10 w-48 h-48 bg-purple-500/20 rounded-full blur-3xl"></div>
                <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-pink-500/20 rounded-full blur-3xl"></div>
                <h2 className="text-4xl md:text-5xl font-extrabold text-center mb-6 drop-shadow-md">
                    BandAid <span className="text-pink-400">In Action</span>
                </h2>
                <p className="text-gray-300 text-center max-w-2xl mx-auto mb-10">
                    See how our intuitive interface empowers you to create music on the fly, with no instruments required.
                </p>
                <div className="relative w-full h-80 bg-gray-900 rounded-xl border border-gray-700 shadow-2xl overflow-hidden">
                    {/* The video element is directly placed here */}
                    <video
                        className="w-full h-full object-cover"
                        autoPlay
                        loop
                        muted
                        playsInline
                        controls
                    >
                        {/* Assuming your video file is in the public directory at public/videos/bandaid-demo.mp4 */}
                        <source src="/bandaid-demo.mp4" type="video/mp4" />
                        Your browser does not support the video tag.
                    </video>
                </div>
            </div>
        </section>

        {/* Feature Section with Improved Cards */}
        <section className="w-full max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 my-20 features-section" ref={cardsRef}>
          {[
            { icon: PlayCircle, title: 'Instant Chord Progressions', description: 'Quickly generate harmonic backdrops that perfectly complement your melodies and vocals.' },
            { icon: Sliders, title: 'Dynamic Customization', description: 'Adjust tempo, key, and instrumentation to fine-tune every element of your unique track.' },
            { icon: Repeat, title: 'Seamless Looping', description: 'Craft compelling rhythms with simple beat patterns and loop options for smooth, continuous playback.' },
            { icon: Keyboard, title: 'Fluid Workflow', description: 'Master your creative process with keyboard shortcuts for effortless real-time adjustments.' }
          ].map((feature, index) => (
            <div 
              key={index} 
              className="feature-card bg-white/5 backdrop-blur-sm p-6 rounded-2xl border border-gray-700/50 shadow-xl flex flex-col items-center text-center transition-all duration-1000 transform opacity-0 translate-y-10 hover:scale-105 hover:border-purple-500/70 group"
              style={{ transitionDelay: `${index * 150}ms` }}
            >
              <div className="bg-pink-500/20 p-3 rounded-full mb-4 group-hover:bg-purple-500/20 transition-colors duration-300">
                <feature.icon className="w-10 h-10 text-pink-400 transition-transform duration-300 group-hover:scale-110 group-hover:text-purple-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-100 mb-2">{feature.title}</h3>
              <p className="text-gray-400 text-sm">{feature.description}</p>
            </div>
          ))}
        </section>
        
        {/* How It Works Section */}
        <section className="w-full max-w-6xl mx-auto my-20 opacity-0" ref={howItWorksRef}>
            <h2 className="text-4xl md:text-5xl font-extrabold text-center mb-12 drop-shadow-md">
                How It <span className="text-pink-400">Works</span>
            </h2>
            <div className="flex flex-col md:flex-row justify-between items-center space-y-12 md:space-y-0 md:space-x-12">
                <div className="flex flex-col items-center text-center max-w-sm">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-600 to-pink-500 flex items-center justify-center mb-4 text-3xl font-bold">1</div>
                    <h3 className="text-2xl font-bold text-gray-100 mb-2">Choose Your Chords</h3>
                    <p className="text-gray-400">
                        Select a series of chords to form the harmonic foundation of your track.
                    </p>
                </div>
                <div className="flex flex-col items-center text-center max-w-sm">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-600 to-pink-500 flex items-center justify-center mb-4 text-3xl font-bold">2</div>
                    <h3 className="text-2xl font-bold text-gray-100 mb-2">Adjust and Customize</h3>
                    <p className="text-gray-400">
                        Tailor your track with simple controls for tempo, scale, and instrument selection.
                    </p>
                </div>
                <div className="flex flex-col items-center text-center max-w-sm">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-600 to-pink-500 flex items-center justify-center mb-4 text-3xl font-bold">3</div>
                    <h3 className="text-2xl font-bold text-gray-100 mb-2">Generate and Play</h3>
                    <p className="text-gray-400">
                        Instantly generate and play your backing track. It's that simple!
                    </p>
                </div>
            </div>
        </section>

        {/* The Problem I Solved Section */}
        <section className="w-full max-w-4xl mx-auto my-20 text-center opacity-0" ref={problemRef}>
            <h2 className="text-3xl font-bold text-pink-400 mb-4 tracking-wide">The Problem It Solves</h2>
            <p className="text-gray-400 leading-relaxed font-sans max-w-2xl mx-auto">
                As people who love to sing we often feel the need to have an instrumental backing, or have a melody or a composition in mind but lack an instrument to immediately try it out. <span className="text-pink-400">BandAid</span> was born to <span className="text-pink-400">fix </span>this exact problem, offering a seamless, handy solution for instant instrumental backing. Never lose your creative spark again.
            </p>
        </section>
        
      </div>

      {/* Footer Section */}
      <footer className="relative z-10 w-full bg-white/5 backdrop-blur-sm p-6 text-center mt-auto border-t border-gray-700">
        <div className="flex flex-col items-center sm:flex-row justify-between max-w-6xl mx-auto">
          <p className="text-gray-400 text-sm mb-4 sm:mb-0">Built to <span className="text-pink-500">solve</span> by Sneha Ojha</p>
          <div className="flex space-x-6">
            <a href="https://linkedin.com/in/snehaojha/connect" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-pink-400 transition-colors duration-300">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.765s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.765-1.75 1.765zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
            </a>
            <a href="https://github.com/sneha-ojha" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-pink-400 transition-colors duration-300">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.809 1.305 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.046.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.196-6.095 8.196-11.385 0-6.627-5.373-12-12-12z"/></svg>
            </a>
          </div>
        </div>
      </footer>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Michroma&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap');
        
        .font-michroma { font-family: 'Michroma', sans-serif; }
        .font-sans { font-family: 'Inter', sans-serif; }
        
        @keyframes text-gradient {
          0% { background-position: 0% 50%; }
          100% { background-position: 100% 50%; }
        }
        .animate-text-gradient {
          background-size: 200% auto;
          animation: text-gradient 3s linear infinite alternate;
        }

        @keyframes pulse-slow-custom {
          0%, 100% { transform: scale(1); opacity: 0.05; }
          50% { transform: scale(1.02); opacity: 0.1; }
        }
        .animate-pulse-slow-custom { animation: pulse-slow-custom 8s ease-in-out infinite alternate; }

        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .fade-in {
          animation: fade-in 1.2s ease-out forwards;
        }

        @keyframes slide-up-and-fade {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .slide-up-and-fade {
          animation: slide-up-and-fade 1.2s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default HomePage;