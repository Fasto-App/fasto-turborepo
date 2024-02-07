import { Ref } from "@typegoose/typegoose";
import { CategoryModel, Category, BusinessModel, ProductModel, MenuModel } from "../../../models";
import { ApolloError } from "../../ApolloErrorExtended/ApolloErrorExtended";
import { Context } from "../types";
import { CreateCategoryInput, UpdateCategoryInput } from "./types";

// FIXME: THIS SHOULD SHOULD BE OF TYPE USERINPUT DONT REFERENCE DATABASE DIRECTLY
type LinkCategoryToProductInput = {
    category: string;
    products: string[];
}

// THIS SHOULD BE OF TYPE CATEGORY POPULATED NOT | OBJECTID
const isCategoryNameUnique = (categories: Ref<Category>[], uniqueNameToCompare: string) => {
    return !categories.find(category => {
        //@ts-ignore
        return category.name === uniqueNameToCompare
    })
}

const createCategory = async (_parent: any, { input }: { input: CreateCategoryInput }, { db, user, business }: Context) => {
    if (!business) throw ApolloError(new Error("No business"), 'Unauthorized')

    const Category = CategoryModel(db);
    const Business = BusinessModel(db)
    const businessByID = await Business.findById(business)

    if (!businessByID) throw ApolloError(new Error("no business id"), 'NotFound')

    const categories = (await businessByID.populate('categories')).categories

    console.log('categories', categories)

    if (!isCategoryNameUnique(categories, input.name)) {
        throw ApolloError(new Error("Category already exists! Please, Try a different one."), 'BadRequest',)
    }

    let parentCategory;
    let subCategories;

    // if parentCategory is not null, I need to check if the parentCategory is in the businessByID
    if (input.parentCategory) {
        parentCategory = await Category.findById(input.parentCategory)
        if (!parentCategory) throw ApolloError(new Error('Parent category not found'), 'NotFound',)
    }

    if (input.subCategories) {
        subCategories = await Category.find({ _id: { $in: input.subCategories } })
        if (subCategories.length !== input.subCategories.length) throw ApolloError(new Error('One or more subcategories not found'), 'NotFound',)
    }

    try {

        const category = new Category({
            name: input.name,
            description: input.description,
            parentCategory: parentCategory?._id,
            subCategories: subCategories?.map(subCategory => subCategory._id),
            business: businessByID._id
        });

        const savedCategory = await category.save();
        if (parentCategory) {
            // @ts-ignore
            parentCategory.subcategories.push(savedCategory._id)
            await parentCategory.save()
        }

        subCategories?.forEach(async subCategory => {
            if (subCategory.parentCategory) throw ApolloError(new Error("Don't overide subcategory"), 'BadRequest')
            subCategory.parentCategory = savedCategory.id
            await subCategory.save()
        })


        return savedCategory;

    } catch (err) {
        throw ApolloError(err as Error, `InternalServerError`)
    }
}




const getAllCategoriesByBusiness = async (_parent: any, _: any, { db, business }: Context) => {


    const Category = CategoryModel(db);
    const allCategoriesByBusiness = await Category.find({ business });
    return allCategoriesByBusiness;
}

// const getCategoriesByMenu = async (parent: any, { id }: { id: string }, { db }: { db: Connection }) => {
//     
//     const Category = CategoryModel(db);

//     // @ts-ignore
//     return parent.categories.map(async category => {
//         const categoryByID = await Category.findById(category)
//         
//         return categoryByID
//     })
// }

const getCategoryByID = async (_parent: any, { id }: { id: string }, { db }: Context) => {
    const Category = CategoryModel(db);
    const category = await Category.findOne({ _id: id });
    return category;
}

// what's the input for create category is going to look like?

// update category
const updateCategory = async (_parent: any, { input }: { input: UpdateCategoryInput }, { db, user, business }: Context) => {

    if (!user?._id) throw ApolloError(new Error("No user"), 'Unauthorized')

    //  Find the categort first
    const Category = CategoryModel(db);
    const category = await Category.findOne({ _id: input._id });
    if (!category) throw ApolloError(new Error("no category"), 'NotFound')

    // Find the business
    const businessByID = await BusinessModel(db).findById(business)
    if (!businessByID) throw ApolloError(new Error("no business"), 'NotFound')

    let parentCategory;
    let subCategories;

    // If the name is not different from the current name, 
    // or from any other product already in the database 
    // then don't update it
    if (input.name) {
        const categories = (await businessByID.populate('categories')).categories
        if (!isCategoryNameUnique(categories, input.name)) throw ApolloError(new Error("not unique"), 'BadRequest')
    }


    // v2
    // Check if this is working properly
    if (input.parentCategory) {
        const parentCategoryFound = await Category.findById(input.parentCategory)
        if (!parentCategoryFound) throw ApolloError(new Error("parent not found"), 'NotFound')
        parentCategory = parentCategoryFound
    }

    // v2
    // Check if this is working properly
    if (input.subCategories) {
        const subCategoriesFound = await Category.find({ _id: { $in: input.subCategories } })
        if (subCategoriesFound.length !== input.subCategories.length) throw ApolloError(new Error("No all data was found"), 'NotFound')
        subCategories = subCategoriesFound
    }
    // v2
    // Check if this is working properly
    subCategories?.forEach(async subCategory => {
        if (subCategory.parentCategory) throw ApolloError(new Error("no parent"), 'BadRequest')
        subCategory.parentCategory = (input._id)
        await subCategory.save()
    })

    try {
        if (input.name) category.name = input.name;
        if (input.description) category.description = input.description;
        if (input.parentCategory) category.parentCategory = input.parentCategory;
        if (input.subCategories) category.subCategories = input.subCategories;
        const savedCategory = await category.save();
        return savedCategory;
    } catch (err) {
        throw ApolloError(err as Error, "InternalServerError",)
    }
}



// delete category
const deleteCategory = async (_parent: any, args: { id: string }, { db, business }: Context) => {
    if (!business) throw ApolloError(new Error("no business"), "NotFound")
    const category = await CategoryModel(db).findById(args.id);
    if (!category) throw ApolloError(new Error("no category"), 'NotFound')

    await MenuModel(db).updateMany({}, { $pull: { sections: { category: category._id } } })
    await ProductModel(db).deleteMany({ category: category._id })
    await category.deleteOne();

    return { ok: true }
};

const linkCategoryToProducts = async (_parent: any,
    { input }: { input: LinkCategoryToProductInput },
    { db, user }: Context) => {

    if (!user?._id) throw ApolloError(new Error("no user"), 'Unauthorized')
    // Get both the category and the product Models
    const Category = CategoryModel(db);
    const Product = ProductModel(db);


    const { category, products } = input;
    const categoryByID = await Category.findById(category)
    if (!categoryByID) throw ApolloError(new Error("no category"), 'NotFound')

    // loop through the croducts and create the array to prepare manupulation
    const productsToLink = products.map(async product => {
        return await Product.findById(product)
    })


    try {
        const productsToLinkArray = await Promise.all(productsToLink)
        if (productsToLinkArray.length !== products.length) throw ApolloError(new Error(), 'NotFound');
        productsToLinkArray.forEach(async product => {
            if (!product) throw ApolloError(new Error("no product"), 'NotFound')

            categoryByID.products?.push(product._id)
            product.category = categoryByID._id
            await product.save()
        })

        return await categoryByID.save()
    } catch {

    }

    return []
}

const CategoryResolverMutation = {
    linkCategoryToProducts,
    createCategory,
    updateCategory,
    deleteCategory,
}
const CategoryResolverQuery = {
    getAllCategoriesByBusiness,
    getCategoryByID,
}

export {
    CategoryResolverMutation,
    CategoryResolverQuery,
}