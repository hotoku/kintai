import {
  GraphQLID,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from "graphql";

// import { UserRecord, TeamRecord, MyDataLoader } from "./data-loaders";
import { ClientRecord, MyDataLoader } from "./data-loaders";

export const ClientType: GraphQLObjectType<ClientRecord, {}> =
  new GraphQLObjectType<ClientRecord, {}>({
    name: "Client",
    fields: () => ({
      id: {
        type: GraphQLID,
      },
      name: {
        type: GraphQLString,
        resolve: (obj) => {
          return `client-${obj.name}-${obj.id}`;
        },
      },
    }),
  });

export const queryType = new GraphQLObjectType<{}, {}>({
  name: "Query",
  fields: {
    getClient: {
      type: ClientType,
      args: {
        id: {
          type: new GraphQLNonNull(GraphQLID),
        },
      },
      resolve: (_, args) => {
        return { id: args.id };
      },
    },
  },
});
