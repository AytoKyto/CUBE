import { Server as ServerIO } from "socket.io";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async (req, res) => {
  if (!res.socket.server.io) {
    console.log("Hello chat");

    const httpServer = res.socket.server;
    const io = new ServerIO(httpServer, {
      path: "/api/chat/socketio",
    });

    res.socket.server.io = io;
  }
  res.end();
};
