import { Connection } from 'mongoose'
import { tokenSigning, typedKeys } from "../utils";
import { Address, AddressModel } from "../../../models/address";
import { Business, BusinessModel } from "../../../models/business";
import { IUserModel, UserModel } from "../../../models/user";
import { CategoryModel } from "../../../models/category";
import { ProductModel } from '../../../models/product';
import { Context } from '../types';
import { Privileges } from '../../../models/types';
import {
  businessInfoSchema,
  businessInfoSchemaInput
} from 'app-helpers';


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

const getBusiness = async (
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
    const allBusiness = typedKeys(userContext.businesses)
    userContext.businesses = {
      ...userContext.businesses,
      [savedBusiness._id.toString()]: [Privileges.ADMIN]
    }

    await userContext.save()

    if (input.address) {
      const address = new Address({
        zipcode: input.address.zipcode,
        city: input.address.city,
        streetName: input.address.streetName,
        streetNumber: input.address.streetNumber,
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

interface UpdateBusinessInput {

}

const updateBusiness = async (_parent: any, { input }: { input: Business & { id: string; address: Address } }, { db }: { db: Connection }) => {
  // get the id, find the business and update its information
  const Business = BusinessModel(db)
  const Address = AddressModel(db)

  const { id: businessID } = input
  const updateBusiness = await Business.findByIdAndUpdate(businessID, {
    name: input.name,
    phone: input.phone,
    website: input.website,
    email: input.email,
  })

  if (!updateBusiness) throw Error('Business not found')

  return updateBusiness
}

const updateBusinessInfo = async (
  _parent: any,
  { input }: { input: businessInfoSchemaInput },
  { db, business }: Context) => {
  // get the id, find the business and update its information
  const Business = BusinessModel(db)
  const Address = AddressModel(db)

  try {

    console.log(input)

    const validatedInput = businessInfoSchema.parse(input)
    const updateBusiness = await Business.findById(business)

    if (!updateBusiness) throw new Error("Business not found");

    if (updateBusiness?.address) {
      await Address.findByIdAndUpdate(updateBusiness.address, {
        zipcode: validatedInput.zipCode,
        city: validatedInput.city,
        streetName: validatedInput.streetName,
        streetNumber: validatedInput.streetNumber,
      })
    } else {

      const address = new Address({
        zipcode: validatedInput.zipCode,
        city: validatedInput.city,
        streetName: validatedInput.streetName,
        streetNumber: validatedInput.streetNumber,
      })

      const savedAddress = await address.save()
      updateBusiness.address = savedAddress._id

      await updateBusiness.save()
    }


    updateBusiness.name = validatedInput.name
    // updateBusiness.hoursOfOperation = validatedInput.hoursOfOperation

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


const BusinessResolverMutation = {
  createBusiness,
  updateBusinessToken,
  deleteBusiness,
  updateBusiness,
  updateBusinessInfo,
}
const BusinessResolverQuery = {
  getAllBusiness,
  getAllBusinessByUser,
  getBusiness
}

const BusinessResolver = {
  getCategoriesByBusiness,
  getProductsByBusiness
}

export { BusinessResolverMutation, BusinessResolverQuery, BusinessResolver }
