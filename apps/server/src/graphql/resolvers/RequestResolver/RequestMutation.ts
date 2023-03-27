import { JoinTabForm, NewTabForm, newTabSchema, RequestStatus } from "app-helpers";
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

  // the status should be either pending or accepted
  const foundRequest = await Request.findOne({
    admin: foundUserByPhone._id,
    status: { $in: ['Pending', 'Accepted'] as RequestStatus[] }
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
  const Tab = TabModel(db);
  const Request = RequestModel(db)
  const Table = TableModel(db);
  const User = UserModel(db)

  const foundRequest = await Request.findOne({ _id: input.request })

  if (!foundRequest) {
    throw ApolloError('BadRequest', "Request Not Found")
  }

  // check if the request belongs to the business
  if (foundRequest.business?.toString() !== business) {
    throw ApolloError('BadRequest', "Request Not Found")
  }

  // check if the request is pending
  if (foundRequest.status !== 'Pending') {
    throw ApolloError('BadRequest', "Request Not Pending")
  }

  const table = await Table.findOne({ _id: input.table, business });

  if (!table) throw ApolloError('BadRequest', "Table Not Found")
  if (table.status !== 'Available') throw ApolloError('BadRequest', "Table Not Available")

  const numGuests = (foundRequest.totalGuests ?? 1) - 1;
  const allUsers = await User.insertMany(new Array(numGuests).fill({ isGuest: true }))
  const usersId = allUsers.map(user => user._id)

  //todo: fix this
  console.log({
    table: table?._id,
    admin: foundRequest?.requestor, // found request was coming back empty
    users: [foundRequest.requestor?._id, ...usersId],
  })

  const tab = await Tab.create({
    table: table?._id,
    admin: foundRequest?.requestor,
    users: [foundRequest.requestor._id, ...usersId],
  });

  if (!tab) throw ApolloError('BadRequest', "Tab Not Created")

  table.status = 'Occupied';
  table.tab = tab._id;
  await table.save();

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
  if (foundRequest.business?.toString() !== business) {
    throw ApolloError('BadRequest', "Request Not Found")
  }

  // check if the request is pending
  if (foundRequest.status !== 'Pending') {
    throw ApolloError('BadRequest', "Request Not Pending")
  }

  foundRequest.status = 'Rejected';

  return await foundRequest.save();
}


// todo: Create a new Request, from a guest to an requestee
const requestJoinTab = async (
  _parent: any,
  { input }: { input: JoinTabForm & { tab: string, admin: string, business: string } },
  { db }: Context
) => {
  const Tab = TabModel(db)
  const User = UserModel(db)
  const Request = RequestModel(db)

  const foundTab = await Tab.findOne({ _id: input.tab })
  const tabAdmin = await User.findOne({ _id: input.admin })

  if (!tabAdmin) throw ApolloError('BadRequest', "User Not Found")
  if (!foundTab) throw ApolloError('BadRequest', "Request Not Found")

  if (foundTab.status !== 'Open') {
    throw ApolloError('BadRequest', "Tab Not Open Yet")
  }

  console.log('foundTab', foundTab)

  const foundUser = await User.findOne({ phoneNumber: input.phoneNumber })

  console.log('foundUser', foundUser)

  if (!foundUser) {

    const newUser = await User.create({
      name: input.name,
      phoneNumber: input.phoneNumber,
    })

    const newRequest = await Request.create({
      requestor: newUser._id,
      admin: tabAdmin._id,
      tab: foundTab._id,
      status: 'Pending',
    })
    console.log('newRequest', newRequest)

    return await tokenClient({
      _id: newUser._id,
      request: newRequest._id,
      business: input.business,
    })
  }

  console.log('foundUser', foundUser)

  const newRequest = await Request.create({
    requestor: foundUser._id,
    admin: tabAdmin._id,
    tab: foundTab._id,
    status: 'Pending',
  })
  //todo: logic for existing user

  return await tokenClient({
    _id: foundUser._id,
    request: newRequest._id,
    business: input.business,
  })

}

const declineInvitation = async (
  _parent: any,
  { input }: {
    input: {
      _id: string,
    }
  },
  { db }: Context
) => {
  const Request = RequestModel(db)
  const foundRequest = await Request.findOne({ _id: input._id })

  console.log("request id", input._id)

  if (!foundRequest) throw ApolloError('BadRequest', "Request Not Found")

  // check if the request is pending
  if (foundRequest.status !== 'Pending') {
    throw ApolloError('BadRequest', "Request Not Pending")
  }

  foundRequest.status = 'Rejected';

  return await foundRequest.save();
}

const acceptInvitation = async (
  _parent: any,
  { input }: {
    input: {
      _id: string,
    }
  },
  { db }: Context
) => {
  const Tab = TabModel(db);
  const Request = RequestModel(db)
  const foundrequest = await Request.findOne({ _id: input._id })

  if (!foundrequest) {
    throw ApolloError('BadRequest', "Request Not Found")
  }

  const foundTab = await Tab.findOne({ _id: foundrequest.tab })

  if (!foundTab) {
    throw ApolloError('BadRequest', "Tab Not Found")
  }

  // change Request status to accepted
  foundrequest.status = 'Accepted';
  await foundrequest.save();

  // add user to tab
  foundTab.users.push(foundrequest.requestor)
  await foundTab.save();

  return foundrequest;
}

export const RequestResolverMutation = {
  openTabRequest,
  acceptTabRequest,
  declineTabRequest,
  requestJoinTab,
  declineInvitation,
  acceptInvitation,
}


