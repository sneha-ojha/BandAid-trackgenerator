import React from 'react';

// --- SVG Icons ---
const PlayIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" ><path d="M8 5v14l11-7z" /></svg> );
const StopIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" ><path d="M6 6h12v12H6z" /></svg> );
const SaveIcon = () => ( <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7H5a2 2 0 00-2 2v8a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"></path></svg> );
const ResetIcon = () => ( <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.22 2.572-1.065z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg> );


export const ActionButtons = ({ isPlaying, onPlay, onStop}) => (
    <>
 

        {/* Play/Stop Buttons */}
        <div className="my-15 w-full flex justify-center">
            {!isPlaying ? (
                <button 
                    onClick={onPlay} 
                    className="flex items-center space-x-3 px-12 py-5 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-extrabold text-2xl shadow-lg shadow-pink-500/30 transition-all duration-500 transform hover:scale-105 rounded-md"
                >
                    <PlayIcon />
                </button>
            ) : (
                <button 
                    onClick={onStop} 
                    className="flex items-center space-x-3 px-12 py-5 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-extrabold text-2xl shadow-lg shadow-pink-500/30 transition-all duration-500 transform hover:scale-105 rounded-md"
                >
                    <StopIcon />
                </button>
            )}
        </div>
    </>
);

export const ShortcutsFooter = () => (
    <>
        <div className="relative z-10 w-full bg-gray-900/50 backdrop-blur-md p-8 border-t border-b border-gray-700">
            <div className="w-full max-w-7xl mx-auto">
                <h2 className="text-xl font-bold text-purple-400 mb-8 text-center">Keyboard Shortcuts</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 text-gray-300">
                    <div className="flex items-center space-x-3"><kbd className="kbd">P</kbd><span className="text-pink-400">➪</span><span>Toggle Piano</span></div>
                    <div className="flex items-center space-x-3"><kbd className="kbd">G</kbd><span className="text-pink-400">➪</span><span>Toggle Guitar</span></div>
                    <div className="flex items-center space-x-3"><kbd className="kbd">V</kbd><span className="text-pink-400">➪</span><span>Toggle Violin</span></div>
                    <div className="flex items-center space-x-3 col-span-2 sm:col-span-1 lg:col-span-1"><kbd className="kbd">Space</kbd><span className="text-pink-400">➪</span><span>Play / Stop</span></div>
                    <div className="flex items-center space-x-3"><kbd className="kbd">B</kbd><span className="text-pink-400">➪</span><span>Beats (1 loop)</span></div>
                    <div className="flex items-center space-x-3"><kbd className="kbd">N</kbd><span className="text-pink-400">➪</span><span>Beats (2 loops)</span></div>
                    <div className="flex items-center space-x-3"><kbd className="kbd">F</kbd><span className="text-pink-400">➪</span><span>Toggle Flute</span></div>
                </div>
            </div>
        </div>
        <footer className="relative z-10 w-full bg-white/5 backdrop-blur-sm p-6 text-center mt-auto border-t border-gray-700">
            <div className="flex flex-col items-center sm:flex-row justify-between max-w-6xl mx-auto">
                <p className="text-gray-400 text-sm mb-4 sm:mb-0">Built to <span className="text-pink-500">solve </span> by Sneha Ojha</p>
                <div className="flex space-x-6">
                    <a href="https://linkedin.com/in/snehaojha/connect" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-pink-400 transition-colors duration-300"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.765s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.765-1.75 1.765zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg></a>
                    <a href="https://github.com/sneha-ojha" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-pink-400 transition-colors duration-300"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.809 1.305 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.046.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.196-6.095 8.196-11.385 0-6.627-5.373-12-12-12z"/></svg></a>
                </div>
            </div>
        </footer>
        <style>{`
            .kbd { 
                display: inline-flex; 
                align-items: center; 
                justify-content: center; 
                padding: 0.2rem 0.6rem; 
                min-width: 2rem; 
                height: 2rem; 
                font-size: 0.875rem; 
                line-height: 1; 
                font-family: monospace; 
                background-color: #1f2937; 
                color: #e5e7eb; 
                border: 1px solid #4b5563; 
                border-radius: 0.375rem; 
                box-shadow: 0 2px 0 #4b5563, 0 1px 0 #1f2937 inset; 
                user-select: none; 
                white-space: nowrap; 
            }
        `}</style>
    </>
);
