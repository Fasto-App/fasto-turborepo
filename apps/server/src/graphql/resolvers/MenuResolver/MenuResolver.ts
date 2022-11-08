import { Connection } from "mongoose";
import { MenuModel, ProductModel, CategoryModel, Section, Product } from "../../../models";
import { ApolloExtendedError } from "../../ApolloErrorExtended/ApolloErrorExtended";
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
        throw new ApolloExtendedError('Error creating menu', 500);
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
        throw new ApolloExtendedError('Error updating menu. Item was not found.', 500);
    }
}

const updateMenu = async (_parent: any, { input }: { input: UpdateMenuInput }, { db, user, business }: Context) => {
    console.log(input)
    if (!user) throw Error('User not found');
    if (!business) throw Error('Business not found');

    // const Section = SectionModel(db);
    const Product = ProductModel(db);
    const Menu = MenuModel(db)
    const Category = CategoryModel(db);

    const menu = await Menu.findById(input._id);
    if (!menu) throw Error('Menu not found')

    if (input.sections.length === 0) {
        return await menu.update({
            sections: []
        })
    }

    const newSections = input.sections.map(async (section) => {

        if (!section.category) throw Error('Section category is required');
        // find if category exists
        const category = await Category.findOne({ _id: section.category });
        if (!category?._id) throw new ApolloExtendedError('BAD USER DATA: Category not found when updating menu', 403);

        // looks for an array of products and see if they all exist
        if (section.products?.length) {
            const products = await Product.find({ _id: { $in: section.products } })
            if (products.length !== section.products.length) {
                throw new ApolloExtendedError('BAD USER DATA: Product not found when updating menu', 403)
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

    menu.sections = allSectionsResolved as Section[];

    console.log(input.name)

    if (input.name) {
        menu.name = input.name
    }

    await menu.save()
    return menu
}


const deleteMenu = async (_parent: any, args: { id: string }, { db, user, business }: Context) => {


    if (!user) throw Error('User not found');
    if (!business) throw Error('Business not found');

    const Menu = MenuModel(db);

    try {
        const menu = await Menu.findOne({ _id: args.id });
        if (!menu) {
            throw new ApolloExtendedError('Menu not found. Make sure the id is correct.', 403)
        };

        await menu.remove();
        return menu;
    } catch {
        throw new ApolloExtendedError('Menu not found. Make sure the id is correct.', 403)
    }
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
}

const getSectionsByMenu = async (_parent: any, args: any, { db }: { db: Connection }) => {
    console.log(_parent)

    return _parent;
}

const getProductsBySection = async (_parent: any, args: any, { db }: { db: Connection }) => {
    const Product = ProductModel(db);
    const products = await Product.find({ _id: { $in: _parent.products } })
    return products;
}

const getCategoryBySection = async (_parent: any, args: any, { db }: { db: Connection }) => {

    console.log(_parent)
    const Category = CategoryModel(db);
    const category = await Category.findById(_parent.category)
    return category?._id;
}

const MenuResolver = {
    getSectionsByMenu,
    getProductsBySection,
    getCategoryBySection
}

export { MenuResolverMutation, MenuResolverQuery, MenuResolver }