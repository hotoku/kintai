import {
  GraphQLList,
  GraphQLInt,
  GraphQLNonNull,
  GraphQLString,
  GraphQLObjectType,
} from "graphql";
import { getPool } from "../../../db/db";

import { ClientType, DealType, WorkHourType } from "../objectTypes";
import { ContextType } from "./index";

export const mutationType = new GraphQLObjectType<{}, ContextType>({
  name: "Mutation",
  fields: {
    deleteWorkHour: {
      type: GraphQLString,
      args: {
        id: {
          type: new GraphQLNonNull(GraphQLInt),
        },
      },
      resolve: async (_, args) => {
        const db = getPool();
        const sql = `
          delete from WorkHours where id=${args.id}
        `;
        await db.query(sql);
        return "ok";
      },
    },
  },
});
