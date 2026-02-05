import React, { useState, useContext, useEffect } from 'react';
import { 
  Home, LayoutGrid, Lightbulb, Fan, Settings, 
  Database, Github, Code, X, ChevronRight, 
  ArrowLeft, RefreshCw, Server 
} from 'lucide-react';
import { DeviceContext } from '../Contexts.jsx';

export default function TopBar({ activeTab, setActiveTab }) {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [currentView, setCurrentView] = useState('menu');
  const { systemStatus } = useContext(DeviceContext);

  const handleClose = () => {
    setIsSettingsOpen(false);
    setTimeout(() => setCurrentView('menu'), 300);
  };

  return (
    <div className="relative w-full max-w-[1400px] mx-auto px-4 pt-4">
      <div className="flex justify-between items-center bg-white/[0.03] backdrop-blur-2xl p-3 pl-6 rounded-[2.5rem] border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.3)]">
        
        <div className="flex items-center gap-4 shrink-0">
          <div className="p-2.5 bg-neutral-900 rounded-2xl text-cyan-400 border border-white/5 shadow-inner">
            <Home size={22} />
          </div>
          <div className="hidden lg:block">
            <h2 className="text-xs font-black tracking-[0.4em] uppercase text-white/90 leading-none mb-1">Monolith</h2>
            <p className="text-[9px] font-bold text-neutral-500 uppercase tracking-widest">Smart Home</p>
          </div>
        </div>

        <div className="flex bg-black/40 p-1.5 rounded-[1.5rem] border border-white/5 gap-1">
          <NavButton active={activeTab === 'all'} onClick={() => setActiveTab('all')} icon={<LayoutGrid size={18} />} label="All" />
          <NavButton active={activeTab === 'light'} onClick={() => setActiveTab('light')} icon={<Lightbulb size={18} />} label="Lights" />
          <NavButton active={activeTab === 'fan'} onClick={() => setActiveTab('fan')} icon={<Fan size={18} />} label="Fans" />
        </div>

        <div className="flex items-center gap-4 pr-2">
          <div className={`flex items-center gap-3 px-4 py-2 rounded-full border transition-all duration-500 ${
            systemStatus === 'online' ? 'bg-green-500/5 border-green-500/20' : 'bg-red-500/5 border-red-500/20'
          }`}>
            <span className={`h-2 w-2 rounded-full transition-shadow duration-500 ${
              systemStatus === 'online' ? 'bg-green-500 shadow-[0_0_10px_#22c55e] animate-pulse' : 'bg-red-500'
            }`}></span>
            <span className={`hidden sm:block text-[10px] font-black uppercase tracking-[0.2em] transition-colors duration-500 ${
              systemStatus === 'online' ? 'text-green-500' : 'text-red-500'
            }`}>
              {systemStatus}
            </span>
          </div>
          <button 
            onClick={() => setIsSettingsOpen(true)} 
            className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 text-neutral-400 hover:text-white hover:bg-white/10 active:scale-90 transition-all border border-white/5"
          >
            <Settings size={20} />
          </button>
        </div>
      </div>

      {isSettingsOpen && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 sm:p-6 transition-all">
          <div 
            className="absolute inset-0 bg-black/80 backdrop-blur-xl animate-in fade-in duration-500" 
            onClick={handleClose} 
          />
          
          <div className="relative bg-[#0d0d0d] border border-white/10 w-full max-w-2xl rounded-[3rem] p-8 shadow-2xl min-h-[550px] flex flex-col animate-in fade-in zoom-in-95 slide-in-from-bottom-8 duration-500">
            
            <div className="flex justify-between items-center mb-10">
              <div className="flex items-center gap-4">
                <div className="relative w-8 h-8 flex items-center justify-center">
                  {currentView !== 'menu' && (
                    <button 
                      onClick={() => setCurrentView('menu')} 
                      className="absolute inset-0 flex items-center justify-center bg-white/5 rounded-full text-neutral-400 hover:text-white transition-all animate-in fade-in zoom-in"
                    >
                      <ArrowLeft size={18} strokeWidth={3} />
                    </button>
                  )}
                </div>
                <h3 className="text-xs font-black tracking-[0.4em] uppercase text-white/60 transition-all">
                  {currentView === 'menu' ? 'System Settings' : currentView}
                </h3>
              </div>
              <button onClick={handleClose} className="p-2 hover:bg-white/5 rounded-full text-neutral-500 hover:text-white transition-all active:scale-90">
                <X size={24} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
              {currentView === 'menu' && (
                <div className="grid grid-cols-1 gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-both">
                  <MenuOption icon={<Database size={20}/>} label="System Logs" desc="View activity from ComponentLog" color="text-cyan-400" onClick={() => setCurrentView('database')} />
                  <MenuOption icon={<Github size={20}/>} label="Repository" desc="View project source code" color="text-white" onClick={() => setCurrentView('repo')} />
                  <MenuOption icon={<Code size={20}/>} label="Developers" desc="Project contributors" color="text-green-400" onClick={() => setCurrentView('devs')} />
                </div>
              )}

              {currentView === 'database' && <DatabaseTable />}

              {currentView === 'repo' && (
                 <div className="text-center space-y-6 py-10 animate-in fade-in zoom-in-95 duration-500">
                    <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mx-auto border border-white/5">
                        <Github size={48} className="text-white/40" />
                    </div>
                    <p className="text-neutral-400 text-sm max-w-xs mx-auto italic">Open-source smart home component logging system.</p>
                    <a href="https://github.com/gabbrealz/Arduino_DC_Motor" target="_blank" rel="noreferrer" className="inline-block px-8 py-4 bg-white text-black rounded-2xl font-black text-[10px] tracking-widest uppercase hover:scale-105 active:scale-95 transition-all shadow-xl">
                      Open GitHub
                    </a>
                 </div>
              )}

              {currentView === 'devs' && (
                <div className="space-y-3 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  {[
                    { name: "pOLyWh1rL", role: "Arduino", user: "pOLyWh1rL" },
                    { name: "LourdMarcus", role: "Arduino", user: "LourdMarcus" },
                    { name: "KareruRei", role: "Frontend", user: "KareruRei" },
                    { name: "gabbrealz", role: "Backend", user: "gabbrealz" }
                  ].map((dev, idx) => (
                    <div 
                      key={dev.user} 
                      style={{ animationDelay: `${idx * 50}ms` }}
                      className="flex items-center gap-4 p-4 bg-white/5 rounded-[1.5rem] border border-white/5 group hover:bg-white/[0.08] transition-all animate-in fade-in slide-in-from-right-4"
                    >
                      <img src={`https://github.com/${dev.user}.png`} alt={dev.name} className="w-12 h-12 rounded-full border border-white/10 group-hover:border-cyan-500/50 transition-colors" />
                      <div className="flex-1 text-left">
                        <p className="text-sm font-bold text-white tracking-tighter group-hover:text-cyan-400 transition-colors">{dev.name}</p>
                        <p className="text-[9px] font-black text-neutral-500 tracking-[0.2em] uppercase">{dev.role}</p>
                      </div>
                    </div>
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

function DatabaseTable() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const API_URL = `${import.meta.env.VITE_BACKEND_URL}/get-logs.php`;

  const fetchLogs = async () => {
    try {
      const res = await fetch(API_URL);
      if (!res.ok) throw new Error("Backend response error");
      const data = await res.json();
      setLogs(data);
    } catch (e) {
      console.error("DB Sync Failure:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
    const interval = setInterval(fetchLogs, 5000); 
    return () => clearInterval(interval);
  }, []);

  if (loading) return (
    <div className="flex flex-col items-center justify-center py-24 gap-4 animate-in fade-in duration-700">
      <RefreshCw size={32} className="animate-spin text-cyan-500" />
      <span className="text-[10px] font-black uppercase tracking-widest text-neutral-600 animate-pulse">Syncing with PHP Node...</span>
    </div>
  );

  return (
    <div className="animate-in fade-in zoom-in-95 duration-500 h-full flex flex-col">
      <div className="bg-white/[0.02] border border-white/5 rounded-[2rem] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/5 bg-white/[0.02] text-[10px] uppercase tracking-widest text-neutral-500 font-black">
                <th className="p-5">Log Time</th>
                <th className="p-5">Component</th>
                <th className="p-5">Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.02]">
              {logs.slice(0, 5).map((log, i) => (
                <tr key={i} className="hover:bg-white/[0.03] transition-colors group">
                  <td className="p-5 text-[10px] font-bold text-neutral-400 uppercase tracking-tighter">
                    {log.log_time}
                  </td>
                  <td className="p-5">
                    <span className="px-3 py-1 bg-black/40 rounded-lg font-black text-[10px] text-cyan-400 border border-white/5 uppercase tracking-widest group-hover:border-cyan-500/30 transition-colors">
                      {log.component}
                    </span>
                  </td>
                  <td className="p-5">
                    <div className="flex items-center gap-3 text-xs font-bold text-white/80 tracking-tight uppercase">
                      <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 shadow-[0_0_8px_rgba(6,182,212,0.4)]" />
                      {log.description}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="mt-6 flex items-center justify-between px-2 text-[9px] font-black uppercase tracking-widest text-neutral-600">
        <span className="flex items-center gap-2"><Server size={12}/> Primary SQL Node: 192.168.50.117</span>
        <button onClick={fetchLogs} className="text-cyan-500 hover:text-cyan-400 active:scale-95 transition-all">Force Refresh</button>
      </div>
    </div>
  );
}

function NavButton({ active, onClick, icon, label }) {
  return (
    <button onClick={onClick} className={`flex items-center gap-3 px-5 py-2.5 rounded-[1.2rem] transition-all duration-300 active:scale-95 ${
      active ? 'bg-neutral-800 text-cyan-400 shadow-xl border border-white/10' : 'text-neutral-500 hover:text-neutral-200'
    }`}>
      <span className={`transition-transform duration-300 ${active ? 'scale-110' : 'opacity-70'}`}>{icon}</span>
      <span className="hidden md:block text-[11px] font-black uppercase tracking-widest">{label}</span>
    </button>
  );
}

function MenuOption({ icon, label, desc, color, onClick }) {
  return (
    <button onClick={onClick} className="w-full flex items-center justify-between p-5 bg-white/[0.02] rounded-[2rem] border border-white/5 hover:bg-white/[0.05] hover:border-white/10 transition-all active:scale-[0.98] group text-left">
      <div className="flex items-center gap-5">
        <div className={`p-3 rounded-2xl bg-black/40 border border-white/5 ${color} group-hover:scale-110 transition-transform duration-300`}>{icon}</div>
        <div>
          <p className="text-xs font-black tracking-widest uppercase text-white/90 mb-0.5">{label}</p>
          <p className="text-[10px] font-medium text-neutral-500 uppercase tracking-tight">{desc}</p>
        </div>
      </div>
      <ChevronRight size={18} className="text-neutral-700 group-hover:text-white group-hover:translate-x-1 transition-all" />
    </button>
  );
}