/* eslint-disable no-undef */
module.exports = {
  definition: {
    openapi: "3.0.0",
    servers: [
      {
        url: "http://localhost:4000", // Update with your server URL
      },
    ],
  },
    info: {
      title: "Apollo GraphQL Server API",
      version: "1.0.0",
      description: "Documentation for the Apollo GraphQL server API",
    },
  apis: ["./src/**/*.ts"], // Update with the paths to your server code
};
