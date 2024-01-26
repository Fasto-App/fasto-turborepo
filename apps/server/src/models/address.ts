import { Connection } from "mongoose";
import { prop, getModelForClass } from "@typegoose/typegoose";

export class Address {
	@prop({ required: true })
	public streetAddress!: string;

	@prop()
	public complement?: string;

	@prop({ required: true })
	public city!: string;

	@prop({ required: true })
	public stateOrProvince!: string;

	@prop({ required: true })
	public postalCode!: string;

	@prop({ required: true })
	public country!: "BR" | "US";

	@prop({ default: Date.now() })
	public created_date!: Date;
}

export const AddressModel = (conn: Connection) =>
	getModelForClass(Address, {
		existingConnection: conn,
		schemaOptions: { collection: "Address" },
	});
