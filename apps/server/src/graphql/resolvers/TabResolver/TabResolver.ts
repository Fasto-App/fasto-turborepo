import { ApolloError } from "../../ApolloErrorExtended/ApolloErrorExtended";
import { TabModel } from "../../../models/tab";
import { UserModel } from "../../../models/user";
import { TableModel } from "../../../models/table";
import { GuestUserModel } from "../../../models/guestUser";
import { Context } from "../types";
import { createTabInput, updateTabInput, updateTabObject } from "./types";
import { OrderStatus, TableStatus, TabStatus } from "app-helpers";
import { BusinessModel, OrderDetailModel } from "../../../models";
import { CheckoutModel } from "../../../models/checkout";

const createTab = async (_parent: any, { input }: createTabInput, { db, business }: Context) => {
    const Tab = TabModel(db);
    const Table = TableModel(db);
    const User = UserModel(db);
    const GuestUser = GuestUserModel(db);

    if (!input.totalUsers) throw Error('Specify total users for this tab.')
    if (!business) throw Error('Business not found!')

    const table = await Table.findOne({ _id: input.table, business });

    if (!table) throw Error('Table not found!')

    if (input.admin) {
        try {
            const user = await User.findOne({ _id: input.admin });

            const tab = await Tab.create({
                table: table._id,
                admin: user?._id,
                users: input.totalUsers,
            });

            await table.updateOne({ status: TableStatus.Occupied });

            return tab

        } catch (err) {
            throw ApolloError("BadRequest", "User not found, Please add a valid user");
        }
    }

    const allUsers = await GuestUser.insertMany(new Array(input.totalUsers).fill({}))

    try {
        const tab = await Tab.create({
            table: input.table,
            admin: allUsers[0]._id,
            users: allUsers.map(user => user._id),
        });
        // change the status table to occupied
        await table.updateOne({ status: TableStatus.Occupied });

        return tab

    } catch (error) {
        throw ApolloError("InternalServerError", "Error creating Tab");
    }
}

const getAllOpenTabsByBusinessID = async (_parent: any, _args: any, { db, business }: Context) => {
    const Tab = TabModel(db);
    const allOpenTabsByBusiness = await Tab.find({ business: business, status: 'OPEN' });
    return allOpenTabsByBusiness;
}

const getAllTabsByBusinessID = async (_parent: any, _args: any, { db, business }: Context) => {
    const Tab = TabModel(db);
    const allTabsByBusiness = await Tab.find({ business });
    return allTabsByBusiness;
}

const getTabByID = async (_parent: any, { input }: { input: any }, { db }: Context) => {

    const Tab = TabModel(db);
    const tab = await Tab.findById(input._id);
    return tab;
}

const updateTab = async (_parent: any, { input }: updateTabInput, { db, business }: Context) => {
    const Tab = TabModel(db);

    console.log('updateTab', input)
    // console.log('updateTab', updateTabObject.parse(input))

    try {
        const parsedInput = updateTabObject.parse(input);
        const tab = await Tab.findById(parsedInput._id);

        if (!tab) throw ApolloError('NotFound')
        if (!parsedInput.status) {
            throw ApolloError('NotFound')
        }

        return await Tab.findByIdAndUpdate(parsedInput._id, parsedInput, { new: true });

    } catch (err) {
        throw ApolloError("InternalServerError", 'Error updating tab: ' + err);
    }
}

const deleteTab = async (_parent: any, { input }: { input: any }, { db, business }: Context) => {
    const Tab = TabModel(db);

    console.log('deleteTab', input._id)

    try {
        const tab = await Tab.findByIdAndDelete(input._id);

        if (!tab) throw ApolloError('NotFound')

        // if the tab has open orders, we need to close them
        // if (tab.orders.length > 0) {
        //     const Order = OrderModel(db);
        //     await Order.updateMany({ _id: { $in: tab.orders } }, { status: 'CLOSED' })
        // }


        // if the Tab is associated with a table, change the status of the table to available
        if (tab?.table) {
            const Table = TableModel(db);
            await Table.findByIdAndUpdate(tab.table, { status: TableStatus.Available });
        }

        return tab;
    } catch (err) {
        throw ApolloError("InternalServerError", 'Error deleting tab: ' + err);
    }
}

const getUsersByTabID = async (parent: any, _args: any, { db }: Context) => {

    console.log('getUsersByTabID', parent._id)
    const Tab = TabModel(db);
    const tab = await Tab.findById(parent._id);

    if (!tab) throw ApolloError('NotFound')

    return tab.users;
}

const getTableByTabID = async (parent: any, _args: any, { db }: Context) => {
    const Table = TableModel(db);
    return await Table.findById(parent.table);
}


const requestCloseTab = async (_parent: any, { input }: { input: { _id: string } }, { db, business }: Context) => {
    const Tab = TabModel(db);
    const OrderDetail = OrderDetailModel(db);
    const Checkout = CheckoutModel(db);
    const foundBusiness = await BusinessModel(db).findById(business);
    const foundTab = await Tab.findById(input._id);

    if (!foundTab) throw ApolloError('NotFound')

    if (foundTab.status === TabStatus.Closed ||
        foundTab.status === TabStatus.Pendent) {
        return foundTab;
    }

    const foundOrderDetails = await OrderDetail.find({ tab: foundTab._id });
    // if there are no open orders, we can close the tab
    if (foundOrderDetails.length === 0) {
        foundTab.status = TabStatus.Closed;
        await foundTab.save();
        return foundTab;
    }

    const subTotal = foundOrderDetails.reduce((acc, orderDetail) => acc + orderDetail.subTotal, 0);

    const checkout = await Checkout.create({
        tab: foundTab._id,
        business: foundBusiness?._id,
        orders: foundOrderDetails.map(orderDetail => orderDetail._id),
        total: subTotal + (subTotal * (foundBusiness?.taxRate ?? 0)),
        tax: foundBusiness?.taxRate ?? 0,
        tip: 0,
        subTotal,
    })

    foundTab.checkout = checkout._id;
    foundTab.status = TabStatus.Pendent;

    return await foundTab.save();;
}



const TabResolverMutation = { createTab, updateTab, deleteTab, requestCloseTab }
const TabResolverQuery = {
    getTabByID,
    getAllOpenTabsByBusinessID,
    getAllTabsByBusinessID
}

const TabResolver = {
    getUsersByTabID,
    getTableByTabID
}

export { TabResolverMutation, TabResolverQuery, TabResolver }

