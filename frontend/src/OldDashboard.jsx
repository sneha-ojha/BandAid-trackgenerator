// import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
// import io from 'socket.io-client';
// import { getSettings, saveSettings, resetSettings, logoutUser } from "./api";
// import Soundfont from "soundfont-player";
// import * as Tone from "tone";

// const socket = io('http://localhost:3000', {
//   withCredentials: true
// });

// // --- SVG Icons ---
// const PlayIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" ><path d="M8 5v14l11-7z" /></svg> );
// const StopIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" ><path d="M6 6h12v12H6z" /></svg> );
// const SaveIcon = () => ( <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7H5a2 2 0 00-2 2v8a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"></path></svg> );
// const ResetIcon = () => ( <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.22 2.572-1.065z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg> );
// const LogoutIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h6a2 2 0 012 2v1" /></svg> );

// const Dashboard = ({ onLogout }) => {
//     // --- State Management ---
//     const [settings, setSettings] = useState({
//         bpm: 120,
//         scale: 'C',
//         transpose: 0,
//         enableBeats: false,
//         beatMode: "1loop",
//         activeInstruments: {},
//     });
//     const [collaborationId, setCollaborationId] = useState(null);
//     const [audioContext, setAudioContext] = useState(null);
//     const [isPlaying, setIsPlaying] = useState(false);
//     const [statusMessage, setStatusMessage] = useState("");
//     const [isLoading, setIsLoading] = useState(false);
//     const [currentChordIndex, setCurrentChordIndex] = useState(null);
//     const [instrumentPlayers, setInstrumentPlayers] = useState({});
// const [joinId, setJoinId] = useState('');
//     // --- Refs for Tone.js loop ---
//     const settingsRef = useRef(settings);
//     const playersRef = useRef(instrumentPlayers);
//     useEffect(() => { settingsRef.current = settings; }, [settings]);
//     useEffect(() => { playersRef.current = instrumentPlayers; }, [instrumentPlayers]);
    
//     // --- Unified Settings Updater ---
//     const updateSettings = useCallback((newSetting) => {
//         setSettings(prev => ({...prev, ...newSetting}));
//         if (collaborationId) {
//             socket.emit('update collaboration settings', newSetting);
//         }
//     }, [collaborationId]);

//     // --- Collaboration & Initial Load ---
//     useEffect(() => {
//         socket.on('collaboration settings updated', (newSettings) => {
//             setSettings(prevSettings => ({ ...prevSettings, ...newSettings }));
//         });

//         const fetchSettings = async () => {
//             try {
//                 const data = await getSettings();
//                 if (data) {
//                     setSettings(prev => ({
//                         ...prev,
//                         bpm: data.tempo || 120,
//                         scale: data.scale || "C",
//                         transpose: data.transpose || 0,
//                         enableBeats: !!data.enableBeats,
//                         beatMode: data.beatMode || "1loop",
//                         activeInstruments: data.instruments || {}
//                     }));
//                 }
//             } catch (err) {
//                 console.error("Failed to load settings:", err);
//                 setStatusMessage("Error loading settings: " + (err.error || err.message));
//             }
//         };
//         fetchSettings();

//         return () => {
//             socket.off('collaboration settings updated');
//         };
//     }, []);

//     const startCollaboration = async () => {
//         try {
//             const response = await fetch('http://localhost:3000/collaboration/start', { method: 'POST' });
//             const data = await response.json();
//             setCollaborationId(data.collaborationId);
//             socket.emit('join collaboration', data.collaborationId);
//         } catch (error) {
//             console.error("Failed to start collaboration:", error);
//         }
//     };

//     const joinCollaboration = (id) => {
//         if (id) {
//             setCollaborationId(id);
//             socket.emit('join collaboration', id);
//         }
//     };

//     // --- Audio & Music Logic ---
//     const scales = useMemo(() => ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"], []);
//     const chordProgression = useMemo(() => [[0, 4, 7], [9, 0, 4], [5, 9, 0], [7, 11, 2]], []);
//     const instruments = useMemo(() => [
//         { label: "Piano", value: "acoustic_grand_piano", defaultGain: 2.0 },
//         { label: "Guitar (Electric)", value: "electric_guitar_clean", defaultGain: 1.5 },
//         { label: "Violin", value: "violin", defaultGain: 1.5 },
//         { label: "Flute", value: "flute", defaultGain: 1.5 },
//     ], []);

//     const displayedScale = useMemo(() => {
//         const rootIndex = scales.indexOf(settings.scale);
//         const transposedIndex = (rootIndex + settings.transpose + 12) % 12;
//         return scales[transposedIndex];
//     }, [settings.scale, settings.transpose, scales]);

//     const getChordName = useCallback((chordIndex) => {
//         const scaleChordsMap = { C: ["C", "Am", "F", "G"], "C#": ["C#", "A#m", "F#", "G#"], D: ["D", "Bm", "G", "A"], "D#": ["D#", "Cm", "G#", "A#"], E: ["E", "C#m", "A", "B"], F: ["F", "Dm", "A#", "C"], "F#": ["F#", "D#m", "B", "C#"], G: ["G", "Em", "C", "D"], "G#": ["G#", "Fm", "C#", "D#"], A: ["A", "F#m", "D", "E"], "A#": ["A#", "Gm", "D#", "F"], B: ["B", "G#m", "E", "F#"] };
//         return (scaleChordsMap[displayedScale] || [])[chordIndex] || "";
//     }, [displayedScale]);

//     const getChordNotes = useCallback((chordIndex) => {
//         const { scale, transpose } = settingsRef.current;
//         const rootIndex = scales.indexOf(scale);
//         const transposedRoot = (rootIndex + transpose + 12) % 12;
//         const chordNotes = chordProgression[chordIndex].map(i => scales[(transposedRoot + i) % 12] + "4");
//         const rootLower = scales[transposedRoot % 12] + "3";
//         const topNote = scales[(transposedRoot + chordProgression[chordIndex][2]) % 12] + "5";
//         return [rootLower, ...chordNotes, topNote];
//     }, [scales, chordProgression]);

//     useEffect(() => {
//         const ac = new (window.AudioContext || window.webkitAudioContext)();
//         setAudioContext(ac);
//     }, []);

//     const [kick] = useState(() => new Tone.Sampler({ urls: { C1: "kick.mp3" }, baseUrl: "https://tonejs.github.io/audio/drum-samples/CR78/" }).toDestination());
//     const [snare] = useState(() => new Tone.Sampler({ urls: { D1: "snare.mp3" }, baseUrl: "https://tonejs.github.io/audio/drum-samples/CR78/" }).toDestination());
//     const [hihat] = useState(() => new Tone.Sampler({ urls: { "F#1": "hihat.mp3" }, baseUrl: "https://tonejs.github.io/audio/drum-samples/CR78/" }).toDestination());

//     const toggleInstrument = useCallback(async (inst) => {
//         if (!audioContext) return;
        
//         const newActiveInstruments = { ...settings.activeInstruments };
//         if (!newActiveInstruments[inst.value]) {
//             try {
//                 const player = await Soundfont.instrument(audioContext, inst.value);
//                 setInstrumentPlayers((prev) => ({ ...prev, [inst.value]: player }));
//                 newActiveInstruments[inst.value] = inst.defaultGain;
//             } catch (err) {
//                 console.error("Failed to load instrument soundfont:", err);
//                 setStatusMessage('Error loading instrument. Please try another.');
//                 return;
//             }
//         } else {
//             delete newActiveInstruments[inst.value];
//         }
//         updateSettings({ activeInstruments: newActiveInstruments });
//     }, [audioContext, settings.activeInstruments, updateSettings]);

//     const drumSeq = useRef(new Tone.Sequence((time, step) => {
//         const { enableBeats, beatMode } = settingsRef.current;
//         if (!enableBeats) return;
//         if (beatMode === "1loop") {
//             if (step % 2 === 0) {
//                 if (step === 0) kick.triggerAttackRelease("C1", "8n", time);
//                 if (step === 2) hihat.triggerAttackRelease("F#1", "8n", time);
//                 if (step === 4) snare.triggerAttackRelease("D1", "8n", time);
//                 if (step === 6) hihat.triggerAttackRelease("F#1", "8n", time);
//             }
//         } else {
//             if (step === 0 || step === 4) kick.triggerAttackRelease("C1", "8n", time);
//             if (step === 2 || step === 6) snare.triggerAttackRelease("D1", "8n", time);
//             if (step % 2 === 1) hihat.triggerAttackRelease("F#1", "16n", time);
//         }
//     }, [...Array(8).keys()], "8n")).current;
    
//     const chordSeq = useRef(new Tone.Sequence((time, chordIndex) => {
//         const notes = getChordNotes(chordIndex);
//         Object.entries(settingsRef.current.activeInstruments).forEach(([value, gain]) => {
//             const player = playersRef.current[value];
//             if (player) {
//                 notes.forEach((n) => {
//                     player.play(n, time, { duration: 1.5, gain });
//                 });
//             }
//         });
//         Tone.Draw.schedule(() => setCurrentChordIndex(chordIndex), time);
//     }, [0, 1, 2, 3], '1m')).current;

//     const startProgression = useCallback(async () => {
//         if (!audioContext || isPlaying || Object.keys(settings.activeInstruments).length === 0) return;
//         await Tone.start();
//         Tone.Transport.bpm.value = settings.bpm;
//         drumSeq.start(0);
//         chordSeq.start(0);
//         Tone.Transport.start();
//         setIsPlaying(true);
//     }, [audioContext, isPlaying, settings.activeInstruments, settings.bpm, drumSeq, chordSeq]);

//     const stopProgression = useCallback(() => {
//         Tone.Transport.stop();
//         Tone.Transport.cancel();
//         drumSeq.stop();
//         chordSeq.stop();
//         setIsPlaying(false);
//         setCurrentChordIndex(null);
//     }, [drumSeq, chordSeq]);

//     useEffect(() => {
//         Tone.Transport.bpm.value = settings.bpm;
//     }, [settings.bpm]);

//     useEffect(() => {
//         const handleKeyDown = (e) => {
//             if (e.target.tagName === 'INPUT') return; // Ignore key presses in input fields
//             switch (e.key.toLowerCase()) {
//                 case "p": toggleInstrument(instruments.find((i) => i.value === "acoustic_grand_piano")); break;
//                 case "g": toggleInstrument(instruments.find((i) => i.value === "electric_guitar_clean")); break;
//                 case "v": toggleInstrument(instruments.find((i) => i.value === "violin")); break;
//                 case "f": toggleInstrument(instruments.find((i) => i.value === "flute")); break;
//                 case "b": updateSettings({ enableBeats: settings.beatMode === '1loop' ? !settings.enableBeats : true, beatMode: '1loop' }); break;
//                 case "n": updateSettings({ enableBeats: settings.beatMode === '2loops' ? !settings.enableBeats : true, beatMode: '2loops' }); break;
//                 case " ": e.preventDefault(); isPlaying ? stopProgression() : startProgression(); break;
//                 default: break;
//             }
//         };
//         window.addEventListener("keydown", handleKeyDown);
//         return () => window.removeEventListener("keydown", handleKeyDown);
//     }, [instruments, toggleInstrument, settings.beatMode, settings.enableBeats, isPlaying, startProgression, stopProgression, updateSettings]);

//     return (
//         <div className="min-h-screen flex flex-col items-center justify-start bg-[#0A0A0E] text-white relative overflow-hidden px-4 font-michroma">
//             {/* Background & Header */}
//             <div className="absolute inset-0 z-0 pointer-events-none">
//                 <div className="absolute top-1/2 left-1/2 w-96 h-96 -translate-x-1/2 -translate-y-1/2 bg-purple-700 rounded-full opacity-10 blur-3xl animate-pulse"></div>
//                 <div className="absolute bottom-0 right-0 w-80 h-80 bg-pink-500 rounded-full opacity-10 blur-3xl animate-pulse-slow"></div>
//                 <div className="absolute top-0 left-0 w-64 h-64 bg-indigo-500 rounded-full opacity-10 blur-3xl animate-pulse-fast"></div>
//                 <div className="absolute inset-0 bg-repeat opacity-5" style={{ backgroundImage: 'linear-gradient(to right, rgba(168,85,247,0.1) 1px, transparent 1px), linear-gradient(to bottom, rgba(168,85,247,0.1) 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
//             </div>
//             <div className="relative z-10 w-full max-w-7xl mx-auto flex flex-col items-center">
//                 <div className="w-full flex justify-between items-center mt-10 mb-10 relative">
//                     <h1 className="text-5xl md:text-6xl font-extrabold text-white leading-tight drop-shadow-[0_0_20px_rgba(255,255,255,0.2)]">
//                         <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500 animate-text-gradient">BandAid</span>
//                     </h1>
//                     <button onClick={async () => { try { await logoutUser(); } catch (err) { console.error(err); } finally { onLogout(); } }} className="text-pink-400 hover:text-purple-400 underline-offset-4 hover:underline transition-colors duration-300 font-semibold text-lg flex items-center space-x-2">
//                         <span>Logout</span>
//                         <LogoutIcon />
//                     </button>
//                 </div>

//         {/* Collaboration UI */}
// <div className="w-full max-w-2xl p-4 sm:p-6 mb-6 text-center bg-gray-800/50 backdrop-blur-md rounded-2xl border border-purple-700/30">
//     {collaborationId ? (
//         <div>
//             <h2 className="text-xl text-purple-400 font-bold tracking-wider">COLLABORATION SESSION ACTIVE</h2>
//             <p className="mt-2 text-gray-300">Share this ID with others:</p>
//             <p className="font-mono bg-gray-900/80 p-2 rounded-lg text-pink-400 mt-2 inline-block">{collaborationId}</p>
//         </div>
//     ) : (
//         <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
//             <button onClick={startCollaboration} className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-500 text-white font-bold text-lg shadow-lg shadow-pink-500/30 transition-all duration-500 transform hover:scale-105 rounded-md">
//                 Start Collaboration
//             </button>
//             <span className="text-gray-400">OR</span>
//             <div className="flex items-center gap-2">
//                 <input 
//                     type="text" 
//                     placeholder="Enter Collaboration ID" 
//                     value={joinId}
//                     onChange={(e) => setJoinId(e.target.value)}
//                     className="w-full sm:w-auto bg-gray-900 border border-purple-600 rounded-xl px-5 py-3 text-center text-lg font-mono text-pink-400 focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none transition-all duration-200 shadow-inner shadow-black/50" 
//                 />
//                 <button 
//                     onClick={() => joinCollaboration(joinId)} 
//                     className="px-6 py-3 bg-gray-700 text-white font-bold rounded-md hover:bg-pink-500 transition-colors duration-300"
//                 >
//                     Join
//                 </button>
//             </div>
//         </div>
//     )}
// </div>
                
//                 {/* Chord Progression Display */}
//                 <div className="w-full max-w-xl p-4 sm:p-6 mb-6 flex justify-around items-center space-x-4">
//                     {chordProgression.map((_, index) => (
//                         <div key={index} className={`text-center transition-all duration-300 p-3 flex-1 rounded-lg ${currentChordIndex === index ? "text-white scale-110 font-bold drop-shadow-lg" : "text-gray-400"}`} style={{ textShadow: currentChordIndex === index ? '0 0 10px rgba(255, 255, 255, 0.5)' : 'none' }}>
//                             <span className="text-2xl sm:text-4xl">{getChordName(index)}</span>
//                         </div>
//                     ))}
//                 </div>

//                 {/* Main Grid for Controls */}
//                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full">
//                     <div className="bg-gray-800/80 backdrop-blur-md rounded-2xl p-8 shadow-xl border border-purple-700/50 hover:border-pink-500 transition-all duration-300">
//                         <label className="block text-lg font-bold text-purple-400 mb-4">BPM</label>
//                         <input type="number" value={settings.bpm} onChange={(e) => updateSettings({ bpm: Number(e.target.value) || 0 })} className="w-full bg-gray-900 border border-purple-600 rounded-xl px-5 py-3 text-center text-3xl font-mono text-pink-400 focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none transition-all duration-200 shadow-inner shadow-black/50" />
//                     </div>
//                     <div className="bg-gray-800/80 backdrop-blur-md rounded-2xl p-8 shadow-xl border border-purple-700/50 hover:border-pink-500 transition-all duration-300">
//                         <label className="block text-lg font-bold text-purple-400 mb-4">Scale</label>
//                         <select value={settings.scale} onChange={(e) => updateSettings({ scale: e.target.value })} className="w-full bg-gray-900 border border-purple-600 rounded-xl px-5 py-3 text-pink-400 focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none transition-all duration-200 cursor-pointer shadow-inner shadow-black/50">
//                             {scales.map((s, idx) => (<option key={idx} value={s}>{s}</option>))}
//                         </select>
//                     </div>
//                     <div className="bg-gray-800/80 backdrop-blur-md rounded-2xl p-8 shadow-xl border border-purple-700/50 hover:border-pink-500 transition-all duration-300">
//                         <label className="block text-lg font-bold text-purple-400 mb-4 text-center">Transpose</label>
//                         <div className="flex justify-center space-x-4">
//                             <button onClick={() => updateSettings({ transpose: settings.transpose - 1 })} className="w-1/2 py-3 bg-gray-900 border border-purple-600 rounded-md shadow-lg hover:bg-purple-600 transition-colors duration-200 text-gray-100 text-base font-bold transform hover:scale-105">-1</button>
//                             <button onClick={() => updateSettings({ transpose: settings.transpose + 1 })} className="w-1/2 py-3 bg-gray-900 border border-purple-600 rounded-md shadow-lg hover:bg-purple-600 transition-colors duration-200 text-gray-100 text-base font-bold transform hover:scale-105">+1</button>
//                         </div>
//                     </div>
//                     <div className="md:col-span-2 bg-gray-800/80 backdrop-blur-md rounded-2xl p-8 shadow-xl border border-purple-700/50 hover:border-pink-500 transition-all duration-300">
//                         <label className="block text-lg font-bold text-purple-400 mb-4">Instruments</label>
//                         <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6">
//                             {instruments.map((inst) => (
//                                 <div key={inst.value} className="flex items-center justify-between space-x-4">
//                                     <div className="flex items-center space-x-3">
//                                         <input type="checkbox" checked={!!settings.activeInstruments[inst.value]} onChange={() => toggleInstrument(inst)} className="form-checkbox h-6 w-6 text-pink-500 bg-gray-700 border-gray-600 rounded-md focus:ring-pink-500 transition-colors cursor-pointer accent-pink-500" />
//                                         <span className="text-base font-medium text-gray-100">{inst.label}</span>
//                                     </div>
//                                     {settings.activeInstruments[inst.value] !== undefined && (
//                                         <input type="range" min="0" max="3" step="0.1" value={settings.activeInstruments[inst.value]} onChange={(e) => updateSettings({ activeInstruments: { ...settings.activeInstruments, [inst.value]: Number(e.target.value) } })} className="w-24 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-500" />
//                                     )}
//                                 </div>
//                             ))}
//                         </div>
//                     </div>
//                     <div className="bg-gray-800/80 backdrop-blur-md rounded-2xl p-8 shadow-xl border border-purple-700/50 hover:border-pink-500 transition-all duration-300">
//                         <label className="block text-lg font-bold text-purple-400 mb-4">Hiphop Beats</label>
//                         <div className="space-y-4">
//                             <div className="flex items-center justify-between">
//                                 <span className="text-base font-medium text-gray-100">Enable Beats</span>
//                                 <input type="checkbox" checked={settings.enableBeats} onChange={(e) => updateSettings({ enableBeats: e.target.checked })} className="form-checkbox h-6 w-6 text-pink-500 bg-gray-700 border-gray-600 rounded-md focus:ring-pink-500 transition-colors cursor-pointer accent-pink-500" />
//                             </div>
//                             {settings.enableBeats && (
//                                 <div className="flex flex-col space-y-2">
//                                     <label className="text-xs text-gray-400">Beat Mode:</label>
//                                     <select value={settings.beatMode} onChange={(e) => updateSettings({ beatMode: e.target.value })} className="w-full bg-gray-900 border border-purple-600 rounded-xl px-5 py-3 text-gray-100 focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none cursor-pointer shadow-inner shadow-black/50">
//                                         <option value="1loop">1 Loop per Chord</option>
//                                         <option value="2loops">2 Loops per Chord</option>
//                                     </select>
//                                 </div>
//                             )}
//                         </div>
//                     </div>
//                 </div>

//                 {/* Save/Reset Buttons & Status */}
//                 <div className="flex justify-center md:col-span-3 lg:col-span-full gap-6 mt-6">
//                     <button onClick={async (e) => { e.preventDefault(); setIsLoading(true); setStatusMessage("Saving settings..."); try { await saveSettings({ tempo: settings.bpm, scale: settings.scale, transpose: settings.transpose, enableBeats: settings.enableBeats, beatMode: settings.beatMode, instruments: settings.activeInstruments }); setStatusMessage("Settings saved successfully!"); } catch (err) { setStatusMessage("Error saving settings: " + (err.error || err.message)); } finally { setIsLoading(false); } }} className="flex items-center space-x-3 px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-500 text-white font-bold text-lg shadow-lg shadow-pink-500/30 transition-all duration-500 transform hover:scale-105 rounded-md" disabled={isLoading}>
//                         <SaveIcon />
//                         <span>{isLoading ? "Saving..." : "Save"}</span>
//                     </button>
//                     <button onClick={async (e) => { e.preventDefault(); setIsLoading(true); setStatusMessage("Resetting settings..."); try { await resetSettings(); updateSettings({ bpm: 120, scale: "C", transpose: 0, enableBeats: false, beatMode: "1loop", activeInstruments: {} }); setStatusMessage("Settings reset successfully!"); } catch (err) { setStatusMessage("Error resetting settings: " + (err.error || err.message)); } finally { setIsLoading(false); } }} className="flex items-center space-x-3 px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-500 text-white font-bold text-lg shadow-lg shadow-pink-500/30 transition-all duration-500 transform hover:scale-105 rounded-md" disabled={isLoading}>
//                         <ResetIcon />
//                         <span>Reset</span>
//                     </button>
//                 </div>
//                 {statusMessage && (<div className={`mt-4 w-full text-center text-sm font-semibold transition-opacity duration-500 ${statusMessage.startsWith("Error") ? 'text-red-400' : 'text-green-400'}`}>{statusMessage}</div>)}

//                 {/* Play/Stop Buttons */}
//                 <div className="mt-10 w-full flex justify-center">
//                     {!isPlaying ? (
//                         <button onClick={startProgression} className="flex items-center space-x-3 px-12 py-5 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-extrabold text-2xl shadow-lg shadow-pink-500/30 transition-all duration-500 transform hover:scale-105 rounded-md"><PlayIcon /></button>
//                     ) : (
//                         <button onClick={stopProgression} className="flex items-center space-x-3 px-12 py-5 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-extrabold text-2xl shadow-lg shadow-pink-500/30 transition-all duration-500 transform hover:scale-105 rounded-md"><StopIcon /></button>
//                     )}
//                 </div>
//             </div>
            
//             {/* Keyboard Shortcuts & Footer */}
//             <br /><br />
//             <div className="relative z-10 w-full bg-gray-800/80 backdrop-blur-md p-8 border-t border-b border-gray-700">
//                 <div className="w-full max-w-7xl mx-auto">
//                     <h2 className="text-xl font-bold text-purple-400 mb-6 text-center">Keyboard Shortcuts</h2>
//                     <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 text-gray-300">
//                         <div className="flex items-center space-x-3"><kbd className="kbd">P</kbd><span className="text-pink-400">➪</span><span>Toggle Piano</span></div>
//                         <div className="flex items-center space-x-3"><kbd className="kbd">G</kbd><span className="text-pink-400">➪</span><span>Toggle Guitar</span></div>
//                         <div className="flex items-center space-x-3"><kbd className="kbd">V</kbd><span className="text-pink-400">➪</span><span>Toggle Violin</span></div>
//                         <div className="flex items-center space-x-3 col-span-2 sm:col-span-1 lg:col-span-1"><kbd className="kbd">Space</kbd><span className="text-pink-400">➪</span><span>Play / Stop</span></div>
//                         <div className="flex items-center space-x-3"><kbd className="kbd">B</kbd><span className="text-pink-400">➪</span><span>Beats (1 loop)</span></div>
//                         <div className="flex items-center space-x-3"><kbd className="kbd">N</kbd><span className="text-pink-400">➪</span><span>Beats (2 loops)</span></div>
//                         <div className="flex items-center space-x-3"><kbd className="kbd">F</kbd><span className="text-pink-400">➪</span><span>Toggle Flute</span></div>
//                     </div>
//                 </div>
//             </div>
//             <footer className="relative z-10 w-full bg-white/5 backdrop-blur-sm p-6 text-center mt-auto border-t border-gray-700">
//                 <div className="flex flex-col items-center sm:flex-row justify-between max-w-6xl mx-auto">
//                     <p className="text-gray-400 text-sm mb-4 sm:mb-0">Built to <span className="text-pink-500">solve </span> by Sneha Ojha</p>
//                     <div className="flex space-x-6">
//                         <a href="https://linkedin.com/in/snehaojha/connect" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-pink-400 transition-colors duration-300"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.765s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.765-1.75 1.765zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg></a>
//                         <a href="https://github.com/sneha-ojha" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-pink-400 transition-colors duration-300"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.809 1.305 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.046.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.196-6.095 8.196-11.385 0-6.627-5.373-12-12-12z"/></svg></a>
//                     </div>
//                 </div>
//             </footer>
//             <style>{`
//                 @import url('https://fonts.googleapis.com/css2?family=Michroma&display=swap');
//                 @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap');
//                 .font-michroma { font-family: 'Michroma', sans-serif; }
//                 .font-sans { font-family: 'Inter', sans-serif; }
//                 .kbd { display: inline-flex; align-items: center; justify-content: center; padding: 0.2rem 0.6rem; min-width: 2rem; height: 2rem; font-size: 0.875rem; line-height: 1; font-family: monospace; background-color: #1f2937; color: #e5e7eb; border: 1px solid #4b5563; border-radius: 0.375rem; box-shadow: 0 2px 0 #4b5563, 0 1px 0 #1f2937 inset; user-select: none; white-space: nowrap; }
//             `}</style>
//         </div>
//     );
// };

// export default Dashboard;













































































































// // Dashboard.jsx
// import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
// import io from 'socket.io-client';
// import * as Tone from "tone";
// import Soundfont from "soundfont-player";

// // --- Child Components ---
// import { Header } from "../components/Header";
// import { CollaborationPanel } from "../components/CollaborationPanel";
// import { ChordDisplay } from "../components/ChordDisplay";
// import { ControlGrid } from "../components/ControlGrid";
// import { ShortcutsFooter, ActionButtons } from "../components/buttons-shortcuts";
// import { getSettings, saveSettings, resetSettings, logoutUser } from "../api.js";

// const socket = io('http://localhost:3000', { withCredentials: true });

// // --- Main Dashboard Component ---
// const Dashboard = ({ onLogout }) => {
//     // --- State Management ---
//     const [settings, setSettings] = useState({
//         bpm: 120,
//         scale: 'C',
//         transpose: 0, // Reverted to original state
//         enableBeats: false,
//         beatMode: "1loop",
//         // This will now hold more complex data for instruments with special options
//         activeInstruments: {}, 
//     });
    
//     const [collaborationId, setCollaborationId]= useState(null);
//     const [joinId, setJoinId] = useState('');
//     const [audioContext, setAudioContext] = useState(null);
//     const [isPlaying, setIsPlaying] = useState(false);
//     const [statusMessage, setStatusMessage] = useState("");
//     const [isLoading, setIsLoading] = useState(false);
//     const [currentChordIndex, setCurrentChordIndex] = useState(null);
//     const [instrumentPlayers, setInstrumentPlayers] = useState({});

//     // --- Refs for Tone.js loop ---
//     const settingsRef = useRef(settings);
//     const playersRef = useRef(instrumentPlayers);
//     useEffect(() => { settingsRef.current = settings; }, [settings]);
//     useEffect(() => { playersRef.current = instrumentPlayers; }, [instrumentPlayers]);
    
//     // --- Constants ---
//     const scales = useMemo(() => ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"], []);
//     const chordProgression = useMemo(() => [[0, 4, 7], [9, 0, 4], [5, 9, 0], [7, 11, 2]], []);
//     const instruments = useMemo(() => [
//         { label: "Piano", value: "acoustic_grand_piano", defaultGain: 2.0 },
//         { label: "Guitar (Electric)", value: "electric_guitar_clean", defaultGain: 1.5 },
//         { label: "Violin", value: "violin", defaultGain: 1.5 },
//         { label: "Flute", value: "flute", defaultGain: 1.5 },
//     ], []);

//     const updateSettings = useCallback((newSetting) => {
//         setSettings(prev => ({...prev, ...newSetting}));
//         if (collaborationId) {
//             socket.emit('update collaboration settings', newSetting);
//         }
//     }, [collaborationId]);

//     const updateInstrumentSetting = useCallback((instrumentValue, key, value) => {
//         const activeInstrument = settings.activeInstruments[instrumentValue];
//         if (!activeInstrument) return;

//         const updatedInstrument = { ...activeInstrument, [key]: value };
        
//         if (key === 'style' && value === 'block') {
//             delete updatedInstrument.octave;
//         }

//         updateSettings({
//             activeInstruments: {
//                 ...settings.activeInstruments,
//                 [instrumentValue]: updatedInstrument,
//             }
//         });
//     }, [settings.activeInstruments, updateSettings]);
    
//     const displayedScale = useMemo(() => {
//         const rootIndex = scales.indexOf(settings.scale);
//         const transposedIndex = (rootIndex + settings.transpose + 12) % 12;
//         return scales[transposedIndex];
//     }, [settings.scale, settings.transpose, scales]);
    

//     useEffect(() => {
//         socket.on('collaboration settings updated', (newSettings) => {
//             setSettings(prevSettings => ({ ...prevSettings, ...newSettings }));
//         });
//         const fetchSettings = async () => {
//             try {
//                 const data = await getSettings();
//                 if (data) {
//                     setSettings(prev => ({
//                         ...prev,
//                         bpm: data.tempo || 120,
//                         scale: data.scale || "C",
//                         transpose: data.transpose || 0,
//                         enableBeats: !!data.enableBeats,
//                         beatMode: data.beatMode || "1loop",
//                         activeInstruments: data.instruments || {}
//                     }));
//                 }
//             } catch (err) {
//                 console.error("Failed to load settings:", err);
//                 setStatusMessage("Error loading settings: " + (err.error || err.message));
//             }
//         };
//         fetchSettings();
//         return () => socket.off('collaboration settings updated');
//     }, []);

//         const handleTranspose = useCallback((direction) => {
//         setSettings(prev => {
//             const currentIndex = scales.indexOf(prev.scale);
//             const nextIndex = (currentIndex + direction + scales.length) % scales.length;
//             const newScale = scales[nextIndex];
//             return { ...prev, scale: newScale };
//         });
//     }, [scales]);

//     const handleScaleChange = useCallback((newScale) => {
//         updateSettings({ scale: newScale });
//     }, [updateSettings]);

//     const startCollaboration = async () => {
//         try {
//             const response = await fetch('http://localhost:3000/collaboration/start', { method: 'POST' });
//             const data = await response.json();
//             setCollaborationId(data.collaborationId);
//             socket.emit('join collaboration', data.collaborationId);
//         } catch (error) {
//             console.error("Failed to start collaboration:", error);
//         }
//     };

//     const joinCollaboration = (id) => {
//         if (id) {
//             setCollaborationId(id);
//             socket.emit('join collaboration', id);
//         }
//     };

//     const getChordName = useCallback((chordIndex) => {
//         const scaleChordsMap = { C: ["C", "Am", "F", "G"], "C#": ["C#", "A#m", "F#", "G#"], D: ["D", "Bm", "G", "A"], "D#": ["D#", "Cm", "G#", "A#"], E: ["E", "C#m", "A", "B"], F: ["F", "Dm", "A#", "C"], "F#": ["F#", "D#m", "B", "C#"], G: ["G", "Em", "C", "D"], "G#": ["G#", "Fm", "C#", "D#"], A: ["A", "F#m", "D", "E"], "A#": ["A#", "Gm", "D#", "F"], B: ["B", "G#m", "E", "F#"] };
//         return (scaleChordsMap[displayedScale] || [])[chordIndex] || "";
//     }, [displayedScale]);

//   const getChordNotes = useCallback((chordIndex, octaveOffset = 0) => {
//         const { scale, transpose } = settingsRef.current;
//         const rootIndex = scales.indexOf(scale);
//         const transposedRoot = (rootIndex + transpose + 12) % 12;
        
//         const baseOctave = 4;
//         const currentOctave = baseOctave + octaveOffset;

//         const getNote = (interval) => scales[(transposedRoot + interval) % 12] + currentOctave;

//         const intervals = chordProgression[chordIndex];
//         return {
//             root: getNote(intervals[0]),
//             third: getNote(intervals[1]),
//             fifth: getNote(intervals[2])
//         };
//     }, [scales, chordProgression]);
    
//     useEffect(() => {
//         const ac = new (window.AudioContext || window.webkitAudioContext)();
//         setAudioContext(ac);
//     }, []);

//     const [kick] = useState(() => new Tone.Sampler({ urls: { C1: "kick.mp3" }, baseUrl: "https://tonejs.github.io/audio/drum-samples/CR78/" }).toDestination());
//     const [snare] = useState(() => new Tone.Sampler({ urls: { D1: "snare.mp3" }, baseUrl: "https://tonejs.github.io/audio/drum-samples/CR78/" }).toDestination());
//     const [hihat] = useState(() => new Tone.Sampler({ urls: { "F#1": "hihat.mp3" }, baseUrl: "https://tonejs.github.io/audio/drum-samples/CR78/" }).toDestination());

//   const toggleInstrument = useCallback(async (inst) => {
//         if (!audioContext) return;
        
//         const newActiveInstruments = { ...settings.activeInstruments };
//         const isActive = !!newActiveInstruments[inst.value];

//         if (!isActive) {
//             try {
//                 setStatusMessage(`Loading ${inst.label}...`);
//                 const player = await Soundfont.instrument(audioContext, inst.value);
//                 setInstrumentPlayers((prev) => ({ ...prev, [inst.value]: player }));

//                 if (inst.value === 'acoustic_grand_piano') {
//                     newActiveInstruments[inst.value] = { gain: inst.defaultGain, style: 'block' };
//                 } else {
//                     newActiveInstruments[inst.value] = { gain: inst.defaultGain };
//                 }
//                 setStatusMessage('');
//             } catch (err) {
//                 console.error("Failed to load instrument soundfont:", err);
//                 setStatusMessage('Error loading instrument. Please try another.');
//                 return;
//             }
//         } else {
//             delete newActiveInstruments[inst.value];
//         }
//         updateSettings({ activeInstruments: newActiveInstruments });
//     }, [audioContext, settings.activeInstruments, updateSettings]);
 
  
//       const drumSeq = useRef(new Tone.Sequence((time, step) => {
//           const { enableBeats, beatMode } = settingsRef.current;
//           if (!enableBeats) return;
//           if (beatMode === "1loop") {
//               if (step % 2 === 0) {
//                   if (step === 0) kick.triggerAttackRelease("C1", "8n", time);
//                   if (step === 2) hihat.triggerAttackRelease("F#1", "8n", time);
//                   if (step === 4) snare.triggerAttackRelease("D1", "8n", time);
//                   if (step === 6) hihat.triggerAttackRelease("F#1", "8n", time);
//               }
//           } else {
//               if (step === 0 || step === 4) kick.triggerAttackRelease("C1", "8n", time);
//               if (step === 2 || step === 6) snare.triggerAttackRelease("D1", "8n", time);
//               if (step % 2 === 1) hihat.triggerAttackRelease("F#1", "16n", time);
//           }
//       }, [...Array(8).keys()], "8n")).current;
      
//  const chordSeq = useRef(new Tone.Sequence((time, chordIndex) => {
//         Object.entries(settingsRef.current.activeInstruments).forEach(([value, instSettings]) => {
//             const player = playersRef.current[value];
//             if (player) {
//                 const octave = instSettings.octave || 0;
//                 const notes = getChordNotes(chordIndex, octave);
//                 const gain = instSettings.gain;

//                 if (value === 'acoustic_grand_piano' && instSettings.style === 'arpeggio') {
//                     player.play(notes.root,  time,                               { duration: 0.5, gain });
//                     player.play(notes.third, time + Tone.Time('4n').toSeconds(), { duration: 0.5, gain });
//                     player.play(notes.fifth, time + Tone.Time('2n').toSeconds(), { duration: 0.5, gain });
//                     player.play(notes.third, time + Tone.Time('2n+4n').toSeconds(), { duration: 0.5, gain });
//                 } else {
//                     player.play(notes.root, time, { duration: 1.5, gain });
//                     player.play(notes.third, time, { duration: 1.5, gain });
//                     player.play(notes.fifth, time, { duration: 1.5, gain });
//                 }
//             }
//         });
//         Tone.Draw.schedule(() => setCurrentChordIndex(chordIndex), time);
//     }, [0, 1, 2, 3], '1m')).current;
    
//       const startProgression = useCallback(async () => {
//           if (!audioContext || isPlaying || Object.keys(settings.activeInstruments).length === 0) return;
//           await Tone.start();
         
//           Tone.Transport.bpm.value = settings.bpm;
//           drumSeq.start(0);
//           chordSeq.start(0);
//           Tone.Transport.start();
//           setIsPlaying(true);
//       }, [audioContext, isPlaying, settings.activeInstruments, settings.bpm, drumSeq, chordSeq]);
  
//       const stopProgression = useCallback(() => {
//           Tone.Transport.stop();
//           Tone.Transport.cancel();
//           drumSeq.stop();
//           chordSeq.stop();
//           setIsPlaying(false);
//           setCurrentChordIndex(null);
//       }, [drumSeq, chordSeq]);
  
//       useEffect(() => {
//           Tone.Transport.bpm.value = settings.bpm;
//       }, [settings.bpm]);
  
//       useEffect(() => {
//           const handleKeyDown = (e) => {
//               if (e.target.tagName === 'INPUT') return; // Ignore key presses in input fields
//               switch (e.key.toLowerCase()) {
//                   case "p": toggleInstrument(instruments.find((i) => i.value === "acoustic_grand_piano")); break;
//                   case "g": toggleInstrument(instruments.find((i) => i.value === "electric_guitar_clean")); break;
//                   case "v": toggleInstrument(instruments.find((i) => i.value === "violin")); break;
//                   case "f": toggleInstrument(instruments.find((i) => i.value === "flute")); break;
//                   case "b": updateSettings({ enableBeats: settings.beatMode === '1loop' ? !settings.enableBeats : true, beatMode: '1loop' }); break;
//                   case "n": updateSettings({ enableBeats: settings.beatMode === '2loops' ? !settings.enableBeats : true, beatMode: '2loops' }); break;
//                   case " ": e.preventDefault(); isPlaying ? stopProgression() : startProgression(); break;
//                   default: break;
//               }
//           };
//           window.addEventListener("keydown", handleKeyDown);
//           return () => window.removeEventListener("keydown", handleKeyDown);
//       }, [instruments, toggleInstrument, settings.beatMode, settings.enableBeats, isPlaying, startProgression, stopProgression, updateSettings]);
  
//     const handleSave = async () => {
//         setIsLoading(true);
//         setStatusMessage("Saving settings...");
//         try {
//             await saveSettings({
//                 tempo: settings.bpm, scale: settings.scale, transpose: settings.transpose,
//                 enableBeats: settings.enableBeats, beatMode: settings.beatMode,
//                 instruments: settings.activeInstruments
//             });
//             setStatusMessage("Settings saved successfully!");
//         } catch (err) {
//             setStatusMessage("Error saving settings: " + (err.error || err.message));
//         } finally {
//             setIsLoading(false);
//             setTimeout(() => setStatusMessage(""), 3000);
//         }
//     };

//     const handleReset = async () => {
//         setIsLoading(true);
//         setStatusMessage("Resetting settings...");
//         try {
//             await resetSettings();
//             updateSettings({ bpm: 120, scale: "C", transpose: 0, enableBeats: false, beatMode: "1loop", activeInstruments: {} });
//             setStatusMessage("Settings reset successfully!");
//         } catch (err) {
//             setStatusMessage("Error resetting settings: " + (err.error || err.message));
//         } finally {
//             setIsLoading(false);
//             setTimeout(() => setStatusMessage(""), 3000);
//         }
//     };

//     const handleLogout = async () => {
//         try {
//             await logoutUser();
//         } catch (err) {
//             console.error(err);
//         } finally {
//             onLogout();
//         }
//     };

//    const handleEndSession = () => {
//         if (collaborationId) {
//             // Optional: Notify the server that you are leaving
//             socket.emit('leave collaboration', collaborationId);
//             setCollaborationId(null);
//         }
//     };

//     return (
//         <div className="min-h-screen flex flex-col items-center justify-start bg-[#0A0A0E] text-white relative overflow-hidden px-4 font-michroma">
//             <div className="absolute inset-0 z-0 pointer-events-none">
//                 { /* ... background divs ... */ }
//             </div>


//             <div className="relative z-10 w-full max-w-7xl mx-auto flex flex-col items-center">
                
//                 {/* --- Header is now simplified --- */}
//                 <Header 
//                     onLogout={handleLogout}
//                     isLoading={isLoading}
//                     onSave={handleSave}
//                     onReset={handleReset}
//                 >
//                     <CollaborationPanel 
//                         collaborationId={collaborationId}
//                         joinId={joinId}
//                         setJoinId={setJoinId}
//                         onStart={startCollaboration}
//                         onJoin={joinCollaboration}
//                         onEndSession={handleEndSession}
//                     />
//                 </Header>
//                 <br></br>
//                     {statusMessage && (
//         <div className={`mt-4 w-full text-center text-sm font-semibold transition-opacity duration-500 ${
//             statusMessage.startsWith("Error") ? 'text-red-400' : 'text-green-400'
//         }`}>
//             {statusMessage}
//         </div>
//     )}
//                 <ChordDisplay
//                     chordProgression={chordProgression}
//                     currentChordIndex={currentChordIndex}
//                     getChordName={getChordName}
//                 />
//                 <br></br>
                
//       {/* --- CHANGE 5: Pass all the new handlers and state to ControlGrid --- */}
//                 <ControlGrid
//                     settings={settings}
//                     updateSettings={updateSettings}
//                     scales={scales}
//                     instruments={instruments}
//                     toggleInstrument={toggleInstrument}
//                     onScaleChange={handleScaleChange}
//                     onTranspose={handleTranspose}
//                     onUpdateInstrumentSetting={updateInstrumentSetting}

//                 />

                
//                 <ActionButtons 
//                     isPlaying={isPlaying}
//                     onPlay={startProgression}
//                     onStop={stopProgression}
//                 />

//             </div>
//             <br></br>
            
//             <ShortcutsFooter />
//         </div>
//     );
// };

// export default Dashboard;