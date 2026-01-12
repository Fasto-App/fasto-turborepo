import { MutationResolvers } from "../../../generated/graphql";
import { NotificationModel } from "../../../models/notification";
import { ApolloError } from "../../ApolloErrorExtended/ApolloErrorExtended";

// @ts-ignore
const changeNotificationStatus: MutationResolvers["changeNotificationStatus"] = async (_parent, { id }, { db, business }) => {

  // find the notification and change read status
//   const notificationRead = await NotificationModel(db).findOneAndUpdate({ _id: id }, 
//     { $set: { isRead: { $not: "$isRead" } } }
//   , { new: true })

const notificationRead = await NotificationModel(db).findOne({ _id: id });

  if (!notificationRead) {
    throw ApolloError(new Error("Notification not found or unauthorized"), 'NotFound')
  }

  // Toggle the isRead field using JavaScript logic
  notificationRead.isRead = !notificationRead.isRead;
  await notificationRead.save();

//   if (!notificationRead) {
//     throw ApolloError(new Error("Notification not found or unauthorized"), 'NotFound')
//   }

  return notificationRead
}

export const NotificationMutation = {
  changeNotificationStatus
}