import {
  GraphQLList,
  GraphQLInt,
  GraphQLNonNull,
  GraphQLObjectType,
} from "graphql";

import { ClientType, DealType, WorkHourType } from "../objectTypes";
import { ContextType } from "./index";

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
      resolve: (_, _2, { loaders }) => {
        return loaders.clientLoader.all();
      },
    },
    getWorkHoursOfDeal: {
      type: new GraphQLList(WorkHourType),
      args: {
        dealId: {
          type: new GraphQLNonNull(GraphQLInt),
        },
      },
      resolve: async (_, args, { loaders }) => {
        const whIds = await loaders.dealWorkHoursLoader.load(args.dealId);
        return whIds.map((whId) => loaders.workHourLoader.load(whId));
      },
    },
  },
});


