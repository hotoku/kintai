import {
  GraphQLList,
  GraphQLInt,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from "graphql";
import { daysOfWeek } from "../../../share/utils";

import {
  ClientType,
  DaySummaryType,
  DealType,
  WorkHourType,
} from "../objectTypes";
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
        // ここの第一引数はundefined
        // argsには、上記で定義しているオブジェクト
        const whIds = await loaders.dealWorkHoursLoader.load(args.dealId);
        return whIds.map((whId) => loaders.workHourLoader.load(whId));
      },
    },
    getWeekSumary: {
      type: new GraphQLList(DaySummaryType),
      args: {
        date: {
          type: GraphQLString,
        },
      },
      resolve: async (_, args, { loaders }) => {
        const dates = daysOfWeek(args.date);
        return dates.map((date) => loaders.daySummaryLoader.load(date));
      },
    },
  },
});
