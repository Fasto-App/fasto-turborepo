import { JoinTabForm, NewTabForm, newTabSchema, RequestStatusType, RequestStatus } from "app-helpers";
import { withFilter } from "graphql-subscriptions";
import { BusinessModel, UserModel, RequestModel, TabModel, TableModel } from "../../../models";
import { ApolloError } from "../../ApolloErrorExtended/ApolloErrorExtended";
import { NUMBER_INCREMENTED, pubsub, TAB_REQUEST, TAB_REQUEST_RESPONSE } from "../pubSub";
import { Context } from "../types"
import { tokenClient } from "../utils";

// client request a table
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
      requestor: client,
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
    requestor: foundUserByPhone._id,
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

// business accepts table request
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

  const tab = await Tab.create({
    table: table?._id,
    admin: foundRequest?.requestor,
    users: [foundRequest.requestor._id, ...usersId],
    type: 'DineIn',
  });

  if (!tab) throw ApolloError('BadRequest', "Tab Not Created")

  table.status = 'Occupied';
  table.tab = tab._id;
  await table.save();

  foundRequest.status = 'Accepted';
  foundRequest.tab = tab._id;

  await foundRequest.save();

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


// todo: Create a new Request, from a guest to a requestee
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
      requestor: newUser._id,
      admin: tabAdmin._id,
      status: 'Pending',
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
    requestor: foundUser._id,
    admin: tabAdmin._id,
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
  { db, client }: Context
) => {
  if (!client) {
    throw ApolloError('Unauthorized', "Client Not Found", "client")
  }

  const Tab = TabModel(db);
  const Request = RequestModel(db)
  const foundrequest = await Request.findOne({ _id: input._id })

  if (!foundrequest) {
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
  foundrequest.status = 'Accepted';
  foundrequest.tab = foundTab._id;
  await foundrequest.save();

  foundTab.users = [...foundTab.users, foundrequest.requestor]
  await foundTab.save();

  return foundrequest;
}

const createNewTakeoutOrDelivery = async (
  _parent: any,
  { input }: { input: JoinTabForm & { business: string } },
  { db, client }: Context
) => {
  // 

  //create new request with accepted status

  const Request = RequestModel(db)
  const User = UserModel(db)
  const Tab = TabModel(db)

  // get the user if exists

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
    })

    const newRequest = await Request.create({
      requestor: newUser._id,
      admin: newUser._id,
      tab: newTab._id,
      status: 'Accepted',
    })

    console.log("newTab", newTab)

    return await tokenClient({
      _id: newUser._id,
      request: newRequest._id,
      business: input.business,
    })
  }

  // see if the user has a request and/or a tab
  const foundRequest = await Request.findOne({
    requestor: foundUser._id,
    // status either pending or accepted
    $or: [
      { status: 'Pending' },
      { status: 'Accepted' }
    ]
  })

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
    status: 'Open',
    type: 'Takeout',
  })

  const newRequest = await Request.create({
    requestor: foundUser._id,
    admin: foundUser._id,
    tab: newTab._id,
    status: 'Accepted',
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


