import { ApolloExtendedError } from "../../ApolloErrorExtended/ApolloErrorExtended";
import { TabModel } from "../../../models/tab";
import { UserModel } from "../../../models/user";
import { TableModel } from "../../../models/table";
import { TableStatus } from "../../../models/types";
import { GuestUserModel } from "../../../models/guestUser";
import { Context } from "../types";
import { createTabInput, updateTabInput, updateTabObject } from "./types";

const createTab = async (_parent: any, { input }: createTabInput, { db, business }: Context) => {
    const Tab = TabModel(db);
    const Table = TableModel(db);
    const User = UserModel(db);
    const GuestUser = GuestUserModel(db);

    console.log('createTab', input)

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

            await table.updateOne({ status: TableStatus.OCCUPIED });

            return tab

        } catch (err) {
            throw new ApolloExtendedError('User not found, Please add a valid user', 500);
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
        await table.updateOne({ status: TableStatus.OCCUPIED });

        return tab

    } catch (error) {
        throw new ApolloExtendedError('Error creating tab', 500);
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

        if (!tab) throw new ApolloExtendedError('Tab not found!')
        if (!parsedInput.status) {
            throw new ApolloExtendedError('Tab not found!')
        }

        return await Tab.findByIdAndUpdate(parsedInput._id, parsedInput, { new: true });

    } catch (err) {
        throw new ApolloExtendedError('Error updating tab: ' + err, 500);
    }
}

const deleteTab = async (_parent: any, { input }: { input: any }, { db, business }: Context) => {
    const Tab = TabModel(db);

    console.log('deleteTab', input._id)

    try {
        const tab = await Tab.findByIdAndDelete(input._id);

        if (!tab) throw new ApolloExtendedError('Tab not found!')

        // if the tab has open orders, we need to close them
        // if (tab.orders.length > 0) {
        //     const Order = OrderModel(db);
        //     await Order.updateMany({ _id: { $in: tab.orders } }, { status: 'CLOSED' })
        // }


        // if the Tab is associated with a table, change the status of the table to available
        if (tab?.table) {
            const Table = TableModel(db);
            await Table.findByIdAndUpdate(tab.table, { status: TableStatus.AVAILABLE });
        }

        return tab;
    } catch (err) {
        throw new ApolloExtendedError('Error deleting tab: ' + err, 500);
    }
}

const getUsersByTabID = async (parent: any, _args: any, { db }: Context) => {

    console.log('getUsersByTabID', parent._id)
    const Tab = TabModel(db);
    const tab = await Tab.findById(parent._id);

    if (!tab) throw new ApolloExtendedError('Tab not found!')

    return tab.users;
}

const getTableByTabID = async (parent: any, _args: any, { db }: Context) => {
    const Table = TableModel(db);
    return await Table.findById(parent.table);
}



const TabResolverMutation = { createTab, updateTab, deleteTab }
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

