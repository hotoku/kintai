import {
  GraphQLList,
  GraphQLInt,
  GraphQLObjectType,
  GraphQLString,
  GraphQLBoolean,
} from "graphql";

import { ClientRecord, DealRecord, WorkHourRecord } from "./recordTypes";
import { ContextType } from "./resolvers";

export const ClientType: GraphQLObjectType<ClientRecord, ContextType> =
  new GraphQLObjectType<ClientRecord, ContextType>({
    name: "Client",
    fields: () => ({
      id: {
        type: GraphQLInt,
      },
      name: {
        type: GraphQLString,
      },
      deals: {
        type: new GraphQLList(DealType),
        resolve: async (obj, _, { loaders }) => {
          const dealIds = await loaders.clientDealsLoader.load(obj.id);
          return await Promise.all(
            dealIds.map((dealId) => {
              return loaders.dealLoader.load(dealId);
            })
          );
        },
      },
    }),
  });

export const DealType: GraphQLObjectType<DealRecord, ContextType> =
  new GraphQLObjectType<DealRecord, ContextType>({
    name: "Deal",
    fields: () => ({
      id: {
        type: GraphQLInt,
      },
      name: {
        type: GraphQLString,
      },
      clientId: {
        type: GraphQLInt,
      },
      client: {
        type: ClientType,
        resolve: (obj, _, { loaders }) => {
          return loaders.clientLoader.load(obj.clientId);
        },
      },
      workHours: {
        type: new GraphQLList(WorkHourType),
        resolve: async (obj, _, { loaders }) => {
          const whIds = await loaders.dealWorkHoursLoader.load(obj.id);
          return await Promise.all(
            whIds.map((whId) => {
              return loaders.workHourLoader.load(whId);
            })
          );
        },
      },
    }),
  });

export const WorkHourType: GraphQLObjectType<WorkHourRecord, ContextType> =
  new GraphQLObjectType<WorkHourRecord, ContextType>({
    name: "WorkHour",
    fields: () => ({
      id: { type: GraphQLInt },
      startTime: { type: GraphQLString },
      endTime: { type: GraphQLString },
      dealId: { type: GraphQLInt },
      isDeleted: { type: GraphQLBoolean },
      note: { type: GraphQLString },
      deal: {
        type: DealType,
        resolve: (obj, _, { loaders }) => {
          return loaders.workHourLoader.load(obj.dealId);
        },
      },
    }),
  });
