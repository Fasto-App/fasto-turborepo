import { RequestStatus, RequestStatusType } from "app-helpers"
import { AddressModel, RequestModel, TabModel, UserModel } from "../../../models"
import { ApolloError } from "../../ApolloErrorExtended/ApolloErrorExtended"
import { Context } from "../types"


const getClientSession = async (
  _parent: any,
  _args: any,
  { db, client }: Context
) => {
  if (!client) {
    throw ApolloError('Unauthorized', "invalid client token", "client")
  }

  const User = UserModel(db)
  const Request = RequestModel(db)
  const Tab = TabModel(db)

  // if the request is accepted, but the tab is null
  // we need to send a new token with the tab
  const foundRequest = await Request.findOne({ _id: client.request })
  const foundUser = await User.findOne({ _id: client._id })
  const foundTab = await Tab.findOne({ _id: foundRequest?.tab })

  if (foundUser?.address) {
    const foundAddress = await AddressModel(db).findById(foundUser.address)

    if (!foundAddress) throw ApolloError("NotFound", "Address not found, but not empty");
    foundUser.address = foundAddress
  }

  return ({
    request: foundRequest,
    user: foundUser,
    tab: foundTab,
  })
}

// This request if for the client to get their request
// the request will be the one that is pending or accepted
// if they are already in a tab, they will be redirected to the tab
const getTabRequest = async (
  _parent: any,
  args: any,
  { db, client }: Context
) => {
  console.log('client', client)

  if (!client) {
    throw ApolloError('Unauthorized', "invalid client token", "client")
  }

  const Request = RequestModel(db)
  const foundRequest = await Request.findOne({ _id: client.request })

  return foundRequest
}

const getTabRequests = async (
  _parent: any,
  { input }: {
    input: {
      filterBy?: RequestStatusType
    }
  },
  { db, business }: Context
) => {
  const Request = RequestModel(db)
  const foundRequests = await Request.find({
    business: business,
    tab: undefined,
    ...(input?.filterBy ? { status: input.filterBy } : {})
  })

  return foundRequests
}

const getPendingInvitations = async (
  _parent: any,
  _args: any,
  { db, client }: Context
) => {
  if (!client) throw ApolloError("Unauthorized", "You're no one", "client");

  const Request = RequestModel(db)
  return await Request.find({
    admin: client._id,
    status: RequestStatus.Pending
  })
}

export const RequestResolverQuery = {
  getTabRequest,
  getTabRequests,
  getPendingInvitations,
  getClientSession
}

// get all the requests for a business, and accept filters
