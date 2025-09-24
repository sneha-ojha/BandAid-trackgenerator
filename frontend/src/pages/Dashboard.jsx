

// Dashboard.jsx
import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import io from 'socket.io-client';
import * as Tone from "tone";
import Soundfont from "soundfont-player";

// --- Child Components ---
import { Header } from "../components/Header";
import { CollaborationPanel } from "../components/CollaborationPanel";
import { ChordDisplay } from "../components/ChordDisplay";
import { ControlGrid } from "../components/ControlGrid";
import { ShortcutsFooter, ActionButtons } from "../components/buttons-shortcuts";
import { getSettings, saveSettings, resetSettings, logoutUser } from "../api.js";

const socket = io('http://localhost:3000', { withCredentials: true });

// --- Main Dashboard Component ---
const Dashboard = ({ onLogout }) => {
    // --- State Management ---
    const [settings, setSettings] = useState({
        bpm: 120,
        scale: 'C',
        transpose: 0, // Reverted to original state
        enableBeats: false,
        arpeggioSubdivision:'4n',
         arpeggioPattern: 'melodic',
        beatMode: "1loop",
        // This will now hold more complex data for instruments with special options
        activeInstruments: {}, 
    });
    
    const [collaborationId, setCollaborationId]= useState(null);
    const [joinId, setJoinId] = useState('');
    const [audioContext, setAudioContext] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [statusMessage, setStatusMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [currentChordIndex, setCurrentChordIndex] = useState(null);
    const [instrumentPlayers] = useState({});
// Initial gain state for beats
const [beatGains, setBeatGains] = useState({
 beats: 1,
});

    // --- Refs for Tone.js loop ---
    const settingsRef = useRef(settings);
    const playersRef = useRef(instrumentPlayers);
    const beatGainsRef = useRef(beatGains); 
    useEffect(() => { settingsRef.current = settings; }, [settings]);
    useEffect(() => { playersRef.current = instrumentPlayers; }, [instrumentPlayers]);
    useEffect(() => { beatGainsRef.current = beatGains; }, [beatGains]);
    // --- Constants ---
    const scales = useMemo(() => ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"], []);
    const chordProgression = useMemo(() => [[0, 4, 7], [9, 0, 4], [5, 9, 0], [7, 11, 2]], []);
    const instruments = useMemo(() => [
        { label: "Piano", value: "acoustic_grand_piano", defaultGain: 2.0 },
        { label: "Strings", value: "electric_guitar_clean", defaultGain: 1.5 },
        { label: "Violin", value: "violin", defaultGain: 1.5 },
        { label: "Flute", value: "flute", defaultGain: 1.5 },
         { label: "Arpeggio", value: "arpeggio", defaultGain: 1.8 }
    ], []);

    const updateSettings = useCallback((newSetting) => {
        setSettings(prev => ({...prev, ...newSetting}));
        if (collaborationId) {
            socket.emit('update collaboration settings', newSetting);
        }
    }, [collaborationId]);

const updateInstrumentSetting = useCallback((instrumentValue, key, value) => {
    setSettings(prevSettings => {
        const activeInstrument = prevSettings.activeInstruments[instrumentValue];
        if (!activeInstrument) return prevSettings;

        const updatedInstrument = { ...activeInstrument, [key]: value };
        if (key === 'style' && value === 'block') {
            delete updatedInstrument.octave;
        }

        return {
            ...prevSettings,
            activeInstruments: {
                ...prevSettings.activeInstruments,
                [instrumentValue]: updatedInstrument,
            }
        };
    });
}, []);

    const displayedScale = useMemo(() => {
        const rootIndex = scales.indexOf(settings.scale);
        const transposedIndex = (rootIndex + settings.transpose + 12) % 12;
        return scales[transposedIndex];
    }, [settings.scale, settings.transpose, scales]);
    

    useEffect(() => {
        socket.on('collaboration settings updated', (newSettings) => {
            setSettings(prevSettings => ({ ...prevSettings, ...newSettings }));
        });
        const fetchSettings = async () => {
            try {
                const data = await getSettings();
                if (data) {
                    setSettings(prev => ({
                        ...prev,
                        bpm: data.tempo || 120,
                        scale: data.scale || "C",
                        transpose: data.transpose || 0,
                        enableBeats: !!data.enableBeats,
                        beatMode: data.beatMode || "1loop",
                        activeInstruments: data.instruments || {}
                    }));
                }
            } catch (err) {
                console.error("Failed to load settings:", err);
                setStatusMessage("Error loading settings: " + (err.error || err.message));
            }
        };
        fetchSettings();
        return () => socket.off('collaboration settings updated');
    }, []);

        const handleTranspose = useCallback((direction) => {
        setSettings(prev => {
            const currentIndex = scales.indexOf(prev.scale);
            const nextIndex = (currentIndex + direction + scales.length) % scales.length;
            const newScale = scales[nextIndex];
            return { ...prev, scale: newScale };
        });
    }, [scales]);

    const handleScaleChange = useCallback((newScale) => {
        updateSettings({ scale: newScale });
    }, [updateSettings]);

    const startCollaboration = async () => {
        try {
            const response = await fetch('http://localhost:3000/collaboration/start', { method: 'POST' });
            const data = await response.json();
            setCollaborationId(data.collaborationId);
            socket.emit('join collaboration', data.collaborationId);
        } catch (error) {
            console.error("Failed to start collaboration:", error);
        }
    };

    const joinCollaboration = (id) => {
        if (id) {
            setCollaborationId(id);
            socket.emit('join collaboration', id);
        }
    };

    const getChordName = useCallback((chordIndex) => {
        const scaleChordsMap = { C: ["C", "Am", "F", "G"], "C#": ["C#", "A#m", "F#", "G#"], D: ["D", "Bm", "G", "A"], "D#": ["D#", "Cm", "G#", "A#"], E: ["E", "C#m", "A", "B"], F: ["F", "Dm", "A#", "C"], "F#": ["F#", "D#m", "B", "C#"], G: ["G", "Em", "C", "D"], "G#": ["G#", "Fm", "C#", "D#"], A: ["A", "F#m", "D", "E"], "A#": ["A#", "Gm", "D#", "F"], B: ["B", "G#m", "E", "F#"] };
        return (scaleChordsMap[displayedScale] || [])[chordIndex] || "";
    }, [displayedScale]);

  const getChordNotes = useCallback((chordIndex, octaveOffset = 0) => {
        const { scale, transpose } = settingsRef.current;
        const rootIndex = scales.indexOf(scale);
        const transposedRoot = (rootIndex + transpose + 12) % 12;
        
        const baseOctave = 4;
    const currentOctave = baseOctave + (Number(octaveOffset) || 0);


        const getNote = (interval) => scales[(transposedRoot + interval) % 12] + currentOctave;

        const intervals = chordProgression[chordIndex];
        return {
            root: getNote(intervals[0]),
            third: getNote(intervals[1]),
            fifth: getNote(intervals[2])
        };
    }, [scales, chordProgression]);
    
    useEffect(() => {
        const ac = new (window.AudioContext || window.webkitAudioContext)();
        setAudioContext(ac);
    }, []);

    const [kick] = useState(() => new Tone.Sampler({ urls: { C1: "kick.mp3" }, baseUrl: "https://tonejs.github.io/audio/drum-samples/CR78/" }).toDestination());
    const [snare] = useState(() => new Tone.Sampler({ urls: { D1: "snare.mp3" }, baseUrl: "https://tonejs.github.io/audio/drum-samples/CR78/" }).toDestination());
    const [hihat] = useState(() => new Tone.Sampler({ urls: { "F#1": "hihat.mp3" }, baseUrl: "https://tonejs.github.io/audio/drum-samples/CR78/" }).toDestination());


const getOctaveOffset = (octaveSetting) => {
  if (octaveSetting === 'lower') return -1;
  if (octaveSetting === 'higher') return 1;
  return 0; // current or invalid
};




const toggleInstrument = useCallback(async (inst) => {
  if (!audioContext) return;

  setSettings(prevSettings => {
    const newActiveInstruments = { ...prevSettings.activeInstruments };
    const isActive = !!newActiveInstruments[inst.value];

    if (!isActive) {
      newActiveInstruments[inst.value] = { 
        gain: inst.defaultGain, 
        style: inst.value === 'arpeggio' ? 'arpeggio' : 'block',
        pattern: 'melodic',
        octave: 'current'  // default octave
      };
    } else {
      const { [inst.value]: _, ...rest } = newActiveInstruments;
      return { ...prevSettings, activeInstruments: rest };
    }

    return { ...prevSettings, activeInstruments: newActiveInstruments };
  });

  // --- Load Soundfont ---
if (!playersRef.current[inst.value]) {
  const instrumentName = inst.value === "arpeggio" ? "acoustic_grand_piano" : inst.value;
  const player = await Soundfont.instrument(audioContext, instrumentName);
  playersRef.current[inst.value] = player;
}

}, [audioContext]);







const drumSeq = useRef(new Tone.Sequence((time, step) => {
    const { enableBeats, beatMode } = settingsRef.current;
    const gain = beatGainsRef.current.beats; // ✅ Get the current volume
    
    if (!enableBeats) return;

    if (beatMode === "1loop") {
        if (step % 2 === 0) {
            if (step === 0) kick.triggerAttackRelease("C1", "8n", time, gain); // ✅ Use gain
            if (step === 2) hihat.triggerAttackRelease("F#1", "8n", time, gain); // ✅ Use gain
            if (step === 4) snare.triggerAttackRelease("D1", "8n", time, gain); // ✅ Use gain
            if (step === 6) hihat.triggerAttackRelease("F#1", "8n", time, gain); // ✅ Use gain
        }
    } else {
        if (step === 0 || step === 4) kick.triggerAttackRelease("C1", "8n", time, gain); // ✅ Use gain
        if (step === 2 || step === 6) snare.triggerAttackRelease("D1", "8n", time, gain); // ✅ Use gain
        if (step % 2 === 1) hihat.triggerAttackRelease("F#1", "16n", time, gain); // ✅ Use gain
    }
}, [...Array(8).keys()], "8n")).current;


const chordSeq = useRef(
  new Tone.Sequence((time, chordIndex) => {
    Object.entries(settingsRef.current.activeInstruments).forEach(([value, instSettings]) => {
      if (value === 'arpeggio') return; // skip arpeggio here
      const player = playersRef.current[value];
      if (!player) return;

const octaveOffset = getOctaveOffset(instSettings.octave || 'current');

const notes = getChordNotes(chordIndex, octaveOffset);
const gain = instSettings.gain || 1; // fallback if gain is missing
player.play(notes.root, time, { duration: 1.5, gain });
player.play(notes.third, time, { duration: 1.5, gain });
player.play(notes.fifth, time, { duration: 1.5, gain });


    });

    Tone.Draw.schedule(() => setCurrentChordIndex(chordIndex), time);
  }, [0, 1, 2, 3], "1m")
).current;

const arpeggioPatterns = useMemo(() => ({
  Melodic: ['root', 'third', 'fifth', 'third'],
  Strong: ['root', 'fifth', 'third', 'fifth'],
  Ascending: ['root', 'third', 'fifth', 'root_octave_up'],
  Descending: ['root_octave_up', 'fifth', 'third', 'root']
}), []);


// Helper to get the actual note from a chord and pattern key
const getPatternNote = useCallback((notes, key, octaveOffset = 0) => {
  const transposeNoteOctave = (note, offset) => {
    const octave = parseInt(note.slice(-1)) + offset;
    return note.slice(0, -1) + octave;
  };

  switch (key) {
    case 'root': 
      return transposeNoteOctave(notes.root, octaveOffset);
    case 'third': 
      return transposeNoteOctave(notes.third, octaveOffset);
    case 'fifth': 
      return transposeNoteOctave(notes.fifth, octaveOffset);
    case 'root_octave_up': {
      const octave = parseInt(notes.root.slice(-1)) + 1 + octaveOffset;
      return notes.root.slice(0, -1) + octave;
    }
    default: 
      return transposeNoteOctave(notes.root, octaveOffset);
  }
}, []);



const arpeggioSeq = useRef(
  new Tone.Sequence((time, step) => {
    Object.entries(settingsRef.current.activeInstruments).forEach(([value, instSettings]) => {
      if (value !== "arpeggio") return;
      
      const player = playersRef.current[value];
      if (!player) return;

      // --- RECOMMENDED LOGIC ---
      // Get the bar number to ensure the chord only changes ONCE per measure.
      const bar = parseInt(Tone.Transport.position.split(':')[0]);
      const chordIndex = bar % 4; // Assumes a 4-chord progression.

      const octave = instSettings.octave || 0;
      const chordNotes = getChordNotes(chordIndex, octave);
      
      const pattern = arpeggioPatterns[instSettings.pattern || "melodic"];
      
      // Correctly picks the note from the pattern for the current step.
      const noteKey = pattern[step % pattern.length];
const octaveOffset = getOctaveOffset(instSettings.octave);
const note = getPatternNote(chordNotes, noteKey, octaveOffset);

const gain = instSettings.gain || 1;
player.play(note, time, {
  gain,
  duration: Tone.Time(settings.arpeggioSubdivision).toSeconds(),
});
;

    });
  },
  // Sequence runs 16 times per bar (once every 16th note).
  [...Array(16).keys()],
   settingsRef.current.arpeggioSubdivision || "4n")
).current;


// --- Arpeggio Sequence ---
// --- Arpeggio Sequence ---


useEffect(() => {
  if (!audioContext) return;

  // Determine how many steps per bar
  const stepsPerBar = Tone.Time("1m").toTicks() / Tone.Time(settings.arpeggioSubdivision).toTicks();
  const stepArray = [...Array(stepsPerBar).keys()];

  // Stop previous sequence
  arpeggioSeq.current?.stop();

  // Create new sequence
  arpeggioSeq.current = new Tone.Sequence(
    (time, step) => {
      Object.entries(settingsRef.current.activeInstruments).forEach(([value, instSettings]) => {
        if (value !== "arpeggio") return;

        const player = playersRef.current[value];
        if (!player) return;

        // Determine current chord
        const bar = parseInt(Tone.Transport.position.split(':')[0]);
        const chordIndex = bar % 4;

        const octaveOffset = getOctaveOffset(instSettings.octave);
        const chordNotes = getChordNotes(chordIndex, octaveOffset);

        // Get the note from the pattern
        const pattern = arpeggioPatterns[instSettings.pattern || "melodic"];
        const noteKey = pattern[step % pattern.length];
        const note = getPatternNote(chordNotes, noteKey, octaveOffset);

        // Safety checks
        if (!note || typeof note !== "string") return;
        const safeGain = Math.max(instSettings.gain || 1, 0.01);
        const safeDuration = Math.max(Tone.Time(settings.arpeggioSubdivision).toSeconds(), 0.05);

        player.play(note, time, {
          gain: safeGain,
          duration: safeDuration,
        });
      });
    },
    stepArray,
    settings.arpeggioSubdivision
  );

  // Start if playing
  if (isPlaying) arpeggioSeq.current.start(0);

  return () => {
    arpeggioSeq.current?.stop();
  };
}, [
  audioContext,
  settings.arpeggioSubdivision,
  isPlaying,
  getChordNotes,
  arpeggioPatterns,
  getPatternNote,arpeggioSeq
]);



    
      const startProgression = useCallback(async () => {
          if (!audioContext || isPlaying || Object.keys(settings.activeInstruments).length === 0) return;
          await Tone.start();
         
          Tone.Transport.bpm.value = settings.bpm;
          drumSeq.start(0);
          chordSeq.start(0);
          arpeggioSeq.start(0); 
          Tone.Transport.start();
          setIsPlaying(true);
      }, [audioContext, isPlaying, settings.activeInstruments, settings.bpm, drumSeq, chordSeq,arpeggioSeq]);
  
      const stopProgression = useCallback(() => {
          Tone.Transport.stop();
          Tone.Transport.cancel();
          drumSeq.stop();
          chordSeq.stop();
           arpeggioSeq.stop(); 
          setIsPlaying(false);
          setCurrentChordIndex(null);
      }, [drumSeq, chordSeq,arpeggioSeq]);
  
      useEffect(() => {
          Tone.Transport.bpm.value = settings.bpm;
      }, [settings.bpm]);
  
      useEffect(() => {
          const handleKeyDown = (e) => {
              if (e.target.tagName === 'INPUT') return; // Ignore key presses in input fields
              switch (e.key.toLowerCase()) {
                  case "p": toggleInstrument(instruments.find((i) => i.value === "acoustic_grand_piano")); break;
                  case "s": toggleInstrument(instruments.find((i) => i.value === "electric_guitar_clean")); break;
                  case "v": toggleInstrument(instruments.find((i) => i.value === "violin")); break;
                  case "f": toggleInstrument(instruments.find((i) => i.value === "flute")); break;
                  case "b": updateSettings({ enableBeats: settings.beatMode === '1loop' ? !settings.enableBeats : true, beatMode: '1loop' }); break;
                  case "n": updateSettings({ enableBeats: settings.beatMode === '2loops' ? !settings.enableBeats : true, beatMode: '2loops' }); break;
                     case "a": // NEW: toggle arpeggio
                toggleInstrument(instruments.find((i) => i.value === "arpeggio"));
                break;
                  case " ": e.preventDefault(); isPlaying ? stopProgression() : startProgression(); break;
                  default: break;
              }
          };
          window.addEventListener("keydown", handleKeyDown);
          return () => window.removeEventListener("keydown", handleKeyDown);
      }, [instruments, toggleInstrument, settings.beatMode, settings.enableBeats, isPlaying, startProgression, stopProgression, updateSettings]);
  
    const handleSave = async () => {
        setIsLoading(true);
        setStatusMessage("Saving settings...");
        try {
            await saveSettings({
                tempo: settings.bpm, scale: settings.scale, transpose: settings.transpose,
                enableBeats: settings.enableBeats, beatMode: settings.beatMode,
                instruments: settings.activeInstruments
            });
            setStatusMessage("Settings saved successfully!");
        } catch (err) {
            setStatusMessage("Error saving settings: " + (err.error || err.message));
        } finally {
            setIsLoading(false);
            setTimeout(() => setStatusMessage(""), 3000);
        }
    };

    const handleReset = async () => {
        setIsLoading(true);
        setStatusMessage("Resetting settings...");
        try {
            await resetSettings();
            updateSettings({ bpm: 120, scale: "C", transpose: 0, enableBeats: false, beatMode: "1loop", activeInstruments: {} });
            setStatusMessage("Settings reset successfully!");
        } catch (err) {
            setStatusMessage("Error resetting settings: " + (err.error || err.message));
        } finally {
            setIsLoading(false);
            setTimeout(() => setStatusMessage(""), 3000);
        }
    };

    const handleLogout = async () => {
        try {
            await logoutUser();
        } catch (err) {
            console.error(err);
        } finally {
            onLogout();
        }
    };

   const handleEndSession = () => {
        if (collaborationId) {
            // Optional: Notify the server that you are leaving
            socket.emit('leave collaboration', collaborationId);
            setCollaborationId(null);
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-start bg-[#0A0A0E] text-white relative overflow-hidden px-4 font-michroma">
            <div className="absolute inset-0 z-0 pointer-events-none">
                { /* ... background divs ... */ }
            </div>


            <div className="relative z-10 w-full max-w-7xl mx-auto flex flex-col items-center">
                
                {/* --- Header is now simplified --- */}
                <Header 
                    onLogout={handleLogout}
                    isLoading={isLoading}
                    onSave={handleSave}
                    onReset={handleReset}
                >
                    <CollaborationPanel 
                        collaborationId={collaborationId}
                        joinId={joinId}
                        setJoinId={setJoinId}
                        onStart={startCollaboration}
                        onJoin={joinCollaboration}
                        onEndSession={handleEndSession}
                    />
                </Header>
                <br></br>
                    {statusMessage && (
        <div className={`mt-4 w-full text-center text-sm font-semibold transition-opacity duration-500 ${
            statusMessage.startsWith("Error") ? 'text-red-400' : 'text-green-400'
        }`}>
            {statusMessage}
        </div>
    )}
                <ChordDisplay
                    chordProgression={chordProgression}
                    currentChordIndex={currentChordIndex}
                    getChordName={getChordName}
                />
                <br></br>
                
      {/* --- CHANGE 5: Pass all the new handlers and state to ControlGrid --- */}
     <ControlGrid
    settings={settings}
    updateSettings={updateSettings}
    scales={scales}
    instruments={instruments}
    toggleInstrument={toggleInstrument}
    onScaleChange={handleScaleChange}
    onTranspose={handleTranspose}
    onUpdateInstrumentSetting={updateInstrumentSetting}
    beatGains={beatGains}         // <-- Add this
    setBeatGains={setBeatGains} 
     arpeggioPatterns={arpeggioPatterns}    // <-- Add this
/>


                
                <ActionButtons 
                    isPlaying={isPlaying}
                    onPlay={startProgression}
                    onStop={stopProgression}
                />

            </div>
            <br></br>
            
            <ShortcutsFooter />
        </div>
    );
};

export default Dashboard;