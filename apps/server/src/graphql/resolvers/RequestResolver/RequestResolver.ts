import { UserModel } from "../../../models"
import { Context } from "../types"


// from the parent Request, get information about the user
const getUserFromRequest = async (parent: any, _args: any, { db }: Context) => {
  const User = UserModel(db)
  const foundUser = await User.findOne({ _id: parent.admin })
  return foundUser
}

export const RequestResolver = {
  getUserFromRequest
}