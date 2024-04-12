import { Connection } from "mongoose";
import { BusinessModel, OrderDetailModel, ProductModel } from "../../../models";
import { Checkout } from "../../../models/checkout";
import { ApolloError } from "../../ApolloErrorExtended/ApolloErrorExtended";
import { Bugsnag } from '../../../bugsnag/bugsnag';
import { NotificationModel } from "../../../models/notification";
import { db } from "../../../dbConnection";

export const updateProductQuantity = async (foundCheckout: Checkout, db: Connection) => {
  const ordersDetails = await OrderDetailModel(db).find({ _id: { $in: foundCheckout.orders } });

  for (const order of ordersDetails) {
    // from each order, subtract the products with the quantity
    const quantity = order.quantity
    const product = await ProductModel(db).findById(order.product)

    if (!product) {
      Bugsnag.notify(`Product not found`)
      return
    }

    product.totalOrdered += quantity;

    if (product?.quantity && product.quantity < quantity) {
      product.quantity = 0; // Set quantity to zero since it's insufficient   
    } else if (product?.quantity && product.quantity >= quantity) {
      product.quantity -= quantity;
    } else {
      // this should not even have to be reached
      // The product has no quantity, but it's set to block on zero quantity
      if (product?.blockOnZeroQuantity) {
        Bugsnag.notify(`Insufficient quantity for product ${product?._id}`)
      }
    }

    await product.save();
  }
}

export const getCountry = async ({
  db, business, input
}: { db: Connection, business?: string, input?: string | null }): Promise<"BR" | "US"> => {

  const foundBusiness = await BusinessModel(db).findById(business)

  if (!foundBusiness || !foundBusiness?.country) {
    throw ApolloError(new Error("you need a country"), "Unauthorized")
  }

  return foundBusiness.country
}

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
    message: "You just made a payment!",
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