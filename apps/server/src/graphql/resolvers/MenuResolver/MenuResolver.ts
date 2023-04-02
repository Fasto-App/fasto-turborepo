import { Connection } from "mongoose";
import { MenuModel, ProductModel, CategoryModel, Section, Product } from "../../../models";
import { ApolloError } from "../../ApolloErrorExtended/ApolloErrorExtended";
import { Context } from "../types";
import { CreateMenuInput, UpdateMenuInput } from "./types";

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

    } catch {
        throw ApolloError('InternalServerError');
    }
}

const getMenuByID = async (_parent: any, args: any, { db }: { db: Connection }) => {

    console.log(args)

    const Menu = MenuModel(db);
    const menu = await Menu.findOne({ _id: args.input.id });
    if (!menu) throw Error('Menu not found');

    return menu
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
    } catch {
        throw ApolloError('InternalServerError');
    }
}

const updateMenu = async (_parent: any, { input }: { input: UpdateMenuInput }, { db, user, business }: Context) => {

    if (!user) throw Error('User not found');
    if (!business) throw Error('Business not found');

    // const Section = SectionModel(db);
    const Product = ProductModel(db);
    const Menu = MenuModel(db)
    const Category = CategoryModel(db);

    const menu = await Menu.findById(input._id);
    if (!menu) throw Error('Menu not found')

    if (input.name) {
        menu.name = input.name
    }

    console.log("Updating isFavorite")

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

    const newSections = input.sections.map(async (section) => {

        if (!section.category) throw Error('Section category is required');
        // find if category exists
        const category = await Category.findOne({ _id: section.category });
        if (!category?._id) throw ApolloError('BadRequest', "BAD USER DATA: Category not found when updating menu");

        // looks for an array of products and see if they all exist
        if (section.products?.length) {
            const products = await Product.find({ _id: { $in: section.products } })
            if (products.length !== section.products.length) {
                throw ApolloError("BadRequest", 'BAD USER DATA: Product not found when updating menu')
            };

            return ({
                category: category._id,
                products: products.map(product => product._id),
            })
        } else {
            return ({
                category: category._id,
                products: [],
            })
        }
    })

    const allSectionsResolved = await Promise.all(newSections);

    menu.sections = allSectionsResolved

    return await menu.save()
}


const deleteMenu = async (_parent: any, args: { id: string }, { db, user, business }: Context) => {


    if (!user) throw Error('User not found');
    if (!business) throw Error('Business not found');

    const Menu = MenuModel(db);

    try {
        const menu = await Menu.findOne({ _id: args.id });
        if (!menu) {
            throw ApolloError('BadRequest', "Menu not found. Make sure the id is correct.")
        };

        await menu.remove();
        return menu;
    } catch {
        throw ApolloError("BadRequest", "Menu not found. Make sure the id is correct.")
    }
}

const getClientMenu = async (_parent: any, args: {
    input: {
        _id?: string,
        business: string
    }
}, { db }: { db: Connection }) => {
    console.log("getClientMenu")

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
    if (!menu) throw ApolloError('BadRequest', 'Menu not found');

    console.log("retuning menu")

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
    const products = await Product.find({ _id: { $in: _parent.products } })
    return products;
}

const getCategoryBySection = async (_parent: any, args: any, { db }: { db: Connection }) => {
    const Category = CategoryModel(db);
    const category = await Category.findById(_parent.category)
    return category;
}

const MenuResolver = {
    getSectionsByMenu,
    getProductsBySection,
    getCategoryBySection
}

export { MenuResolverMutation, MenuResolverQuery, MenuResolver }