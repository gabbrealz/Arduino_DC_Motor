import React, { useContext, useState, useEffect } from "react";
import { Fan, Power, Activity, RefreshCw } from "lucide-react";
import { DeviceContext } from "../Contexts.jsx";

export default function FanCard({ name = "Fan", accentColor = "#06b6d4" }) {
  const { devices, send, systemStatus } = useContext(DeviceContext);
  
  const fanContext = devices[name.toUpperCase()] || { on: false, speed: 50, swing: false };

  const [on, setOn] = useState(fanContext.on);
  const [speed, setSpeed] = useState(fanContext.speed);
  const [swing, setSwing] = useState(fanContext.swing);

  useEffect(() => {
    setOn(fanContext.on);
    setSpeed(fanContext.speed);
    setSwing(fanContext.swing);
  }, [fanContext.on, fanContext.speed, fanContext.swing]);

  const speedMapping = [
    { label: "1", value: 50 },
    { label: "2", value: 66 },
    { label: "3", value: 100 },
  ];

  const rotationDuration = on ? `${(120 - speed) / 40 + 0.2}s` : "0s";
  
  const radius = 38;
  const circumference = 2 * Math.PI * radius;
  
  const segmentLength = circumference / 3;
  const gap = 4; 
  const dashArray = `${segmentLength - gap} ${gap}`;

  const getActiveSegments = () => {
    if (!on) return 0;
    if (speed <= 50) return 1;
    if (speed <= 66) return 2;
    return 3;
  };

  const activeSegments = getActiveSegments();
  const strokeDashoffset = circumference - (activeSegments * segmentLength);

  const togglePower = () => {
    if (systemStatus !== "online") return;
    const newOn = !on;
    setOn(newOn);
    if (!newOn) {
      setSpeed(50); 
      setSwing(false);
      send({ component: name.toUpperCase(), value: 0 });
      send({ component: "SWING", value: 0 });
    } else {
      send({ component: name.toUpperCase(), value: speed });
    }
  };

  const changeSpeed = (newSpeed) => {
    if (systemStatus !== "online" || !on) return;
    setSpeed(newSpeed);
    send({ component: name.toUpperCase(), value: newSpeed });
  };

  const toggleSwing = () => {
    if (systemStatus !== "online" || !on) return;
    const newSwing = !swing;
    setSwing(newSwing);
    send({ component: "SWING", value: newSwing ? 1 : 0 });
  };

  return (
    <div className="font-sans shrink-0">
      <div className="bg-[#1a1a1a] text-white rounded-[2.5rem] p-7 w-80 h-[420px] flex flex-col justify-between shadow-2xl border border-white/5">
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div
              style={{
                borderColor: on ? accentColor : "#3f3f46",
                color: on ? accentColor : "#525252",
                boxShadow: on ? `0 0 15px ${accentColor}44` : "none",
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
            onClick={togglePower}
            disabled={systemStatus !== "online"}
            style={{
              backgroundColor: on ? accentColor : "#262626",
              color: on ? "black" : "#737373",
              cursor: systemStatus !== "online" ? "not-allowed" : "pointer",
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
              {speedMapping.map((s) => (
                <button
                  key={s.label}
                  disabled={!on || systemStatus !== "online"}
                  onClick={() => changeSpeed(s.value)}
                  className="flex-1 py-2.5 rounded-xl font-bold transition-all duration-300 border border-white/5"
                  style={{
                    backgroundColor: on && speed === s.value ? accentColor : "#262626",
                    color: on && speed === s.value ? "black" : "#737373",
                  }}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          <button
            disabled={!on || systemStatus !== "online"}
            onClick={toggleSwing}
            className="w-full py-3 rounded-xl flex items-center justify-between px-4 transition-all border border-white/5 bg-[#262626]"
            style={{ borderColor: swing && on ? accentColor : "transparent" }}
          >
            <div className="flex items-center gap-3">
              <RefreshCw size={18} className={swing && on ? "animate-reverse-spin" : ""} style={{ color: swing && on ? accentColor : "#737373" }} />
              <span className="font-semibold" style={{ color: swing && on ? "white" : "#737373" }}>Swing</span>
            </div>
            <div
              className="w-10 h-5 rounded-full relative transition-colors duration-300 flex items-center px-1"
              style={{ backgroundColor: swing && on ? accentColor : "#404040" }}
            >
              <div className={`w-3 h-3 bg-white rounded-full transition-transform duration-300 ${swing ? "translate-x-5" : "translate-x-0"}`} />
            </div>
          </button>
        </div>

        <div className="relative h-32 flex items-center justify-center">
          <div className="relative w-full h-full bg-black/20 rounded-[2rem] border border-white/5 flex items-center justify-center overflow-hidden">
            <svg className="absolute transform -rotate-90 w-24 h-24" viewBox="0 0 100 100">
              <circle
                cx="50" cy="50" r={radius}
                stroke="#262626" strokeWidth="8"
                fill="transparent"
                strokeDasharray={dashArray}
              />
              <circle
                cx="50" cy="50" r={radius}
                stroke={on ? accentColor : "#262626"}
                strokeWidth="8"
                fill="transparent"
                strokeDasharray={dashArray}
                style={{
                  strokeDashoffset: strokeDashoffset,
                  transition: "stroke-dashoffset 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
                }}
                strokeLinecap="round"
              />
            </svg>
            <div className="text-center z-10">
              <span className={`block text-3xl font-black tracking-tighter ${on ? "text-white" : "text-neutral-700"}`}>
                {on ? (speed === 50 ? "1" : speed === 66 ? "2" : "3") : "--"}
              </span>
              <span className="text-[8px] font-black uppercase text-neutral-500 tracking-[0.2em]">Level</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}