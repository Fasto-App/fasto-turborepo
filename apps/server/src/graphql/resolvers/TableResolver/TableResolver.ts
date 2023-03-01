import { Table, TableModel } from "../../../models/table";
import { BusinessModel } from "../../../models/business";
import { Connection } from "mongoose";
import { ApolloError } from "../../ApolloErrorExtended/ApolloErrorExtended";
import { SpaceModel } from "../../../models/space";
import { TabModel } from "../../../models/tab";
import { TabStatus } from "app-helpers";
import { Context } from "../types";

const createTable = async (
  parent: any,
  { input }: {
    input: {
      space: string;
    }
  },
  { db, business }: { db: Connection, business: string },
) => {
  console.log("Creating Table")

  const Table = TableModel(db);
  const businessByID = await BusinessModel(db).findById(business)
  const spaceByID = await SpaceModel(db).findById(input.space)
  const allTables = await Table.find({ space: spaceByID?._id })

  if (!businessByID) throw ApolloError('NotFound')

  if (!spaceByID) {
    throw ApolloError('BadRequest', "Space not found.")
  }

  const table = new Table({
    space: spaceByID._id,
    tableNumber: (allTables.length + 1).toString()
  });

  return await table.save()
}

export const getTablesFromSpace = async (
  parent: any,
  _args: any,
  { db }: { db: Connection },
) => {
  const tables = await TableModel(db).find({ space: parent._id })
  return tables
}

// delete table by id
const deleteTable = async (parent: any, args: any, { db, business }: Context) => {
  // make sure the business exists and I woun it
  const businessByID = await BusinessModel(db).findById(business)
  if (!businessByID) throw ApolloError('NotFound')

  // get the table by id and delete it
  // id will be passed as args.id
  const tableByID = await TableModel(db).findByIdAndDelete(args.input.table)
  // get the table by id and delete it
  // id will be passed as args.id
  return tableByID
}

const getOpenTabByTable = async (table: any, _: any, { db }: { db: Connection }) => {
  // TODO: add a check to make sure the business owns the table
  const tab = await TabModel(db).findOne({ status: TabStatus.Open, table: table._id.toString() })
  return tab
}

const TableResolverMutation = { deleteTable, createTable }

const TableResolver = {
  getOpenTabByTable,
  getTablesFromSpace,
}

export { TableResolverMutation, TableResolver }

