import React from 'react';

export const ChordDisplay = ({ chordProgression, currentChordIndex, getChordName }) => (
    <div className="w-full max-w-xl p-4 sm:p-6 mb-6 flex justify-around items-center space-x-4">
        {chordProgression.map((_, index) => (
            <div 
                key={index} 
                className={`text-center transition-all duration-300 p-3 flex-1 rounded-lg ${
                    currentChordIndex === index 
                        ? "text-white scale-110 font-bold drop-shadow-lg" 
                        : "text-gray-400"
                }`} 
                style={{ 
                    textShadow: currentChordIndex === index ? '0 0 10px rgba(255, 255, 255, 0.5)' : 'none' 
                }}
            >
                <span className="text-2xl sm:text-4xl">{getChordName(index)}</span>
            </div>
        ))}
    </div>
);
