import { Connection } from "mongoose";
import { getModelForClass, prop } from "@typegoose/typegoose";

export class Tax {
	@prop({ required: true })
	public country!: "BR" | "US";

	@prop({ required: true })
	public state!: string;

	@prop({ required: true })
	public zipcode!: string;

	@prop({ required: true })
	public rate!: number;

	@prop({ default: Date.now() })
	public created_date!: Date;
}

export const TaxModel = (conn: Connection) =>
	getModelForClass(Tax, {
		existingConnection: conn,
		schemaOptions: { collection: "Tax" },
	});
