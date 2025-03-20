import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({
    collection: 'ratings',
    timestamps: true
 })

 export class Rating extends Document {
   @Prop({ type: String, ref: 'User', required: true }) 
   ratedUser: string;
 
   @Prop({ type: String, ref: 'User', required: true }) 
   raterUser: string;
 
   @Prop({ type: String, ref: 'Request', required: true }) 
   request: string;
 
   @Prop({ type: Number, required: true, min: 1, max: 5 })
   score: number;
 
   @Prop({ type: String, maxlength: 500 })
   comment?: string;
 }

export const RatingSchema = SchemaFactory.createForClass(Rating);
