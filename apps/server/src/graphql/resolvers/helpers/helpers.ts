import { Connection } from "mongoose";
import { OrderDetailModel, ProductModel } from "../../../models";
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