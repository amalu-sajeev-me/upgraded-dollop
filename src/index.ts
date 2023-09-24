import "reflect-metadata";
import express from "express";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { UserResolver } from "./resolvers/userResolvers";
import { connectToMongoDB } from "./services/mongodb";
import { container } from "tsyringe";
import { UserContext } from "./services/UserContext.service";
import customAuthChecker from "./services/Authenticator";
import swaggerDocument from "../swagger.json";
import swaggerUi from "swagger-ui-express";
import { initSocket } from "./server";

const startServer = async () => {
  const app = express();

  const schema = await buildSchema({
    resolvers: [UserResolver],
    emitSchemaFile: true,
    authChecker: customAuthChecker,
  });

  const context = container.resolve(UserContext).createContext;

  const server = new ApolloServer({ schema, context });
  initSocket(server);

  await connectToMongoDB();
  await server.start();
  server.applyMiddleware({ app });
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

  app.listen({ port: 4000 }, () =>
    console.log(`Server running at http://localhost:4000${server.graphqlPath}`)
  );
};

startServer();
