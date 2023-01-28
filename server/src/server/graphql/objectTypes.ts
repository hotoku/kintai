import {
  GraphQLList,
  GraphQLInt,
  GraphQLObjectType,
  GraphQLString,
  GraphQLBoolean,
} from "graphql";
import { workHours } from "../routes";

import {
  ClientRecord,
  DaySummaryRecord,
  DealRecord,
  WorkHourRecord,
} from "./recordTypes";
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
          // ここの第一引数はWorkHourRecordオブジェクト
          // ここの第二引数(args)はundefined
          // data loaderから呼ばれる時には、第一引数に、オブジェクトが入る
          return loaders.dealLoader.load(obj.dealId);
        },
      },
    }),
  });

export const DaySummaryType: GraphQLObjectType<DaySummaryRecord, ContextType> =
  new GraphQLObjectType<DaySummaryRecord, ContextType>({
    name: "DaySummary",
    fields: () => ({
      date: { type: GraphQLString },
      workHours: {
        type: new GraphQLList(WorkHourType),
        resolve: (obj) => {
          return obj.workHours;
        },
      },
    }),
  });
