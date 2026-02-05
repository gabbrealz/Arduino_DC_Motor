import React, { useState } from "react";
import TopBar from "./components/Topbar.jsx";
import LightCard from "./components/LightCard.jsx";
import FanCard from "./components/FanCard.jsx";

export default function App() {
  const [activeTab, setActiveTab] = useState('all');

  const devices = [
    { id: 1, name: "Red", type: "light", color: "#F40000" }, 
    { id: 2, name: "Yellow", type: "light", color: "#FEEF4C" },    
    { id: 3, name: "Green", type: "light", color: "#72BF00" }, 
    { id: 4, name: "Fan", type: "fan", color: "#FF6EB6" },      
    { id: 5, name: "Orange", type: "light", color: "#FF6308" }, 
    { id: 6, name: "Blue", type: "light", color: "#00A3F5" }, 
  ];

  const filteredDevices = devices.filter(
    device => activeTab === 'all' || device.type === activeTab
  );

  return (
    <div className="min-h-screen bg-neutral-950 bg-[radial-gradient(circle_at_50%_20%,rgba(40,40,40,1)_0%,rgba(10,10,10,1)_100%)] text-white font-sans antialiased">
      
      <div className="max-w-[1400px] mx-auto px-8 py-12 space-y-16">
        <TopBar activeTab={activeTab} setActiveTab={setActiveTab} />
        <div className="flex flex-wrap justify-center gap-x-12 gap-y-16 transition-all duration-500">
          {filteredDevices.map(device => (
            <div 
              key={device.id} 
              className="animate-in fade-in zoom-in duration-300 flex justify-center"
            >
              {device.type === 'light' ? (
                <LightCard 
                  name={device.name} 
                  accentColor={device.color} 
                />
              ) : (
                <FanCard 
                  name={device.name} 
                  accentColor={device.color} 
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}