import bcrypt from "bcryptjs";
import { User, UserModel } from "../../../models/user";
import { SessionModel } from "../../../models/session";
import { getUserFromToken, tokenSigning, validateEmail } from "../utils";
import { Connection } from "mongoose";
import { Context } from "../types";
import { BusinessModel } from "../../../models/business";
import {
	typedKeys,
	SignUpSchemaInput,
	CreateAccountField,
	createAccountSchema,
	AccountInformation,
	ResetPasswordSchemaInput,
	CreateEmployeeAccountInput,
	createEmployeeAccountSchema,
	loginSchema,
	signUpSchema,
} from "app-helpers";
import { sendWelcomeEmail, sendResetPasswordEmail } from "../../../email-tool";
import { uploadFileS3Bucket } from "../../../s3/s3";
import { ApolloError } from "../../ApolloErrorExtended/ApolloErrorExtended";
import { MutationResolvers } from "../../../generated/graphql";

const hashPassword = (password: string) => {
	const salt = bcrypt.genSaltSync(10);
	return bcrypt.hashSync(password, salt);
};

export const requestUserAccountCreation: MutationResolvers["requestUserAccountCreation"] =
	async (_parent, { input }, { db, locale }) => {
		const { email } = signUpSchema.parse(input);

		const Session = SessionModel(db);
		const User = UserModel(db);
		const user = await User.findOne({ email });

		if (user) throw new Error("An account with this email already exists");

		let newSession;

		const existingSession = await Session.findOne({ email });

		if (!existingSession) {
			newSession = await Session.create({
				email,
			});
		} else {
			newSession = existingSession;
		}

		if (!newSession?.email) throw new Error("Could not create session");

		try {
			const token = await tokenSigning(newSession._id, newSession.email);

			newSession.token = token;
			await newSession.save();

			if (!token) throw new Error("Token not found");

			return await sendWelcomeEmail({
				email,
				token,
				locale,
			});
		} catch (err) {
			throw new Error(`Could not send email ${err}`);
		}
	};

export const createUser = async (
	_parent: any,
	{ input }: { input: CreateAccountField },
	{ db }: { db: Connection },
) => {
	try {
		const validInput = createAccountSchema.parse(input);

		const Session = SessionModel(db);
		const Business = BusinessModel(db);
		const findSession = await Session.findOne({ email: validInput.email });

		if (!findSession)
			throw ApolloError(
				new Error(
					"Session not found. Check you email again or request a new access token.",
				),
				"NotFound",
			);

		const hashedPassword = hashPassword(validInput.password);
		const User = UserModel(db);

		const user = await User.create({
			name: validInput.name,
			email: validInput.email.toLowerCase(),
			password: hashedPassword,
			isGuest: false,
		});

		const savedUser = await user.save();

		// business can only belong to one country
		// address will auto populate
		const creatingBusiness = await Business.create({
			user: savedUser._id,
			name: savedUser.name,
			email: savedUser.email,
			employees: [savedUser._id],
			country: validInput.country,
		});

		const businessToString = creatingBusiness._id.toString();

		user.businesses = {
			[businessToString]: {
				privilege: "Admin",
				jobTitle: "Owner",
			},
		};

		const token = tokenSigning(
			user._id,
			input.email.toLowerCase(),
			creatingBusiness?._id,
		);
		await user.save();

		return {
			_id: savedUser._id,
			name: savedUser.name,
			email: savedUser.email,
			token,
		};
	} catch (err) {
		throw new Error(`${err}`);
	}
};

// Enter credentials to get existing user
export const postUserLogin = async (
	_parent: any,
	{ input }: any,
	{ db }: { db: Connection },
) => {
	const { email, password } = loginSchema.parse(input);

	const User = UserModel(db);
	const user = await User.findOne({ email });

	if (!user || !user.password) throw new Error("User not found");

	const isPasswordMatch = await bcrypt.compare(password, user.password);
	if (!isPasswordMatch) throw new Error("User not found");

	const allBusiness = typedKeys(user.businesses);
	const businessId = allBusiness.length
		? (allBusiness[0] as string)
		: undefined;

	const token = await tokenSigning(user._id, email, businessId);

	return {
		_id: user._id,
		name: user.name,
		token,
		email,
	};
};

export const getUserInformation = async (
	_parent: any,
	_args: any,
	{ db, user }: Context,
) => {
	const foundUser = await UserModel(db).findById(user);

	if (!foundUser) return null;

	const token = tokenSigning(foundUser._id, foundUser.email as string);

	return {
		_id: foundUser._id,
		name: foundUser.name,
		email: foundUser.email,
		picture: foundUser.picture,
		token,
	};
};

export const getToken = async (_parent: any, _: any, { db, user }: Context) => {
	if (!user) throw new Error("User not found");

	const userProfile = await UserModel(db).findById(user._id);
	if (!userProfile) return null;

	const allBusiness = typedKeys(userProfile.businesses);
	const businessId = allBusiness.length
		? (allBusiness[0] as string)
		: undefined;

	const token = await tokenSigning(
		userProfile._id,
		userProfile.email as string,
		businessId,
	);

	return {
		_id: userProfile._id,
		name: userProfile.name,
		email: userProfile.email,
		token,
	};
};

export const getAllUsers = async (
	_parent: any,
	_args: any,
	{ db }: Context,
) => {
	const User = UserModel(db);
	return await User.find({});
};

export const deleteUser = async (
	_parent: any,
	{ input }: { input: string },
	{ db, user }: Context,
) => {
	if (!user) throw new Error("User not found");

	const User = await UserModel(db).findOneAndDelete({ _id: user._id });

	return { ok: !!User };
};

//TODO: when a new email is created, a new token should be generated
export const updateUserInformation = async (
	_parent: any,
	{ input }: { input: AccountInformation & { picture: any } },
	{ db, user }: Context,
) => {
	if (!user) throw new Error("User not found.");

	const User = UserModel(db);
	const foundUser = await User.findById(user._id);

	if (input.picture) {
		const file = await uploadFileS3Bucket(input.picture);

		foundUser?.set({ picture: file.Location });
	}

	if (input.newPassword && input.oldPassword) {
		const isPasswordMatch = await bcrypt.compare(
			input.oldPassword,
			foundUser?.password as string,
		);
		const hashedPassword = hashPassword(input.newPassword);

		if (!isPasswordMatch) throw new Error("User not found");

		foundUser?.set({ password: hashedPassword });
	}

	return await foundUser
		?.set({
			name: input.name,
		})
		.save();
};

// recover password

export const recoverPassword: MutationResolvers["recoverPassword"] = async (
	_parent,
	{ input },
	{ db, locale },
) => {
	if (!validateEmail(input)) {
		throw ApolloError(new Error("Invalid input"), "BadRequest");
	}

	const User = UserModel(db);
	const user = await User.findOne({ email: input });

	if (!user || !user.email || !user.name)
		throw ApolloError(new Error("Not an user"), "NotFound");

	const allBusiness = typedKeys(user.businesses);
	const businessId = allBusiness.length
		? (allBusiness[0] as string)
		: undefined;
	const token = await tokenSigning(user._id, user.email, businessId);

	if (!token)
		throw ApolloError(new Error("No signing token"), "InternalServerError");

	try {
		const courierResponse = await sendResetPasswordEmail({
			email: user.email,
			name: user.name,
			token,
			locale,
		});

		return courierResponse;
	} catch (err) {
		throw new Error(`Could not send email ${err}`);
	}
};

const createEmployeeAccount = async (
	_parent: any,
	{ input }: { input: CreateEmployeeAccountInput },
	{ db }: Context,
) => {
	try {
		const validInput = createEmployeeAccountSchema.parse(input);
		const { token, password, email, name } = validInput;
		if (!email || !token)
			throw ApolloError(new Error("Invalid input"), "BadRequest");
		// the token will be used to know what business the user is creating the account for
		const Session = SessionModel(db);
		const foundSession = await Session.findOne({ email: email, token: token });
		// with the session we can try to get the job role

		if (!foundSession)
			throw ApolloError(new Error("Invalid input"), "BadRequest");

		const {
			_id,
			email: emailFromToken,
			business,
		} = (await getUserFromToken(token)) || {};

		if (!business || !emailFromToken) {
			throw ApolloError(
				new Error("Invalid Token. Request a new one"),
				"BadRequest",
			);
		}

		const User = UserModel(db);
		const hashedPassword = hashPassword(password);
		// make sure business exists
		const businessFound = await BusinessModel(db).findById(business);

		const privilege = foundSession?.business?.privilege;
		const jobTitle = foundSession?.business?.jobTitle;

		if (!businessFound || !privilege || !jobTitle) {
			throw ApolloError(
				new Error("Invalid Business or Privileges"),
				"BadRequest",
			);
		}

		const user = await User.create({
			name,
			email,
			password: hashedPassword,
			isGuest: false,
			businesses: {
				[businessFound._id]: {
					privilege,
					jobTitle,
				},
			},
		});

		// this should never be undefined, but just in case
		businessFound.employees = [...(businessFound?.employees || []), user._id];
		businessFound.employeesPending = businessFound?.employeesPending?.filter(
			(employee) => employee?.toString() !== _id?.toString(),
		);

		await businessFound.save();

		const newToken = await tokenSigning(
			user._id,
			user.email as string,
			businessFound._id,
		);

		return {
			_id: user._id,
			name: user.name,
			email: user.email,
			picture: user.picture,
			token: newToken,
		};
	} catch (err) {
		throw ApolloError(err as Error, "BadRequest");
	}
};

const getBusinessByUser = (user: User, input: any, context: Context) => {
	const business = user.businesses;

	if (!business) return [];

	const mappedbusinesses = typedKeys(business).map(
		(businessId: string | number) => {
			return {
				business: businessId,
				privilege: business[businessId].privilege,
			};
		},
	);

	return mappedbusinesses;
};

const passwordReset = async (
	_parent: any,
	{ input: { password, token } }: { input: ResetPasswordSchemaInput },
	{ db }: Context,
) => {
	if (!token) throw ApolloError(new Error("No token"), "BadRequest");

	try {
		const decodedToken = await getUserFromToken(token);

		if (!decodedToken)
			throw ApolloError(new Error("Token Invalid"), "BadRequest");

		const User = UserModel(db);
		const user = await User.findOne({ email: decodedToken.email });

		if (!user) throw new Error("User not found");

		const hashedPassword = hashPassword(password);

		user.password = hashedPassword;
		await user.save();

		return {
			_id: user._id,
			name: user.name,
			email: user.email,
			token,
		};
	} catch (error) {
		throw ApolloError(error as Error, "BadRequest");
	}
};

const getClientInformation = async (
	_parent: any,
	{ input }: { input: string },
	{ db, client }: Context,
) => {
	const User = UserModel(db);
	const foundClient = await User.findById(client?._id);

	if (!foundClient)
		throw ApolloError(new Error("Client not found"), "BadRequest");

	return foundClient;
};

const UserResolverMutation = {
	requestUserAccountCreation,
	updateUserInformation,
	deleteUser,
	createUser,
	recoverPassword,
	postUserLogin,
	passwordReset,
	createEmployeeAccount,
};
const UserResolverQuery = {
	getUserInformation,
	getAllUsers,
	getToken,
	getClientInformation,
};

const UserResolver = {
	getBusinessByUser,
};

export { UserResolver, UserResolverMutation, UserResolverQuery };
