import mongoose from 'mongoose';
import {
    OrderDetailModel,
    ProductModel,
    RequestModel,
    TabModel,
    UserModel
} from '../../../models';
import { ApolloError } from "../../ApolloErrorExtended/ApolloErrorExtended";
import { Context } from "../types";
import { CreateMultipleOrdersDetail, CreateMultipleOrdersDetailInput, CreateOrderDetail, CreateOrderDetailInput, UpdateOrderDetailInput } from "./types";
import { MutationResolvers } from '../../../generated/graphql';
import { CartItemModel } from '../../../models/cartItem';

const createOrderDetail = async (_parent: any,
    { input }: CreateOrderDetailInput,
    { db }: Context) => {
    const OrderDetail = OrderDetailModel(db);
    const Product = ProductModel(db);
    const Tab = TabModel(db);
    const User = UserModel(db);

    try {
        const parsedInput = CreateOrderDetail.parse(input);

        const user = await User.findOne({ _id: parsedInput.user });
        const tab = await Tab.findOne({ _id: parsedInput.tab });
        const product = await Product.findOne({ _id: parsedInput.product });

        if (!product) throw ApolloError("NotFound");
        if (!tab) throw ApolloError("NotFound");

        const orderDetail = await OrderDetail.create({
            ...parsedInput,
            subTotal: (product?.price || 0) * parsedInput.quantity,
            user: user?._id,
        })

        tab.orders.push(orderDetail._id);
        await tab.save();

        return orderDetail;
    } catch (err) {
        console.log({ err })
        throw ApolloError("InternalServerError", `Error creating OrderDetail ${err}`);
    }
}

const createMultipleOrderDetails = async (_parent: any,
    { input }: { input: CreateMultipleOrdersDetailInput[] },
    { db, user: businessUser }: Context) => {
    const OrderDetail = OrderDetailModel(db);
    const Product = ProductModel(db);
    const Tab = TabModel(db);
    const User = UserModel(db);

    try {

        console.log("createMultipleOrderDetails")

        const parsedInputArray = CreateMultipleOrdersDetail.parse(input);

        // todo: we don't have to look for the same tab inside this loop
        const tab = await Tab.findOne({ _id: parsedInputArray[0].tab });

        if (!tab) throw ApolloError("NotFound");

        const orderDetails = await Promise.all(parsedInputArray.map(async (parsedInput) => {
            const user = await User.findOne({ _id: parsedInput.user });
            const product = await Product.findOne({ _id: parsedInput.product });


            if (!product) throw ApolloError("NotFound");
            if (!tab) throw ApolloError("NotFound");
            if (tab.status !== 'Open') throw ApolloError("BadRequest", "Tab is not open");
            if (!businessUser?._id) throw ApolloError("Unauthorized", "Business user is not logged in");

            const orderDetails = await OrderDetail.create({
                ...parsedInput,
                subTotal: (product?.price || 0) * parsedInput.quantity,
                // undefined users means it's for the table
                user: user?._id,
                tab: tab._id,
                createdByUser: businessUser?._id
            });

            tab.orders.push(orderDetails._id);

            return orderDetails
        }));

        await tab.save();
        return orderDetails;

    } catch (err) {
        console.log({ err })
        throw ApolloError("InternalServerError", `Error creating OrderDetail ${err}`);
    }
}

//@ts-ignore
const clientCreateMultipleOrderDetails:
    MutationResolvers["clientCreateMultipleOrderDetails"] = async (_parent,
        { input },
        { db, client }) => {
        console.log("createClientMultipleOrderDetails")

        const OrderDetail = OrderDetailModel(db);
        const Product = ProductModel(db);
        const Tab = TabModel(db);
        const User = UserModel(db);
        const Request = RequestModel(db);
        const CartItem = CartItemModel(db);
        const foundRequest = await Request.findOne({ _id: client?.request });

        if (!foundRequest) throw ApolloError("NotFound");

        const tab = await Tab.findOne({ _id: foundRequest?.tab });

        if (!tab) throw ApolloError("NotFound");
        if (tab.status !== 'Open') throw ApolloError("BadRequest", "Tab is not open");

        const foundCartItems = await Promise.all(input.map(async (item) => {
            const foundCartItem = await CartItem.findOne({
                _id: item.cartItem,
                user: item.user,
                quantity: item.quantity,
            });

            if (!foundCartItem) throw ApolloError("BadRequest", "Cart item is not valid");

            return foundCartItem;
        }))

        const orderDetails = await Promise.all(foundCartItems.map(async (parsedInput) => {
            const user = await User.findOne({ _id: parsedInput.user });
            const product = await Product.findOne({ _id: parsedInput.product });

            if (!product) throw ApolloError("NotFound");

            const orderDetails = await OrderDetail.create({
                quantity: parsedInput.quantity,
                product: parsedInput.product,
                subTotal: (product?.price || 0) * parsedInput.quantity,
                user: user?._id,
                tab: tab._id,
                createdByUser: client?._id
            });

            tab.orders = [...tab?.orders, orderDetails._id]
            tab.cartItems = tab.cartItems.filter((item) => item?.toString() !== parsedInput._id.toString());

            await CartItem.findOneAndDelete({ _id: parsedInput._id });

            return orderDetails
        }));

        await tab.save();

        return orderDetails;
    }


const updateOrderDetail = async (_parent: any,
    { input }: UpdateOrderDetailInput,
    { db }: Context) => {

    const OrderDetail = OrderDetailModel(db);
    const Product = ProductModel(db);

    try {
        const orderDetail = await OrderDetail.findOne({ _id: input._id });
        if (!orderDetail) throw ApolloError("NotFound");

        const product = await Product.findOne({ _id: orderDetail.product });
        if (!product) throw ApolloError('NotFound');

        const subTotalUpdated = input.quantity ? (product?.price || 0) * input.quantity : orderDetail.subTotal

        return await OrderDetail.findOneAndUpdate({ _id: input._id }, {
            ...input,
            subTotal: subTotalUpdated,
        }, { new: true });

    } catch (err) {
        console.log({ err })
        throw ApolloError("InternalServerError", `Error updating OrderDetail ${err}`);
    }
}

const deleteOrderDetail = async (_parent: any, { input }: { input: any }, { db }: Context) => {
    const OrderDetail = OrderDetailModel(db);

    try {
        const orderDetail = await OrderDetail.findOne({ _id: input._id });
        if (!orderDetail) throw ApolloError("NotFound");

        return await OrderDetail.findOneAndDelete({ _id: input._id });
    } catch (err) {
        console.log({ err })
        throw ApolloError("InternalServerError", `Error deleting OrderDetail ${err}`);
    }
}

export const OrderDetailsResolverMutation = {
    createOrderDetail,
    updateOrderDetail,
    deleteOrderDetail,
    createMultipleOrderDetails,
    clientCreateMultipleOrderDetails
}