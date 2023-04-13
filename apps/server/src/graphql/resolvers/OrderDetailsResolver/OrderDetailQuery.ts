import { QueryResolvers } from "../../../generated/graphql";
import { OrderDetailModel, RequestModel, TabModel } from "../../../models";
import { ApolloError } from "../../ApolloErrorExtended/ApolloErrorExtended";
import { Context } from "../types";

// @ts-ignore
const getOrderDetailByID: QueryResolvers["getOrderDetailByID"] = async (_parent: any, { orderDetailID }, { db }) => {
  const OrderDetail = OrderDetailModel(db);
  const orderDetail = await OrderDetail.findOne({ _id: orderDetailID });
  return orderDetail || [];
}

const getAllOrderDetailsByOrderID = async (_parent: any, { input }: { input: any }, { db }: Context) => {
  const OrderDetail = OrderDetailModel(db);
  const allOrderDetailsByOrderID = await OrderDetail.find({ order: input.id });
  return allOrderDetailsByOrderID;
}

const getOrdersByTabID = async (_parent: any, { input }: { input: any }, { db }: Context) => {
  const OrderDetail = OrderDetailModel(db);
  const allOrderDetailsByTabID = await OrderDetail.find({ tab: _parent._id.toString() });
  return allOrderDetailsByTabID || [];
}

// @ts-ignore
const getOrdersBySession: QueryResolvers["getOrdersBySession"] = async (_parent, args, { db, client }) => {
  const OrderDetail = OrderDetailModel(db);
  const Request = RequestModel(db);
  const Tab = TabModel(db);

  const foundRequest = await Request.findOne({ _id: client?.request });
  if (!foundRequest) throw ApolloError("NotFound");

  const foundTab = await Tab.findOne({ _id: foundRequest?.tab });
  if (!foundTab) throw ApolloError("NotFound");

  return await OrderDetail.find({ tab: foundTab._id });
}


export const OrderDetailsResolverQuery = {
  getOrderDetailByID,
  getAllOrderDetailsByOrderID,
  getOrdersBySession
}
export const OrderDetailsResolver = {
  getOrdersByTabID
}