import { Space, SpaceModel } from "../../../models/space";
import { BusinessModel } from "../../../models/business";
import { Connection } from "mongoose";
import { ApolloError } from "../../ApolloErrorExtended/ApolloErrorExtended";
import { TableModel } from "../../../models/table";

type CreateSpaceInput = {
  name: string;
}

type UpdateSpaceInput = {
  _id: string;
  name: string;
}

export const getSpacesFromBusiness = async (
  parent: any,
  _args: any,
  { db, business }: { db: Connection, business: string },
) => {
  // from the business we will populate the address field and return the address object
  const businessByID = await BusinessModel(db).findById(business)
  if (!businessByID) throw ApolloError(new Error("Business not found."), 'NotFound',)

  return await SpaceModel(db).find({ business: businessByID?._id })
}

// create a space from a input name
export const createSpace = async (
  parent: any,
  { input }: { input: CreateSpaceInput },
  { db, business }: { db: Connection, business: string },
) => {
  const Space = SpaceModel(db);
  const businessByID = await BusinessModel(db).findById(business)
  if (!businessByID) throw ApolloError(new Error("No Business"), 'Unauthorized')

  const spaceByName = await Space.findOne({ name: input.name, business: businessByID?._id })
  if (spaceByName) {
    throw ApolloError(new Error("Space with this name already exists."), 'BadRequest',)
  }

  const space = new Space({
    name: input.name,
    business: businessByID?._id,
  });

  return space.save()
}

// patch space by id
// mostly it's name and description
export const updateSpace = async (
  parent: any,
  { input }: { input: UpdateSpaceInput },
  { db, business }: { db: Connection, business: string },
) => {
  const Space = SpaceModel(db);
  const businessByID = await BusinessModel(db).findById(business)
  if (!businessByID) throw ApolloError(new Error('Business not found.'), 'NotFound')

  const spaceByID = await Space.findById(input._id)
  if (!spaceByID) {
    throw ApolloError(new Error('Space not found.'), 'NotFound')
  }

  spaceByID.name = input.name

  return spaceByID.save()
}

export const deleteSpace = async (parent: any, args: any, context: any) => {
  const { db, business } = context;

  // if no business is found, throw error
  const businessByID = await BusinessModel(db).findById(business)
  if (!businessByID) throw ApolloError(new Error('Business not found.'), 'NotFound')

  // get the space by id and delete it
  // id will be passed as args.id
  const spaceByID = await SpaceModel(db).findByIdAndDelete(args.input.space)
  // delete all tables from this space
  const tables = await TableModel(db).find({ space: args.input.space })

  return spaceByID
}

const SpaceResolverMutation = {
  createSpace,
  updateSpace,
  deleteSpace,
}
const SpaceResolverQuery = {
  getSpacesFromBusiness
}

export {
  SpaceResolverMutation,
  SpaceResolverQuery,
}
