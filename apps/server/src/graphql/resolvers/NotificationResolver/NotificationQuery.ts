import { QueryResolvers } from "../../../generated/graphql";
import { NotificationModel } from "../../../models/notification";
import { ApolloError } from "../../ApolloErrorExtended/ApolloErrorExtended";

// @ts-ignore
export const getNotificationByBusiness: QueryResolvers['getNotificationByBusiness'] = async (
  _parent,
  _args,
  { db, business }
) => {
  if (!business) throw ApolloError(new Error("No business id"), 'Unauthorized')

  const foundNotifications = await NotificationModel(db).find({ business_receiver_id: business });

  return foundNotifications;
};

export const NotificationQuery = {
  getNotificationByBusiness,
};