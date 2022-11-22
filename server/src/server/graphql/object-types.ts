import { GraphQLID, GraphQLObjectType, GraphQLString } from "graphql";

import { MyDataLoader } from "./data-loaders";
import { ClientRecord, DealRecord } from "./record-types";
import { ContextType } from "./resolvers";

export const ClientType: GraphQLObjectType<ClientRecord, ContextType> =
  new GraphQLObjectType<ClientRecord, ContextType>({
    name: "Client",
    fields: () => ({
      id: {
        type: GraphQLID,
      },
      name: {
        type: GraphQLString,
      },
    }),
  });

export const DealType: GraphQLObjectType<DealRecord, ContextType> =
  new GraphQLObjectType<DealRecord, ContextType>({
    name: "Deal",
    fields: () => ({
      id: {
        type: GraphQLID,
      },
      name: {
        type: GraphQLString,
      },
      clientId: {
        type: GraphQLID,
      },
      client: {
        type: ClientType,
        resolve: (obj, _, { loaders }) => {
          const ret = loaders.clientLoader.load(obj.clientId);
          return ret;
        },
      },
    }),
  });
