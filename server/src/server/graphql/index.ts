import { Application } from "express";
import { graphqlHTTP } from "express-graphql";
import { GraphQLSchema } from "graphql";

import { queryType } from "./resolvers";

function graphql(app: Application) {
  app.use("/graphql", (req, res) => {
    return graphqlHTTP({
      schema: new GraphQLSchema({ query: queryType }),
      graphiql: true,
    })(req, res);
  });
}

export default graphql;
