import { Connection } from "mongoose";
import { BusinessModel, OrderDetailModel, ProductModel } from "../../../models";
import { Checkout } from "../../../models/checkout";
import { ApolloError } from "../../ApolloErrorExtended/ApolloErrorExtended";
import { Bugsnag } from '../../../bugsnag/bugsnag';

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

    if (product?.quantity && product.quantity >= quantity) {
      product.quantity -= quantity;
      return await product.save();
    } else if (product?.quantity && product.quantity < quantity) {
      product.quantity = 0; // Set quantity to zero since it's insufficient    
      return await product.save();
    } else if (product?.blockOnZeroQuantity) {
      // The product has no quantity, but it's set to block on zero quantity
      // this should not even have to be reached
      Bugsnag.notify(`Insufficient quantity for product ${product?._id}`)
    }

    return await product.save();
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