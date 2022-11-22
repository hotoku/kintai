import {
  GraphQLID,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from "graphql";

// import { UserRecord, TeamRecord, MyDataLoader } from "./data-loaders";
import { MyDataLoader } from "./data-loaders";
import { ClientRecord, DealRecord } from "./record-types";

export const ClientType: GraphQLObjectType<ClientRecord, {}> =
  new GraphQLObjectType<ClientRecord, {}>({
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

export const DealType: GraphQLObjectType<DealRecord, {}> =
  new GraphQLObjectType<DealRecord, {}>({
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
    }),
  });

export const queryType = new GraphQLObjectType<{}, { loader: MyDataLoader }>({
  name: "Query",
  fields: {
    getClient: {
      type: ClientType,
      args: {
        id: {
          type: new GraphQLNonNull(GraphQLID),
        },
      },
      resolve: (_, args, { loader }) => {
        return loader.clientLoader.load(args.id);
      },
    },
    getDeal: {
      type: DealType,
      args: {
        id: {
          type: new GraphQLNonNull(GraphQLID),
        },
      },
      resolve: (_, args, { loader }) => {
        return loader.dealLoader.load(args.id);
      },
    },
  },
});
