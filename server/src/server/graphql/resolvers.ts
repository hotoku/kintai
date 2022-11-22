import { GraphQLID, GraphQLNonNull, GraphQLObjectType } from "graphql";

import { MyDataLoader } from "./data-loaders";
import { ClientType, DealType } from "./object-types";

export type ContextType = {
  loaders: MyDataLoader;
};

export const queryType = new GraphQLObjectType<{}, ContextType>({
  name: "Query",
  fields: {
    getClient: {
      type: ClientType,
      args: {
        id: {
          type: new GraphQLNonNull(GraphQLID),
        },
      },
      resolve: (_, args, { loaders }) => {
        return loaders.clientLoader.load(args.id);
      },
    },
    getDeal: {
      type: DealType,
      args: {
        id: {
          type: new GraphQLNonNull(GraphQLID),
        },
      },
      resolve: (_, args, { loaders }) => {
        return loaders.dealLoader.load(args.id);
      },
    },
  },
});
