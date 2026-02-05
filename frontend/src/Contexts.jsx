import { useState, createContext, useEffect } from "react";

export const WebSocketContext = createContext();
export const DeviceContext = createContext();

const ContextProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);

  const [systemStatus, setSystemStatus] = useState("offline");

  const [devices, setDevices] = useState({
    FAN: { on: false, speed: 33, swing: false },
    lights: {
      GREEN1: false,
      YELLOW1: false,
      RED: false,
      YELLOW2: false,
      GREEN2: false,
    },
  });

  useEffect(() => {
    const ws = new WebSocket(import.meta.env.VITE_WEBSOCKET_URL);
    setSocket(ws);

    ws.onopen = () => {
      console.log("WebSocket connected");
      setSystemStatus("online");
    };

    ws.onmessage = (msg) => {
      try {
        const data = JSON.parse(msg.data);
        setDevices((prev) => ({ ...prev, ...data }));
      } catch (err) {
        console.error("Failed to parse WebSocket message", err);
      }
    };

    ws.onclose = () => {
      console.log("WebSocket closed");
      setSystemStatus("offline");
      // auto-reconnect
      setTimeout(() => setSocket(new WebSocket(import.meta.env.VITE_WEBSOCKET_URL)), 3000);
    };

    ws.onerror = () => {
      console.log("WebSocket error, retrying in 3s");
      setSystemStatus("offline");
      setTimeout(() => setSocket(new WebSocket(import.meta.env.VITE_WEBSOCKET_URL)), 3000);
    };

    return () => ws.close();
  }, []);

  const send = (payload) => {
    // Prevent sending if offline
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify(payload));

      // Update local state optimistically
      setDevices((prev) => {
        switch (payload.type) {
          case "FAN_POWER":
            return { ...prev, fan: { ...prev.fan, on: payload.value } };
          case "FAN_SPEED":
            return { ...prev, fan: { ...prev.fan, speed: payload.value } };
          case "SWING":
            return { ...prev, fan: { ...prev.fan, swing: payload.value } };
          case "LIGHT_TOGGLE":
            return {
              ...prev,
              lights: { ...prev.lights, [payload.id]: payload.value },
            };
          default:
            return prev;
        }
      });
    } else {
      console.warn("Cannot send payload: WebSocket is offline");
      setSystemStatus("offline");
    }
  };

  return (
    <WebSocketContext.Provider value={socket}>
      <DeviceContext.Provider value={{ devices, send, systemStatus, setSystemStatus }}>
        {children}
      </DeviceContext.Provider>
    </WebSocketContext.Provider>
  );
};

export default ContextProvider;
