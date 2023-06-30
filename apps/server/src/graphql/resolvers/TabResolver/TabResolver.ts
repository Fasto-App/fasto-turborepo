import { ApolloError } from "../../ApolloErrorExtended/ApolloErrorExtended";
import { TabModel } from "../../../models/tab";
import { UserModel } from "../../../models/user";
import { TableModel } from "../../../models/table";
import { Context } from "../types";
import { createTabInput, updateTabInput, updateTabObject } from "./types";
import { getPercentageOfValue, RequestStatus, TableStatus, TableStatusType, TabStatus } from "app-helpers";
import { BusinessModel, OrderDetailModel, RequestModel } from "../../../models";
import { CheckoutModel } from "../../../models/checkout";
import { MutationResolvers } from "../../../generated/graphql";

const createTab = async (_parent: any, { input }: createTabInput, { db, business }: Context) => {
    const Tab = TabModel(db);
    const Table = TableModel(db);
    const User = UserModel(db);

    if (!input.totalUsers) throw Error('Specify total users for this tab.')
    if (!business) throw Error('Business not found!')

    const table = await Table.findOne({ _id: input.table, business });

    if (!table) throw Error('Table not found!')

    const allUsers = await User.insertMany(new Array(input.totalUsers).fill({ isGuest: true }))

    // if admin is specified, create a tab with admin
    const SAVED_CLIENT_FEATURE_FLAG = false;

    if (input.admin && SAVED_CLIENT_FEATURE_FLAG) {
        try {
            const user = await User.findOne({ _id: input.admin });

            const tab = await Tab.create({
                table: table._id,
                admin: user?._id,
                // TODO: can we add exsisting users this way?
                // perhaps we need to add a new field to existing user emails or ids
                users: allUsers.map(user => user._id),
            });

            await table.updateOne({ status: TableStatus.Occupied, tab: tab._id });

            return tab

        } catch (err) {
            throw ApolloError("BadRequest", "User not found, Please add a valid user");
        }
    }

    // insert many guest users
    // guest flag set to true

    try {
        const tab = await Tab.create({
            table: input.table,
            admin: allUsers[0]._id,
            users: allUsers.map(user => user._id),
        });

        if (!tab) throw ApolloError("InternalServerError", "Error creating Tab")

        table.status = TableStatus.Occupied;
        table.tab = tab._id;
        await table.save();

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
            await Table.findByIdAndUpdate(tab.table, {
                status: TableStatus.Available,
                tab: undefined
            });
        }

        return tab;
    } catch (err) {
        throw ApolloError("InternalServerError", 'Error deleting tab: ' + err);
    }
}

const getUsersByTabID = async (parent: any, _args: any, { db }: Context) => {
    const Tab = TabModel(db);
    const User = UserModel(db);
    const tab = await Tab.findById(parent._id);

    if (!tab) throw ApolloError('NotFound')

    return await User.find({ _id: { $in: tab.users } });
}

const getTableByTabID = async (parent: any, _args: any, { db }: Context) => {
    const Table = TableModel(db);
    return await Table.findById(parent.table);
}


//@ts-ignore
const requestCloseTab: MutationResolvers["requestCloseTab"] = async (_parent, args, { db, business, client }) => {
    const Tab = TabModel(db);
    const OrderDetail = OrderDetailModel(db);
    const Checkout = CheckoutModel(db);
    const Table = TableModel(db);
    const foundBusiness = await BusinessModel(db).findById(business || client?.business);
    let tabId;

    if (!foundBusiness) throw ApolloError('NotFound', "Business not found")

    if (client?.request) {
        const foundRequest = await RequestModel(db).findById(client.request);
        if (!foundRequest) throw ApolloError('NotFound')
        tabId = foundRequest.tab;
    }

    const foundTab = await Tab.findById(tabId || args.input?._id);

    const changeTableStatus = async (toStatus: TableStatusType) => {
        if (foundTab?.table) {
            const foundTable = await Table.findById(foundTab.table);
            if (foundTable) {
                foundTable.status = toStatus;
                await foundTable.save();
            }
        }
    }

    if (!foundTab) throw ApolloError('NotFound')

    if (foundTab.status === TabStatus.Closed ||
        foundTab.status === TabStatus.Pendent) {
        return foundTab;
    }

    const foundOrderDetails = await OrderDetail.find({ tab: foundTab._id });
    // if there are no open orders, we can close the tab
    if (foundOrderDetails.length === 0) {
        foundTab.status = TabStatus.Closed;

        // find all the requests associated with this tab and close them
        const foundRequests = await RequestModel(db).find({ tab: foundTab._id });
        if (foundRequests.length > 0) {
            await RequestModel(db).updateMany({ tab: foundTab._id }, { status: RequestStatus.Completed });
        }
        // upadate the table status to available
        changeTableStatus(TableStatus.Available)

        await foundTab.save();
        return foundTab;
    }

    const subTotal = foundOrderDetails.reduce((acc, orderDetail) => acc + orderDetail.subTotal, 0);

    const checkout = await Checkout.create({
        tab: foundTab._id,
        business: foundBusiness?._id,
        orders: foundOrderDetails.map(orderDetail => orderDetail._id),
        subTotal,
        total: subTotal + getPercentageOfValue(subTotal, foundBusiness?.taxRate),
        tax: foundBusiness?.taxRate ?? 0,
    })

    foundTab.checkout = checkout._id;
    foundTab.status = TabStatus.Pendent;

    return await foundTab.save();
}

const TabResolverMutation = {
    createTab,
    updateTab,
    deleteTab,
    requestCloseTab,
}
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

