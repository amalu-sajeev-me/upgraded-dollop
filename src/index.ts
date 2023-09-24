import "reflect-metadata";
import { connectToMongoDB } from "./services/mongodb";
import { container } from "tsyringe";
import { Server } from "./bin/Server";

container.registerSingleton(Server);

(async function main() {
  const server = container.resolve(Server);
  await connectToMongoDB();
  (await server.start()).handleErrors();
})();
