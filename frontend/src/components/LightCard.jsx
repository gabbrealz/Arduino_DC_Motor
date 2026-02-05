import React, { useState } from 'react';
import { Lightbulb, Power, Sun } from 'lucide-react';

export default function LightCard({ name = "Room", accentColor = "#fde047" }) {
  const [on, setOn] = useState(false);
  const [brightness, setBrightness] = useState(0);

  const alphaHex = on ? Math.floor((brightness / 100) * 255).toString(16).padStart(2, '0') : "00";
  const spread = on ? (brightness / 1.5) : 0;

  return (
    <div className="font-sans shrink-0">
      <div className="bg-[#1a1a1a] text-white rounded-[2.5rem] p-8 w-80 h-[420px] flex flex-col justify-between shadow-2xl border border-white/5">
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div 
              style={{ 
                borderColor: on ? accentColor : '#3f3f46', 
                color: on ? accentColor : '#525252',
                boxShadow: on ? `0 0 15px ${accentColor}44` : 'none' 
              }}
              className="p-3 rounded-full border-2 transition-all duration-500"
            >
              <Lightbulb size={24} strokeWidth={2.5} />
            </div>
            <span className="text-xl font-bold tracking-tight">{name}</span>
          </div>
          
          <button
            onClick={() => setOn(!on)}
            style={{ 
              backgroundColor: on ? accentColor : '#262626',
              color: on ? 'black' : '#737373'
            }}
            className="p-3 rounded-full transition-all duration-500 active:scale-95 shadow-lg"
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
            <span style={{ color: on ? accentColor : '#737373' }} className="text-lg font-bold tabular-nums transition-colors">
              {brightness}%
            </span>
          </div>
          
          <input
            type="range"
            min="0"
            max="100"
            value={brightness}
            onChange={(e) => setBrightness(Number(e.target.value))}
            disabled={!on}
            style={{ accentColor: on ? accentColor : '#525252' }}
            className="w-full h-2 bg-neutral-800 rounded-full appearance-none cursor-pointer"
          />
        </div>

        <div className="relative h-40 flex items-center justify-center pt-2">
          <div
            className="w-full h-full rounded-[2rem] transition-all duration-150 ease-out border border-white/10"
            style={{
              backgroundColor: on ? `${accentColor}${alphaHex}` : '#262626',
              boxShadow: on ? `0 0 ${spread}px ${accentColor}${alphaHex}` : 'none'
            }}
          />
          
          {on && (
            <div 
              className="absolute inset-0 blur-3xl rounded-[2rem] -z-10 transition-all duration-150"
              style={{ 
                backgroundColor: accentColor, 
                opacity: (brightness / 100) * 0.3 
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}