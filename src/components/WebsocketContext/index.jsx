import React, { useEffect, createContext, useRef } from 'react';
import useWebSocket from 'react-use-websocket';
import { v4 as uuidv4 } from 'uuid';
import { WEBSOCKET_URL } from './constants';

const WebSocketContext = createContext();

function WebSocketProvider({ children }) {
  const websocketId = useRef(uuidv4());

  const { lastJsonMessage } = useWebSocket(
    `${WEBSOCKET_URL}/${websocketId.current}`,
    {
      shouldReconnect: () => true,
      reconnectAttempts: 3,
      heartbeat: {
        message: 'ping',
        returnMessage: 'pong',
        timeout: 10000,
        interval: 20000,
      },
    }
  );
  useEffect(() => {
    if (lastJsonMessage !== null) {
      if (lastJsonMessage.type === 'identification') {
        websocketId.current = lastJsonMessage.id;
      }
    }
  }, [lastJsonMessage]);

  /* WS provider dom */
  /* subscribe and unsubscribe are the only required prop for the context */
  return (
    <WebSocketContext.Provider value={{ websocketId, lastJsonMessage }}>
      {children}
    </WebSocketContext.Provider>
  );
}

export { WebSocketContext, WebSocketProvider };