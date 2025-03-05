import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

@Schema({
    collection: 'items',
    timestamps: true,
})

export class Item extends Document{

    @Prop({required: true,trim: true, minLength:3,maxLength:20 })
    name: string;

    @Prop({required: true,  minLength:8})
    description: string;

    @Prop({required: true})
    condition: string;

    @Prop({required: true, type: Types.ObjectId, ref: 'Category'})
    category: Types.ObjectId;

}

export const ItemSchema = SchemaFactory.createForClass(Item);

