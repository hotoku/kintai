import assert from "assert";
import {
  GraphQLInt,
  GraphQLNonNull,
  GraphQLString,
  GraphQLObjectType,
  GraphQLBoolean,
} from "graphql";
import { getConnection, getPool } from "../../../db/db";
import { DealType, WorkHourType } from "../objectTypes";

import { ContextType } from "./index";

function validateTime(s: string): boolean {
  const re = /[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}:[0-9]{2}\+[0-9]{4}/;
  return re.test(s);
}

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
          if (!validateTime(args.startTime))
            return new Error(`invalid date time string: ${args.startTime}`);
          setStatemets.push(`startTime=?`);
          setValues.push(args.startTime);
        }
        if (args.endTime !== undefined) {
          if (args.endTime.toUpperCase() === "NULL") {
            setStatemets.push(`endTime=NULL`);
          } else {
            if (!validateTime(args.endTime))
              return new Error(`invalid date time string: ${args.endTime}`);

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
        if (!validateTime(args.startTime)) {
          return new Error(
            `invalid date time string for start time: ${args.startTime}`
          );
        }
        if (
          args.endTime &&
          !(validateTime(args.endTime) || args.endTime === "NULL")
        ) {
          return new Error(
            `invalid date time string for end time: ${args.endTime}`
          );
        }
        values.push(args.startTime);
        if (args.endTime && args.endTime !== "NULL") {
          values.push(args.endTime);
        } else {
          values.push(undefined);
        }
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
    addDeal: {
      type: DealType,
      args: {
        name: { type: new GraphQLNonNull(GraphQLString) },
        clientId: { type: new GraphQLNonNull(GraphQLInt) },
        isFinished: { type: GraphQLBoolean },
      },
      resolve: async (_, args, { loaders }) => {
        const db = await getConnection();
        const isFinished = args.isFinished ?? false;
        const sql = `
          insert into
          Deals(
            name,
            clientId,
            isFinished
          )
          values (
            ?, ?, ?
          )
        `;
        const values = [args.name, args.clientId, isFinished];
        try {
          const [obj, _] = await db.query(sql, values);
          assert(
            !(obj instanceof Array),
            new Error("type of return value is not expected")
          );
          return loaders.dealLoader.load(obj.insertId);
        } catch (e) {
          return new Error(JSON.stringify(e));
        }
      },
    },
    updateDeal: {
      type: DealType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLInt) },
        name: { type: GraphQLString },
        clientId: { type: GraphQLInt },
        isFinished: { type: GraphQLBoolean },
      },
      resolve: async (_, args, { loaders }) => {
        const db = getPool();
        const setStatemets = [] as string[];
        const setValues = [] as any[];
        if (args.name !== undefined) {
          setStatemets.push(`name=?`);
          setValues.push(args.name);
        }
        if (args.clientId !== undefined) {
          setStatemets.push(`clientId=?`);
          setValues.push(args.clientId);
        }
        if (args.isFinished !== undefined) {
          setStatemets.push(`isFinished=?`);
          setValues.push(args.isFinished);
        }
        const sql = `
          update Deals
          set
            ${setStatemets.join(",")}
          where
            id = ${args.id}
        `;
        try {
          await db.query(sql, setValues);
          return loaders.dealLoader.load(args.id);
        } catch (e) {
          return new Error(JSON.stringify(e));
        }
      },
    },
  },
});
