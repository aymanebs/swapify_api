import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Collection, Document, Types } from "mongoose";
import { MessageStatus } from "src/enums/messages-status.enum";

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

    @Prop({enum: MessageStatus, default: MessageStatus.UNREAD})
    status: string;

}

export const MessageSchema = SchemaFactory.createForClass(Message);