import { Connection } from "mongoose";
import { AddressModel, BusinessModel, OrderDetailModel, ProductModel } from "../../../models";
import { Checkout } from "../../../models/checkout";
import { ApolloError } from "../../ApolloErrorExtended/ApolloErrorExtended";
import { Bugsnag } from '../../../bugsnag/bugsnag';
import { NotificationModel } from "../../../models/notification";
import { db } from "../../../dbConnection";

export const updateProductQuantity = async (foundCheckout: Checkout, db: Connection) => {
  const ordersDetails = await OrderDetailModel(db).find({ _id: { $in: foundCheckout.orders } });
  const Product = ProductModel(db)

  for (const order of ordersDetails) {
    // from each order, subtract the products with the quantity
    const quantity = order.quantity
    const product = await Product.findById(order.product)

    // subtract
    if (product?.quantity && product.quantity >= quantity) {
      product.quantity = product.quantity - quantity;
      product.totalOrdered = product.totalOrdered + quantity
      return await product.save();
    }

    if (product?.blockOnZeroQuantity) {
      Bugsnag.notify(`Insufficient quantity for product ${product?._id}`)
    }
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

export const createBusinessNotification = async (
  message: string,
  businessId: string,
  customerSenderId: string,
  path?: string
) => {
  const Notification = NotificationModel(db);
  const newNotification = await Notification.create({
    business_sender_id: businessId,
    message,
    sender_id: customerSenderId,
    path
  });

  return newNotification;
};


export const createCustomerNotification = async (
  customerId: string,
  businessUserId: string,
  message: string,
  path?: string
) => {
  const Notification = NotificationModel(db);
  const newNotification = await Notification.create({
    customer_sender_id: customerId,
    message,
    sender_id: businessUserId,
    path
  });

  return newNotification;
};