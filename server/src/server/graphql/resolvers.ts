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
  },
});
