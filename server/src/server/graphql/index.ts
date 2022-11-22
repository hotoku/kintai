import { Application } from "express";
import { graphqlHTTP } from "express-graphql";
import { GraphQLSchema } from "graphql";

import { queryType } from "./resolvers";
import {
  createClientLoader,
  createDealLoader,
  MyDataLoader,
} from "./data-loaders";

function graphql(app: Application) {
  app.use("/graphql", (req, res) => {
    const loaders: MyDataLoader = {
      clientLoader: createClientLoader(),
      dealLoader: createDealLoader(),
    };
    return graphqlHTTP({
      schema: new GraphQLSchema({ query: queryType }),
      graphiql: true,
      context: { loaders },
    })(req, res);
  });
}

export default graphql;
