import { Application } from "express";
import { graphqlHTTP } from "express-graphql";
import { GraphQLSchema } from "graphql";

import { mutationType, queryType } from "./resolvers";
import createDataLoader from "./dataLoaders";

function graphql(app: Application) {
  console.log(`grqphql:queryType=${JSON.stringify(queryType)}`);
  app.use("/graphql", (req, res) => {
    const loaders = createDataLoader();
    return graphqlHTTP({
      schema: new GraphQLSchema({ query: queryType, mutation: mutationType }),
      graphiql: true,
      context: { loaders },
    })(req, res);
  });
}

export default graphql;
