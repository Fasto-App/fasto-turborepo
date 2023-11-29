import { ObjectId } from "mongodb";
import { DateType, QueryResolvers } from "../../../generated/graphql";
import { CheckoutModel } from "../../../models/checkout";
import { ApolloError } from "../../ApolloErrorExtended/ApolloErrorExtended";
import { Context } from "../types";
import { getDaysAgo } from "../utils";

// @ts-ignore
export const getCheckoutByID: QueryResolvers["getCheckoutByID"] = async (parent, { input }, { db, client, user }) => {
  const Checkout = CheckoutModel(db);

  if (!client && !user) throw ApolloError(new Error("You must be logged in to perform this action"), "Unauthorized",)

  const checkout = await Checkout.findOne({ _id: input._id, business: client?.business || user?.business });
  if (!checkout) throw ApolloError(new Error("Checkout not found"), "NotFound",);
  return checkout
}

// @ts-ignore
export const getCheckoutsByBusiness: QueryResolvers["getCheckoutsByBusiness"] = async (_parent, { page = 1, pageSize = 10 }, { db, business }) => {
  if (!business) {
    throw ApolloError(new Error("no business"), "Unauthorized")
  }
  const skip = (page - 1) * pageSize;

  const checkouts = await CheckoutModel(db).find({ business }).skip(skip).limit(pageSize).sort({ _id: -1 });
  return checkouts
}

// @ts-ignore
export const getOrdersByCheckout: QueryResolvers["getOrdersByCheckout"] = async (parent, { input }, { db }) => {
  const Checkout = CheckoutModel(db);
  const checkout = await Checkout.findById(input._id);

  if (!checkout) throw ApolloError(new Error("Checkout not found"), "NotFound",);

  return checkout
}

type AveragePerDay = {
  _id: string; totalAmount: number
}

export const getPaidCheckoutByDate: QueryResolvers["getPaidCheckoutByDate"] = async (par, { input }, { db, user, business }) => {

  let { days, daysAgo } = getDaysAgo(input.type);

  const matchQuery: any = {
    business: new ObjectId(business),
    paid: true,
  };

  if (input.type !== DateType.AllTime) {
    matchQuery.created_date = {
      $gte: daysAgo,
    };
  }

  const dataResult: AveragePerDay[] = await CheckoutModel(db).aggregate([
    {
      $match: matchQuery,
    },
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m-%d', date: '$created_date' } },
        totalAmount: { $sum: '$total' }, // Assuming "total" is the field with the amount
      },
    },
    {
      // Sort by date in ascending order
      $sort: { _id: 1 },
    },
  ]);

  if (!dataResult.length) return { sortBy: input.type, data: [], total: 0 }

  if (input.type == DateType.AllTime) {
    const total = dataResult.reduce((accu, current) => accu + current.totalAmount, 0)
    return { sortBy: input.type, data: dataResult, total }
  }

  const today = new Date();
  const resultArray = new Array(days).fill(null) as AveragePerDay[];

  let total = 0

  dataResult.forEach(group => {
    const date = new Date(group._id);
    const timeDifference = today.getTime() - date.getTime();
    const diffInDays = Math.floor(timeDifference / (1000 * 60 * 60 * 24));

    resultArray[diffInDays] = group;
    total += group.totalAmount
  });

  return { sortBy: input.type, data: resultArray.reverse(), total }
}


const CheckoutResolverQuery = {
  getCheckoutByID,
  getCheckoutsByBusiness,
  getOrdersByCheckout,
  getPaidCheckoutByDate
}

export {
  CheckoutResolverQuery,
}