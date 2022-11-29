import {
  GraphQLInt,
  GraphQLNonNull,
  GraphQLString,
  GraphQLObjectType,
  GraphQLBoolean,
} from "graphql";
import { getPool } from "../../../db/db";
import { WorkHourType } from "../objectTypes";

import { ContextType } from "./index";

export const mutationType = new GraphQLObjectType<{}, ContextType>({
  name: "Mutation",
  fields: {
    updateWorkHour: {
      type: WorkHourType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLInt) },
        startTime: { type: new GraphQLNonNull(GraphQLString) },
        endTime: { type: GraphQLString },
        isDeleted: { type: new GraphQLNonNull(GraphQLBoolean) },
        dealId: { type: GraphQLInt },
        note: { type: GraphQLString },
      },
      resolve: async (_, args) => {
        const db = getPool();
        const sql = `
          update WorkHours
          set
          startTime = ${args.startTime},
          endTime = ${args.endTime || "null"}
          isDeleted = ${args.isDeleted || "null"}
          
          where
            id = ${args.id}
        `;
        try {
          await db.query(sql);
          return "ok";
        } catch (e) {
          return new Error(JSON.stringify(e));
        }
      },
    },
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
        try {
          await db.query(sql);
          return "ok";
        } catch (e) {
          return new Error(JSON.stringify(e));
        }
      },
    },
  },
});
