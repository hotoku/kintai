import {
  GraphQLInt,
  GraphQLNonNull,
  GraphQLString,
  GraphQLObjectType,
  GraphQLBoolean,
} from "graphql";
import { getConnection, getPool } from "../../../db/db";
import { WorkHourType } from "../objectTypes";

import { ContextType } from "./index";

export const mutationType = new GraphQLObjectType<{}, ContextType>({
  name: "Mutation",
  fields: {
    updateWorkHour: {
      type: WorkHourType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLInt) },
        startTime: { type: GraphQLString },
        endTime: { type: GraphQLString },
        isDeleted: { type: GraphQLBoolean },
        dealId: { type: GraphQLInt },
        note: { type: GraphQLString },
      },
      resolve: async (_, args, { loaders }) => {
        const db = getPool();
        const setStatemets = [] as string[];
        const setValues = [] as any[];
        if (args.startTime) {
          setStatemets.push(`startTime=?`);
          setValues.push(args.startTime);
        }
        if (args.endTime) {
          if (args.endTime.toUpperCase() === "NULL") {
            setStatemets.push(`endTime=NULL`);
          } else {
            setStatemets.push(`endTime=?`);
            setValues.push(args.endTime);
          }
        }
        if (args.isDeleted !== undefined) {
          setStatemets.push(`isDeleted=?`);
          setValues.push(args.isDeleted);
        }
        if (args.dealId) {
          setStatemets.push(`dealId=?`);
          setValues.push(args.dealId);
        }
        if (args.note) {
          setStatemets.push(`note = ?`);
          setValues.push(args.note);
        }
        const sql = `
          update WorkHours
          set
            ${setStatemets.join(",")}
          where
            id = ${args.id}
        `;
        try {
          await db.query(sql, setValues);
          return loaders.workHourLoader.load(args.id);
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
        const db = await getConnection();
        const sql = `
          delete from WorkHours where id=?
        `;
        try {
          await db.query(sql, args.id);
          return "ok";
        } catch (e) {
          return new Error(JSON.stringify(e));
        }
      },
    },
  },
});
