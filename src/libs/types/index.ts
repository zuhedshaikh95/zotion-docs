import type { NextApiResponse } from "next";
import type { Socket, Server } from "net";
import type { Server as SocketIoServer } from "socket.io";

export type NavbarMenuItemI = {
  title: string;
  href: string;
  description: string;
};

export interface NextApiResponseServerIoT extends NextApiResponse {
  socket: Socket & {
    server: Server & {
      io: SocketIoServer;
    };
  };
}
