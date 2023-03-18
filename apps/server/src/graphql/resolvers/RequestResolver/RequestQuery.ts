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


  console.log('foundClient', foundClient)
  console.log('foundRequest', foundRequest)
  return foundRequest

}

export const RequestResolverQuery = {
  getTabRequest,
}