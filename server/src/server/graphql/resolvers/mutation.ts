import assert from "assert";
import {
  GraphQLInt,
  GraphQLNonNull,
  GraphQLString,
  GraphQLObjectType,
  GraphQLBoolean,
} from "graphql";
import { ResultSetHeader } from "mysql2/promise";
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
        if (args.startTime !== undefined) {
          setStatemets.push(`startTime=?`);
          setValues.push(args.startTime);
        }
        if (args.endTime !== undefined) {
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
        if (args.dealId !== undefined) {
          setStatemets.push(`dealId=?`);
          setValues.push(args.dealId);
        }
        if (args.note !== undefined) {
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
    addWorkHour: {
      type: WorkHourType,
      args: {
        startTime: { type: new GraphQLNonNull(GraphQLString) },
        endTime: { type: GraphQLString },
        dealId: { type: new GraphQLNonNull(GraphQLInt) },
        note: { type: GraphQLString },
      },
      resolve: async (_, args, { loaders }) => {
        const db = await getConnection();
        const sql = `
          insert into
          WorkHours (
            startTime,
            endTime,
            dealId,
            note
          )
          values (
            ?, ?, ?, ?
          )
        `;
        const values = [] as any[];
        values.push(args.startTime);
        values.push(args.endTime);
        values.push(args.dealId);
        values.push(args.note ?? "");
        try {
          const [obj, _] = await db.query(sql, values);
          assert(
            !(obj instanceof Array),
            new Error("type of return value is not expected")
          );
          return loaders.workHourLoader.load(obj.insertId);
        } catch (e) {
          return new Error(JSON.stringify(e));
        }
      },
    },
  },
});
