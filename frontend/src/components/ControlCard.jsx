import React from 'react';

export const ControlCard = ({ title, children, className = '', titleClassName = '' }) => (
    <div className={`bg-gray-800/80 backdrop-blur-md rounded-2xl p-8 shadow-xl border border-purple-700/50 hover:border-pink-500 transition-all duration-300 ${className}`}>
        <label className={`block text-lg font-bold text-purple-400 mb-4 ${titleClassName}`}>
            {title}
        </label>
        {children}
    </div>
);
