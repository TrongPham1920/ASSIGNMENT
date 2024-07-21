const app = require("./src/app");
require("dotenv").config();
const router = require("./src/server/router");
const express = require("express");
require("dotenv").config();

const bodyParser = require("body-parser");
const swagger = require("./swagger");

const PORT = process.env.PORT || 8080;

app.use(bodyParser.json());
swagger(app);

app.use("/", router);

const typeDefs = require("./TypeDefs");
const resolvers = require("./Resolvers");
const { ApolloServer } = require("apollo-server-express");
const server = new ApolloServer({ typeDefs, resolvers });

server.start().then(() => {
  server.applyMiddleware({ app });

  app.listen(PORT, () =>
    console.log(`Server ready at http://localhost:${PORT}${server.graphqlPath}`)
  );
});
