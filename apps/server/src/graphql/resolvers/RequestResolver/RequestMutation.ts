import { NewTabForm, newTabSchema, RequestStatus } from "app-helpers";
import { BusinessModel, UserModel, RequestModel, TabModel, TableModel } from "../../../models";
import { ApolloError } from "../../ApolloErrorExtended/ApolloErrorExtended";
import { Context } from "../types"
import { tokenClient } from "../utils";

const openTabRequest = async (
  _parent: any,
  { input }: {
    input: NewTabForm & {
      business: string, names?: string[]
    }
  },
  { db }: Context
) => {

  const { business, phoneNumber, name, totalGuests, } = input

  // check if business exists
  const Business = BusinessModel(db)
  const Request = RequestModel(db)
  const User = UserModel(db)
  const foundBusiness = await Business.find({ _id: business })

  if (!foundBusiness) {
    throw ApolloError('BadRequest', "Business Not Found")
  }

  const foundUserByPhone = await User.findOne({ phoneNumber })

  const createNewRequest = async (client: string) => {
    // creating a new request
    return await Request.create({
      business,
      admin: client,
      totalGuests,
      names: input.names,
    })
  }

  if (!foundUserByPhone) {

    const newClient = await User.create({
      name,
      phoneNumber,
    })

    const newRequest = await createNewRequest(newClient._id)

    return await tokenClient({
      _id: newClient._id,
      request: newRequest._id,
      business,
    })
  }

  const status: RequestStatus[] = ['Pending', 'Accepted']

  // the status should be either pending or accepted
  const foundRequest = await Request.findOne({
    admin: foundUserByPhone._id,
    status: { $in: status }
  })

  if (foundRequest) {
    return await tokenClient({
      _id: foundUserByPhone._id,
      request: foundRequest._id,
      business,
    })
  }

  const newRequest = await createNewRequest(foundUserByPhone._id)

  return await tokenClient({
    _id: foundUserByPhone._id,
    request: newRequest._id,
    business,
  })
}

const acceptTabRequest = async (
  _parent: any,
  { input }: {
    input: {
      request: string,
      table: string
    }
  },
  { db, business }: Context
) => {

  console.log('business', business)
  console.log(input)

  const Tab = TabModel(db);
  const Request = RequestModel(db)
  const Table = TableModel(db);
  const User = UserModel(db)

  const foundRequest = await Request.findOne({ _id: input.request })

  if (!foundRequest) throw ApolloError('BadRequest', "Request Not Found")

  // check if the request belongs to the business
  if (foundRequest.business.toString() !== business) throw ApolloError('BadRequest', "Request Not Found")

  // check if the request is pending
  if (foundRequest.status !== 'Pending') throw ApolloError('BadRequest', "Request Not Pending")

  const allUsers = await User.insertMany(new Array(foundRequest.totalGuests).fill({ isGuest: true }))

  const table = await Table.findOne({ _id: input.table, business });

  const tab = await Tab.create({
    table: table?._id,
    admin: foundRequest?.admin,
    // todo: can we add exsisting users this way?
    // perhaps we need to add a new field to existing user emails or ids
    users: allUsers.map(user => user._id),
  });

  foundRequest.status = 'Accepted';
  foundRequest.tab = tab._id;

  return await foundRequest.save();
}

const declineTabRequest = async (
  _parent: any,
  { input }: {
    input: {
      _id: string,
    }
  },
  { db, business }: Context
) => {

  const Request = RequestModel(db)
  const foundRequest = await Request.findOne({ _id: input._id })

  if (!foundRequest) throw ApolloError('BadRequest', "Request Not Found")

  // check if the request belongs to the business
  if (foundRequest.business.toString() !== business) throw ApolloError('BadRequest', "Request Not Found")

  // check if the request is pending
  if (foundRequest.status !== 'Pending') throw ApolloError('BadRequest', "Request Not Pending")

  foundRequest.status = 'Rejected';

  return await foundRequest.save();
}

export const RequestResolverMutation = {
  openTabRequest,
  acceptTabRequest,
  declineTabRequest,
}


