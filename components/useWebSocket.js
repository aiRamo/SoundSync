import { useEffect, useRef } from "react";
import API_URL from "../API_URL.json";

const useWebSocket = (onMessage) => {
  let ws = useRef(null);
  const url = API_URL.API_URL_WS; // Get the URL from the JSON file
  const url2 = API_URL.API_URL_UPLOAD;
  console.log(url2);
  console.log(url);
  useEffect(() => {
    ws.current = new WebSocket(url);

    ws.current.onopen = () => console.log("WebSocket connection opened");
    ws.current.onmessage = onMessage;
    ws.current.onerror = (error) => console.log("WebSocket error:", error);
    ws.current.onclose = () => console.log("WebSocket connection closed");

    return () => {
      ws.current.close();
    };
  }, [url, onMessage]);
};

export default useWebSocket;
