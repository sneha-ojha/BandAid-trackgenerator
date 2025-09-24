import React, { useState, useEffect, useRef } from 'react';

// --- SVG Icons ---
const CopyIcon = ({ className }) => ( <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg> );
const EndSessionIcon = ({ className }) => ( <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" /></svg> );
const JamIcon = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={className || "w-5 h-5 text-gray-400"}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth="1.5"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M9 9l10.5-3m0 6.553v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 11-.99-3.467l2.31-.66a2.25 2.25 0 001.632-2.163zm0 0V2.25L9 5.25v10.303m0 0v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 01-.99-3.467l2.31-.66A2.25 2.25 0 009 15.553z"
    />
  </svg>
);


export const CollaborationPanel = ({ collaborationId, joinId, setJoinId, onStart, onJoin, onEndSession }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isCopied, setIsCopied] = useState(false);
    const panelRef = useRef(null);

    const handleCopy = () => {
        if (collaborationId) {
            navigator.clipboard.writeText(collaborationId);
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 2000);
        }
    };

    useEffect(() => {
        function handleClickOutside(event) {
            if (panelRef.current && !panelRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [panelRef]);

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`flex items-center space-x-2 px-6 py-2.5 font-semibold text-sm rounded-lg shadow-md transition-all duration-300 transform hover:scale-105 disabled:opacity-50 ${
                    collaborationId 
                        ? 'bg-gray-800 text-white' // --- CHANGE 1: Active button is now pink ---
                        : 'bg-gray-800 text-white hover:bg-purple-600'
                }`}
            >
                <JamIcon className="w-5 h-5" />
                <span>{collaborationId ? 'Session' : 'Start Jam'}</span>
                
                {/* --- CHANGE 2: Active dot is now green --- */}
                {collaborationId && (
                    <span className="relative flex h-2 w-2 ml-1">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-400"></span>
                    </span>
                )}
            </button>

            {isOpen && (
                <div
                    ref={panelRef}
                    className="absolute top-full right-0 mt-2 w-96 p-6 bg-gray-900 border border-purple-700/50 rounded-xl shadow-2xl z-20 text-center"
                >
                    {collaborationId ? (
                        <div className="flex flex-col items-center gap-4">
                            <h2 className="text-lg font-bold tracking-wider text-green-400">SESSION ACTIVE</h2>
                            <p className="text-gray-400 text-sm">Share this ID with your team:</p>
                            <div className="relative w-full">
                                <p className="font-mono bg-gray-800 py-2 pl-4 pr-10 rounded-md text-pink-400 border border-gray-700 w-full">{collaborationId}</p>
                                <button onClick={handleCopy} className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-400 hover:text-white"><CopyIcon className="w-5 h-5" /></button>
                            </div>
                            {isCopied && <p className="text-green-400 text-xs">Copied to clipboard!</p>}
                            <button onClick={onEndSession} className="flex items-center gap-2 mt-2 px-4 py-2 text-sm font-semibold text-red-400 bg-red-900/40 border border-red-500/30 rounded-lg hover:bg-red-900/60 hover:text-white transition-colors w-full justify-center">
                                <EndSessionIcon className="w-5 h-5" />
                                End Session
                            </button>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center gap-4">
                            <h2 className="text-lg font-bold tracking-wider text-purple-300">COLLABORATION</h2>
                            <button onClick={onStart} className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-500 text-white font-bold rounded-md shadow-lg hover:scale-105 transition-transform">
                                Start New Session
                            </button>
                            <div className="flex items-center w-full"><div className="flex-grow h-px bg-gray-700"></div><span className="px-2 text-gray-500 text-sm">OR</span><div className="flex-grow h-px bg-gray-700"></div></div>
                            <p className="text-gray-400 text-sm -mb-2">Have an ID? Join here:</p>
                            <div className="flex items-center gap-2 w-full">
                                <input type="text" placeholder="Enter Session ID" value={joinId} onChange={(e) => setJoinId(e.target.value)} className="flex-grow bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-center text-sm font-mono text-pink-400 placeholder-gray-600 focus:ring-1 focus:ring-pink-500 outline-none" />
                                <button onClick={() => onJoin(joinId)} disabled={!joinId} className="px-4 py-2 bg-gray-700 text-white font-semibold text-sm rounded-md hover:bg-pink-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                                    Join
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};