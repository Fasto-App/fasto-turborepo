import { Connection } from 'mongoose'
import { tokenSigning } from "../utils";
import { Address, AddressModel } from "../../../models/address";
import { Business, BusinessModel } from "../../../models/business";
import { IUserModel, UserModel } from "../../../models/user";
import { CategoryModel } from "../../../models/category";
import { ProductModel } from '../../../models/product';
import { Context } from '../types';
import {
  businessInformationSchemaInput,
  businessLocationSchema,
  businessLocationSchemaInput,
  EmployeeInformation,
  hoursOfOperationSchema,
  HoursOfOperationType,
  Privileges,
} from 'app-helpers';
import { uploadFileS3Bucket } from '../../../s3/s3';
import { ApolloError } from '../../ApolloErrorExtended/ApolloErrorExtended';
import { SessionModel } from '../../../models/session';
import { sendEployeeAccountCreation, sendExistingUserEployeeEmail } from '../../../email-tool';
import { MutationResolvers } from '../../../generated/graphql';


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
  return await BusinessModel(db).find({ picture: { $ne: null } })
}

const getBusinessById = async (_parent: any, { input }: { input: { _id: string } }, { db }: { db: Connection }) => {
  const Business = BusinessModel(db)
  return await Business.findById(input._id)
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
      [`${savedBusiness._id.toString()}`]: {
        privilege: "Admin",
        jobTitle: 'Owner',
      }
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
  { input }: {
    input: businessInformationSchemaInput &
    { hoursOfOperation: HoursOfOperationType }
  },
  { db, business }: Context) => {
  const Business = BusinessModel(db)
  const foundBusines = await Business.findById(business)

  if (!foundBusines) throw Error('Business not found')

  try {
    const validateDaysOfTheWeek = await hoursOfOperationSchema.parseAsync(input.hoursOfOperation)

    if (input.picture) {
      const file = await uploadFileS3Bucket(input.picture)

      foundBusines.set({ picture: file.Location })
    }

    foundBusines.set({
      name: input.name,
      hoursOfOperation: validateDaysOfTheWeek,
      ...(input.description && { description: input.description }),
    })

    return await foundBusines.save()

  } catch {
    throw ApolloError("BadRequest");
  }
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

const getAllEmployees = async (parent: any, args: any, { business, db }: Context) => {
  if (!business) throw ApolloError("Unauthorized")

  const User = UserModel(db)
  const Business = BusinessModel(db)
  const Session = SessionModel(db)
  // use the array of users to poupulate the employees
  const foundBusiness = await Business.findById(business)
  const employees = await User.find({ _id: { $in: foundBusiness?.employees } })
  const employeesPending = await Session.find({ _id: { $in: foundBusiness?.employeesPending } })

  const employeesWithPrivileges = employees.map((employee) => {
    return ({
      _id: employee._id,
      name: employee.name,
      email: employee.email,
      picture: employee.picture,
      privilege: employee?.businesses?.[business].privilege,
      jobTitle: employee?.businesses?.[business].jobTitle,
      isPending: false
    })
  })

  const pendingEmployeesWithPrivileges = employeesPending.map((employee) => {
    return ({
      _id: employee._id,
      name: employee.name,
      email: employee.email,
      privilege: employee?.business?.privilege,
      jobTitle: employee?.business?.jobTitle,
      isPending: true
    })
  })

  return {
    employees: employeesWithPrivileges,
    employeesPending: pendingEmployeesWithPrivileges
  }
}

// @ts-ignore
const manageBusinessEmployees: MutationResolvers["manageBusinessEmployees"] = async (parent, args, { business, db }) => {
  if (!business) throw ApolloError("Unauthorized")
  const { email, privilege, _id, name, jobTitle, isPending } = args.input

  const User = UserModel(db)
  const Business = BusinessModel(db)
  const Session = SessionModel(db)

  const foundBusiness = await Business.findById(business)
  const foundAsUser = await User.findOne({ email })
  if (!foundBusiness) throw ApolloError("BadRequest")

  if (_id) {
    if (isPending) {
      const foundSession = await Session.findById(_id)
      if (!foundSession) throw ApolloError("BadRequest")
      if (!foundSession.name || !foundSession.email) throw ApolloError("BadRequest")

      foundSession.business = {
        privilege,
        jobTitle
      }

      await foundSession.save()

      return ({
        _id: foundSession._id,
        name: foundSession.name,
        email: foundSession.email,
        privilege,
        jobTitle,
        isPending: true
      })
    }

    const foundUser = await User.findById(_id)

    if (!foundUser) throw ApolloError("BadRequest")

    foundUser.businesses = {
      ...foundUser.businesses,
      [business]: {
        privilege,
        jobTitle
      }
    }

    await foundUser.save()

    return ({
      _id: foundUser._id,
      name: foundUser.name,
      email: foundUser.email,
      picture: foundUser.picture,
      privilege,
      jobTitle,
      isPending: false
    })
  }


  if (foundAsUser) {
    if (foundBusiness.employees?.includes(foundAsUser._id)) {
      throw ApolloError("BadRequest", "This user is already an employee")
    }

    foundBusiness.employees?.push(foundAsUser._id)

    foundAsUser.businesses = {
      ...foundAsUser.businesses,
      [business]: {
        privilege,
        jobTitle
      }
    }

    await foundAsUser.save()
    await foundBusiness.save()

    sendExistingUserEployeeEmail({
      email: foundAsUser.email || "",
      name: foundAsUser.name || "",
      businessName: foundBusiness.name,
    })

    return ({
      _id: foundAsUser._id,
      name: foundAsUser.name,
      email: foundAsUser.email,
      picture: foundAsUser.picture,
      privilege
    })
  }

  // create a new session and append that as the pending employee
  let newSession;

  newSession = await Session.findOne({ email })

  if (!newSession) {
    newSession = new Session({
      email,
    })
  }

  const token = await tokenSigning(newSession._id, email, business);

  newSession.token = token
  newSession.name = name
  newSession.business = {
    privilege,
    jobTitle
  }

  await newSession.save()

  if (!foundBusiness.employeesPending?.includes(newSession._id)) {
    foundBusiness.employeesPending?.push(newSession._id)
    await foundBusiness.save()
  }

  sendEployeeAccountCreation({
    email,
    name,
    businessName: foundBusiness.name,
    token
  })

  return ({
    _id: newSession._id,
    email: newSession.email,
    name: newSession.name,
    privilege
  })
}

const deleteBusinessEmployee = async (parent: any, args: { input: any }, { business, db }: Context) => {
  if (!business) throw ApolloError("Unauthorized")
  const { _id } = args.input
  console.log("Delete Employee", args.input)

  const Business = BusinessModel(db)
  const User = UserModel(db)
  const Session = SessionModel(db)

  const foundBusiness = await Business.findById(business)

  if (foundBusiness?.employees?.includes(_id) && foundBusiness?.user !== _id) {
    foundBusiness.employees = foundBusiness.employees.filter((employee: any) => employee !== _id)
    await foundBusiness.save()

    const removeBusinessFromUser = await User.findById(_id)
    if (removeBusinessFromUser) {

      delete removeBusinessFromUser?.businesses?.[business]
      await removeBusinessFromUser.save()

      return removeBusinessFromUser._id
    }
  }

  if (foundBusiness?.employeesPending?.includes(_id)) {
    foundBusiness.employeesPending = foundBusiness.employeesPending.filter((employee: any) => employee !== _id)
    await foundBusiness.save()

    const foundSession = await Session.findById(_id)

    if (foundSession) {
      await foundSession.remove()
      return foundSession._id
    }
  }

  throw ApolloError("BadRequest", "Employee not found or there was an error deleting the them.")
}


const BusinessResolverMutation = {
  createBusiness,
  updateBusinessToken,
  deleteBusiness,
  updateBusinessInformation,
  updateBusinessLocation,
  manageBusinessEmployees,
  deleteBusinessEmployee
}
const BusinessResolverQuery = {
  getBusinessById,
  getBusinessLocation,
  getAllBusiness,
  getAllBusinessByUser,
  getBusinessInformation,
  getAllEmployees
}

const BusinessResolver = {
  getCategoriesByBusiness,
  getProductsByBusiness
}

export { BusinessResolverMutation, BusinessResolverQuery, BusinessResolver }
