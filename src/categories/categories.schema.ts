import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import {  Document } from "mongoose";

@Schema({
    collection: "categories",
    timestamps: true,
})

export class Category extends Document{

    @Prop({required: true, minlength: 3})
    name: string;

}

export const categorySchema = SchemaFactory.createForClass(Category);

