import { RequestStatus } from "app-helpers"
import { RequestModel, UserModel } from "../../../models"
import { ApolloError } from "../../ApolloErrorExtended/ApolloErrorExtended"
import { Context } from "../types"

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

  const User = UserModel(db)
  const Request = RequestModel(db)

  const foundClient = await User.findOne({ _id: client._id })
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
    ...(input?.filterBy ? { status: input.filterBy } : {})
  })

  console.log('foundRequests', foundRequests)

  return foundRequests
}

export const RequestResolverQuery = {
  getTabRequest,
  getTabRequests
}

// get all the requests for a business, and accept filters
