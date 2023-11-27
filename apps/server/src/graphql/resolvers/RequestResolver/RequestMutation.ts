import { RequestStatusType } from "app-helpers";
import { withFilter } from "graphql-subscriptions";
import { BusinessModel, UserModel, RequestModel, TabModel, TableModel } from "../../../models";
import { ApolloError } from "../../ApolloErrorExtended/ApolloErrorExtended";
import { pubsub, TAB_REQUEST, TAB_REQUEST_RESPONSE } from "../pubSub";
import { Context } from "../types"
import { tokenClient } from "../utils";
import { MutationResolvers } from "../../../generated/graphql";

// client request a table
const openTabRequest: MutationResolvers["openTabRequest"] = async (
  _parent,
  { input },
  { db }
) => {

  const { business, phoneNumber, name, totalGuests, } = input

  // check if business exists
  const Business = BusinessModel(db)
  const Request = RequestModel(db)
  const User = UserModel(db)
  const foundBusiness = await Business.findById(business)

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

    pubsub.publish(TAB_REQUEST, { onTabRequest: newRequest })

    return await tokenClient({
      _id: newClient._id,
      request: newRequest._id,
      business,
    })
  }

  // the status should be either pending or accepted
  const foundRequest = await Request.findOne({
    business: foundBusiness._id,
    $or: [{ requestor: foundUserByPhone._id }, { admin: foundUserByPhone._id }],
    status: { $in: ['Pending', 'Accepted'] as RequestStatusType[] }
  })

  if (foundRequest) {
    return await tokenClient({
      _id: foundUserByPhone._id,
      request: foundRequest._id,
      business,
    })
  }

  const newRequest = await createNewRequest(foundUserByPhone._id)

  pubsub.publish(TAB_REQUEST, { onTabRequest: newRequest })

  return await tokenClient({
    _id: foundUserByPhone._id,
    request: newRequest._id,
    business,
  })
}

// Business accepts a Request to get a Table
// @ts-ignore
const acceptTabRequest: MutationResolvers["acceptTabRequest"] = async (
  _parent,
  { input },
  { db, business }
) => {
  const Tab = TabModel(db);
  const Request = RequestModel(db)
  const Table = TableModel(db);
  const User = UserModel(db)

  const foundRequest = await Request.findOne({
    _id: input.request,
    business,
    status: 'Pending',
  })

  if (!foundRequest) {
    throw ApolloError('BadRequest', "Request Not Found or Not Pending")
  }

  const foundAdmin = await User.findOne({ _id: foundRequest.admin })
  if (!foundAdmin) throw ApolloError('BadRequest', "Admin Not Found")

  const table = await Table.findOne({ _id: input.table, business });

  if (!table) throw ApolloError('BadRequest', "Table Not Found")
  if (table.status !== 'Available') throw ApolloError('BadRequest', "Table Not Available")

  // create all the other users. total guests - 1
  const numGuests = (foundRequest.totalGuests || 1) - 1;

  let allUsersIds: string[] = []

  if (numGuests > 0) {
    const allUsers = await User.insertMany(new Array(numGuests).fill({ isGuest: true }))
    allUsers.forEach(user => {
      if (user._id) allUsersIds.push(user._id)
    })
  }

  const tab = await Tab.create({
    table: table._id,
    admin: foundAdmin._id,
    users: [foundAdmin._id, ...allUsersIds],
    type: 'DineIn',
  });

  if (!tab) throw ApolloError('BadRequest', "Tab Not Created")

  foundRequest.status = 'Accepted';
  foundRequest.tab = tab._id;
  await foundRequest.save();

  table.status = 'Occupied';
  table.tab = tab._id;
  await table.save();

  pubsub.publish(TAB_REQUEST_RESPONSE, { onTabRequestResponse: foundRequest })

  return foundRequest
}

// business decline tab request
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

  pubsub.publish(TAB_REQUEST_RESPONSE, { onTabRequestResponse: foundRequest })

  return await foundRequest.save();
}


// TODO: Create a new Request, from a guest to a requestee
const requestJoinTab: MutationResolvers["requestJoinTab"] = async (
  _parent,
  { input },
  { db }
) => {
  const Tab = TabModel(db)
  const User = UserModel(db)
  const Request = RequestModel(db)

  const foundTab = await Tab.findOne({ _id: input.tab })
  const tabAdmin = await User.findOne({ _id: input.admin })

  if (!tabAdmin) throw ApolloError('BadRequest', "Tab Admin Not Found")
  if (!foundTab) throw ApolloError('BadRequest', "Request Not Found")

  if (foundTab.status !== 'Open') {
    throw ApolloError('BadRequest', "Tab Not Open")
  }

  const foundUser = await User.findOne({ phoneNumber: input.phoneNumber })

  if (!foundUser) {

    const newUser = await User.create({
      name: input.name,
      phoneNumber: input.phoneNumber,
    })

    const newRequest = await Request.create({
      admin: input.admin,
      requestor: newUser._id,
      status: 'Pending',
      business: input.business,
    })
    console.log('newRequest', newRequest)

    return await tokenClient({
      _id: newUser._id,
      request: newRequest._id,
      business: input.business,
    })
  }

  // does the user already have a request to this tab?
  const foundRequest = await Request.findOne({
    requestor: foundUser._id,
    business: input.business,
    status: { $in: ['Pending', 'Accepted'] as RequestStatusType[] }
  })

  if (foundRequest) {
    return await tokenClient({
      _id: foundUser._id,
      request: foundRequest._id,
      business: input.business,
    })
  }

  const newRequest = await Request.create({
    admin: input.admin,
    requestor: foundUser._id,
    status: 'Pending',
    business: input.business,
  })
  //TODO: logic for existing user

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
  { db, client }: Context
) => {
  if (!client) {
    throw ApolloError('Unauthorized', "Client Not Found", "client")
  }

  const Tab = TabModel(db);
  const Request = RequestModel(db)
  const pendingRequest = await Request.findOne({ _id: input._id })

  if (!pendingRequest) {
    throw ApolloError('BadRequest', "Request Not Found")
  }

  const adminRequest = await Request.findById(client?.request)

  if (!adminRequest) {
    throw ApolloError('BadRequest', "Request Not Found")
  }

  const foundTab = await Tab.findOne({ _id: adminRequest?.tab })

  if (!foundTab) {
    throw ApolloError('BadRequest', "Tab Not Found")
  }

  // change Request status to accepted
  pendingRequest.status = 'Accepted';
  pendingRequest.tab = foundTab._id;
  await pendingRequest.save();

  foundTab.users = [...foundTab.users, pendingRequest.requestor]
  await foundTab.save();

  return pendingRequest;
}

const createNewTakeoutOrDelivery: MutationResolvers['createNewTakeoutOrDelivery'] = async (
  _parent,
  { input },
  { db, client }
) => {
  const Request = RequestModel(db)
  const User = UserModel(db)
  const Tab = TabModel(db)

  const foundUser = await User.findOne({ phoneNumber: input.phoneNumber })

  if (!foundUser) {

    const newUser = await User.create({
      name: input.name,
      phoneNumber: input.phoneNumber,
    })

    const newTab = await Tab.create({
      business: input.business,
      admin: newUser._id,
      users: [newUser._id],
      status: 'Open',
      type: input.type,
    })

    const newRequest = await Request.create({
      admin: newUser._id,
      tab: newTab._id,
      status: 'Accepted',
      business: input.business,
    })

    return await tokenClient({
      _id: newUser._id,
      request: newRequest._id,
      business: input.business,
    })
  }

  // see if the user has a request and/or a tab
  const foundRequest = await Request.findOne({
    business: input.business,
    $or: [
      { admin: foundUser._id }, // Find requests with the admin matching the ID
      { requestor: foundUser._id }, // Find requests with the requestor matching the ID
    ],
    // status either pending or accepted
    status: { $in: ['Pending', 'Accepted'] }, // Include requests with status 'Pending' or 'Accepted'
  });

  console.log('foundRequest', foundRequest)
  console.log('foundRequest', foundRequest)

  if (foundRequest) {

    return await tokenClient({
      _id: foundUser._id,
      request: foundRequest._id,
      business: input.business,
    })
  }

  const newTab = await Tab.create({
    business: input.business,
    admin: foundUser._id,
    users: [foundUser._id],
    status: 'Open',
    type: input.type,
  })

  const newRequest = await Request.create({
    admin: foundUser._id,
    tab: newTab._id,
    status: 'Accepted',
    business: input.business,
  })

  return await tokenClient({
    _id: foundUser._id,
    request: newRequest._id,
    business: input.business,
  })

}


export const RequestResolverMutation = {
  openTabRequest,
  acceptTabRequest,
  declineTabRequest,
  requestJoinTab,
  declineInvitation,
  acceptInvitation,
  createNewTakeoutOrDelivery
}

export const RequestSubscription = {
  onTabRequest: {
    subscribe: withFilter(
      () => pubsub.asyncIterator(TAB_REQUEST),
      (payload, _, { business }: Context) => {

        if (business) {
          return payload.onTabRequest.business?.toString() === business
        }

        return false
      }
    )
  },
  numberIncremented: {
    subscribe: withFilter(() => pubsub.asyncIterator(['NUMBER_INCREMENTED']),
      (payload, _, { client, }: Context) => {

        console.log('client', client)
        console.log('payload', payload)

        // if (client) {
        //   return payload.onTabRequestResponse.requestor?.toString() === client._id ||
        //     payload.onTabRequestResponse.admin?.toString() === client._id
        // }

        return true
      })
  },
  onTabRequestResponse: {
    subscribe: withFilter(
      () => pubsub.asyncIterator(TAB_REQUEST_RESPONSE),
      (payload, _, { client }: Context) => {

        console.log('payload', payload)
        console.log('client', client)


        if (client) {

          return payload.onTabRequestResponse.requestor?.toString() === client._id ||
            payload.onTabRequestResponse.admin?.toString() === client._id
        }

        return false
      }
    )
  },
}


