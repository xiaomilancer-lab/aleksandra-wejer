"use client";

import { Eraser, Palette, Pause, Play, RefreshCw, Sparkles } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const colors = ["#2D4739", "#E85D75", "#F2B134", "#4C8BF5", "#7B61A8", "#42A66C"];
const memorySymbols = ["🌸", "🐻", "🌈", "⭐", "🦋", "🍓"];

export default function BabyroomActivities() {
  return (
    <div className="space-y-5">
      <DrawingBoard />
      <div className="grid gap-5 lg:grid-cols-2">
        <BreathingBubble />
        <MemoryGame />
      </div>
    </div>
  );
}

function DrawingBoard() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawingRef = useRef(false);
  const [color, setColor] = useState(colors[0]);
  const [lineWidth, setLineWidth] = useState(8);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const snapshot = document.createElement("canvas");
      snapshot.width = canvas.width;
      snapshot.height = canvas.height;
      snapshot.getContext("2d")?.drawImage(canvas, 0, 0);
      const ratio = Math.max(window.devicePixelRatio || 1, 1);
      canvas.width = Math.round(rect.width * ratio);
      canvas.height = Math.round(rect.height * ratio);
      const context = canvas.getContext("2d");
      context?.setTransform(ratio, 0, 0, ratio, 0, 0);
      context?.drawImage(snapshot, 0, 0, snapshot.width, snapshot.height, 0, 0, rect.width, rect.height);
    };
    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  function point(event: React.PointerEvent<HTMLCanvasElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    return { x: event.clientX - rect.left, y: event.clientY - rect.top };
  }

  function start(event: React.PointerEvent<HTMLCanvasElement>) {
    drawingRef.current = true;
    event.currentTarget.setPointerCapture(event.pointerId);
    const context = event.currentTarget.getContext("2d");
    const current = point(event);
    if (!context) return;
    context.beginPath();
    context.moveTo(current.x, current.y);
  }

  function draw(event: React.PointerEvent<HTMLCanvasElement>) {
    if (!drawingRef.current) return;
    const context = event.currentTarget.getContext("2d");
    if (!context) return;
    const current = point(event);
    context.strokeStyle = color;
    context.lineWidth = lineWidth;
    context.lineCap = "round";
    context.lineJoin = "round";
    context.lineTo(current.x, current.y);
    context.stroke();
  }

  function clear() {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (canvas && context) context.clearRect(0, 0, canvas.width, canvas.height);
  }

  return (
    <section className="rounded-3xl border border-[#E5E1D8] bg-white p-5 shadow-sm sm:p-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div><p className="text-sm text-gray-500">Rysowanie bez zapisywania</p><h2 className="text-2xl font-bold">Tablica PsychOLKI 🎨</h2></div>
        <button type="button" onClick={clear} className="inline-flex min-h-11 w-fit items-center gap-2 rounded-xl border border-[#D8DDD4] px-4 py-2 font-semibold"><Eraser size={18} aria-hidden="true" />Wyczyść</button>
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-3" aria-label="Narzędzia do rysowania">
        <Palette size={20} aria-hidden="true" />
        {colors.map((item) => <button key={item} type="button" aria-label={`Wybierz kolor ${item}`} aria-pressed={color === item} onClick={() => setColor(item)} className={`h-11 w-11 rounded-full border-4 ${color === item ? "border-[#2D4739]" : "border-white"} shadow ring-1 ring-gray-200`} style={{ backgroundColor: item }} />)}
        <label className="ml-1 text-sm font-semibold">Grubość <input type="range" min="3" max="20" value={lineWidth} onChange={(event) => setLineWidth(Number(event.target.value))} className="ml-2 align-middle" /></label>
      </div>
      <canvas ref={canvasRef} onPointerDown={start} onPointerMove={draw} onPointerUp={() => { drawingRef.current = false; }} onPointerCancel={() => { drawingRef.current = false; }} className="mt-4 h-[360px] w-full touch-none rounded-2xl border-2 border-dashed border-[#CBD3C6] bg-[#FFFDF9]" aria-label="Pusta tablica do rysowania palcem lub myszką" />
      <p className="mt-3 text-xs text-gray-500">Rysunek zostaje tylko na tym ekranie i znika po odświeżeniu strony.</p>
    </section>
  );
}

function BreathingBubble() {
  const [running, setRunning] = useState(false);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (!running) return;
    const timer = window.setInterval(() => setTick((value) => (value + 1) % 8), 1000);
    return () => window.clearInterval(timer);
  }, [running]);

  const inhale = tick < 4;
  const count = inhale ? tick + 1 : tick - 3;

  return (
    <section className="rounded-3xl border border-[#E5E1D8] bg-white p-6 text-center shadow-sm">
      <p className="text-sm text-gray-500">Chwila wspólnego spokoju</p>
      <h2 className="mt-1 text-2xl font-bold">Kolorowy balonik</h2>
      <div className="mx-auto mt-8 flex h-56 items-center justify-center">
        <div className="flex h-32 w-32 items-center justify-center rounded-full bg-gradient-to-br from-[#F7B9C5] via-[#F4D38B] to-[#9FC7B0] text-4xl shadow-lg transition-transform duration-1000 ease-in-out" style={{ transform: running && inhale ? "scale(1.55)" : "scale(1)" }}>🌸</div>
      </div>
      <p className="text-lg font-bold">{running ? (inhale ? `Balonik rośnie… ${count}` : `Balonik maleje… ${count}`) : "Gotowi?"}</p>
      <p className="mt-1 text-sm text-gray-600">Oddychajcie spokojnie, bez wysiłku i tylko tak długo, jak jest przyjemnie.</p>
      <button type="button" onClick={() => { setRunning((value) => !value); setTick(0); }} className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-xl bg-[#6D7A62] px-5 py-3 font-semibold text-white">{running ? <Pause size={18} aria-hidden="true" /> : <Play size={18} aria-hidden="true" />}{running ? "Zatrzymaj" : "Zacznij"}</button>
    </section>
  );
}

function shuffledCards() {
  return [...memorySymbols, ...memorySymbols]
    .map((symbol, index) => ({ id: `${symbol}-${index}`, symbol }))
    .sort(() => Math.random() - 0.5);
}

function initialCards() {
  return [...memorySymbols, ...memorySymbols].map((symbol, index) => ({ id: `${symbol}-${index}`, symbol }));
}

function MemoryGame() {
  const [cards, setCards] = useState(() => initialCards());
  const [open, setOpen] = useState<number[]>([]);
  const [matched, setMatched] = useState<string[]>([]);
  const locked = open.length === 2;

  useEffect(() => {
    if (open.length !== 2) return;
    const [first, second] = open;
    if (cards[first].symbol === cards[second].symbol) {
      const timer = window.setTimeout(() => { setMatched((items) => [...items, cards[first].symbol]); setOpen([]); }, 450);
      return () => window.clearTimeout(timer);
    }
    const timer = window.setTimeout(() => setOpen([]), 800);
    return () => window.clearTimeout(timer);
  }, [cards, open]);

  function choose(index: number) {
    if (locked || open.includes(index) || matched.includes(cards[index].symbol)) return;
    setOpen((items) => [...items, index]);
  }

  function reset() {
    setCards(shuffledCards());
    setOpen([]);
    setMatched([]);
  }

  return (
    <section className="rounded-3xl border border-[#E5E1D8] bg-white p-6 shadow-sm">
      <div className="flex items-start justify-between gap-3"><div><p className="text-sm text-gray-500">Znajdź pary</p><h2 className="text-2xl font-bold">Memory</h2></div><button type="button" onClick={reset} className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-[#D8DDD4] px-3 py-2 font-semibold"><RefreshCw size={17} aria-hidden="true" />Od nowa</button></div>
      <div className="mt-5 grid grid-cols-4 gap-2 sm:gap-3">
        {cards.map((card, index) => {
          const visible = open.includes(index) || matched.includes(card.symbol);
          return <button key={card.id} type="button" onClick={() => choose(index)} aria-label={visible ? `Odkryta karta ${card.symbol}` : "Zakryta karta"} className={`aspect-square rounded-2xl border text-2xl transition sm:text-3xl ${visible ? "border-[#CBD3C6] bg-[#EEF1EB]" : "border-[#E5E1D8] bg-[#F8F5F0] hover:bg-[#EFEAE2]"}`}>{visible ? card.symbol : "?"}</button>;
        })}
      </div>
      <p className="mt-4 flex items-center gap-2 text-sm font-semibold text-[#6D7A62]"><Sparkles size={17} aria-hidden="true" />Znalezione pary: {matched.length} / {memorySymbols.length}</p>
      {matched.length === memorySymbols.length && <p className="mt-3 rounded-xl bg-[#FFF9EE] p-3 text-center font-bold">Brawo! Wszystkie pary odnalezione 🎉</p>}
    </section>
  );
}
