import { Server } from "socket.io";

export const initSocket = (httpServer) => {
  const io = new Server(httpServer, {
    cors: {
      origin: "*",
    },
  });
  console.log(io.listen(3000));

  io.on("connection", (socket) => {
    console.log(`New connection: ${socket.id}`);

    socket.on("message", (data) => {
      // Handle incoming messages from clients
      console.log(`Received message: ${data}`);
      socket.emit("message", "Message received!"); // Send a response back to the client
    });

    socket.on("disconnect", () => {
      console.log(`Disconnected: ${socket.id}`);
    });
  });

  return io;
};
