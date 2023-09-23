import "reflect-metadata";
import * as express from "express";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { UserResolver } from "./resolvers/userResolvers";
import { connectToMongoDB } from "./services/mongodb";

const startServer = async () => {
  const app = express();

  const schema = await buildSchema({
    resolvers: [UserResolver],
    emitSchemaFile: true,
  });

  const server = new ApolloServer({ schema });

  await connectToMongoDB();
  await server.start();
  server.applyMiddleware({ app });

  app.listen({ port: 4000 }, () =>
    console.log(`Server running at http://localhost:4000${server.graphqlPath}`)
  );
};

startServer();
