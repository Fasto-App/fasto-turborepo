import { db } from "../../../dbConnection";
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

    let query: any = { business_receiver_id: business };

    if (_args.input && _args.input.isRead !== null) { 
        query.isRead = _args.input.isRead;   
    }    
    
    const foundNotifications = await NotificationModel(db).find(query).sort({createdAt: -1}).limit(10);    
    
    return foundNotifications; 

};



// @ts-ignore
export const getNotificationByCustomer: QueryResolvers['getNotificationByCustomer'] = async (
    _parent,
    _args,
    { db, client }
  ) => {
    if (!client) throw ApolloError(new Error("No client id"), 'Unauthorized')
        
      let query: any = { customer_receiver_id: client._id, sender_id: client.business };
  
      if (_args.input && _args.input.isRead !== null) { 
          query.isRead = _args.input.isRead;   
      }    
      
      const foundNotifications = await NotificationModel(db).find(query).sort({ createAt: -1}); 
      
      return foundNotifications; 
  
  };
export const NotificationQuery = {
  getNotificationByBusiness,
  getNotificationByCustomer
};
  

export const testMongoDBQuery = async (businessId: string) => {
  if (!businessId) throw ApolloError(new Error("No business id"), 'Unauthorized')

  const foundNotifications = await NotificationModel(db)
    .find({ business_receiver_id: businessId })

  return foundNotifications
}