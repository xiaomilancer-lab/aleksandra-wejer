"use client";

import Image from "next/image";
import { Download, Eraser, Expand, Minimize2, Paintbrush, RefreshCw, Undo2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const coloringPages = [
  { path: "/psycholka/coloring/psycholka-waving-line-art.png", label: "Machająca PsychOLKA", alt: "Kontur machającej PsychOLKI do kolorowania" },
  { path: "/psycholka/coloring/psycholka-teddy-line-art.png", label: "PsychOLKA z misiem", alt: "Kontur PsychOLKI z misiem do kolorowania" },
  { path: "/psycholka/coloring/psycholka-idea-line-art.png", label: "Pomysłowa PsychOLKA", alt: "Kontur PsychOLKI z pomysłem do kolorowania" },
  { path: "/psycholka/coloring/psycholka-hearts-line-art.png", label: "Serca PsychOLKI", alt: "Kontur PsychOLKI z sercami do kolorowania" },
] as const;

const coloringColors = ["#E85D75", "#F2B134", "#4C8BF5", "#7B61A8", "#42A66C", "#F08A5D", "#2D4739"];
const maxHistory = 20;

export default function PsycholkaColoring() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawingRef = useRef(false);
  const historyRef = useRef<ImageData[]>([]);
  const [color, setColor] = useState(coloringColors[0]);
  const [lineWidth, setLineWidth] = useState(18);
  const [eraser, setEraser] = useState(false);
  const [pageIndex, setPageIndex] = useState(0);
  const [historySize, setHistorySize] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);
  const page = coloringPages[pageIndex];

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
  }, [isExpanded]);

  function saveHistory() {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return;
    historyRef.current = [...historyRef.current.slice(-(maxHistory - 1)), context.getImageData(0, 0, canvas.width, canvas.height)];
    setHistorySize(historyRef.current.length);
  }

  function point(event: React.PointerEvent<HTMLCanvasElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    return { x: event.clientX - rect.left, y: event.clientY - rect.top };
  }

  function start(event: React.PointerEvent<HTMLCanvasElement>) {
    saveHistory();
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
    context.globalCompositeOperation = eraser ? "destination-out" : "source-over";
    context.strokeStyle = color;
    context.lineWidth = eraser ? lineWidth * 1.8 : lineWidth;
    context.lineCap = "round";
    context.lineJoin = "round";
    context.lineTo(current.x, current.y);
    context.stroke();
  }

  function undo() {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    const previous = historyRef.current.pop();
    if (!canvas || !context || !previous) return;
    context.putImageData(previous, 0, 0);
    setHistorySize(historyRef.current.length);
  }

  function clear() {
    saveHistory();
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (canvas && context) context.clearRect(0, 0, canvas.width, canvas.height);
  }

  function selectPage(index: number) {
    if (index === pageIndex) return;
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (canvas && context) context.clearRect(0, 0, canvas.width, canvas.height);
    historyRef.current = [];
    setHistorySize(0);
    setPageIndex(index);
  }

  return (
    <section className="rounded-3xl border border-[#E5E1D8] bg-white p-5 shadow-sm sm:p-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-sm text-gray-500">Malowanie palcem albo myszką</p>
          <h2 className="mt-1 text-2xl font-bold">Kolorowanki PsychOLKI</h2>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-gray-600">Wybierz jedną z czterech kolorowanek. Kontur zostaje na wierzchu, a każdy ruch możesz cofnąć.</p>
        </div>
        <a href={page.path} download className="inline-flex min-h-11 w-fit items-center gap-2 rounded-xl border border-[#D8DDD4] px-4 py-2 font-semibold hover:bg-[#F8F5F0]"><Download size={18} aria-hidden="true" />Pobierz pustą</a>
      </div>
      <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4" aria-label="Wybierz kolorowankę">
        {coloringPages.map((item, index) => <button key={item.path} type="button" onClick={() => selectPage(index)} aria-pressed={index === pageIndex} className={`rounded-2xl border p-3 text-left text-sm font-semibold transition ${index === pageIndex ? "border-[#6D7A62] bg-[#EEF3EB] text-[#2D4739]" : "border-[#E5E1D8] bg-white hover:bg-[#F8F5F0]"}`}>{item.label}</button>)}
      </div>
      <div className="mt-5 flex flex-wrap items-center gap-3" aria-label="Narzędzia kolorowanki">
        {coloringColors.map((item) => <button key={item} type="button" aria-label={`Wybierz kolor ${item}`} aria-pressed={!eraser && color === item} onClick={() => { setColor(item); setEraser(false); }} className={`h-11 w-11 rounded-full border-4 ${!eraser && color === item ? "border-[#2D4739]" : "border-white"} shadow ring-1 ring-gray-200`} style={{ backgroundColor: item }} />)}
        <button type="button" aria-pressed={eraser} onClick={() => setEraser((value) => !value)} className={`inline-flex min-h-11 items-center gap-2 rounded-xl border px-3 py-2 font-semibold ${eraser ? "border-[#6D7A62] bg-[#EEF1EB]" : "border-[#D8DDD4]"}`}><Eraser size={18} aria-hidden="true" />Gumka</button>
        <button type="button" onClick={undo} disabled={historySize === 0} className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-[#D8DDD4] px-3 py-2 font-semibold disabled:cursor-not-allowed disabled:opacity-45"><Undo2 size={18} aria-hidden="true" />Cofnij ruch</button>
        <button type="button" onClick={clear} className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-[#D8DDD4] px-3 py-2 font-semibold"><RefreshCw size={18} aria-hidden="true" />Od nowa</button>
        <button type="button" onClick={() => setIsExpanded(true)} className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-[#D8DDD4] px-3 py-2 font-semibold"><Expand size={18} aria-hidden="true" />Pełny ekran</button>
      </div>
      <label className="mt-4 block text-sm font-semibold"><span className="inline-flex items-center gap-2"><Paintbrush size={17} aria-hidden="true" />Grubość kredki</span><input type="range" min="7" max="42" value={lineWidth} onChange={(event) => setLineWidth(Number(event.target.value))} className="ml-3 w-40 align-middle accent-[#6D7A62]" /></label>
      <div className={isExpanded ? "fixed inset-0 z-[200] flex items-center justify-center bg-[#F8F5F0] p-4 sm:p-8" : "relative mx-auto mt-5 aspect-[3/5] max-h-[740px] w-full max-w-[520px] overflow-hidden rounded-2xl border-2 border-dashed border-[#CBD3C6] bg-white"}>
        {isExpanded && <button type="button" onClick={() => setIsExpanded(false)} className="absolute right-4 top-4 z-30 inline-flex min-h-11 items-center gap-2 rounded-xl border border-[#D8DDD4] bg-white px-4 py-2 font-semibold shadow-sm"><Minimize2 size={18} aria-hidden="true" />Wróć</button>}
        {isExpanded && <p className="absolute left-4 top-5 z-30 text-sm font-semibold text-[#2D4739]">{page.label}</p>}
        <div className={isExpanded ? "relative aspect-[3/5] h-full max-h-[calc(100vh-2rem)] w-auto max-w-full overflow-hidden rounded-2xl border-2 border-dashed border-[#CBD3C6] bg-white" : "contents"}>
          <canvas ref={canvasRef} onPointerDown={start} onPointerMove={draw} onPointerUp={() => { drawingRef.current = false; }} onPointerCancel={() => { drawingRef.current = false; }} className="absolute inset-0 z-10 h-full w-full touch-none" aria-label="Kolorowanka PsychOLKI do malowania palcem lub myszką" />
          <Image src={page.path} alt={page.alt} fill sizes="(max-width: 640px) 92vw, 520px" className="pointer-events-none z-20 object-contain mix-blend-multiply" priority={false} />
        </div>
      </div>
      <p className="mt-3 text-xs text-gray-500">Kolorowanie zostaje tylko na tym ekranie. Pusty kontur możesz też pobrać i wydrukować.</p>
    </section>
  );
}
