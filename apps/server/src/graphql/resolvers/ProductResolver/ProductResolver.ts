import { Product, ProductModel } from "../../../models/product";
import { Connection } from "mongoose";
import { BusinessModel } from "../../../models/business";
import { CategoryModel } from "../../../models/category";
import { ApolloError } from "../../ApolloErrorExtended/ApolloErrorExtended";
import { CreateProductInput } from "./types";
import { uploadFileS3Bucket } from "../../../s3/s3";
import { Context } from "../types";
import { MenuModel } from "../../../models";
import { MutationResolvers } from "../../../generated/graphql";

const getCurrency = (country: "US" | "BR") =>
	country === "US" ? "USD" : "BRL";

// @ts-ignore
const createProduct: MutationResolvers["createProduct"] = async (
	_parent,
	{ input },
	{ db, business },
) => {
	const Product = ProductModel(db);
	const Category = CategoryModel(db);
	const businessByID = await BusinessModel(db).findById(business);
	const categoryByID = await Category.findById(input.category);

	if (!businessByID)
		throw ApolloError(new Error("Business not found."), "NotFound");
	if (!categoryByID)
		throw ApolloError(new Error("Category not found."), "NotFound");

	if (categoryByID?.subCategories?.length) {
		throw ApolloError(
			new Error(
				"Category already has subcategories, and should not be linked to a product",
			),
			"BadRequest",
		);
	}

	const productByName = await Product.findOne({
		name: input.name,
		business: business,
	});

	if (productByName) {
		throw ApolloError(new Error("Product already exists."), "BadRequest");
	}

	if (input.price < 0 || !Number.isInteger(input.price)) {
		throw ApolloError(
			new Error("Price must be an integer and greater than 0"),
			"BadRequest",
		);
	}

	try {
		const product = new Product({
			name: input.name,
			description: input?.description,
			price: input.price,
			business: businessByID?._id,
			category: categoryByID?._id,
			addons: input?.addons,
			quantity: input?.quantity,
			currency: getCurrency(businessByID.country),
			paused: input?.paused,
		});

		if (input.file) {
			const file = await uploadFileS3Bucket(input.file);

			product.imageUrl = file.Location;
		}

		const savedProduct = await product.save();

		if (categoryByID) {
			categoryByID.products?.push(savedProduct._id);
			await categoryByID.save();
		}

		return savedProduct;
	} catch (err) {
		throw new Error(`Error creating product: ${err}`);
	}
};

const getProductsByCategory = async (
	parent: Parent,
	args: any,
	{ db }: Context,
) => {
	const products = parent.products;

	const Product = ProductModel(db);
	const productsByCategory = await Product.find({ _id: { $in: products } });

	return productsByCategory;
};

const getCategoryByProduct = async (
	parent: any,
	{ productID }: { productID: string },
	{ db }: { db: Connection },
) => {
	const Category = CategoryModel(db);
	const category = await Category.findById(parent.category);

	return category;
};

const getAllProductsByBusinessID = async (
	_parent: any,
	_: any,
	{ db, business }: { db: Connection; business: string },
) => {
	const allProductsByBusiness = await ProductModel(db).find<Product>({
		business,
	});
	return allProductsByBusiness;
};

const getProductByID = async (
	_parent: any,
	{ productID }: { productID: string },
	{ db }: { db: Connection },
) => {
	return await ProductModel(db).findById(productID);
};

// @ts-ignore
const updateProductByID: MutationResolvers["updateProductByID"] = async (
	_parent,
	{ input },
	{ db, user, business },
) => {
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

	// use the _id to find the product, make sure the name is unique, and update the product
	const Product = ProductModel(db);
	const product = await Product.findById(input._id);

	if (!product)
		throw ApolloError(
			new Error("Product not found. Please try it again."),
			"BadRequest",
		);

	// if the input has a photo, upload it to the s3 bucket
	if (input.file) {
		const file = await uploadFileS3Bucket(input.file);

		product.imageUrl = file.Location;
	}

	// if theres a name, see if the name is unique
	if (input.name) {
		const productByName = await Product.findOne({
			name: input.name,
			business: business,
		});

		if (productByName && productByName._id.toString() !== input._id) {
			throw ApolloError(
				new Error("Product name already exists. Please try it again."),
				"BadRequest",
			);
		}

		product.name = input.name;
	}

	// if theres a price, see if the price is valid
	if (input.price) {
		if (input.price < 0) {
			throw ApolloError(
				new Error("Price must be greater than 0. Please try it again"),
				"BadRequest",
			);
		}

		product.price = input.price;
	}

	// if theres a description, see if the description is valid
	if (input.description) {
		if (input.description.length > 500)
			throw ApolloError(
				new Error(
					"Description must be less than 500 characters. Please try it again.",
				),
				"BadRequest",
			);

		product.description = input.description;
	}

	// if theres a category, see if the category is valid
	if (input.category) {
		const Category = CategoryModel(db);
		const category = await Category.findById(input.category);
		if (!category)
			throw ApolloError(
				new Error("Category not found. Please try it again."),
				"BadRequest",
			);

		product.category = category._id;
	}

	if (input.quantity) {
		product.quantity = input.quantity;
	}
	// if theres a addons, see if the addons are valid
	// if (input.addons) {
	//     if (input.addons.length > 10)
	//         throw ApolloError(new Error(), 'BadRequest', "Addons must be less than 10. Please try it again.")
	// }


	if (input.quantity) {
		product.quantity = input.quantity
	}

	product.paused = input.paused
	// if theres a addons, see if the addons are valid
	// if (input.addons) {
	//     if (input.addons.length > 10)
	//         throw ApolloError(new Error(), 'BadRequest', "Addons must be less than 10. Please try it again.")
	// }

	return await product.save()
}

// delete category
const deleteProduct = async (
	_parent: any,
	args: { id: string },
	{ db, user, business }: Context,
) => {
	if (!business)
		throw ApolloError(
			new Error("Business not found. Please login again."),
			"Unauthorized",
		);

	const Product = ProductModel(db);
	const product = await Product.findById(args.id);

	if (!product)
		throw ApolloError(
			new Error("Product not found. Please try it again."),
			"BadRequest",
		);

	await MenuModel(db).updateMany(
		{},
		{ $pull: { "sections.$[].products": args.id } },
	);
	await product.remove();
	return { ok: true };
};

const uploadFile = async (_parent: any, { file }: { file: any }) => {
	const imageUrl = await uploadFileS3Bucket(file);
	return imageUrl.Location;
};

const getProductByOrderDetails = async (
	parent: any,
	args: any,
	{ db }: Context,
) => {
	const Product = ProductModel(db);
	const product = await Product.findById(parent.product);
	return product;
};

const getMostSellingProducts = async (
	par: any,
	args: any,
	{ db, business }: any,
) => {
	const foundProducts = await ProductModel(db)
		.find({ business })
		.sort({ totalOrdered: -1 }) // Sorting in descending order based on totalOrdered
		.limit(5); // Limiting the result to one product

	return foundProducts;
};

type Parent = {
	id: string;
	products: Product[];
};

const ProductResolverQuery = {
	getAllProductsByBusinessID,
	getProductByID,
	getMostSellingProducts,
};
const ProductResolverMutation = {
	createProduct,
	updateProductByID,
	deleteProduct,
	uploadFile,
};

const ProductResolver = {
	getProductsByCategory,
	getCategoryByProduct,
	getProductByOrderDetails,
};

export { ProductResolverMutation, ProductResolverQuery, ProductResolver };
