import {
    BusinessModel,
    OrderDetailModel,
    ProductModel,
    RequestModel,
    TabModel,
    UserModel
} from '../../../models';
import { ApolloError } from "../../ApolloErrorExtended/ApolloErrorExtended";
import { Context } from "../types";
import { CreateMultipleOrdersDetail, UpdateOrderDetailInput } from "./types";
import { MutationResolvers } from '../../../generated/graphql';
import { CartItemModel } from '../../../models/cartItem';
import { TabStatus, TabType, getPercentageOfValue } from 'app-helpers';
import { CheckoutModel } from '../../../models/checkout';

// wee need two differentiate functions for creating order and creating the orderwith checkout

// @ts-ignore
const createOrdersCheckout: MutationResolvers["createOrdersCheckout"] = async (parent, { input },
    { db, user: businessUser }) => {

    const Checkout = CheckoutModel(db);
    const OrderDetail = OrderDetailModel(db);
    const Business = BusinessModel(db);
    const Tab = TabModel(db);
    const Product = ProductModel(db);
    const User = UserModel(db);

    if (!businessUser?._id) throw ApolloError(new Error("Business user is not logged in"), "Unauthorized");

    try {
        const parsedInputArray = CreateMultipleOrdersDetail.parse(input);
        const foundBusiness = await Business.findOne({ createdByUser: businessUser?.business });

        const newUser = await User.create({})

        if (!newUser?._id) throw ApolloError(new Error("Error creating user"), "InternalServerError",);

        const newTab = await Tab.create({
            admin: newUser?._id,
            type: TabType.Takeout,
            status: TabStatus.Pendent,
            users: [newUser?._id],
        });

        const orderDetails = await Promise.all(parsedInputArray.map(async (parsedInput) => {
            const product = await Product.findOne({ _id: parsedInput.product });

            if (!product) throw ApolloError(new Error("Product not found"), "NotFound");

            const orderDetails = await OrderDetail.create({
                ...parsedInput,
                subTotal: (product?.price || 0) * parsedInput.quantity,
                user: newUser?._id,
                tab: newTab?._id,
                createdByUser: businessUser?._id
            });

            newTab.orders.push(orderDetails._id);

            return orderDetails
        }));

        const subTotal = orderDetails.reduce((acc, orderDetail) => acc + orderDetail.subTotal, 0);

        return await Checkout.create({
            tab: newTab._id,
            business: businessUser?.business,
            orders: orderDetails.map(orderDetail => orderDetail._id),
            subTotal,
            total: subTotal + getPercentageOfValue(subTotal, foundBusiness?.taxRate ?? 0),
            tax: foundBusiness?.taxRate ?? 0,
        })

    } catch (error) {

        console.log("Error: ", error)
        throw ApolloError(error as Error, "BadRequest");
    }
}



// @ts-ignore
const createMultipleOrderDetails: MutationResolvers["createMultipleOrderDetails"] = async (_parent,
    { input },
    { db, user: businessUser }) => {
    console.log("createMultipleOrderDetails")

    const OrderDetail = OrderDetailModel(db);
    const Product = ProductModel(db);
    const Tab = TabModel(db);
    const User = UserModel(db);

    try {
        const parsedInputArray = CreateMultipleOrdersDetail.parse(input);

        const tab = await Tab.findOne({ _id: parsedInputArray[0].tab });
        if (!tab) throw ApolloError(new Error("No tab"), "NotFound");
        if (tab.status !== 'Open') throw ApolloError(new Error("Tab is not open"), "BadRequest",);

        const orderDetails = await Promise.all(parsedInputArray.map(async (parsedInput) => {
            const user = await User.findOne({ _id: parsedInput.user });
            const product = await Product.findOne({ _id: parsedInput.product });

            if (!product) throw ApolloError(new Error("No product"), "NotFound");

            if (!businessUser?._id) throw ApolloError(new Error("Business user is not logged in"), "Unauthorized",);

            const orderDetails = await OrderDetail.create({
                ...parsedInput,
                subTotal: (product?.price || 0) * parsedInput.quantity,
                user: user?._id,
                tab: tab?._id,
                createdByUser: businessUser?._id,
                type: "DineIn"
            });

            tab.orders.push(orderDetails._id);

            return orderDetails
        }));

        await tab.save();

        return orderDetails;

    } catch (err) {
        throw ApolloError(err as Error, "BadRequest");
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

        if (!foundRequest) throw ApolloError(new Error("No found request"), "NotFound");

        const tab = await Tab.findOne({ _id: foundRequest?.tab });

        if (!tab) throw ApolloError(new Error("No Tab"), "NotFound");
        if (tab.status !== 'Open') throw ApolloError(new Error("Tab is not open"), "BadRequest");

        const foundCartItems = await Promise.all(input.map(async (item) => {
            const foundCartItem = await CartItem.findOne({
                _id: item.cartItem,
                user: item.user,
                quantity: item.quantity,
            });

            if (!foundCartItem) throw ApolloError(new Error("Cart item is not valid"), "BadRequest",);

            return foundCartItem;
        }))

        const orderDetails = await Promise.all(foundCartItems.map(async (parsedInput) => {
            const user = await User.findOne({ _id: parsedInput.user });
            const product = await Product.findOne({ _id: parsedInput.product });

            if (!product) throw ApolloError(new Error("No product"), "NotFound");

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
        if (!orderDetail) throw ApolloError(new Error("No Order detail"), "NotFound");

        const product = await Product.findOne({ _id: orderDetail.product });
        if (!product) throw ApolloError(new Error("No product"), 'NotFound');

        const subTotalUpdated = input.quantity ? (product?.price || 0) * input.quantity : orderDetail.subTotal

        return await OrderDetail.findOneAndUpdate({ _id: input._id }, {
            ...input,
            subTotal: subTotalUpdated,
        }, { new: true });

    } catch (err) {
        throw ApolloError(err as Error, "InternalServerError",);
    }
}

const deleteOrderDetail = async (_parent: any, { input }: { input: any }, { db }: Context) => {
    const OrderDetail = OrderDetailModel(db);

    try {
        const orderDetail = await OrderDetail.findOne({ _id: input._id });
        if (!orderDetail) throw ApolloError(new Error("No order detail"), "NotFound");

        return await OrderDetail.findOneAndDelete({ _id: input._id });
    } catch (err) {
        throw ApolloError(err as Error, "BadRequest",);
    }
}

export const OrderDetailsResolverMutation = {
    updateOrderDetail,
    deleteOrderDetail,
    createMultipleOrderDetails,
    clientCreateMultipleOrderDetails,
    createOrdersCheckout,
}