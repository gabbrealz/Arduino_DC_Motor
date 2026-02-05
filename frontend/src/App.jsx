import React, { useState, useContext } from "react";
import TopBar from "./components/Topbar.jsx";
import LightCard from "./components/LightCard.jsx";
import FanCard from "./components/FanCard.jsx";
import ContextProvider, { DeviceContext } from "./Contexts.jsx";

export default function App() {
  return (
    <ContextProvider>
      <InnerApp />
    </ContextProvider>
  );
}

function InnerApp() {
  const [activeTab, setActiveTab] = useState("all");
  const { devices } = useContext(DeviceContext);

  const lightColors = {
    red: "#F40000",
    yellow1: "#FEEF4C",
    green1: "#72BF00",
    yellow2: "#FEEF4C",
    green2: "#72BF00",
  };

  const devicesArray = [
    { id: "RED", name: "Red", type: "light", color: lightColors.red },
    { id: "YELLOW1", name: "Yellow 1", type: "light", color: lightColors.yellow1 },
    { id: "GREEN1", name: "Green 1", type: "light", color: lightColors.green1 },
    { id: "YELLOW2", name: "Yellow 2", type: "light", color: lightColors.yellow2 },
    { id: "GREEN2", name: "Green 2", type: "light", color: lightColors.green2 },
    { id: "FAN", name: "Fan", type: "fan", color: "#06b6d4" },
  ];

  const filteredDevices = devicesArray.filter(
    (d) => activeTab === "all" || d.type === activeTab
  );

  return (
    <div className="min-h-screen bg-neutral-950 bg-[radial-gradient(circle_at_50%_20%,rgba(40,40,40,1)_0%,rgba(10,10,10,1)_100%)] text-white font-sans antialiased">
      <div className="max-w-[1400px] mx-auto px-8 py-12 space-y-16">
        <TopBar activeTab={activeTab} setActiveTab={setActiveTab} />

        <div className="flex flex-wrap justify-center gap-x-12 gap-y-16 transition-all duration-500">
          {filteredDevices.map((device) =>
            device.type === "light" ? (
              <LightCard
                key={device.id}
                name={device.id}
                accentColor={device.color}
              />
            ) : (
              <FanCard
                key={device.id}
                name={device.id}
                accentColor={device.color}
              />
            )
          )}
        </div>
      </div>
    </div>
  );
}