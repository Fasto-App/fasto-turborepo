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

        const orderDetails = await Promise.all(parsedInputArray.map(async (parsedInput) => {
            const tab = await Tab.findOne({ _id: parsedInput.tab });
            const user = await User.findOne({ _id: parsedInput.user });
            const product = await Product.findOne({ _id: parsedInput.product });


            if (!product) throw ApolloError("NotFound");
            if (!tab) throw ApolloError("NotFound");
            if (tab.status !== 'Open') throw ApolloError("BadRequest", "Tab is not open");
            if (!businessUser?._id) throw ApolloError("Unauthorized", "Business user is not logged in");

            const orderDetails = await OrderDetail.create({
                ...parsedInput,
                subTotal: (product?.price || 0) * parsedInput.quantity,
                // null users means it's for the table
                user: user?._id,
                tab: tab._id,
                createdByUser: businessUser?._id
            });

            tab.orders.push(orderDetails._id);
            await tab.save();

            return orderDetails
        }));

        return orderDetails;

    } catch (err) {
        console.log({ err })
        throw ApolloError("InternalServerError", `Error creating OrderDetail ${err}`);
    }
}

// todo: hopefully have types generated from the schema
const clientCreateMultipleOrderDetails = async (_parent: any,
    { input }: { input: any },
    { db, client }: Context) => {

    const OrderDetail = OrderDetailModel(db);
    const Product = ProductModel(db);
    const Tab = TabModel(db);
    const User = UserModel(db);
    const Request = RequestModel(db);

    console.log("createClientMultipleOrderDetails")
    console.log({ input })

    // order made by a client
    // product, quantity, message, tab, user
    // tab is comming from the Request
    // make sure all of the cart items are from the same tab

    return []
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
    createMultipleOrderDetails,
    clientCreateMultipleOrderDetails
}
const OrderDetailsResolverQuery = {
    getOrderDetailByID,
    getAllOrderDetailsByOrderID,
}
const OrderDetailsResolver = {
    getOrdersByTabID
}

export { OrderDetailsResolverMutation, OrderDetailsResolverQuery, OrderDetailsResolver }