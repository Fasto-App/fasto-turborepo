import { Connection } from 'mongoose'
import { tokenSigning } from "../utils";
import { Address, AddressModel } from "../../../models/address";
import { Business, BusinessModel } from "../../../models/business";
import { IUserModel, UserModel } from "../../../models/user";
import { CategoryModel } from "../../../models/category";
import { ProductModel } from '../../../models/product';
import { Context } from '../types';
import { Privileges } from '../../../models/types';
import {
  businessInformationSchemaInput,
  businessLocationSchema,
  businessLocationSchemaInput,
} from 'app-helpers';
import { uploadFileS3Bucket } from '../../../s3/s3';


//FIX: this should be a validation of the token, not the business id
const updateBusinessToken = async (_: any,
  args: {
    input: {
      business: string
    }
  }, context: Context) => {
  if (!context.user) throw new Error("User not found");
  const newToken = tokenSigning(context.user._id, context.user.email, args.input.business)

  return newToken
}

const getAllBusinessByUser = async (_parent: any, _args: any, { db, user }: Context) => {
  if (!user) throw Error('User not found')
  return await BusinessModel(db).find({ user: user._id })
}

const getAllBusiness = async (_parent: any, _args: any, { db }: { db: Connection }) => {
  return await BusinessModel(db).find({})
}

const getBusinessInformation = async (
  _parent: any,
  args: any,
  { db, business }: Context,
) => {
  const Business = BusinessModel(db)
  return await Business.findById(business);
};

const createBusiness = async (_parent: any,
  { input }: { input: Business & { address?: Address } },
  context: { db: Connection, user: IUserModel }) => {
  const { db, user } = context;

  const Business = BusinessModel(db)
  const Address = AddressModel(db)
  const User = UserModel(db)

  // let savedBusiness;
  let savedAddress;

  try {

    // Why would the user be undefined here?
    if (!user?._id) throw Error('User from token is undefined')
    if (!user?.email) throw Error('Email from token is undefined')

    const userContext = await User.findById(user._id);

    if (!userContext) throw Error("Error Finding user with valid ID")


    const savedBusiness = new Business({
      user: user._id,
      name: input.name,
      phone: input.phone,
      website: input.website,
      email: user.email,
    })

    await savedBusiness.save();
    userContext.businesses = {
      ...userContext.businesses,
      [savedBusiness._id.toString()]: [Privileges.ADMIN]
    }

    await userContext.save()

    if (input.address) {
      const address = new Address({
        postalCode: input.address.postalCode,
        city: input.address.city,
        streetAddress: input.address.streetAddress,
        country: input.address.country,
        complement: input.address.complement,
      })

      savedAddress = await address.save()
    }


    if (savedAddress) {
      savedBusiness.address = savedAddress._id
      await savedBusiness.save()
    }

    // the creation of a new token should happen here as well.
    const newToken = tokenSigning(user._id, user.email, savedBusiness._id)

    // based on the users information, create a new token
    return ({ business: savedBusiness, token: newToken })
  } catch (error) {

    return null
  }
};

const updateBusinessInformation = async (
  _parent: any,
  { input }: { input: businessInformationSchemaInput },
  { db, business }: Context) => {
  const Business = BusinessModel(db)
  const foundBusines = await Business.findById(business)

  if (!foundBusines) throw Error('Business not found')

  if (input.picture) {
    const file = await uploadFileS3Bucket(input.picture)

    foundBusines.set({ picture: file.Location })
  }

  foundBusines.set({
    name: input.name,
    ...(input.description && { description: input.description }),
  })

  return await foundBusines.save()
}

const updateBusinessLocation = async (
  _parent: any,
  { input }: { input: businessLocationSchemaInput },
  { db, business }: Context) => {
  console.log("Location Input", input)
  const Business = BusinessModel(db)
  const Address = AddressModel(db)

  try {

    const validatedInput = businessLocationSchema.parse(input)
    const updateBusiness = await Business.findById(business)

    if (!updateBusiness) throw new Error("Business not found");

    if (updateBusiness?.address) {
      await Address.findByIdAndUpdate(updateBusiness.address, {
        streetAddress: validatedInput.streetAddress,
        complement: validatedInput.complement,
        postalCode: validatedInput.postalCode,
        city: validatedInput.city,
        stateOrProvince: validatedInput.stateOrProvince,
        country: validatedInput.country,
      })
    } else {

      const address = new Address({
        streetAddress: validatedInput.streetAddress,
        complement: validatedInput.complement,
        postalCode: validatedInput.postalCode,
        city: validatedInput.city,
        stateOrProvince: validatedInput.stateOrProvince,
        country: validatedInput.country,
      })

      const savedAddress = await address.save()
      updateBusiness.address = savedAddress._id

      await updateBusiness.save()
    }

    return await updateBusiness.save()
  } catch (err) {
    throw new Error(`Error saving business information: ${err}`);
  }
}

const deleteBusiness = async (parent: any, args: any, context: any) => {
  const { businessID } = args;

  try {
    const BusinessDB = BusinessModel(context.db)
    const deletedBusiness = await BusinessDB.deleteOne({ _id: businessID })

    return ({ success: !!deletedBusiness, message: 'Business deleted ' })
  } catch {
    return ({ success: false, message: 'Business not found' })
  }
}

const getProductsByBusiness = async (parent: any, args: any, context: Context) => {
  if (context.business && parent._id) {
    return await ProductModel(context.db).find({ business: parent._id })
  }
}

const getCategoriesByBusiness = async (parent: any, args: any, context: Context) => {
  if (context.business) {
    return await CategoryModel(context.db).find({ business: parent._id })
  }
}

const getBusinessLocation = async (parent: null, args: null, { business, db }: Context) => {

  console.log("Business", business)
  if (business) {

    const Business = BusinessModel(db)
    const Address = AddressModel(db)
    const foundBusiness = await Business.findById(business)

    if (foundBusiness?.address) {
      const address = await Address.findById(foundBusiness.address)
      console.log("Address", address)
      return address
    }
  }
}


const BusinessResolverMutation = {
  createBusiness,
  updateBusinessToken,
  deleteBusiness,
  updateBusinessInformation,
  updateBusinessLocation,
}
const BusinessResolverQuery = {
  getBusinessLocation,
  getAllBusiness,
  getAllBusinessByUser,
  getBusinessInformation
}

const BusinessResolver = {
  getCategoriesByBusiness,
  getProductsByBusiness
}

export { BusinessResolverMutation, BusinessResolverQuery, BusinessResolver }
