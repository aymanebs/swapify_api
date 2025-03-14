import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

@Schema({
    collection: 'chats',
    timestamps: true
})

export class Chat extends Document{

    @Prop({required: true, type : Types.ObjectId, ref: 'Message'})
    messages: Types.ObjectId[];

    @Prop({required: true, type: Types.ObjectId, ref: 'User'})
    participants: Types.ObjectId[];

    @Prop({required: true, type: Types.ObjectId, ref: 'Request'})
    request: Types.ObjectId;

    @Prop({default: false})
    isActive: boolean;
}

export const ChatSchema = SchemaFactory.createForClass(Chat);

