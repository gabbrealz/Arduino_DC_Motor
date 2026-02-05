import { useState, createContext } from "react";

export const WebSocketContext = createContext();
export const LogContext = createContext();

const ContextProvider = ({ children }) => {
  const [socket, setSocket] = useState(new WebSocket(import.meta.env.VITE_WEBSOCKET_URL));

  socket.onopen = () => {

  };
  socket.onmessage = () => {

  };
  socket.onclose = () => {

  };
  socket.onerror = () => {
    setTimeout(() => setSocket(new WebSocket(import.meta.env.VITE_WEBSOCKET_URL)), 3000);
  };


  const getLogs = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/get-logs.php`);
      if (!res.ok) return;

      const logs = await res.json();
      return logs;
    }
    catch(e){
      console.error("Failed to load logs:", e);
    }
  };

  return (
    <WebSocketContext.Provider value={socket}>
      <LogContext.Provider value={getLogs}>
        {children}
      </LogContext.Provider>
    </WebSocketContext.Provider>
  )
};

export default WebSocketProvider;