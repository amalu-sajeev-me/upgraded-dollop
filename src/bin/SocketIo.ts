import { Server as SocketServer, Socket } from "socket.io";
import { Server } from "http";
import { injectable, singleton } from "tsyringe";

@singleton()
@injectable()
export class SocketService {
  private io: SocketServer | null;

  constructor() {
    this.io = null; // Initialize as null for now
  }

  initialize(server: Server) {
    this.io = new SocketServer(server);

    this.io.on("connection", (socket: Socket) => {
      console.log("New client connected:", socket.id);

      socket.on("newData", (data) => {
        console.log("Received new data from client:", data);
        socket.broadcast.emit("newData", data);
      });

      setInterval(() => {
        socket.broadcast.emit("newData", " - alive");
      }, 4000);
    });
  }

  getIoInstance() {
    if (!this.io) throw new Error("you must initialize the socket first");
    return this.io;
  }
}
