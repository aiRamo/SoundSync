import { useState, useEffect } from "react";
import API_URL from "../API_URL.json";

const useAudioWebSocket = (getAudioModuleData, setIsListening) => {
  const [webSocket, setWebSocket] = useState(null);

  useEffect(() => {
    const ws = new WebSocket(API_URL.API_URL_WS_AUDIO);

    ws.onopen = () => {
      console.log("WebSocket connection established");
      setIsListening(true);
    };

    ws.onmessage = (e) => {
      const message = e.data;
      const delimiterIndex = message.indexOf(",");
      const values = message.split(",");
      const filteredValues = values.filter(
        (value) => value.indexOf("Hz") === -1 && value !== "(null)"
      );
      const trimmedValues = filteredValues.map((value) => value.trim());

      if (delimiterIndex !== -1) {
        const frequency = message.substring(0, delimiterIndex).trim();

        const noteString = trimmedValues;
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
