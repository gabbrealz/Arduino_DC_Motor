import React, { useState } from 'react';
import { Fan, Power, Activity, RefreshCw } from 'lucide-react';

export default function FanCard({ name = "Fan", accentColor = "#06b6d4" }) {
  const [on, setOn] = useState(false);
  const [speed, setSpeed] = useState(33);
  const [swing, setSwing] = useState(false);

  const speeds = [
    { label: '1', value: 33 },
    { label: '2', value: 66 },
    { label: '3', value: 100 },
  ];

  const rotationDuration = on ? `${(120 - speed) / 40 + 0.2}s` : '0s';
  const radius = 38;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (speed / 100) * circumference;

  return (
    <div className="font-sans shrink-0">
      <div className="bg-[#1a1a1a] text-white rounded-[2.5rem] p-7 w-80 h-[420px] flex flex-col justify-between shadow-2xl border border-white/5">
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

        <div className={`space-y-4 transition-all duration-500 ${on ? "opacity-100" : "opacity-30"}`}>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-neutral-500 px-1">
              <Activity size={16} />
              <span className="text-[10px] uppercase tracking-[0.2em] font-black">Speed</span>
            </div>
            <div className="flex gap-2">
              {speeds.map((s) => (
                <button
                  key={s.label}
                  disabled={!on}
                  onClick={() => setSpeed(s.value)}
                  className="flex-1 py-2.5 rounded-xl font-bold transition-all duration-300 border border-white/5"
                  style={{
                    backgroundColor: on && speed === s.value ? accentColor : '#262626',
                    color: on && speed === s.value ? 'black' : '#737373',
                  }}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          <button
            disabled={!on}
            onClick={() => setSwing(!swing)}
            className="w-full py-3 rounded-xl flex items-center justify-between px-4 transition-all border border-white/5 bg-[#262626]"
            style={{ 
              borderColor: swing && on ? accentColor : 'transparent'
            }}
          >
            <div className="flex items-center gap-3">
              <RefreshCw size={18} style={{ color: swing && on ? accentColor : '#737373' }} />
              <span className="font-semibold" style={{ color: swing && on ? 'white' : '#737373' }}>Swing</span>
            </div>
            <div 
              className="w-10 h-5 rounded-full relative transition-colors duration-300 flex items-center px-1"
              style={{ backgroundColor: swing && on ? accentColor : '#404040' }}
            >
              <div 
                className={`w-3 h-3 bg-white rounded-full transition-transform duration-300 ${swing ? 'translate-x-5' : 'translate-x-0'}`}
              />
            </div>
          </button>
        </div>

        <div className="relative h-32 flex items-center justify-center">
          <div className="relative w-full h-full bg-black/20 rounded-[2rem] border border-white/5 flex items-center justify-center overflow-hidden">
            <svg className="absolute transform -rotate-90 w-24 h-24">
              <circle cx="48" cy="48" r={radius} stroke="#262626" strokeWidth="6" fill="transparent" />
              <circle
                cx="48"
                cy="48"
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
                {on ? (speed === 33 ? '1' : speed === 66 ? '2' : '3') : '--'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}