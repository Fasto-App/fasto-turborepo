import { Connection } from "mongoose";
import { MenuModel, ProductModel, CategoryModel, Section, Product } from "../../../models";
import { ApolloError } from "../../ApolloErrorExtended/ApolloErrorExtended";
import { Context } from "../types";
import { CreateMenuInput, UpdateMenuInput } from "./types";
import { QueryResolvers } from "../../../generated/graphql";
import { getBusinessMenu, populateProducts } from "./helpers";

type UpdateMenuInfo = Pick<UpdateMenuInput, 'name' | '_id'>;

const createMenu = async (_parent: any, { input }: CreateMenuInput, { db, user, business }: Context) => {
    if (!business) throw Error('Business not found');
    if (!user) throw Error('User not found');

    const Menu = MenuModel(db);

    const menu = await Menu.findOne({ name: input.name, business });
    if (menu) throw Error('Menu with this name already exists.');

    try {
        return await (Menu.create({
            name: input.name,
            business
        }))

    } catch (err) {
        throw ApolloError(err as Error, 'InternalServerError');
    }
}

// @ts-ignore
const getMenuByID: QueryResolvers["getMenuByID"] = async (_parent, args, { business }) => {
    if (!business) throw Error('Business not found');

    return await getBusinessMenu({
        _id: args.input?.id,
        business
    });
}

const getAllMenusByBusinessID = async (_parent: any, { id }: { id: string }, { db, business }: Context) => {
    const Menu = MenuModel(db);
    const allMenusByBusiness = await Menu.find({ business });
    return allMenusByBusiness;
}

const updateMenuInfo = async (_parent: any, args: { input: UpdateMenuInfo }, { db, user, business }: Context) => {

    if (!business) throw Error('Business not found');
    if (!user) throw Error('User not found');

    const Menu = MenuModel(db);

    try {
        const menu = await Menu.findOne({ _id: args.input._id, business });
        if (!menu) throw Error('Menu not found');

        menu.name = args.input.name;
        menu.save();

        return menu
    } catch (err) {
        throw ApolloError(err as Error, 'InternalServerError');
    }
}

const updateMenu = async (_parent: any, { input }: { input: UpdateMenuInput }, { db, user, business }: Context) => {

    if (!user) throw Error('User not found');
    if (!business) throw Error('Business not found');

    const Product = ProductModel(db);
    const Menu = MenuModel(db)
    const Category = CategoryModel(db);

    const menu = await Menu.findById(input._id);
    if (!menu) throw Error('Menu not found')

    // frontend will send the information that needs to be updated
    if (input.name) {
        menu.name = input.name
    }


    if (input.isFavorite) {
        const currentFavorite = await Menu.findOne({ isFavorite: true })

        if (currentFavorite) {
            currentFavorite.isFavorite = false
            await currentFavorite.save()
        }
    }

    menu.isFavorite = input.isFavorite

    if (input.sections.length === 0) {
        menu.sections = [];
        return await menu.save();
    }

    // from all the sections, just get the product ids
    const productIds = input.sections.map(section => section.products).flat();
    // make sure they dont repeat 
    const uniqueProductIds = Array.from(new Set(productIds))
    // find all the products that match the ids

    const products = await Product.find({ _id: { $in: uniqueProductIds } })
    if (products.length !== uniqueProductIds.length) {
        throw ApolloError(new Error('BAD USER DATA: Product not found when updating menu'), "BadRequest")
    }

    menu.items = products;

    return await menu.save()
}


const deleteMenu = async (_parent: any, args: { id: string }, { db, user, business }: Context) => {


    if (!user) throw Error('User not found');
    if (!business) throw Error('Business not found');

    const Menu = MenuModel(db);

    try {
        const menu = await Menu.findOne({ _id: args.id });
        if (!menu) {
            throw ApolloError(new Error("Menu not found. Make sure the id is correct."), 'BadRequest',)
        };

        await menu.remove();
        return menu;
    } catch (err) {
        throw ApolloError(err as Error, "BadRequest")
    }
}

const getClientMenu = async (_parent: any, args: {
    input: {
        _id?: string,
        business: string
    }
}, { db }: { db: Connection }) => {
    const Menu = MenuModel(db);

    if (!args.input._id) {

        const favoriteMenu = await Menu.findOne({
            business: args.input.business,
            isFavorite: true
        })

        if (!favoriteMenu) {
            return await Menu.findOne({
                business: args.input.business
            })
        }

        return favoriteMenu
    }

    const menu = await Menu.findOne({ _id: args.input._id });
    if (!menu) throw ApolloError(new Error('Menu not found'), 'BadRequest');

    return menu
}


const MenuResolverMutation = {
    createMenu,
    updateMenu,
    updateMenuInfo,
    deleteMenu,
}
const MenuResolverQuery = {
    getAllMenusByBusinessID,
    getMenuByID,
    getClientMenu
}

const getSectionsByMenu = async (_parent: any, args: any, { db }: { db: Connection }) => {
    return _parent;
}

const getProductsBySection = async (_parent: any, args: any, { db }: { db: Connection }) => {
    const Product = ProductModel(db);
    if (!_parent.products.length) return []

    return await Product.find({
        _id: { $in: _parent.products },
        $or: [
            { paused: false },
            { paused: { $exists: false } }
        ]
    })
}

const getCategoryBySection = async (_parent: any, args: any, { db }: { db: Connection }) => {
    const Category = CategoryModel(db);
    if (!_parent.category) return null

    return await Category.findById(_parent.category)
}

async function getItemsByMenu(menu: any) {
    return await populateProducts(menu);
}

const MenuResolver = {
    getSectionsByMenu,
    getProductsBySection,
    getCategoryBySection,
    getItemsByMenu
}

export { MenuResolverMutation, MenuResolverQuery, MenuResolver }