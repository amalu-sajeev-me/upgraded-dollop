import express from "express";
import { Server as SocketServer, Socket } from "socket.io";
import { ApolloServer } from "apollo-server-express";
import { container, inject, injectable } from "tsyringe";
import { buildSchema } from "type-graphql";
import rateLimit from "express-rate-limit";
import { UserResolver } from "../resolvers/userResolvers";
import customAuthChecker from "../services/Authenticator";
import { UserContext } from "../services/UserContext.service";
import { EnvironmentUtil } from "../utils/environment.util";
import { LoggerUtil } from "../utils/logger.util";
import { Server } from "http";

@injectable()
export class ServerInit {
  public readonly app: express.Application = express();
  public io: SocketServer;
  private server?: ApolloServer;
  private readonly userContextService: UserContext =
    container.resolve(UserContext);
  constructor(@inject(LoggerUtil) private logger: typeof LoggerUtil) {}

  start = async () => {
    const { PORT = 4000 } = process.env;
    const schema = await buildSchema({
      resolvers: [UserResolver],
      emitSchemaFile: true,
      authChecker: customAuthChecker,
    });
    const context = this.userContextService.createContext;
    this.app.use("/graphql", this.limitReqs);
    const server = new ApolloServer({ schema, context });
    this.server = server;
    await this.server.start();
    server.applyMiddleware({ app: this.app });
    const expressServer = this.app.listen(
      { port: EnvironmentUtil.isLocal() ? PORT : 4000 },
      () => {
        this.logger.info(
          "info",
          `server started running at http://localhost:4000${server.graphqlPath}`
        );
      }
    );
    this.createSocketServer(expressServer);
    return { ...this, expressServer };
  };

  handleErrors = () => {
    if (!this.server)
      throw new Error("you must first start server befor handling rrors");
    process.on("unhandledRejection", (reason, promise) => {
      console.error("Unhandled Rejection at:", promise, "reason:", reason);
    });

    process.on("uncaughtException", (err) => {
      console.error("Uncaught Exception:", err);
      this.handleTermination(this.server!);
    });
  };

  handleTermination = (server: ApolloServer) => {
    server.stop(); // Stop the Apollo Server
    process.exit(0); // Exit the process gracefully
  };
  limitReqs = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes,
    max: 4, // limit each IP to 100 requests per windowMs
    message: "Too many requests from this IP, Please try again later",
  });
  createSocketServer(server: Server) {
    if (this.server) {
      try {
        this.io = new SocketServer(server);
        this.io.on("connection", (socket: Socket) => {
          this.logger.info("io-event", `New client connected: ${socket}`);
          socket.on("newData", (data) => {
            this.logger.info(
              "io-event",
              `Recieved new data from client: ${data}`
            );
            socket.broadcast.emit("newData", data);
          });
        });
        this.logger.info(
          "socket.io engine",
          this.io.engine.clientsCount.toString()
        );
      } catch (error) {
        console.log(error);
      }
    }
  }
}
