"use client";

import { Clock3, Pause, Play, Volume2, Waves } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

type SoundKind = "pink" | "brown" | "rain" | "white";

const sounds: ReadonlyArray<{ id: SoundKind; label: string; description: string }> = [
  { id: "pink", label: "Miękki szum", description: "łagodny i równy" },
  { id: "brown", label: "Głęboki szum", description: "cieplejszy, spokojniejszy" },
  { id: "rain", label: "Delikatny deszcz", description: "lekki szmer w tle" },
  { id: "white", label: "Jasny szum", description: "prosty, jednostajny" },
];

const timerOptions = [15, 30, 60] as const;

function fillNoiseBuffer(buffer: AudioBuffer, kind: SoundKind) {
  const data = buffer.getChannelData(0);
  let brown = 0;
  let b0 = 0;
  let b1 = 0;
  let b2 = 0;
  let b3 = 0;
  let b4 = 0;
  let b5 = 0;
  let b6 = 0;

  for (let index = 0; index < data.length; index += 1) {
    const white = Math.random() * 2 - 1;

    if (kind === "brown") {
      brown = (brown + 0.02 * white) / 1.02;
      data[index] = Math.max(-1, Math.min(1, brown * 3.5));
      continue;
    }

    if (kind === "pink") {
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.969 * b2 + white * 0.153852;
      b3 = 0.8665 * b3 + white * 0.3104856;
      b4 = 0.55 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.016898;
      data[index] = Math.max(-1, Math.min(1, (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.11));
      b6 = white * 0.115926;
      continue;
    }

    data[index] = kind === "rain" ? white * (0.58 + Math.random() * 0.18) : white * 0.55;
  }
}

export default function SoothingSounds() {
  const contextRef = useRef<AudioContext | null>(null);
  const sourceRef = useRef<AudioBufferSourceNode | null>(null);
  const gainRef = useRef<GainNode | null>(null);
  const filterRef = useRef<BiquadFilterNode | null>(null);
  const [sound, setSound] = useState<SoundKind>("pink");
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(18);
  const [timerMinutes, setTimerMinutes] = useState<number | null>(30);
  const [remainingSeconds, setRemainingSeconds] = useState<number | null>(null);

  const stop = useCallback(() => {
    try {
      sourceRef.current?.stop();
    } catch {
      // The source may already be stopped by the browser.
    }
    sourceRef.current?.disconnect();
    filterRef.current?.disconnect();
    gainRef.current?.disconnect();
    sourceRef.current = null;
    filterRef.current = null;
    gainRef.current = null;
    setPlaying(false);
    setRemainingSeconds(null);
  }, []);

  const play = useCallback(async () => {
    stop();
    const AudioContextClass = window.AudioContext ||
      (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;

    const context = contextRef.current?.state !== "closed"
      ? contextRef.current
      : null;
    const activeContext = context ?? new AudioContextClass();
    contextRef.current = activeContext;

    try {
      await activeContext.resume();
    } catch {
      // iPhone may wait for the next direct tap; the button remains available.
      return;
    }

    const source = activeContext.createBufferSource();
    const filter = activeContext.createBiquadFilter();
    const gain = activeContext.createGain();
    const buffer = activeContext.createBuffer(1, activeContext.sampleRate * 3, activeContext.sampleRate);

    fillNoiseBuffer(buffer, sound);
    source.buffer = buffer;
    source.loop = true;
    filter.type = sound === "rain" ? "bandpass" : sound === "white" ? "highpass" : "lowpass";
    filter.frequency.value = sound === "rain" ? 2800 : sound === "white" ? 180 : sound === "brown" ? 900 : 1800;
    filter.Q.value = sound === "rain" ? 0.45 : 0.2;
    gain.gain.value = (volume / 100) * 0.22;

    source.connect(filter);
    filter.connect(gain);
    gain.connect(activeContext.destination);
    source.start();

    sourceRef.current = source;
    filterRef.current = filter;
    gainRef.current = gain;
    setPlaying(true);
    setRemainingSeconds(timerMinutes ? timerMinutes * 60 : null);
  }, [sound, stop, timerMinutes, volume]);

  useEffect(() => {
    if (gainRef.current) gainRef.current.gain.value = (volume / 100) * 0.22;
  }, [volume]);

  useEffect(() => {
    if (!playing || remainingSeconds === null) return;
    const timer = window.setTimeout(() => {
      if (remainingSeconds <= 1) {
        stop();
        return;
      }
      setRemainingSeconds(remainingSeconds - 1);
    }, 1000);
    return () => window.clearTimeout(timer);
  }, [playing, remainingSeconds, stop]);

  useEffect(() => {
    const handleVisibility = () => {
      if (document.hidden) stop();
    };
    document.addEventListener("visibilitychange", handleVisibility);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibility);
      stop();
      void contextRef.current?.close();
      contextRef.current = null;
    };
  }, [stop]);

  const remainingLabel = remainingSeconds === null
    ? "bez limitu"
    : `${Math.floor(remainingSeconds / 60)}:${String(remainingSeconds % 60).padStart(2, "0")}`;

  return (
    <section className="rounded-3xl border border-[#DCE4D8] bg-gradient-to-br from-[#F7FAF5] to-white p-5 shadow-sm sm:p-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-sm text-gray-500">Ciche tło do wspólnego odpoczynku</p>
          <h2 className="mt-1 flex items-center gap-2 text-2xl font-bold"><Waves className="text-[#6D7A62]" size={24} aria-hidden="true" />Spokojne szumy PsychOLKI</h2>
        </div>
        <div className="rounded-xl bg-white px-3 py-2 text-sm font-semibold text-[#5E6C57] shadow-sm" aria-live="polite">
          {playing ? `Gra · ${remainingLabel}` : "Gotowe do włączenia"}
        </div>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {sounds.map((item) => (
          <button
            key={item.id}
            type="button"
            aria-pressed={sound === item.id}
            onClick={() => {
              stop();
              setSound(item.id);
            }}
            className={`min-h-20 rounded-2xl border p-3 text-left transition ${sound === item.id ? "border-[#6D7A62] bg-[#EEF3EB]" : "border-[#E5E1D8] bg-white hover:bg-[#FAF8F4]"}`}
          >
            <span className="block font-bold">{item.label}</span>
            <span className="mt-1 block text-xs text-gray-500">{item.description}</span>
          </button>
        ))}
      </div>

      <div className="mt-5 grid gap-5 rounded-2xl bg-white p-4 sm:grid-cols-2">
        <label className="text-sm font-semibold">
          <span className="flex items-center gap-2"><Volume2 size={18} aria-hidden="true" />Głośność: {volume}%</span>
          <input type="range" min="5" max="45" value={volume} onChange={(event) => setVolume(Number(event.target.value))} className="mt-3 w-full accent-[#6D7A62]" />
        </label>
        <div>
          <p className="flex items-center gap-2 text-sm font-semibold"><Clock3 size={18} aria-hidden="true" />Wyłącz po</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {timerOptions.map((minutes) => (
              <button key={minutes} type="button" onClick={() => { setTimerMinutes(minutes); if (playing) setRemainingSeconds(minutes * 60); }} className={`min-h-10 rounded-xl border px-3 py-2 text-sm font-semibold ${timerMinutes === minutes ? "border-[#6D7A62] bg-[#EEF3EB]" : "border-[#D8DDD4]"}`}>{minutes} min</button>
            ))}
            <button type="button" onClick={() => { setTimerMinutes(null); setRemainingSeconds(null); }} className={`min-h-10 rounded-xl border px-3 py-2 text-sm font-semibold ${timerMinutes === null ? "border-[#6D7A62] bg-[#EEF3EB]" : "border-[#D8DDD4]"}`}>bez limitu</button>
          </div>
        </div>
      </div>

      <button type="button" onClick={playing ? stop : () => { void play(); }} className="mt-5 inline-flex min-h-12 items-center gap-2 rounded-xl bg-[#6D7A62] px-5 py-3 font-bold text-white hover:bg-[#58644F]">
        {playing ? <Pause size={19} aria-hidden="true" /> : <Play size={19} aria-hidden="true" />}
        {playing ? "Zatrzymaj szum" : "Włącz cicho"}
      </button>
      <p className="mt-4 max-w-3xl text-xs leading-relaxed text-gray-500">Dźwięk jest generowany tylko na tym urządzeniu i nie jest nagrywany. Ustaw go cicho, korzystaj razem z opiekunem i zawsze zachowaj możliwość usłyszenia dziecka oraz otoczenia.</p>
    </section>
  );
}
