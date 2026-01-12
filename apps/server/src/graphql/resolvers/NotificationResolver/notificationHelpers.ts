import { db } from "../../../dbConnection";
import { NotificationModel } from "../../../models/notification";


// this notification is for the business to view and is the receiver
export const createBusinessNotification = async ({
    businessId,
    sender_id,
    path,
    message
  }: {
    message: string,
    businessId: string,
    sender_id: string,
    path?: string
  }
  ) => {
    const Notification = NotificationModel(db);
    // the problem here is that the business is null
    const newNotification = await Notification.create({
      business_receiver_id: businessId,
      message,
      sender_id,
      path
    });
  
    return newNotification;
  };
  
  export const createBusinessRequestNotification = async (sender: string, businessId: string) => {
      // business/admin/orders
      return await createBusinessNotification({
        sender_id: sender,
        businessId: businessId,
        path: 'business/admin/orders',
        message: "Request for Table!",
      });
    }
  
  // when a payment is made by a customer
  export const createBusinessPaymentNotification = async (sender: string, businessId: string, paymentId: string) => {
    // business/admin/orders
    return await createBusinessNotification({
      sender_id: sender,
      businessId: businessId,
      path: `business/admin/payments?paymentId=${paymentId}`,
      message: "You just received a payment!",
    });
  }
  
  export const createBusinessOrderNotification = async (sender: string, businessId: string, orderId: string) => {
      // business/admin/orders
      return await createBusinessNotification({
          sender_id: sender,
          businessId: businessId,
        path: `business/admin/orders?orderId${orderId}`,
        message: "Order Requested!",
      });
    }
  
  type CustomerNotification = {
    customerId: string,
    businessUserId: string,
    message: string,
    path?: string
  }
  
  // this notification is for the customer to view and is the receiver
  export const createCustomerNotification = async ({
    businessUserId,
    customerId,
    message,
    path
  }: CustomerNotification
  ) => {
    const Notification = NotificationModel(db);
    const newNotification = await Notification.create({
      message,
      sender_id: businessUserId,
      customer_receiver_id: customerId,
      path
    });
  
    return newNotification;
  };
  
  // when a order is made by a customer
  export const createCustomerOrderNotification = async (sender: string, customerId: string, orderId: string) => {
    // business/admin/orders
    return await createCustomerNotification({
      businessUserId: sender,
      customerId: customerId,
      path: `business/admin/orders?orderId${orderId}`,
      message: "Your Order was Sent!",
    });
  }
  
  // when a customer requests a table
  // notification is working properly
  export const createCustomerRequestNotification = async (sender: string, customerId: string) => {
    // business/admin/orders
    return await createCustomerNotification({
      businessUserId: sender,
      customerId: customerId,
      path: 'business/admin/orders',
      message: "Your Table is Ready!",
    });
  }