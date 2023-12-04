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
    throw ApolloError(new Error("No client session"), 'Unauthorized', "customer")
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

    if (!foundAddress) throw ApolloError(new Error("Address not found, but not empty"), "NotFound",);
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
  if (!client) {
    throw ApolloError(new Error("invalid client token"), 'Unauthorized', "customer")
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
  if (!client) throw ApolloError(new Error("You're no one"), "Unauthorized", "customer");

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
