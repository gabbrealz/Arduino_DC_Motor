import React, { useState } from 'react';
import { Lightbulb, Power, Sun } from 'lucide-react';

export default function LightCard() {
  const [on, setOn] = useState(true);
  const [brightness, setBrightness] = useState(90);

  const glowOpacity = on ? brightness / 100 : 0;
  const spread = on ? (brightness / 1.5) : 0;
  const colorIntensity = on ? Math.floor(200 + (brightness * 0.55)) : 38;

  return (
    <div className="font-sans">
      <div className="bg-[#1a1a1a] text-white rounded-[2.5rem] p-8 w-80 h-[420px] flex flex-col justify-between shadow-2xl border border-white/5">
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className={`p-3 rounded-full border-2 transition-all duration-500 ${
              on ? 'border-yellow-500 text-yellow-500 shadow-[0_0_15px_rgba(234,179,8,0.3)]' : 'border-neutral-700 text-neutral-600'
            }`}>
              <Lightbulb size={24} strokeWidth={2.5} />
            </div>
            <span className="text-xl font-bold tracking-tight">Living Room</span>
          </div>
          
          <button
            onClick={() => setOn(!on)}
            className={`p-3 rounded-full transition-all duration-500 active:scale-95 ${
              on ? "bg-yellow-500 text-black scale-110 shadow-lg" : "bg-neutral-800 text-neutral-500"
            }`}
          >
            <Power size={20} />
          </button>
        </div>

        <div className={`space-y-6 transition-all duration-500 ${on ? "opacity-100" : "opacity-30"}`}>
          <div className="flex justify-between items-center px-1">
            <div className="flex items-center gap-2 text-neutral-500">
              <Sun size={18} />
              <span className="text-[10px] uppercase tracking-[0.2em] font-black">Intensity</span>
            </div>
            <span className="text-lg font-bold tabular-nums text-yellow-500">{brightness}%</span>
          </div>
          
          <input
            type="range"
            min="0"
            max="100"
            value={brightness}
            onChange={(e) => setBrightness(Number(e.target.value))}
            disabled={!on}
            className="w-full h-2 bg-neutral-800 rounded-full appearance-none cursor-pointer accent-yellow-500"
          />
        </div>
=
        <div className="relative h-40 flex items-center justify-center pt-2">
          <div
            className="w-full h-full rounded-[2rem] transition-all duration-150 ease-out border border-white/10"
            style={{
              backgroundColor: on ? `rgb(${colorIntensity}, ${colorIntensity - 20}, ${colorIntensity - 100})` : '#262626',
              boxShadow: on ? `0 0 ${spread}px rgba(253, 224, 71, ${glowOpacity * 0.4})` : 'none',
              background: on 
                ? `linear-gradient(135deg, rgba(255,255,255,${0.2 + glowOpacity * 0.3}) 0%, rgba(253,224,71,1) 100%)`
                : '#262626'
            }}
          />
          {on && (
            <div 
              className="absolute inset-0 blur-3xl rounded-[2rem] -z-10 opacity-30"
              style={{ backgroundColor: '#fde047', transform: `scale(${1 + brightness / 200})` }}
            />
          )}
        </div>
      </div>
    </div>
  );
}