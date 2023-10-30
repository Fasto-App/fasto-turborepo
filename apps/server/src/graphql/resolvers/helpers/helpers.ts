import { Connection } from "mongoose";
import { AddressModel, BusinessModel, OrderDetailModel, ProductModel } from "../../../models";
import { Checkout } from "../../../models/checkout";

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
      await product.save();
      console.log(`Product ${product._id} has been updated`);
    } else {
      console.error(`Insufficient quantity for product ${product?._id}`);
    }
  }
}

export const getCountry = async ({
  db, business, input
}: { db: Connection, business?: string, input?: string | null }): Promise<"BR" | "US" | undefined> => {

  if (input === "BR") return input
  if (input === "US") return input

  let country: "US" | "BR" | undefined = undefined;

  if (business) {
    const foundBusiness = await BusinessModel(db).findById(business)
    // if country exist return on Business Model return
    if (foundBusiness?.country) {
      country = foundBusiness.country

    } else if (foundBusiness?.address) {
      const foundAddress = await AddressModel(db).findById(foundBusiness.address)

      if (foundAddress?.country) {
        country = foundAddress.country
      }
    }
  }
  return country
}