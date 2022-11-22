import { Application } from "express";
import { graphqlHTTP } from "express-graphql";
import { GraphQLSchema } from "graphql";

import { queryType } from "./resolvers";
import { createClientLoader, MyDataLoader } from "./data-loaders";

function graphql(app: Application) {
  app.use("/graphql", (req, res) => {
    const loader: MyDataLoader = {
      clientLoader: createClientLoader(),
    };
    return graphqlHTTP({
      schema: new GraphQLSchema({ query: queryType }),
      graphiql: true,
      context: { loader },
    })(req, res);
  });
}

export default graphql;
