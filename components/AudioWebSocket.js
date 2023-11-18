import { useState, useEffect } from "react";
import API_URL from "../API_URL.json";

const useAudioWebSocket = (getAudioModuleData) => {
  const [webSocket, setWebSocket] = useState(null);

  useEffect(() => {
    const ws = new WebSocket(API_URL.API_URL_WS_AUDIO);

    ws.onopen = () => {
      console.log("WebSocket connection established");
    };

    ws.onmessage = (e) => {
      const message = e.data;
      console.log(message);
      const delimiterIndex = message.indexOf(",");

      if (delimiterIndex !== -1) {
        const frequency = message.substring(0, delimiterIndex).trim();
        const noteString = message.substring(delimiterIndex + 1).trim();
        getAudioModuleData({ frequency, noteString }); // The return for the callback in Tracker and Test
      }
    };

    ws.onerror = (e) => {
      console.log(e.message);
    };

    ws.onclose = () => {
      console.log("WebSocket connection closed");
    };

    setWebSocket(ws);

    return () => {
      ws.close();
    };
  }, [getAudioModuleData]);

  return webSocket;
};

export default useAudioWebSocket;
