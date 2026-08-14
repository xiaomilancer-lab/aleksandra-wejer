"use client";

import Image from "next/image";
import { Eraser, Palette, Pause, Play, Puzzle as PuzzleIcon, RefreshCw, Sparkles } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const colors = ["#2D4739", "#E85D75", "#F2B134", "#4C8BF5", "#7B61A8", "#42A66C"];
const memorySymbols = [
  { key: "macha", label: "PsychOLKA macha", src: "/psycholka/greeting/1_greeting_macha.png" },
  { key: "mis", label: "PsychOLKA z misiem", src: "/psycholka/children/10_children_mis.png" },
  { key: "kawa", label: "PsychOLKA z kubkiem", src: "/psycholka/lifestyle/4_coffee_kubek.png" },
  { key: "kalendarz", label: "PsychOLKA z kalendarzem", src: "/psycholka/booking/3_booking_kalendarz.png" },
  { key: "konfetti", label: "PsychOLKA świętuje", src: "/psycholka/emotions/5_success_konfetti.png" },
  { key: "pomysl", label: "PsychOLKA ma pomysł", src: "/psycholka/ideas/15_idea_pomysl.png" },
] as const;

const puzzleScenes = [
  { label: "Machająca", src: "/psycholka/greeting/1_greeting_macha.png" },
  { label: "Z misiem", src: "/psycholka/children/10_children_mis.png" },
  { label: "Konfetti", src: "/psycholka/emotions/5_success_konfetti.png" },
] as const;

export default function BabyroomActivities() {
  return (
    <div className="space-y-5">
      <DrawingBoard />
      <div className="grid gap-5 lg:grid-cols-2">
        <BreathingBubble />
        <MemoryGame />
      </div>
      <PsycholkaPuzzle />
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

function createMemoryDeck() {
  return [...memorySymbols, ...memorySymbols].map((symbol, index) => ({
    id: `${symbol.key}-${index}`,
    symbol,
  }));
}

function shuffledCards() {
  const deck = createMemoryDeck();
  for (let index = deck.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [deck[index], deck[randomIndex]] = [deck[randomIndex], deck[index]];
  }
  return deck;
}

function MemoryGame() {
  const [cards, setCards] = useState(() => createMemoryDeck());
  const [open, setOpen] = useState<number[]>([]);
  const [matched, setMatched] = useState<string[]>([]);
  const locked = open.length === 2;

  useEffect(() => {
    if (open.length !== 2) return;
    const [first, second] = open;
    if (cards[first].symbol.key === cards[second].symbol.key) {
      const timer = window.setTimeout(() => {
        setMatched((items) => [...items, cards[first].symbol.key]);
        setOpen([]);
      }, 450);
      return () => window.clearTimeout(timer);
    }
    const timer = window.setTimeout(() => setOpen([]), 800);
    return () => window.clearTimeout(timer);
  }, [cards, open]);

  function choose(index: number) {
    if (locked || open.includes(index) || matched.includes(cards[index].symbol.key)) return;
    setOpen((items) => [...items, index]);
  }

  function reset() {
    setCards(shuffledCards());
    setOpen([]);
    setMatched([]);
  }

  return (
    <section className="rounded-3xl border border-[#E5E1D8] bg-white p-6 shadow-sm">
      <div className="flex items-start justify-between gap-3"><div><p className="text-sm text-gray-500">Znajdź dwie takie same PsychOLKI</p><h2 className="text-2xl font-bold">Memory PsychOLKI</h2></div><button type="button" onClick={reset} className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-[#D8DDD4] px-3 py-2 font-semibold"><RefreshCw size={17} aria-hidden="true" />Pomieszaj</button></div>
      <div className="mt-5 grid grid-cols-4 gap-2 sm:gap-3">
        {cards.map((card, index) => {
          const visible = open.includes(index) || matched.includes(card.symbol.key);
          return (
            <button
              key={card.id}
              type="button"
              onClick={() => choose(index)}
              aria-label={visible ? card.symbol.label : "Zakryta karta"}
              className={`relative aspect-square overflow-hidden rounded-2xl border transition ${visible ? "border-[#CBD3C6] bg-[#EEF1EB]" : "border-[#E5E1D8] bg-[#F8F5F0] hover:bg-[#EFEAE2]"}`}
            >
              {visible ? (
                <Image
                  src={card.symbol.src}
                  alt=""
                  width={160}
                  height={160}
                  className="h-full w-full object-contain p-1 sm:p-2"
                />
              ) : (
                <span className="text-2xl font-bold text-[#6D7A62] sm:text-3xl">?</span>
              )}
            </button>
          );
        })}
      </div>
      <p className="mt-4 flex items-center gap-2 text-sm font-semibold text-[#6D7A62]"><Sparkles size={17} aria-hidden="true" />Znalezione pary: {matched.length} / {memorySymbols.length}</p>
      {matched.length === memorySymbols.length && <p className="mt-3 rounded-xl bg-[#FFF9EE] p-3 text-center font-bold">Brawo! Wszystkie PsychOLKI odnalezione 🎉</p>}
    </section>
  );
}

type PuzzleTile = number | null;

const solvedPuzzle: PuzzleTile[] = [0, 1, 2, 3, 4, 5, 6, 7, null];

function adjacentIndexes(index: number) {
  const row = Math.floor(index / 3);
  const column = index % 3;
  const neighbors: number[] = [];
  if (row > 0) neighbors.push(index - 3);
  if (row < 2) neighbors.push(index + 3);
  if (column > 0) neighbors.push(index - 1);
  if (column < 2) neighbors.push(index + 1);
  return neighbors;
}

function shuffledPuzzle() {
  const tiles = [...solvedPuzzle];
  let blankIndex = 8;
  let previousBlank = -1;

  for (let step = 0; step < 120; step += 1) {
    const choices = adjacentIndexes(blankIndex).filter((index) => index !== previousBlank);
    const chosen = choices[Math.floor(Math.random() * choices.length)];
    tiles[blankIndex] = tiles[chosen];
    tiles[chosen] = null;
    previousBlank = blankIndex;
    blankIndex = chosen;
  }

  if (isPuzzleSolved(tiles)) {
    const chosen = adjacentIndexes(blankIndex)[0];
    tiles[blankIndex] = tiles[chosen];
    tiles[chosen] = null;
  }

  return tiles;
}

function isPuzzleSolved(tiles: PuzzleTile[]) {
  return tiles.every((tile, index) => tile === solvedPuzzle[index]);
}

function PsycholkaPuzzle() {
  const [sceneIndex, setSceneIndex] = useState(0);
  const [tiles, setTiles] = useState<PuzzleTile[]>(solvedPuzzle);
  const [moves, setMoves] = useState(0);
  const [started, setStarted] = useState(false);
  const scene = puzzleScenes[sceneIndex];
  const complete = started && isPuzzleSolved(tiles);

  function shuffle() {
    setTiles(shuffledPuzzle());
    setMoves(0);
    setStarted(true);
  }

  function chooseTile(index: number) {
    const blankIndex = tiles.indexOf(null);
    if (!adjacentIndexes(blankIndex).includes(index) || tiles[index] === null) return;

    setTiles((current) => {
      const next = [...current];
      next[blankIndex] = next[index];
      next[index] = null;
      return next;
    });
    setMoves((value) => value + 1);
    setStarted(true);
  }

  function chooseScene(index: number) {
    setSceneIndex(index);
    setTiles(solvedPuzzle);
    setMoves(0);
    setStarted(false);
  }

  return (
    <section className="rounded-3xl border border-[#E5E1D8] bg-white p-5 shadow-sm sm:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-sm text-gray-500">Przesuwaj kafelki obok pustego pola</p>
          <h2 className="mt-1 flex items-center gap-2 text-2xl font-bold">
            <PuzzleIcon className="text-[#6D7A62]" size={24} aria-hidden="true" />
            Puzzle PsychOLKI 3 × 3
          </h2>
        </div>
        <button type="button" onClick={shuffle} className="inline-flex min-h-11 w-fit items-center gap-2 rounded-xl bg-[#6D7A62] px-4 py-2.5 font-semibold text-white hover:bg-[#58644F]">
          <RefreshCw size={17} aria-hidden="true" />
          Pomieszaj
        </button>
      </div>

      <div className="mt-5 flex flex-wrap gap-2" aria-label="Wybierz obrazek układanki">
        {puzzleScenes.map((option, index) => (
          <button
            key={option.src}
            type="button"
            onClick={() => chooseScene(index)}
            aria-pressed={sceneIndex === index}
            className={`min-h-11 rounded-xl border px-4 py-2 text-sm font-semibold ${
              sceneIndex === index
                ? "border-[#6D7A62] bg-[#EEF1EB] text-[#2D4739]"
                : "border-[#D8DDD4] bg-white text-gray-600"
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>

      <div className="mx-auto mt-6 grid max-w-xl grid-cols-3 gap-1.5 rounded-2xl bg-[#E7E2D9] p-1.5 sm:gap-2 sm:p-2">
        {tiles.map((tile, index) => {
          if (tile === null) {
            return <div key="blank" className="aspect-square rounded-xl bg-[#F8F5F0]" aria-label="Puste pole" />;
          }

          const sourceRow = Math.floor(tile / 3);
          const sourceColumn = tile % 3;
          return (
            <button
              key={tile}
              type="button"
              onClick={() => chooseTile(index)}
              aria-label={`Przesuń fragment ${tile + 1}`}
              className="aspect-square rounded-xl border border-white/80 bg-[#FFFDF9] bg-no-repeat shadow-sm transition hover:brightness-105 focus:outline-none focus:ring-4 focus:ring-[#AFC0AA]"
              style={{
                backgroundImage: `url(${scene.src})`,
                backgroundPosition: `${sourceColumn * 50}% ${sourceRow * 50}%`,
                backgroundSize: "300% 300%",
              }}
            >
              <span className="float-right m-1.5 flex h-7 w-7 items-center justify-center rounded-full bg-white/85 text-xs font-bold text-[#49604F] shadow-sm sm:m-2">
                {tile + 1}
              </span>
            </button>
          );
        })}
      </div>

      <div className="mx-auto mt-4 flex max-w-xl items-center justify-between gap-3 text-sm font-semibold text-[#6D7A62]">
        <span>Ruchy: {moves}</span>
        {!started && <span>Naciśnij „Pomieszaj”, żeby zacząć.</span>}
      </div>
      {complete && (
        <p className="mx-auto mt-4 max-w-xl rounded-xl bg-[#FFF9EE] p-3 text-center font-bold">
          Ułożone! PsychOLKA wróciła na swoje miejsce 🌸
        </p>
      )}
    </section>
  );
}
