import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Collection, Document, Types } from "mongoose";

@Schema({
    collection: 'messages',
    timestamps: true,
})

export class Message extends Document{

    @Prop({required: true, ref: 'User'})
    sender: Types.ObjectId;

    @Prop({required: true, ref: 'User'})
    receiver: Types.ObjectId;

    @Prop({required: true, minlength: 1})
    content: string;

    @Prop({default: false})
    isRead: boolean;

}

export const MessageSchema = SchemaFactory.createForClass(Message);