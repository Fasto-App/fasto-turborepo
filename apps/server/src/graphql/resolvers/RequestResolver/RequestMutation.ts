import { NewTabForm, newTabSchema } from "app-helpers";
import { BusinessModel, UserModel, RequestModel } from "../../../models";
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
    status: { $in: ['pending', 'accepted'] }
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

export const RequestResolverMutation = {
  openTabRequest,
}
