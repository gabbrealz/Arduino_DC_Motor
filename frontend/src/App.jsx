import React, { useState } from "react";
import TopBar from "./components/TopBar";
import LightCard from "./components/LightCard";
import FanCard from "./components/FanCard";

export default function App() {
  const [activeTab, setActiveTab] = useState('all');

  return (
    <div className="min-h-screen bg-neutral-950 bg-[radial-gradient(circle_at_50%_20%,rgba(40,40,40,1)_0%,rgba(10,10,10,1)_100%)] text-white font-sans antialiased">
      
      <div className="max-w-5xl mx-auto px-6 py-10 space-y-12">
        {/* Navigation is now inside the TopBar */}
        <TopBar activeTab={activeTab} setActiveTab={setActiveTab} />

        <div className="flex flex-wrap justify-center gap-10 transition-all duration-500">
          {(activeTab === 'all' || activeTab === 'light') && (
            <div className="animate-in fade-in zoom-in duration-300">
              <LightCard />
            </div>
          )}
          {(activeTab === 'all' || activeTab === 'fan') && (
            <div className="animate-in fade-in zoom-in duration-300">
              <FanCard />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}