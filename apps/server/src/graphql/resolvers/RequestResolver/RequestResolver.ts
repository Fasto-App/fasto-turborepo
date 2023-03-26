import { UserModel } from "../../../models"
import { Context } from "../types"


// from the parent Request, get information about the user
const getAdminFromRequest = async (parent: any, _args: any, { db }: Context) => {
  const User = UserModel(db)
  const foundUser = await User.findOne({ _id: parent.admin })
  return foundUser
}

const getRequestorFromRequest = async (parent: any, _args: any, { db }: Context) => {
  const User = UserModel(db)
  return await User.findOne({ _id: parent.requestor })
}

export const RequestResolver = {
  getAdminFromRequest,
  getRequestorFromRequest,
}