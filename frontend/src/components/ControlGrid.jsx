import React from "react";

// --- Sub-Component: A reusable card wrapper ---
const ControlCard = ({ title, children, className = "" }) => (
    <div className={`bg-gray-800/80 backdrop-blur-md rounded-2xl p-6 shadow-xl border border-purple-700/50 flex flex-col ${className}`}>
        <label className="block text-lg font-bold text-purple-400 mb-4">{title}</label>
        <div className="space-y-6 flex-grow">{children}</div>
    </div>
);

// --- Sub-Component: Volume Icon ---
const VolumeIcon = () => (
    <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
    </svg>
);

// --- Sub-Component: Reusable Dropdown ---
const StyledSelect = ({ id, label, value, onChange, children, disabled }) => (
    <div className="flex-1 min-w-[100px]">
        <label className="text-sm text-gray-400 mb-1 block" htmlFor={id}>{label}</label>
        <select
            id={id}
            value={value}
            onChange={onChange}
            disabled={disabled}
            className="w-full bg-gray-900 border border-purple-600 rounded-lg px-3 py-1.5 text-pink-400 focus:ring-1 focus:ring-pink-500 outline-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
            {children}
        </select>
    </div>
);

// --- Sub-Component: InstrumentControlRow ---
const InstrumentControlRow = ({ inst, settings, onToggle, onUpdate }) => {
    const instSettings = settings.activeInstruments[inst.value] || {};
    const isEnabled = !!settings.activeInstruments[inst.value];

    return (
        <div className="flex flex-col sm:flex-row gap-x-8 gap-y-4">
            {/* --- Left Side: Toggle & Volume --- */}
            <div className="space-y-4 w-44 shrink-0">
                <div className="flex items-center space-x-3">
                    <input
                        type="checkbox"
                        id={`inst-checkbox-${inst.value}`}
                        checked={isEnabled}
                        onChange={() => onToggle(inst)}
                        className="form-checkbox h-5 w-5 text-pink-500 bg-gray-700 border-gray-600 rounded-md focus:ring-pink-500 cursor-pointer accent-pink-500"
                    />
                    <label
                        htmlFor={`inst-checkbox-${inst.value}`}
                        className="text-base font-medium text-gray-100 cursor-pointer"
                    >
                        {inst.label}
                    </label>
                </div>
                
                <div className={`transition-all duration-300 ease-in-out overflow-hidden ${isEnabled ? 'max-h-20 opacity-100' : 'max-h-0 opacity-0'}`}>
                    <div className="flex items-center space-x-2 pt-2">
                        <VolumeIcon />
                        <input
                            type="range"
                            min="0" max="3" step="0.1"
                            value={instSettings.gain ?? inst.defaultGain}
                            onChange={(e) => onUpdate(inst.value, "gain", Number(e.target.value))}
                            disabled={!isEnabled}
                            className="w-24 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
                        />
                    </div>
                </div>
            </div>

            {/* --- Right Side: Octave Dropdown --- */}
            <div className={`flex-grow transition-all duration-300 ease-in-out ${isEnabled ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0 pointer-events-none'}`}>
                <StyledSelect
                    id={`inst-octave-${inst.value}`}
                    label="Octave"
                    value={instSettings.octave || "current"}
                    onChange={(e) => onUpdate(inst.value, "octave", e.target.value)}
                    disabled={!isEnabled}
                >
                    <option value="lower">Low</option>
                    <option value="current">Medium</option>
                    <option value="higher">High</option>
                </StyledSelect>
            </div>
        </div>
    );
};


// --- Main Component ---
export const ControlGrid = ({
    settings,
    updateSettings,
    scales,
    instruments,
    toggleInstrument,
    onUpdateInstrumentSetting,
    arpeggioPatterns,
    beatGains,
    setBeatGains,
    onScaleChange,
    onTranspose,
}) => {
    const isArpeggioEnabled = !!settings.activeInstruments['arpeggio'];
    const arpeggioSettings = settings.activeInstruments['arpeggio'] || {};

    return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full">

        <ControlCard title="BPM">
            <input
                type="number"
                value={settings.bpm}
                onChange={(e) => updateSettings({ bpm: Number(e.target.value) || 0 })}
                className="w-full bg-gray-900 border border-purple-600 rounded-xl px-5 py-3 text-center text-3xl font-mono text-pink-400 focus:ring-2 focus:ring-pink-500 outline-none"
                aria-label="Beats Per Minute"
            />
        </ControlCard>

        {/* --- ⭐️ CHANGE 2: Update the Scale Card --- */}
        <ControlCard title="Scale">
            <select
                value={settings.scale} 
                onChange={(e) => onScaleChange(e.target.value)} 
                className="w-full bg-gray-900 border border-purple-600 rounded-xl px-5 py-3 text-pink-400 focus:ring-2 focus:ring-pink-500 outline-none cursor-pointer"
                aria-label="Musical Scale"
            >
                {scales.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
        </ControlCard>

        {/* --- ⭐️ CHANGE 3: Update the Transpose Card --- */}
      <ControlCard title="Transpose">

            <div className="flex justify-center space-x-4">
                <button
                    onClick={() => onTranspose(-1)} 
                    className="w-1/2 py-3 bg-gray-900 border border-purple-600 rounded-md shadow-lg hover:bg-purple-600 transition-colors text-gray-100 font-bold"
                    aria-label="Transpose Down"
                >-1</button>
                <button
                    onClick={() => onTranspose(1)} 
                    className="w-1/2 py-3 bg-gray-900 border border-purple-600 rounded-md shadow-lg hover:bg-purple-600 transition-colors text-gray-100 font-bold"
                    aria-label="Transpose Up"
                >+1</button>
            </div>
        </ControlCard>

        <ControlCard title="Instruments" className="lg:col-span-3">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-80 gap-y-3 items-start">
                {instruments
                    .filter(inst => inst.value !== 'arpeggio')
                    .map((inst) => (
                        <InstrumentControlRow
                            key={inst.value}
                            inst={inst}
                            settings={settings}
                            onToggle={toggleInstrument}
                            onUpdate={onUpdateInstrumentSetting}
                        />
                    ))}
            </div>
        </ControlCard>

        <ControlCard title="Melody" className="lg:col-span-2">
             <div className="flex flex-col md:flex-row gap-6 md:gap-8">
                {/* --- Left side: Main Toggle & Volume --- */}
                <div className="space-y-4">
                     <div className="flex items-center space-x-3">
                        <input
                            type="checkbox"
                            id="arpeggio-checkbox"
                            checked={isArpeggioEnabled}
                            onChange={() => {
                                const isEnabled = !!settings.activeInstruments['arpeggio'];
                                toggleInstrument(instruments.find(i => i.value === 'arpeggio'));
                                if (!isEnabled) {
                                    onUpdateInstrumentSetting('arpeggio', 'pattern', 'melodic');
                                    updateSettings({ arpeggioSubdivision: '8n' });
                                }
                            }}
                            className="form-checkbox h-5 w-5 text-pink-500 bg-gray-700 border-gray-600 rounded-md focus:ring-pink-500 cursor-pointer accent-pink-500"
                        />
                        <label htmlFor="arpeggio-checkbox" className="text-base font-medium text-gray-100 cursor-pointer">Arpeggio</label>
                    </div>
                    
                    <div className={`transition-all duration-300 ease-in-out overflow-hidden ${isArpeggioEnabled ? 'max-h-20 opacity-100' : 'max-h-0 opacity-0'}`}>
                        <div className="flex items-center space-x-2 pt-2">
                            <VolumeIcon />
                            <input
                                type="range"
                                min="0" max="3" step="0.1"
                                value={arpeggioSettings.gain ?? 1.8}
                                onChange={(e) => onUpdateInstrumentSetting('arpeggio', 'gain', Number(e.target.value))}
                                aria-label="Arpeggio Volume"
                                disabled={!isArpeggioEnabled}
                                className="w-24 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
                            />
                        </div>
                    </div>
                </div>

                {/* --- Right side: Dropdowns --- */}
                <div className={`flex-grow grid grid-cols-2 sm:grid-cols-3 gap-4 transition-all duration-300 ease-in-out ${isArpeggioEnabled ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0 pointer-events-none'}`}>
                    <StyledSelect
                        id="arpeggio-pattern" label="Mood"
                        value={arpeggioSettings.pattern || 'melodic'}
                        onChange={(e) => onUpdateInstrumentSetting('arpeggio', 'pattern', e.target.value)}
                        disabled={!isArpeggioEnabled}
                    >
                        {Object.keys(arpeggioPatterns).map((key) => (
                            <option key={key} value={key} className="capitalize">{key}</option>
                        ))}
                    </StyledSelect>
                    
                    <StyledSelect
                        id="arpeggio-speed" label="Speed"
                        value={settings.arpeggioSubdivision || '8n'}
                        onChange={(e) => updateSettings({ arpeggioSubdivision: e.target.value })}
                        disabled={!isArpeggioEnabled}
                    >
                        <option value="4n">Slow (4n)</option>
                        <option value="8n">Medium (8n)</option>
                        <option value="16n">Fast (16n)</option>
                    </StyledSelect>

                    <StyledSelect
                        id="arpeggio-octave" label="Octave"
                        value={arpeggioSettings.octave || 'current'}
                        onChange={(e) => onUpdateInstrumentSetting('arpeggio', 'octave', e.target.value)}
                        disabled={!isArpeggioEnabled}
                    >
                        <option value="lower">Low</option>
                        <option value="current">Medium</option>
                        <option value="higher">High</option>
                    </StyledSelect>
                </div>
            </div>
        </ControlCard>

        <ControlCard title="Rhythm">
            <div className="flex flex-col md:flex-row gap-6 md:gap-8">
                {/* --- Left Side: Toggle & Volume --- */}
                <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                        <input
                            type="checkbox"
                            id="beats-checkbox"
                            checked={settings.enableBeats}
                            onChange={() => updateSettings({ enableBeats: !settings.enableBeats })}
                            className="form-checkbox h-5 w-5 text-pink-500 bg-gray-700 border-gray-600 rounded-md focus:ring-pink-500 cursor-pointer accent-pink-500"
                        />
                        <label htmlFor="beats-checkbox" className="text-base font-medium text-gray-100 cursor-pointer">Beats</label>
                    </div>

                    <div className={`transition-all duration-300 ease-in-out overflow-hidden ${settings.enableBeats ? 'max-h-20 opacity-100' : 'max-h-0 opacity-0'}`}>
                        <div className="flex items-center space-x-2 pt-2">
                            <VolumeIcon />
                            <input
                                type="range"
                                min="0" max="3" step="0.1"
                                value={beatGains.beats}
                                onChange={(e) => setBeatGains({ ...beatGains, beats: Number(e.target.value) })}
                                disabled={!settings.enableBeats}
                                className="w-24 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
                                aria-label="Beats Volume"
                            />
                        </div>
                    </div>
                </div>
                
                {/* --- Right Side: Dropdown --- */}
                <div className={`flex-grow transition-all duration-300 ease-in-out ${settings.enableBeats ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0 pointer-events-none'}`}>
                     <StyledSelect
                        id="beat-mode" label="Mode"
                        value={settings.beatMode}
                        onChange={(e) => updateSettings({ beatMode: e.target.value })}
                        disabled={!settings.enableBeats}
                    >
                        <option value="1loop">Basic Rock (1 loop)</option>
                        <option value="2loops">Basic Rock (2 loops)</option>
                        {/* --- ⭐️ CHANGE 4: Add the Dembow option --- */}
                        <option value="dembow">Dembow Riddim</option>
                    </StyledSelect>
                </div>
            </div>
        </ControlCard>
    </div>
    );
};
