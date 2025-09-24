import React, { useState, useEffect, useRef } from "react";

// Add a settings icon for the popovers
const SettingsIcon = () => (
  <svg className="w-5 h-5 text-gray-400 hover:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.22 2.572-1.065z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

// --- Reusable Row with Popover Logic ---
export const ConfigurableControlRow = ({
  label,
  isEnabled,
  onToggle,
  gain,
  onGainChange,
  children // The content for the popover
}) => {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const popoverRef = useRef(null);

  // Hook to close popover when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (popoverRef.current && !popoverRef.current.contains(event.target)) {
        setIsPopoverOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [popoverRef]);

  return (
    <div className="relative">
      <div className="flex items-center justify-between">
        {/* Left Side: Checkbox and Label */}
        <div className="flex items-center space-x-3">
          <input
            type="checkbox"
            id={`${label}-checkbox`}
            checked={isEnabled}
            onChange={onToggle}
            className="form-checkbox h-6 w-6 text-pink-500 bg-gray-700 border-gray-600 rounded-md focus:ring-pink-500 cursor-pointer accent-pink-500"
          />
          <label htmlFor={`${label}-checkbox`} className="text-base font-medium text-gray-100 cursor-pointer">
            {label}
          </label>
        </div>

        {/* Right Side: Controls (Settings Icon and Volume) */}
        <div className={`flex items-center space-x-4 transition-opacity duration-300 ${isEnabled ? 'opacity-100' : 'opacity-0'}`}>
          <button onClick={() => setIsPopoverOpen(!isPopoverOpen)} aria-label="Open Settings">
            <SettingsIcon />
          </button>
          <input
            type="range"
            min="0" max="3" step="0.1"
            value={gain}
            onChange={onGainChange}
            className="w-32 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
            aria-label={`${label} Volume`}
          />
        </div>
      </div>

      {/* The Popover */}
      {isPopoverOpen && isEnabled && (
        <div
          ref={popoverRef}
          className="absolute top-full right-0 mt-2 w-72 p-4 bg-gray-900 border border-purple-700/50 rounded-lg shadow-2xl z-20 space-y-4"
        >
          {children}
        </div>
      )}
    </div>
  );
};