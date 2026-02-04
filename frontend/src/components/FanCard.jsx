import React, { useState } from 'react';
import { Fan, Power, Activity } from 'lucide-react';

export default function FanCard() {
  const [on, setOn] = useState(false);
  const [speed, setSpeed] = useState(40);

  const rotationDuration = on ? `${(100 - speed) / 40 + 0.2}s` : '0s';
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (speed / 100) * circumference;

  return (
    <div className="font-sans">
      <div className="bg-[#1a1a1a] text-white rounded-[2.5rem] p-8 w-80 h-[420px] flex flex-col justify-between shadow-2xl border border-white/5">
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className={`p-3 rounded-full border-2 transition-all duration-500 ${
              on ? 'border-cyan-500 text-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.3)]' : 'border-neutral-700 text-neutral-600'
            }`}>
              <Fan size={24} strokeWidth={2.5} className={on ? "animate-spin" : ""} style={{ animationDuration: rotationDuration }} />
            </div>
            <span className="text-xl font-bold tracking-tight">Ceiling Fan</span>
          </div>
          
          <button
            onClick={() => setOn(!on)}
            className={`p-3 rounded-full transition-all duration-500 active:scale-95 ${
              on ? "bg-cyan-500 text-black scale-110 shadow-lg" : "bg-neutral-800 text-neutral-500"
            }`}
          >
            <Power size={20} />
          </button>
        </div>

        <div className={`space-y-6 transition-all duration-500 ${on ? "opacity-100" : "opacity-30"}`}>
          <div className="flex justify-between items-center px-1">
            <div className="flex items-center gap-2 text-neutral-500">
              <Activity size={18} />
              <span className="text-[10px] uppercase tracking-[0.2em] font-black">Velocity</span>
            </div>
            <span className="text-lg font-bold tabular-nums text-cyan-400">{speed}%</span>
          </div>
          
          <input
            type="range"
            min="0"
            max="100"
            value={speed}
            onChange={(e) => setSpeed(Number(e.target.value))}
            disabled={!on}
            className="w-full h-2 bg-neutral-800 rounded-full appearance-none cursor-pointer accent-cyan-500"
          />
        </div>

        <div className="relative h-40 flex items-center justify-center pt-2">
          <div className="relative w-full h-full bg-black/20 rounded-[2rem] border border-white/5 flex items-center justify-center overflow-hidden">
            <svg className="absolute transform -rotate-90 w-32 h-32">
              <circle cx="64" cy="64" r={radius} stroke="currentColor" strokeWidth="6" fill="transparent" className="text-neutral-800" />
              <circle
                cx="64"
                cy="64"
                r={radius}
                stroke="currentColor"
                strokeWidth="7"
                strokeDasharray={circumference}
                style={{ strokeDashoffset: on ? offset : circumference, transition: 'stroke-dashoffset 0.5s ease-out' }}
                strokeLinecap="round"
                fill="transparent"
                className="text-cyan-500"
              />
            </svg>
            <div className="text-center z-10">
              <span className={`block text-3xl font-black tracking-tighter ${on ? 'text-white' : 'text-neutral-700'}`}>
                {on ? speed : '--'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}