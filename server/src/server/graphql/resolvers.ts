import {
  GraphQLList,
  GraphQLInt,
  GraphQLNonNull,
  GraphQLObjectType,
} from "graphql";

import { MyDataLoader } from "./dataLoaders";
import { ClientType, DealType, WorkHourType } from "./objectTypes";

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
          type: new GraphQLNonNull(GraphQLInt),
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
          type: new GraphQLNonNull(GraphQLInt),
        },
      },
      resolve: (_, args, { loaders }) => {
        return loaders.dealLoader.load(args.id);
      },
    },
    getWorkhour: {
      type: WorkHourType,
      args: {
        id: {
          type: new GraphQLNonNull(GraphQLInt),
        },
      },
      resolve: (_, args, { loaders }) => {
        return loaders.workHourLoader.load(args.id);
      },
    },
    getAllClients: {
      type: new GraphQLList(ClientType),
      args: {},
      resolve: (_, args, { loaders }) => {
        return loaders.clientLoader.load();
      },
    },
  },
});
