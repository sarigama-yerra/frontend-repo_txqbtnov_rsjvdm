import React, { useEffect, useRef, useState } from 'react';

export default function TraceCanvas({ onStroke }){
  const canvasRef = useRef(null);
  const [drawing, setDrawing] = useState(false);
  const [strokes, setStrokes] = useState([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    const size = 280; // 3x3 grid square-ish
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    canvas.style.width = size + 'px';
    canvas.style.height = size + 'px';
    ctx.scale(dpr, dpr);

    // grid
    ctx.clearRect(0,0,size,size);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0,0,size,size);
    ctx.strokeStyle = '#e5e7eb';
    ctx.lineWidth = 1;
    for (let i = 1; i < 3; i++){
      const p = (size/3)*i;
      ctx.beginPath(); ctx.moveTo(p,0); ctx.lineTo(p,size); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(0,p); ctx.lineTo(size,p); ctx.stroke();
    }

    // draw strokes
    ctx.strokeStyle = '#111827';
    ctx.lineWidth = 4;
    ctx.lineCap = 'round';
    strokes.forEach(path => {
      ctx.beginPath();
      path.forEach(([x,y], idx) => {
        if (idx === 0) ctx.moveTo(x,y); else ctx.lineTo(x,y);
      });
      ctx.stroke();
    });
  }, [strokes]);

  function getPos(e){
    const rect = canvasRef.current.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return [clientX - rect.left, clientY - rect.top];
  }

  function start(e){
    setDrawing(true);
    const [x,y] = getPos(e);
    setStrokes(s => [...s, [[x,y]]]);
  }

  function move(e){
    if (!drawing) return;
    const [x,y] = getPos(e);
    setStrokes(s => {
      const copy = s.slice();
      copy[copy.length-1] = [...copy[copy.length-1], [x,y]];
      return copy;
    });
  }

  function end(){
    setDrawing(false);
    onStroke?.(strokes);
  }

  function clear(){ setStrokes([]); }

  return (
    <div className="flex flex-col items-center gap-2">
      <canvas
        ref={canvasRef}
        className="rounded-lg border border-gray-200 touch-none select-none bg-white"
        onMouseDown={start}
        onMouseMove={move}
        onMouseUp={end}
        onMouseLeave={end}
        onTouchStart={start}
        onTouchMove={move}
        onTouchEnd={end}
      />
      <button onClick={clear} className="text-sm text-gray-600 hover:text-gray-900 underline">Bersihkan</button>
    </div>
  );
}
