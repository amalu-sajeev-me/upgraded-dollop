import "reflect-metadata";
import { connectToMongoDB } from "./services/mongodb";
import { container } from "tsyringe";
import { Server } from "./bin/Server";
import { LoggerUtil } from "./utils/logger.util";

container.registerSingleton(Server);
container.register<LoggerUtil>(LoggerUtil, { useValue: LoggerUtil });

(async function main() {
  const server = container.resolve(Server);
  await connectToMongoDB();
  (await server.start()).handleErrors();
})();
