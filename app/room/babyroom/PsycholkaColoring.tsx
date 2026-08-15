"use client";

import Image from "next/image";
import { Download, Eraser, Paintbrush, RefreshCw } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const lineArtPath = "/psycholka/coloring/psycholka-waving-line-art.png";
const coloringColors = ["#E85D75", "#F2B134", "#4C8BF5", "#7B61A8", "#42A66C", "#F08A5D", "#2D4739"];

export default function PsycholkaColoring() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawingRef = useRef(false);
  const [color, setColor] = useState(coloringColors[0]);
  const [lineWidth, setLineWidth] = useState(18);
  const [eraser, setEraser] = useState(false);

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
    context.globalCompositeOperation = eraser ? "destination-out" : "source-over";
    context.strokeStyle = color;
    context.lineWidth = eraser ? lineWidth * 1.8 : lineWidth;
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
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-sm text-gray-500">Malowanie palcem albo myszką</p>
          <h2 className="mt-1 text-2xl font-bold">Kolorowanka PsychOLKI</h2>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-gray-600">Kolory trafiają pod czarny kontur, więc PsychOLKA cały czas pozostaje wyraźna.</p>
        </div>
        <a href={lineArtPath} download className="inline-flex min-h-11 w-fit items-center gap-2 rounded-xl border border-[#D8DDD4] px-4 py-2 font-semibold hover:bg-[#F8F5F0]"><Download size={18} aria-hidden="true" />Pobierz pustą</a>
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-3" aria-label="Narzędzia kolorowanki">
        {coloringColors.map((item) => (
          <button
            key={item}
            type="button"
            aria-label={`Wybierz kolor ${item}`}
            aria-pressed={!eraser && color === item}
            onClick={() => { setColor(item); setEraser(false); }}
            className={`h-11 w-11 rounded-full border-4 ${!eraser && color === item ? "border-[#2D4739]" : "border-white"} shadow ring-1 ring-gray-200`}
            style={{ backgroundColor: item }}
          />
        ))}
        <button type="button" aria-pressed={eraser} onClick={() => setEraser((value) => !value)} className={`inline-flex min-h-11 items-center gap-2 rounded-xl border px-3 py-2 font-semibold ${eraser ? "border-[#6D7A62] bg-[#EEF1EB]" : "border-[#D8DDD4]"}`}><Eraser size={18} aria-hidden="true" />Gumka</button>
        <button type="button" onClick={clear} className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-[#D8DDD4] px-3 py-2 font-semibold"><RefreshCw size={18} aria-hidden="true" />Od nowa</button>
      </div>

      <label className="mt-4 block text-sm font-semibold"><span className="inline-flex items-center gap-2"><Paintbrush size={17} aria-hidden="true" />Grubość kredki</span><input type="range" min="7" max="42" value={lineWidth} onChange={(event) => setLineWidth(Number(event.target.value))} className="ml-3 w-40 align-middle accent-[#6D7A62]" /></label>

      <div className="relative mx-auto mt-5 aspect-[3/5] max-h-[740px] w-full max-w-[520px] overflow-hidden rounded-2xl border-2 border-dashed border-[#CBD3C6] bg-white">
        <canvas
          ref={canvasRef}
          onPointerDown={start}
          onPointerMove={draw}
          onPointerUp={() => { drawingRef.current = false; }}
          onPointerCancel={() => { drawingRef.current = false; }}
          className="absolute inset-0 z-10 h-full w-full touch-none"
          aria-label="Kolorowanka PsychOLKI do malowania palcem lub myszką"
        />
        <Image src={lineArtPath} alt="Kontur machającej PsychOLKI do kolorowania" fill sizes="(max-width: 640px) 92vw, 520px" className="pointer-events-none z-20 object-contain mix-blend-multiply" priority={false} />
      </div>
      <p className="mt-3 text-xs text-gray-500">Kolorowanie zostaje tylko na tym ekranie. Pusty kontur możesz też pobrać i wydrukować.</p>
    </section>
  );
}
