import "reflect-metadata";
import { connectToMongoDB } from "./services/mongodb";
import { container } from "tsyringe";
import { ServerInit } from "./bin/Server";
import { LoggerUtil } from "./utils/logger.util";

container.registerSingleton(ServerInit);
container.register<LoggerUtil>(LoggerUtil, { useValue: LoggerUtil });

(async function main() {
  const server = container.resolve(ServerInit);
  await connectToMongoDB();
  (await server.start()).handleErrors();
})();
