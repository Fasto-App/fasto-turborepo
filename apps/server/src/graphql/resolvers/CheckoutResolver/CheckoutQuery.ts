import { ObjectId } from "mongodb";
import { DateType, QueryResolvers } from "../../../generated/graphql";
import { CheckoutModel } from "../../../models/checkout";
import { ApolloError } from "../../ApolloErrorExtended/ApolloErrorExtended";
import { Context } from "../types";

// @ts-ignore
export const getCheckoutByID: QueryResolvers["getCheckoutByID"] = async (parent, { input }, { db, client, user }) => {
  const Checkout = CheckoutModel(db);

  if (!client && !user) throw ApolloError("Unauthorized", "You must be logged in to perform this action")

  const checkout = await Checkout.findOne({ _id: input._id, business: client?.business || user?.business });
  if (!checkout) throw ApolloError("NotFound", "Checkout not found");
  return checkout
}

// @ts-ignore
export const getCheckoutsByBusiness: QueryResolvers["getCheckoutsByBusiness"] = async (_parent, args, { db, business }) => {
  const Checkout = CheckoutModel(db);
  const checkouts = await Checkout.find({ business: business }).sort({ _id: -1 });
  return checkouts
}

// @ts-ignore
export const getOrdersByCheckout: QueryResolvers["getOrdersByCheckout"] = async (parent, { input }, { db }) => {
  const Checkout = CheckoutModel(db);
  const checkout = await Checkout.findById(input._id);

  if (!checkout) throw ApolloError("NotFound", "Checkout not found");

  return checkout
}

type AveragePerDay = {
  _id: string; totalAmount: number
}

export const getPaidCheckoutByDate: QueryResolvers["getPaidCheckoutByDate"] = async (par, { input }, { db, user, business }) => {
  let days;

  switch (input.type) {
    case DateType.SevenDays:
      days = 7
      break;
    case DateType.ThirtyDays:
      days = 30
      break;
    case DateType.NinetyDays:
      days = 90
      break;
    case DateType.AllTime:
      days = 0
      break
  }

  const daysAgo = new Date();
  daysAgo.setDate(daysAgo.getDate() - days);

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

  if (!dataResult.length) return null

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