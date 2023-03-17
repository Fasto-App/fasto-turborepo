import { ApolloError } from "../../ApolloErrorExtended/ApolloErrorExtended";
import { Context } from "../types"

const openTabRequest = async (
  _parent: any,
  { input }: { input: any },
  { db, business }: Context
) => {

  console.log('openTabRequest', input)

  // find the business
  // find the user with the phone number
  // create user
  // create request, which restaurant should then accept
  // upon acceptance, create tab

  // send information about the user to the user
  // in form of token?

  return null
}

export const RequestResolverMutation = {
  openTabRequest,
}
