import React, { useState } from 'react';
import { Fan, Power, Activity } from 'lucide-react';

export default function FanCard({ name = "Fan", accentColor = "#06b6d4" }) {
  const [on, setOn] = useState(false);
  const [speed, setSpeed] = useState(40);

  const rotationDuration = on ? `${(100 - speed) / 40 + 0.2}s` : '0s';
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (speed / 100) * circumference;

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
              <Fan 
                size={24} 
                strokeWidth={2.5} 
                className={on ? "animate-spin" : ""} 
                style={{ animationDuration: rotationDuration }} 
              />
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
              <Activity size={18} />
              <span className="text-[10px] uppercase tracking-[0.2em] font-black">Velocity</span>
            </div>
            <span style={{ color: on ? accentColor : '#737373' }} className="text-lg font-bold tabular-nums">
              {speed}%
            </span>
          </div>
          
          <input
            type="range"
            min="0"
            max="100"
            value={speed}
            onChange={(e) => setSpeed(Number(e.target.value))}
            disabled={!on}
            style={{ accentColor: on ? accentColor : '#525252' }}
            className="w-full h-2 bg-neutral-800 rounded-full appearance-none cursor-pointer"
          />
        </div>

        <div className="relative h-40 flex items-center justify-center pt-2">
          <div className="relative w-full h-full bg-black/20 rounded-[2rem] border border-white/5 flex items-center justify-center overflow-hidden">
            <svg className="absolute transform -rotate-90 w-32 h-32">
              <circle cx="64" cy="64" r={radius} stroke="#262626" strokeWidth="6" fill="transparent" />
              <circle
                cx="64"
                cy="64"
                r={radius}
                stroke={on ? accentColor : '#262626'}
                strokeWidth="7"
                strokeDasharray={circumference}
                style={{ 
                  strokeDashoffset: on ? offset : circumference, 
                  transition: 'stroke-dashoffset 0.5s ease-out' 
                }}
                strokeLinecap="round"
                fill="transparent"
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