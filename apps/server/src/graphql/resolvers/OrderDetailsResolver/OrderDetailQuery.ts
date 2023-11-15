import { ObjectId } from "mongodb";
import { DateType, QueryResolvers } from "../../../generated/graphql";
import { OrderDetailModel, ProductModel, RequestModel, TabModel } from "../../../models";
import { ApolloError } from "../../ApolloErrorExtended/ApolloErrorExtended";
import { Context } from "../types";
import { getDaysAgo } from "../utils";

// @ts-ignore
const getOrderDetailByID: QueryResolvers["getOrderDetailByID"] = async (_parent: any, { orderDetailID }, { db }) => {
  const OrderDetail = OrderDetailModel(db);
  const orderDetail = await OrderDetail.findOne({ _id: orderDetailID });
  return orderDetail || [];
}

// TODO: implement this when theres a way to get OrderDetails from businesses
const getAllOrderDetailsByDate = async (_parent: any, { input }: any, { db, business }: Context) => {

  // TODO: replace with the input data
  const { days, daysAgo } = getDaysAgo(DateType.SevenDays);

  const products = await ProductModel(db).find({ business });
  const productsObjects = products.map(product => new ObjectId(product._id))

  const matchQuery: any = {
    product: { $in: productsObjects },
  };

  if (true || input.type !== DateType.AllTime) {
    matchQuery.created_date = {
      $gte: daysAgo,
    };
  }

  const aggregatedOrders = await OrderDetailModel(db).aggregate([
    { $match: matchQuery },
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m-%d', date: '$created_date' } },
        count: { $sum: '$quantity' } // Count the number of orders for each day
      }
    },
    {
      $sort: { _id: 1 },
    }
  ]);

  return aggregatedOrders
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
  getOrdersBySession,
  getAllOrderDetailsByDate
}
export const OrderDetailsResolver = {
  getOrdersByTabID
}