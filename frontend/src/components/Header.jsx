import React from 'react';

// --- SVG Icons (no changes needed) ---
const SaveIcon = () => ( <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7H5a2 2 0 00-2 2v8a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"></path></svg> );
const ResetIcon = () => ( <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426-1.756-2.924-1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.22 2.572-1.065z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg> );
const LogoutIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h6a2 2 0 012 2v1" /></svg> );

export const Header = ({ isLoading, onSave, onReset, onLogout, children }) => {
    const buttonStyle = "flex items-center space-x-2 px-5 py-2.5 bg-gray-800/80 text-white font-semibold text-sm rounded-lg shadow-md hover:bg-purple-600 transition-all duration-300 transform hover:scale-105 disabled:opacity-50";

    return (
        // ✅ The <header> is now a relative container for the absolute button
        <header className="w-full relative mt-12 mb-8">
            
            {/* Logout button is now positioned absolutely relative to the header */}
            <button
                onClick={onLogout}
                // ✅ Positioned top-0 right-0 by default, and moved further out on larger screens
                className="absolute top-0 right-0 md:-top-8 md:-right-25 flex items-center space-x-2 px-3 py-2.5 text-pink-400 hover:text-purple-400 transition-colors font-semibold text-sm z-10"
            >
                <span>Logout</span>
                <LogoutIcon />
            </button>
            
            {/* This new div contains the main header content */}
            <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-6">
                {/* Left side: Title */}
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white leading-tight text-center lg:text-left">
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500">
                        BandAid
                    </span>
                </h1>

                {/* Right side: Action Buttons */}
                <div className="flex items-center justify-center lg:justify-end gap-3 sm:gap-4 flex-wrap">
                    <button onClick={onSave} className={buttonStyle} disabled={isLoading}>
                        <SaveIcon />
                        <span>{isLoading ? "Saving..." : "Save"}</span>
                    </button>

                    <button onClick={onReset} className={buttonStyle} disabled={isLoading}>
                        <ResetIcon />
                        <span>Reset</span>
                    </button>
                    
                    {/* CollaborationPanel (Start Jam) Button */}
                    {children}
                </div>
            </div>
        </header>
    );
};