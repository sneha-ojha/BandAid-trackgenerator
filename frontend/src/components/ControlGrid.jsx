import React from "react";

export const ControlGrid = ({
  settings,
  updateSettings,
  scales,
  instruments,
  toggleInstrument,
  onUpdateInstrumentSetting, // <-- Added this prop
  arpeggioPatterns,         // <-- Added this prop
  beatGains,
  setBeatGains
}) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full">

    {/* BPM Card */}
    <div className="bg-gray-800/80 backdrop-blur-md rounded-2xl p-8 shadow-xl border border-purple-700/50">
      <label className="block text-lg font-bold text-purple-400 mb-4">BPM</label>
      <input
        type="number"
        value={settings.bpm}
        onChange={(e) => updateSettings({ bpm: Number(e.target.value) || 0 })}
        className="w-full bg-gray-900 border border-purple-600 rounded-xl px-5 py-3 text-center text-3xl font-mono text-pink-400 focus:ring-2 focus:ring-pink-500 outline-none"
      />
    </div>

    {/* Scale Card */}
    <div className="bg-gray-800/80 backdrop-blur-md rounded-2xl p-8 shadow-xl border border-purple-700/50">
      <label className="block text-lg font-bold text-purple-400 mb-4">Scale</label>
      <select
        value={settings.scale}
        onChange={(e) => updateSettings({ scale: e.target.value })}
        className="w-full bg-gray-900 border border-purple-600 rounded-xl px-5 py-3 text-pink-400 focus:ring-2 focus:ring-pink-500 outline-none cursor-pointer"
      >
        {scales.map((s) => <option key={s} value={s}>{s}</option>)}
      </select>
    </div>

    {/* Transpose Card */}
    <div className="bg-gray-800/80 backdrop-blur-md rounded-2xl p-8 shadow-xl border border-purple-700/50">
      <label className="block text-lg font-bold text-purple-400 mb-4 text-center">
        Transpose: {settings.transpose}
      </label>
      <div className="flex justify-center space-x-4">
        <button
          onClick={() => updateSettings({ transpose: settings.transpose - 1 })}
          className="w-1/2 py-3 bg-gray-900 border border-purple-600 rounded-md shadow-lg hover:bg-purple-600 transition-colors text-gray-100 font-bold"
        >-1</button>
        <button
          onClick={() => updateSettings({ transpose: settings.transpose + 1 })}
          className="w-1/2 py-3 bg-gray-900 border border-purple-600 rounded-md shadow-lg hover:bg-purple-600 transition-colors text-gray-100 font-bold"
        >+1</button>
      </div>
    </div>

    {/* --- MODIFIED: Instruments Card --- */}
    <div className="lg:col-span-3 bg-gray-800/80 backdrop-blur-md rounded-2xl p-8 shadow-xl border border-purple-700/50">
      <label className="block text-lg font-bold text-purple-400 mb-4">Instruments</label>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6">
        {/* --- MODIFIED: Filtered out 'Arpeggio' from this list --- */}
        {instruments
          .filter(inst => inst.value !== 'arpeggio')
          .map((inst) => {
            const instSettings = settings.activeInstruments[inst.value] || {};
            return (
              <div key={inst.value} className="flex items-center justify-between space-x-4">
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id={`inst-checkbox-${inst.value}`}
                    checked={!!settings.activeInstruments[inst.value]}
                    onChange={() => toggleInstrument(inst)}
                    className="form-checkbox h-6 w-6 text-pink-500 bg-gray-700 border-gray-600 rounded-md focus:ring-pink-500 cursor-pointer accent-pink-500"
                  />
                  <label htmlFor={`inst-checkbox-${inst.value}`} className="text-base font-medium text-gray-100 cursor-pointer">{inst.label}</label>
                </div>

                {settings.activeInstruments[inst.value] && (
                  <input
                    type="range"
                    min="0" max="3" step="0.1"
                    value={instSettings.gain ?? inst.defaultGain}
                    onChange={(e) => onUpdateInstrumentSetting(inst.value, 'gain', Number(e.target.value))}
                    className="w-24 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
                  />
                )}
              </div>
            );
          })}
      </div>
    </div>

    {/* --- NEW: Arpeggio Card --- */}
    <div className="bg-gray-800/80 backdrop-blur-md rounded-2xl p-8 shadow-xl border border-purple-700/50">
      <label className="block text-lg font-bold text-purple-400 mb-4">Arpeggio</label>
      <div className="space-y-4">
        <div className="flex items-center justify-between space-x-4">
          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              id="arpeggio-checkbox"
              // Find the arpeggio instrument object to pass to the toggle function
              checked={!!settings.activeInstruments['arpeggio']}
              onChange={() => toggleInstrument(instruments.find(i => i.value === 'arpeggio'))}
              className="form-checkbox h-6 w-6 text-pink-500 bg-gray-700 border-gray-600 rounded-md focus:ring-pink-500 cursor-pointer accent-pink-500"
            />
            <label htmlFor="arpeggio-checkbox" className="text-base font-medium text-gray-100 cursor-pointer">Enable Arpeggio</label>
          </div>
          {settings.activeInstruments['arpeggio'] && (
            <input
              type="range"
              min="0" max="3" step="0.1"
              value={settings.activeInstruments['arpeggio'].gain ?? 1.8}
              onChange={(e) => onUpdateInstrumentSetting('arpeggio', 'gain', Number(e.target.value))}
              className="w-24 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
            />
          )}
        </div>
        
        {/* --- MODIFIED: Pattern dropdown only appears when arpeggio is active --- */}
        {settings.activeInstruments['arpeggio'] && (
          <div className="pt-2">
            <label className="text-xs text-gray-400">Arpeggio Pattern</label>
            <select
              value={settings.activeInstruments['arpeggio'].pattern || 'melodic'}
              onChange={(e) => onUpdateInstrumentSetting('arpeggio', 'pattern', e.target.value)}
              className="w-full bg-gray-900 border border-purple-600 rounded-xl px-4 py-2 text-pink-400 focus:ring-2 focus:ring-pink-500 outline-none cursor-pointer"
            >
              {Object.entries(arpeggioPatterns).map(([key, ]) => (
                  <option key={key} value={key} className="capitalize">{key}</option>
              ))}
            </select>
          </div>
        )}
      </div>
    </div>

    {/* Hiphop Beats Card */}
    <div className="bg-gray-800/80 backdrop-blur-md rounded-2xl p-8 shadow-xl border border-purple-700/50">
      <label className="block text-lg font-bold text-purple-400 mb-4">Hiphop Beats</label>
      <div className="space-y-4">
        <div className="flex items-center justify-between space-x-4">
          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              id="beats-checkbox"
              checked={settings.enableBeats}
              onChange={(e) => updateSettings({ enableBeats: e.target.checked })}
              className="form-checkbox h-6 w-6 text-pink-500 bg-gray-700 border-gray-600 rounded-md focus:ring-pink-500 cursor-pointer accent-pink-500"
            />
            <label htmlFor="beats-checkbox" className="text-base font-medium text-gray-100 cursor-pointer">Enable Beats</label>
          </div>
          {settings.enableBeats && (
            <input
              type="range"
              min="0" max="1.5" step="0.05"
              value={beatGains.beats}
              onChange={(e) => setBeatGains({ ...beatGains, beats: Number(e.target.value) })}
              className="w-24 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
            />
          )}
        </div>

        {/* --- MODIFIED: Beat Mode dropdown only appears when beats are enabled --- */}
        {settings.enableBeats && (
          <div className="pt-2">
            <label className="text-xs text-gray-400">Beat Mode</label>
            <select
              value={settings.beatMode}
              onChange={(e) => updateSettings({ beatMode: e.target.value })}
              className="w-full bg-gray-900 border border-purple-600 rounded-xl px-4 py-2 text-gray-100 focus:ring-2 focus:ring-pink-500 cursor-pointer"
            >
              <option value="1loop">1 Loop per Chord</option>
              <option value="2loops">2 Loops per Chord</option>
            </select>
          </div>
        )}
      </div>
    </div>

  </div>
);
