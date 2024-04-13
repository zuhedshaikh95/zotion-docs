import { NextApiResponseServerIoT } from "@/libs/types";
import { Server as HTTPServer } from "http";
import type { NextApiRequest } from "next";
import { Server } from "socket.io";

export const config = {
  api: {
    bodyParser: false,
  },
};

const ioHandler = (request: NextApiRequest, response: NextApiResponseServerIoT) => {
  if (!response.socket.server.io) {
    const httpServer: HTTPServer = response.socket.server as any;

    const io = new Server(httpServer, { path: "/api/socket/io", addTrailingSlash: false });

    io.on("connection", (socket) => {
      socket.on("create-room", (fileId) => {
        socket.join(fileId);
      });

      socket.on("send-changes", (delta, fileId) => {
        socket.to(fileId).emit("receive-changes", delta, fileId);
      });

      socket.on("send-cursor-move", (range, fileId, cursorId) => {
        socket.to(fileId).emit("receive-cursor-move", range, fileId, cursorId);
      });
    });

    response.socket.server.io = io;
  }

  response.end();
};

export default ioHandler;
