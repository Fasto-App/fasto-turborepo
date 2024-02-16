import { Connection } from "mongoose";
import { AddressModel, BusinessModel, OrderDetailModel, ProductModel } from "../../../models";
import { Checkout } from "../../../models/checkout";
import { ApolloError } from "../../ApolloErrorExtended/ApolloErrorExtended";
import { Bugsnag } from '../../../bugsnag/bugsnag';

export const updateProductQuantity = async (foundCheckout: Checkout, db: Connection) => {
  const ordersDetails = await OrderDetailModel(db).find({ _id: { $in: foundCheckout.orders } });
  const Product = ProductModel(db)

  for (let order of ordersDetails) {
    // from each order, subtract the products with the quantity
    const quantity = order.quantity
    const product = await Product.findById(order.product)

    // subtract
    if (product?.quantity && product.quantity >= quantity) {
      product.quantity = product.quantity - quantity;
      product.totalOrdered = product.totalOrdered + quantity
      await product.save();
      console.log(`Product ${product._id} has been updated`);
    } else {
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