import { Product, ProductModel } from "../../../models/product";
import { Connection } from "mongoose"
import { BusinessModel } from "../../../models/business";
import { CategoryModel } from "../../../models/category";
import { GQLContext } from "../CategoryResolver/CategoryResolver";
import { ApolloExtendedError } from "../../ApolloErrorExtended/ApolloErrorExtended";
import { Bugsnag } from "../../../bugsnag/bugsnag";
import { CreateProductInput } from "./types";
import { uploadFileS3Bucket } from "../../../s3/s3";



const createProduct = async (_parent: any, { input }: { input: CreateProductInput }, { db, business }: { db: Connection, business: string }) => {

    console.log("Creating Product")
    console.log({ input })


    const Product = ProductModel(db);
    const Category = CategoryModel(db);
    const businessByID = await BusinessModel(db).findById(business)
    const categoryByID = await Category.findById(input.category)

    if (!businessByID) throw new ApolloExtendedError('Business not found.')
    if (!categoryByID) throw new ApolloExtendedError('Category not found.')


    if (categoryByID?.subCategories?.length) {
        throw new ApolloExtendedError('Category already has subcategories, and should not be linked to a product')
    }

    const productByName = await Product.findOne({ name: input.name, business: business })


    if (productByName) {
        throw new ApolloExtendedError('Product already exists.', 401)
    }


    if (input.price < 0 || !Number.isInteger(input.price)) {
        throw new ApolloExtendedError('Price must be an integer and greater than 0')
    }

    try {

        const product = new Product({
            name: input.name,
            description: input?.description,
            price: input.price,
            business: businessByID?._id,
            category: categoryByID?._id,
            addons: input?.addons,
            imageUrl: input.file,
        });


        const savedProduct = await product.save();

        if (categoryByID) {
            categoryByID.products?.push(savedProduct._id)
            await categoryByID.save()
        }

        return savedProduct;

    } catch (err) {
        throw new Error(`Error creating product: ${err}`);
    }
}


const getProductsByCategory = async (parent: Parent, args: any, { db }: GQLContext) => {
    const products = parent.products;


    const Product = ProductModel(db);
    const productsByCategory = await Product.find({ _id: { $in: products } })

    return productsByCategory;
}

const getCategoryByProduct = async (parent: any, { productID }: { productID: string }, { db }: { db: Connection }) => {
    const Category = CategoryModel(db);
    const category = await Category.findById(parent.category)

    return category;
}

const getAllProductsByBusinessID = async (_parent: any, _: any, { db, business }: { db: Connection, business: string }) => {

    console.log("Getting all products by business ID")
    console.log("business", business)



    const Product = ProductModel(db);
    const allProductsByBusiness = await Product.find<Product>({ business });
    return allProductsByBusiness;
}

const getProductByID = async (_parent: any,
    { productID }: { productID: string },
    { db }: { db: Connection }) => {
    return await ProductModel(db).findById(productID);;
}

// TODO: Properly type input
const updateProductByID = async (_parent: any, arg: { input: any }, { db, user, business }: GQLContext) => {
    const { input } = arg;

    console.log({ input })

    // use the _id to find the product, make sure the name is unique, and update the product
    const Product = ProductModel(db);
    const product = await Product.findById(input._id);



    if (!product) throw new ApolloExtendedError('Product not found. Please try it again.', 401)

    // if the input has a photo, upload it to the s3 bucket
    if (input.file) {
        product.imageUrl = input.file;
    }

    // if theres a name, see if the name is unique
    if (input.name) {
        const productByName = await Product.findOne({ name: input.name, business: business })


        if (productByName && productByName._id.toString() !== input._id) {
            throw new ApolloExtendedError('Product name already exists. Please try it again.', 401)
        }

        product.name = input.name;
    }

    // if theres a price, see if the price is valid
    if (input.price) {
        if (input.price < 0) {
            throw new ApolloExtendedError('Price must be greater than 0. Please try it again.', 401)
        }


        product.price = input.price;
    }

    // if theres a description, see if the description is valid
    if (input.description) {
        if (input.description.length > 500) throw new ApolloExtendedError('Description must be less than 500 characters. Please try it again.', 401)

        product.description = input.description;
    }

    // if theres a category, see if the category is valid   
    if (input.category) {
        const Category = CategoryModel(db);
        const category = await Category.findById(input.category)
        if (!category) throw new ApolloExtendedError('Category not found. Please try it again.', 401)

        product.category = input.category;
    }

    // if theres a addons, see if the addons are valid
    if (input.addons) {
        if (input.addons.length > 10) throw new ApolloExtendedError('Addons must be less than 10. Please try it again.', 401)
    }

    if (input.file) {
        product.imageUrl = input.file;
    }

    // TODO: change to updateOne instead?
    // await product.updateOne({
    //     $set: {
    //         name: input.name,
    //         description: input.description,
    //         price: input.price,
    //         category: input.category,
    //         addons: input.addons,
    //         imageUrl: input.imageUrl,
    //     }
    // })

    await product.save()
    return product
}

// delete category
const deleteProduct = async (_parent: any, args: { id: string }, { db, user, business }: GQLContext) => {
    // INIATILY DELETING THE PRODUCT


    if (!business) throw new ApolloExtendedError('Business not found. Please login again.', 401)

    const Product = ProductModel(db);
    const product = await Product.findById(args.id);

    if (!product) throw new ApolloExtendedError('Product not found. Please try it again.', 401)

    await product.remove();
    return { ok: true }
};

const uploadFile = async (_parent: any, { file }: { file: any }) => {
    const imageUrl = await uploadFileS3Bucket(file);
    return imageUrl.Location;
}





type GetProductByIDInput = {
    productID: string
}

type Parent = {
    id: string
    products: Product[]
}

const ProductResolverQuery = {
    getAllProductsByBusinessID,
    getProductByID,
}
const ProductResolverMutation = {
    createProduct,
    updateProductByID,
    deleteProduct,
    uploadFile
}

const ProductResolver = {
    getProductsByCategory,
    getCategoryByProduct
}

export { ProductResolverMutation, ProductResolverQuery, ProductResolver }