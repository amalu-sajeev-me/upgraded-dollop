import { ApolloServer } from "apollo-server-express";
import express from "express";
import { container, inject, injectable } from "tsyringe";
import { buildSchema } from "type-graphql";
import { UserResolver } from "../resolvers/userResolvers";
import customAuthChecker from "../services/Authenticator";
import { UserContext } from "../services/UserContext.service";
import { EnvironmentUtil } from "../utils/environment.util";
import { LoggerUtil } from "../utils/logger.util";

@injectable()
export class Server {
  public readonly app: express.Application = express();
  //   private readonly envUtility: EnvironmentUtil = environmentContainer.resolve(
  //     EnvironmentUtil
  //   ) as typeof EnvironmentUtil;
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
    const server = new ApolloServer({ schema, context });
    this.server = server;
    await server.start();
    server.applyMiddleware({ app: this.app });
    this.app.listen({ port: EnvironmentUtil.isLocal() ? PORT : 4000 }, () => {
      this.logger.info(
        "info",
        `server started running at http://localhost:4000/${server.graphqlPath}`
      );
    });
    return this;
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
}
