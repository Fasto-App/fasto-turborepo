import { Types, Connection } from "mongoose";
import { prop, getModelForClass } from "@typegoose/typegoose";
import type { RequestStatus, RequestStatusType } from "app-helpers";

export class Request {
	@prop({ required: true })
	public business!: Types.ObjectId;

	@prop()
	public admin?: Types.ObjectId;

	@prop()
	public requestor?: Types.ObjectId;

	@prop()
	public tab?: Types.ObjectId;

	@prop()
	public totalGuests?: number;

	@prop()
	public names?: string[];

	@prop({ default: "Pending" })
	public status?: RequestStatusType;

	@prop({ default: Date.now() })
	public created_date!: Date;
}

export const RequestModel = (conn: Connection) =>
	getModelForClass(Request, {
		existingConnection: conn,
		schemaOptions: { collection: "Request" },
	});
