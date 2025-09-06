import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { getSettings, saveSettings, resetSettings, logoutUser } from "./api";
import Soundfont from "soundfont-player";
import * as Tone from "tone";

// SVG imports
const PlayIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-6.518-3.758A1 1 0 007 8.236v7.528a1 1 0 001.234.97l6.518-3.758a1 1 0 000-1.736z" />
    </svg>
);

const StopIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
);

const SaveIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
);

const ResetIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v6h6M20 20v-6h-6" />
    </svg>
);

const LogoutIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h6a2 2 0 012 2v1" />
    </svg>
);

const Dashboard = ({ onLogout }) => {
    const [audioContext, setAudioContext] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [bpm, setBpm] = useState(120);
    const [scale, setScale] = useState("C");
    const [transpose, setTranspose] = useState(0);
    const [enableBeats, setEnableBeats] = useState(false);
    const [beatMode, setBeatMode] = useState("1loop");

    const [activeInstruments, setActiveInstruments] = useState({});
    const [instrumentPlayers, setInstrumentPlayers] = useState({});

    // refs
    const bpmRef = useRef(bpm);
    const scaleRef = useRef(scale);
    const transposeRef = useRef(transpose);
    const enableBeatsRef = useRef(enableBeats);
    const beatModeRef = useRef(beatMode);
    const instrumentsRef = useRef({});
    const playersRef = useRef({});

    
    useEffect(() => { bpmRef.current = bpm; Tone.Transport.bpm.value = bpm; }, [bpm]);
    useEffect(() => { scaleRef.current = scale; }, [scale]);
    useEffect(() => { transposeRef.current = transpose; }, [transpose]);
    useEffect(() => { enableBeatsRef.current = enableBeats; }, [enableBeats]);
    useEffect(() => { beatModeRef.current = beatMode; }, [beatMode]);
    useEffect(() => { instrumentsRef.current = activeInstruments; }, [activeInstruments]);
    useEffect(() => { playersRef.current = instrumentPlayers; }, [instrumentPlayers]);

    // Load settings on mount
    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const data = await getSettings();
                if (data) {
                    setBpm(data.tempo || 120);
                    setScale(data.scale || "C");
                    setTranspose(data.transpose || 0);
                    setEnableBeats(!!data.enableBeats);
                    setBeatMode(data.beatMode || "1loop");
                    if (data.instruments) setActiveInstruments(data.instruments);
                }
            } catch (err) {
                console.error("Failed to load settings:", err);
            }
        };
        fetchSettings();
    }, []);

    // drums
    const [kick] = useState(() => new Tone.Sampler({ urls: { C1: "kick.mp3" }, baseUrl: "https://tonejs.github.io/audio/drum-samples/CR78/" }).toDestination());
    const [snare] = useState(() => new Tone.Sampler({ urls: { D1: "snare.mp3" }, baseUrl: "https://tonejs.github.io/audio/drum-samples/CR78/" }).toDestination());
    const [hihat] = useState(() => new Tone.Sampler({ urls: { "F#1": "hihat.mp3" }, baseUrl: "https://tonejs.github.io/audio/drum-samples/CR78/" }).toDestination());

    const transport = Tone.Transport;

    // chord instruments
    const instruments = useMemo(() => [
        { label: "Piano", value: "acoustic_grand_piano", defaultGain: 2.0 },
        { label: "Guitar (Electric)", value: "electric_guitar_clean", defaultGain: 1.5 },
        { label: "Violin", value: "violin", defaultGain: 1.5 },
        { label: "Flute", value: "flute", defaultGain: 1.5 },
    ], []);

    const scales = useMemo(() => ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"], []);
    const chordProgression = useMemo(() => [
        [0, 4, 7],
        [9, 0, 4],
        [5, 9, 0],
        [7, 11, 2],
    ], []);

    const displayedScale = useMemo(() => {
        const rootIndex = scales.indexOf(scale);
        const transposedIndex = (rootIndex + transpose + 12) % 12;
        return scales[transposedIndex];
    }, [scale, transpose, scales]);

    useEffect(() => {
        const ac = new (window.AudioContext || window.webkitAudioContext)();
        setAudioContext(ac);
    }, []);

    const toggleInstrument = useCallback(async (inst) => {
        if (!audioContext) return;
        if (!activeInstruments[inst.value]) {
            const player = await Soundfont.instrument(audioContext, inst.value);
            setInstrumentPlayers((prev) => ({ ...prev, [inst.value]: player }));
            setActiveInstruments((prev) => ({ ...prev, [inst.value]: inst.defaultGain }));
        } else {
            setActiveInstruments((prev) => {
                const copy = { ...prev };
                delete copy[inst.value];
                return copy;
            });
        }
    }, [audioContext, activeInstruments]);;

const getChordNotes = useCallback((chordIndex) => {
        const rootIndex = scales.indexOf(scaleRef.current);
        const transposedRoot = (rootIndex + transposeRef.current + 12) % 12;
        const chordNotes = chordProgression[chordIndex].map(
            (i) => scales[(transposedRoot + i) % 12] + "4"
        );
        const rootLower = scales[transposedRoot % 12] + "3";
        const topNote = scales[(transposedRoot + chordProgression[chordIndex][2]) % 12] + "5";
        return [rootLower, ...chordNotes, topNote];
    }, [scales, chordProgression]);

    // drum sequence
    const [drumSeq] = useState(() =>
        new Tone.Sequence((time, step) => {
            if (!enableBeatsRef.current) return;
            const mode = beatModeRef.current;
            if (mode === "1loop") {
                if (step % 2 === 0) {
                    if (step === 0) kick.triggerAttackRelease("C1", "8n", time);
                    if (step === 2) hihat.triggerAttackRelease("F#1", "8n", time);
                    if (step === 4) snare.triggerAttackRelease("D1", "8n", time);
                    if (step === 6) hihat.triggerAttackRelease("F#1", "8n", time);
                }
            } else {
                if (step === 0 || step === 4) kick.triggerAttackRelease("C1", "8n", time);
                if (step === 2 || step === 6) snare.triggerAttackRelease("D1", "8n", time);
                if (step % 2 === 1) hihat.triggerAttackRelease("F#1", "16n", time);
            }
        }, [...Array(8).keys()], "8n")
    );

const startProgression = useCallback(async () => {
        if (!audioContext || isPlaying || Object.keys(activeInstruments).length === 0) return;
        await Tone.start();
        transport.stop();
        transport.cancel();
        let chordIndex = 0;
        transport.scheduleRepeat((time) => {
            const notes = getChordNotes(chordIndex);
            Object.entries(instrumentsRef.current).forEach(([value, gain]) => {
                const player = playersRef.current[value];
                if (player) {
                    notes.forEach((n) => {
                        player.play(n, time, { duration: 1.5, gain });
                    });
                }
            });
            chordIndex = (chordIndex + 1) % chordProgression.length;
        }, "1m");
        drumSeq.start(0);
        transport.start();
        setIsPlaying(true);
    }, [
        audioContext,
        isPlaying,
        activeInstruments,
        getChordNotes,
        chordProgression,
        drumSeq, transport
    ]);

const stopProgression = useCallback(() => {
        transport.stop();
        transport.cancel();
        drumSeq.stop();
        setIsPlaying(false);
}, [drumSeq, transport]);
    const handleTranspose = (dir) => {
        setTranspose((prev) => {
            let t = prev + dir;
            if (t >= 12) t -= 12;
            if (t < 0) t += 12;
            return t;
        });
    };
    // inside Dashboard component (before return)

useEffect(() => {
  const handleKeyDown = (e) => {
    switch (e.key.toLowerCase()) {
      case "p":
        toggleInstrument(instruments.find((i) => i.value === "acoustic_grand_piano"));
        break;
      case "g":
        toggleInstrument(instruments.find((i) => i.value === "electric_guitar_clean"));
        break;
      case "v":
        toggleInstrument(instruments.find((i) => i.value === "violin"));
        break;
      case "f":
        toggleInstrument(instruments.find((i) => i.value === "flute"));
        break;
      case "b":
        setEnableBeats((prev) => {
          if (prev && beatMode === "1loop") return false;
          setBeatMode("1loop");
          return true;
        });
        break;
      case "n":
        setEnableBeats((prev) => {
          if (prev && beatMode === "2loops") return false;
          setBeatMode("2loops");
          return true;
        });
        break;
      case " ":
        e.preventDefault(); // avoid page scroll
        if (isPlaying) stopProgression();
        else startProgression();
        break;
      default:
        break;
    }
  };

  window.addEventListener("keydown", handleKeyDown);
  return () => window.removeEventListener("keydown", handleKeyDown);
}, [instruments, toggleInstrument, beatMode, isPlaying, startProgression, stopProgression]);

return (
    <div className="min-h-screen bg-gray-950 text-gray-100 p-6 sm:p-8 flex flex-col font-michroma tracking-tight relative overflow-hidden">

        {/* Background Gradient & Blob - subtle, artistic touch */}
        <div className="absolute top-0 left-0 w-full h-full z-0 opacity-20">
            <div className="absolute w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob top-10 left-10"></div>
            <div className="absolute w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000 top-40 right-40"></div>
            <div className="absolute w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000 bottom-20 left-60"></div>
        </div>


        {/* Main Content Container - centered and elevated */}
        <div className="relative z-10 w-full max-w-7xl mx-auto flex flex-col items-center">

            {/* Header with Logout */}
            <div className="w-full flex justify-between items-center mb-10">
                <h1 className="text-3xl sm:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">
                    BandAid
                </h1>
       <button
    onClick={async () => { try { await logoutUser(); } catch (err) { console.error(err); } finally { onLogout(); } }}
    className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-gray-100 font-semibold rounded-full shadow-lg hover:bg-purple-700 transition-all duration-300 transform hover:scale-105"
>
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
    <span>Logout</span>
</button>
            </div>

            {/* Main Grid for Controls */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">

                {/* BPM Card */}
                <div className="bg-gray-800/70 backdrop-blur-sm rounded-2xl p-6 shadow-2xl border border-gray-700 hover:border-purple-500 transition-all duration-300">
                    <label className="block text-lg font-bold text-purple-400 mb-2">BPM</label>
                    <input
                        type="number"
                        value={bpm}
                        onChange={(e) => setBpm(Number(e.target.value) || 0)}
                        className="w-full bg-gray-900 border border-gray-700 rounded-xl p-3 text-center text-2xl font-mono text-pink-400 focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none transition-all duration-200"
                    />
                </div>

                {/* Scale Card */}
                <div className="bg-gray-800/70 backdrop-blur-sm rounded-2xl p-6 shadow-2xl border border-gray-700 hover:border-purple-500 transition-all duration-300">
                    <label className="block text-lg font-bold text-purple-400 mb-2">Scale</label>
                    <select
                        value={displayedScale}
                        onChange={(e) => setScale(e.target.value)}
                        className="w-full bg-gray-900 border border-gray-700 rounded-xl p-3 text-pink-400 focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none transition-all duration-200 cursor-pointer"
                    >
                        {scales.map((s, idx) => (
                            <option key={idx} value={s}>{s}</option>
                        ))}
                    </select>
                </div>

                {/* Transpose Card */}
                <div className="bg-gray-800/70 backdrop-blur-sm rounded-2xl p-6 shadow-2xl border border-gray-700 hover:border-purple-500 transition-all duration-300">
                    <label className="block text-lg font-bold text-purple-400 mb-4 text-center">Transpose</label>
                    <div className="flex justify-center space-x-4">
                        <button
                            onClick={() => handleTranspose(-1)}
                            className="w-1/2 py-3 bg-gray-700 rounded-full shadow-lg hover:bg-purple-600 transition-colors duration-200 text-gray-100 text-base font-bold"
                        >
                            -1
                        </button>
                        <button
                            onClick={() => handleTranspose(1)}
                            className="w-1/2 py-3 bg-gray-700 rounded-full shadow-lg hover:bg-purple-600 transition-colors duration-200 text-gray-100 text-base font-bold"
                        >
                            +1
                        </button>
                    </div>
                </div>

                {/* Instruments Card */}
                <div className="md:col-span-2 bg-gray-800/70 backdrop-blur-sm rounded-2xl p-6 shadow-2xl border border-gray-700 hover:border-purple-500 transition-all duration-300">
                    <label className="block text-lg font-bold text-purple-400 mb-4">Instruments</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
                        {instruments.map((inst) => (
                            <div key={inst.value} className="flex items-center justify-between space-x-4">
                                <div className="flex items-center space-x-3">
                                    <input
                                        type="checkbox"
                                        checked={!!activeInstruments[inst.value]}
                                        onChange={() => toggleInstrument(inst)}
                                        className="form-checkbox h-5 w-5 text-pink-500 bg-gray-700 border-gray-600 rounded-md focus:ring-pink-500 transition-colors cursor-pointer accent-pink-500"
                                    />
                                    <span className="text-base font-medium text-gray-100">{inst.label}</span>
                                </div>
                                {activeInstruments[inst.value] !== undefined && (
                                    <input
                                        type="range"
                                        min="0"
                                        max="3"
                                        step="0.1"
                                        value={activeInstruments[inst.value]}
                                        onChange={(e) => setActiveInstruments((prev) => ({ ...prev, [inst.value]: Number(e.target.value) }))}
                                        className="w-24 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
                                    />
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Beats Card */}
                <div className="bg-gray-800/70 backdrop-blur-sm rounded-2xl p-6 shadow-2xl border border-gray-700 hover:border-purple-500 transition-all duration-300">
                    <label className="block text-lg font-bold text-purple-400 mb-4">Hiphop Beats</label>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <span className="text-base font-medium text-gray-100">Enable Beats</span>
                            <input
                                type="checkbox"
                                checked={enableBeats}
                                onChange={(e) => setEnableBeats(e.target.checked)}
                                className="form-checkbox h-5 w-5 text-pink-500 bg-gray-700 border-gray-600 rounded-md focus:ring-pink-500 transition-colors cursor-pointer accent-pink-500"
                            />
                        </div>
                        {enableBeats && (
                            <div className="flex flex-col space-y-2">
                                <label className="text-xs text-gray-400">Beat Mode:</label>
                                <select
                                    value={beatMode}
                                    onChange={(e) => setBeatMode(e.target.value)}
                                    className="w-full bg-gray-900 border border-gray-700 rounded-xl p-3 text-gray-100 focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none cursor-pointer"
                                >
                                    <option value="1loop">1 Loop per Chord</option>
                                    <option value="2loops">2 Loops per Chord</option>
                                </select>
                            </div>
                        )}
                    </div>
                </div>

                {/* save/reset */}
                <div className="flex justify-center md:col-span-3 lg:col-span-full gap-4 mt-4">
           <button
   onClick={async (e) => {
    e.preventDefault(); // This line prevents the page reload
    try {
       await saveSettings({ tempo: bpm, scale, transpose, enableBeats, beatMode, instruments: activeInstruments });
       alert("Settings saved!");
    } catch (err) { alert("Failed to save: " + (err.error || err)); }
   }}
   className="flex items-center space-x-2 px-5 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold rounded-full shadow-lg hover:from-indigo-600 hover:to-purple-600 transition-all duration-300 transform hover:scale-105"
>
<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7H5a2 2 0 00-2 2v8a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"></path></svg>
<span>Save</span>
</button>

<button
onClick={async (e) => {
    e.preventDefault(); // This line prevents the page reload
    try {
       await resetSettings();
    setBpm(120);
       setScale("C");
       setTranspose(0);
       setEnableBeats(false);
       setBeatMode("1loop");
       setActiveInstruments({});
       alert("Settings reset!");
    } catch (err) { alert("Failed to reset: " + (err.error || err)); }
}}
   className="flex items-center space-x-2 px-5 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold rounded-full shadow-lg hover:from-indigo-600 hover:to-purple-600 transition-all duration-300 transform hover:scale-105"
>
<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.22 2.572-1.065z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
   <span>Reset</span>
</button>
                </div>

            </div>

            {/* Play/Stop Button - Prominent & Centered */}
            <div className="mt-10 w-full flex justify-center">
                {!isPlaying ? (
                    <button
                        onClick={startProgression}
                        className="flex items-center space-x-3 px-10 py-4 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-extrabold text-xl rounded-full shadow-2xl hover:from-purple-600 hover:to-pink-500 transition-all duration-300 transform hover:scale-105"
                    >
                        <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M8 5v14l11-7z"></path></svg>
                        <span>Play</span>
                    </button>
                ) : (
                    <button
                        onClick={stopProgression}
                        className="flex items-center space-x-3 px-10 py-4 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-extrabold text-xl rounded-full shadow-2xl hover:from-purple-600 hover:to-pink-500 transition-all duration-300 transform hover:scale-105"
                    >
                        <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M6 6h12v12H6z"></path></svg>
                        <span>Stop</span>
                    </button>
                )}
            </div>

<div className="mt-12 w-full bg-gray-800/70 backdrop-blur-sm rounded-2xl p-6 shadow-2xl border border-gray-700">
        <h2 className="text-base font-bold text-purple-400 mb-4">Keyboard Shortcuts</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-3 text-gray-300">
                <div className="flex items-center space-x-2">
                        <kbd className="kbd">P</kbd>
                        <span className="text-pink-400">➪</span>
                        <span>Toggle Piano</span>
                </div>
                <div className="flex items-center space-x-2">
                        <kbd className="kbd">G</kbd>
                        <span className="text-pink-400">➪</span>
                        <span>Toggle Guitar</span>
                </div>
                <div className="flex items-center space-x-2">
                        <kbd className="kbd">V</kbd>
                        <span className="text-pink-400">➪</span>
                        <span>Toggle Violin</span>
                </div>
                <div className="flex items-center space-x-2">
                        <kbd className="kbd">F</kbd>
                        <span className="text-pink-400">➪</span>
                        <span>Toggle Flute</span>
                </div>
                <div className="flex items-center space-x-2">
                        <kbd className="kbd">B</kbd>
                        <span className="text-pink-400">➪</span>
                        <span>Beats (1 loop)</span>
                </div>
                <div className="flex items-center space-x-2">
                        <kbd className="kbd">N</kbd>
                        <span className="text-pink-400">➪</span>
                        <span>Beats (2 loops)</span>
                </div>
                <div className="flex items-center space-x-2">
                        <kbd className="kbd">Space</kbd>
                        <span className="text-pink-400">➪</span>
                        <span>Play / Stop</span>
                </div>
        </div>
</div>
        </div>
    </div>
);

};

export default Dashboard;