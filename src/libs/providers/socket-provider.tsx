"use client";
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { Socket } from "socket.io";
import { io as ClientIo } from "socket.io-client";

type SocketContextT = {
  socket: Socket | null;
  isConnected: boolean;
};

const SocketContext = createContext<SocketContextT>({
  socket: null,
  isConnected: false,
});

export const useSocket = (): SocketContextT => {
  return useContext(SocketContext);
};

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);

  const values = useMemo(() => ({ socket, isConnected }), [socket, isConnected]);

  useEffect(() => {
    const socketInstance = new (ClientIo as any)(process.env.NEXT_PUBLIC_SITE_URL, {
      path: "/api/socket/io",
      addTrailingSlash: false,
    });

    socketInstance.on("connect", () => {
      setIsConnected(true);
    });

    socketInstance.on("disconnect", () => {
      setIsConnected(false);
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, []);

  return <SocketContext.Provider value={values}>{children}</SocketContext.Provider>;
};
