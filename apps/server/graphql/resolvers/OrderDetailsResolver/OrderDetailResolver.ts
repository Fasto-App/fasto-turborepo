import mongoose from 'mongoose';
import {
    OrderDetailModel,
    ProductModel,
    TabModel,
    GuestUserModel,
    UserModel
} from '../../../models';
import { ApolloExtendedError } from "../../ApolloErrorExtended/ApolloErrorExtended";
import { Context } from "../types";
import { CreateMultipleOrdersDetail, CreateMultipleOrdersDetailInput, CreateOrderDetail, CreateOrderDetailInput, UpdateOrderDetailInput } from "./types";

const createOrderDetail = async (_parent: any,
    { input }: CreateOrderDetailInput,
    { db }: Context) => {
    const OrderDetail = OrderDetailModel(db);
    const Product = ProductModel(db);
    const Tab = TabModel(db);
    const User = UserModel(db);
    const GuestUser = GuestUserModel(db);

    try {
        const parsedInput = CreateOrderDetail.parse(input);

        const tab = await Tab.findOne({ _id: parsedInput.tab });
        const guestUser = await GuestUser.findOne({ _id: parsedInput.user });
        const user = await User.findOne({ _id: parsedInput.user });

        const product = await Product.findOne({ _id: parsedInput.product });

        if (!user && !guestUser) throw new ApolloExtendedError('User not found.', 404);
        if (!product) throw new ApolloExtendedError('Product not found', 500);
        if (!tab) throw new ApolloExtendedError('Tab not found', 500);

        return await OrderDetail.create({
            ...parsedInput,
            subTotal: (product?.price || 0) * parsedInput.quantity,
        });
    } catch (err) {
        console.log({ err })
        throw new ApolloExtendedError(`Error creating OrderDetail ${err}`, 500);
    }
}

const createMultipleOrderDetails = async (_parent: any,
    { input }: { input: CreateMultipleOrdersDetailInput[] },
    { db }: Context) => {
    const OrderDetail = OrderDetailModel(db);
    const Product = ProductModel(db);
    const Tab = TabModel(db);
    const User = UserModel(db);
    const GuestUser = GuestUserModel(db);

    try {

        const parsedInput = CreateMultipleOrdersDetail.parse(input);

        const tab = await Tab.findOne({ _id: parsedInput.tab });
        console.log({ tab })

        const guestUser = await GuestUser.findOne({ _id: parsedInput.user });
        const user = await User.findOne({ _id: parsedInput.user });

        if (!user?._id && !guestUser) throw new ApolloExtendedError('User not found.', 404);
        if (!tab) throw new ApolloExtendedError('Tab not found', 500);
        if (tab.status !== 'OPEN') throw new ApolloExtendedError('Tab is not open', 500);

        const ultimateUser = user?._id || guestUser?._id;
        const userFound = tab.users.find(user => user?.toString() === ultimateUser.toString())

        if (!userFound) return new ApolloExtendedError('User not found in tab', 500);

        const productIds = parsedInput.orderDetails.map(orderDetails => orderDetails.product);
        const productsFound = await Product.find({ _id: { $in: productIds } });

        if (productsFound.length !== productIds.length) {
            return new ApolloExtendedError(`Numbers of Products doesn't match products ids`, 500)
        };

        const orderDetails = parsedInput.orderDetails.map(orderDetail => ({
            ...orderDetail,
            tab: tab._id,
            user: ultimateUser,
            subTotal: (productsFound.find(product => product._id.toString() === orderDetail.product)?.price || 0) * orderDetail.quantity,
        }));

        return await OrderDetail.insertMany(orderDetails);

    } catch (err) {
        console.log({ err })
        throw new ApolloExtendedError(`Error creating OrderDetail ${err}`, 500);
    }
}


const updateOrderDetail = async (_parent: any,
    { input }: UpdateOrderDetailInput,
    { db }: Context) => {

    const OrderDetail = OrderDetailModel(db);
    const Product = ProductModel(db);

    try {
        const orderDetail = await OrderDetail.findOne({ _id: input._id });
        if (!orderDetail) throw new ApolloExtendedError('OrderDetail not found.', 404);

        const product = await Product.findOne({ _id: orderDetail.product });
        if (!product) throw new ApolloExtendedError('Product not found', 500);

        const subTotalUpdated = input.quantity ? (product?.price || 0) * input.quantity : orderDetail.subTotal

        return await OrderDetail.findOneAndUpdate({ _id: input._id }, {
            ...input,
            subTotal: subTotalUpdated,
        }, { new: true });

    } catch (err) {
        console.log({ err })
        throw new ApolloExtendedError(`Error updating OrderDetail ${err}`, 500);
    }
}

const deleteOrderDetail = async (_parent: any, { input }: { input: any }, { db }: Context) => {
    const OrderDetail = OrderDetailModel(db);

    try {
        const orderDetail = await OrderDetail.findOne({ _id: input._id });
        if (!orderDetail) throw new ApolloExtendedError('OrderDetail not found.', 404);

        return await OrderDetail.findOneAndDelete({ _id: input._id });
    } catch (err) {
        console.log({ err })
        throw new ApolloExtendedError(`Error deleting OrderDetail ${err}`, 500);
    }
}

const getOrderDetailByID = async (_parent: any, { input }: { input: any }, { db }: Context) => {
    const OrderDetail = OrderDetailModel(db);
    const orderDetail = await OrderDetail.findOne({ _id: input.id });
    return orderDetail;
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
const OrderDetailsResolverMutation = {
    createOrderDetail,
    updateOrderDetail,
    deleteOrderDetail,
    createMultipleOrderDetails
}
const OrderDetailsResolverQuery = {
    getOrderDetailByID,
    getAllOrderDetailsByOrderID,
}
const OrderDetailsResolver = {
    getOrdersByTabID
}

export { OrderDetailsResolverMutation, OrderDetailsResolverQuery, OrderDetailsResolver }