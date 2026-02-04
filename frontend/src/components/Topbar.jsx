import React, { useState } from 'react';
import { Home, LayoutGrid, Lightbulb, Fan, Settings, Database, Github, Code, X, ChevronRight, ArrowLeft } from 'lucide-react';

export default function TopBar({ activeTab, setActiveTab }) {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [currentView, setCurrentView] = useState('menu');

  const [systemStatus, setSystemStatus] = useState('online'); 

  const handleClose = () => {
    setIsSettingsOpen(false);
    setTimeout(() => setCurrentView('menu'), 300);
  };

  return (
    <div className="relative w-full">
      <div className="flex justify-between items-center bg-white/5 backdrop-blur-xl p-2 sm:p-3 pl-4 sm:pl-6 rounded-[2rem] sm:rounded-[2.5rem] border border-white/10 shadow-2xl">
        
        <div className="flex items-center gap-3 shrink-0">
          <div className="p-2 sm:p-2.5 bg-neutral-800 rounded-xl text-cyan-400 border border-white/5">
            <Home size={20} />
          </div>
          <h2 className="hidden sm:block text-sm font-black tracking-[0.3em] uppercase text-white/90 leading-none">
              Home
          </h2>
        </div>

        <div className="flex bg-black/20 p-1 rounded-2xl border border-white/5 mx-2">
          <NavButton active={activeTab === 'all'} onClick={() => setActiveTab('all')} icon={<LayoutGrid size={18} />} label="All" />
          <NavButton active={activeTab === 'light'} onClick={() => setActiveTab('light')} icon={<Lightbulb size={18} />} label="Lights" />
          <NavButton active={activeTab === 'fan'} onClick={() => setActiveTab('fan')} icon={<Fan size={18} />} label="Fans" />
        </div>

        <div className="flex items-center gap-2 sm:gap-4 pr-2 shrink-0">
          {/* Dynamic Status Pill */}
          <div className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full border transition-colors duration-500 ${
            systemStatus === 'online' 
              ? 'bg-green-500/10 border-green-500/20' 
              : 'bg-red-500/10 border-red-500/20'
          }`}>
            <span className={`h-1.5 w-1.5 rounded-full transition-colors duration-500 ${
              systemStatus === 'online' ? 'bg-green-500 animate-pulse' : 'bg-red-500'
            }`}></span>
            <span className={`hidden sm:block text-[10px] font-black uppercase tracking-widest transition-colors duration-500 ${
              systemStatus === 'online' ? 'text-green-500' : 'text-red-500'
            }`}>
              {systemStatus}
            </span>
          </div>

          <button onClick={() => setIsSettingsOpen(true)} className="text-neutral-500 hover:text-white transition-colors p-1">
            <Settings size={20} />
          </button>
        </div>
      </div>

      {isSettingsOpen && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={handleClose} />
          
          <div className="relative bg-[#1a1a1a] border border-white/10 w-full max-w-md rounded-[2.5rem] p-8 shadow-2xl min-h-[400px] flex flex-col transition-all duration-300">
            
            <div className="flex justify-between items-center mb-8">
              <div className="flex items-center gap-3">
                {currentView !== 'menu' && (
                  <button onClick={() => setCurrentView('menu')} className="text-neutral-500 hover:text-white transition-colors">
                    <ArrowLeft size={20} strokeWidth={3} />
                  </button>
                )}
                <h3 className="text-sm font-black tracking-[0.3em] uppercase text-white/90">
                  {currentView === 'menu' ? 'Settings' : currentView}
                </h3>
              </div>
              <button onClick={handleClose} className="text-neutral-500 hover:text-white"><X size={20} /></button>
            </div>

            <div className="flex-1 overflow-y-auto">
              {currentView === 'menu' && (
                <div className="space-y-3 animate-in fade-in slide-in-from-bottom-4 duration-300">
                  <MenuOption icon={<Database size={18}/>} label="Database" color="text-cyan-400" onClick={() => setCurrentView('database')} />
                  <MenuOption icon={<Github size={18}/>} label="Repository" color="text-white" onClick={() => setCurrentView('repo')} />
                  <MenuOption icon={<Code size={18}/>} label="Developers" color="text-green-400" onClick={() => setCurrentView('devs')} />
                </div>
              )}

              {currentView === 'database' && (
                <div className="space-y-6 animate-in fade-in zoom-in duration-300">
                  <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                    <p className="text-[10px] font-black uppercase tracking-widest text-neutral-500 mb-2">Primary Node</p>
                    <p className="text-sm font-bold text-white">Manny Pacquiao</p>
                  </div>
                  {/* Toggle button for demo purposes */}
                  <button 
                    onClick={() => setSystemStatus(systemStatus === 'online' ? 'offline' : 'online')}
                    className="text-[10px] font-black uppercase tracking-widest text-neutral-600 hover:text-white transition-colors"
                  >
                    Simulate {systemStatus === 'online' ? 'Downtime' : 'Connection'}
                  </button>
                </div>
              )}

              {currentView === 'repo' && (
                <div className="space-y-4 animate-in fade-in zoom-in duration-300 text-center">
                  <p className="text-neutral-400 text-sm leading-relaxed">Source code for the Smart Home System</p>
                  <a href="https://github.com/pOLyWh1rL" target="_blank" rel="noreferrer" className="block p-4 bg-white/5 rounded-2xl border border-white/5 font-black text-[10px] tracking-[0.2em] uppercase hover:bg-white/10 transition-all">
                     Open Github Repo
                  </a>
                </div>
              )}

              {currentView === 'devs' && (
                <div className="space-y-3 animate-in fade-in zoom-in duration-300">
                  {[
                    { name: "pOLyWh1rL", role: "Arduino", user: "pOLyWh1rL" },
                    { name: "LourdMarcus", role: "Arduino", user: "LourdMarcus" },
                    { name: "KareruRei", role: "Frontend", user: "KareruRei" },
                    { name: "gabbrealz", role: "Backend", user: "gabbrealz" }
                  ].map((dev) => (
                    <a key={dev.user} href={`https://github.com/${dev.user}`} target="_blank" rel="noreferrer" className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/5 hover:bg-white/10 transition-colors group">
                      <div className="w-10 h-10 rounded-full bg-neutral-800 border border-white/10 overflow-hidden shrink-0">
                        <img src={`https://github.com/${dev.user}.png`} alt={dev.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-bold text-white group-hover:text-cyan-400 transition-colors">{dev.name}</p>
                        <p className="text-[10px] font-black text-neutral-500 tracking-widest uppercase">{dev.role}</p>
                      </div>
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function MenuOption({ icon, label, color, onClick }) {
  return (
    <button onClick={onClick} className="w-full flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5 hover:bg-white/10 transition-all group">
      <div className="flex items-center gap-4">
        <span className={color}>{icon}</span>
        <span className="text-xs font-black tracking-widest uppercase text-white/80">{label}</span>
      </div>
      <ChevronRight size={16} className="text-neutral-600 group-hover:text-white transition-colors" />
    </button>
  );
}

function NavButton({ active, onClick, icon, label }) {
  return (
    <button onClick={onClick} className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl transition-all duration-300 ${active ? 'bg-neutral-800 text-cyan-400 shadow-lg scale-105' : 'text-neutral-500 hover:text-neutral-200'}`}>
      {icon}
      <span className="hidden md:block text-[11px] font-black uppercase tracking-wider">{label}</span>
    </button>
  );
}