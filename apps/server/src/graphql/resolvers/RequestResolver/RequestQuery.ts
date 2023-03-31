import { RequestStatus } from "app-helpers"
import { RequestModel, TabModel, UserModel } from "../../../models"
import { ApolloError } from "../../ApolloErrorExtended/ApolloErrorExtended"
import { Context } from "../types"

// This request if for the client to get their request
// the request will be the one that is pending or accepted
// if they are already in a tab, they will be redirected to the tab
export const getTabRequest = async (
  _parent: any,
  { input }: {
    input: {
      business: string, phoneNumber: string
    }
  },
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
      filterBy?: RequestStatus
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
  { input }: { input: { tab: string } },
  { db, client }: Context
) => {
  // an admin user will get all the pending request for an open Tab
  // the input will be the tab id
  // no business id will be needed

  // todo: add the tab to the token
  if (!client) throw ApolloError("Unauthorized", "You're no one", "client");

  const Request = RequestModel(db)
  const foundRequests = await Request.find({
    tab: input.tab,
    admin: client?._id,
    status: "Pending"
  })

  return foundRequests
}

export const RequestResolverQuery = {
  getTabRequest,
  getTabRequests,
  getPendingInvitations
}

// get all the requests for a business, and accept filters
