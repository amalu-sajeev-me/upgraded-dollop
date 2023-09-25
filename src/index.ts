import "reflect-metadata";
import { MongoDB } from "./services/mongodb.service";
import { container } from "tsyringe";
import { ServerInit } from "./bin/Server";
import { LoggerUtil } from "./utils/logger.util";

container.registerSingleton(ServerInit);
container.registerSingleton(MongoDB);
container.register<LoggerUtil>(LoggerUtil, { useValue: LoggerUtil });

(async function main() {
  const server = container.resolve(ServerInit);

  (await server.start()).handleErrors();
})();
