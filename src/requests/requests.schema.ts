import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Collection, Document, Types } from "mongoose";
import { RequestStatus } from "../enums/request-status.enum";

@Schema({
    collection: 'requests',
    timestamps: true
})

export class Request extends Document{

    @Prop({required: true, type: Types.ObjectId, ref: 'User'})
    sender: string;

    @Prop({required: true, type: Types.ObjectId, ref: 'User'})
    receiver: string;

    @Prop({required: true, type: Types.ObjectId, ref: 'Item'})
    itemOffered: string;

    @Prop({required: true, type: Types.ObjectId, ref: 'Item'})
    itemRequested: string;

    @Prop({ enum: RequestStatus, default: RequestStatus.PENDING})
    status: string;
}

export const RequestSchema = SchemaFactory.createForClass(Request);