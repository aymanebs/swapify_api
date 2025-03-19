import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Item } from './items.schema';
import { Model } from 'mongoose';
import { CreateItemDto } from './dtos/create-items.dto';
import { UpdateItemDto } from './dtos/update-items.dto';

@Injectable()
export class ItemsService {
    constructor(@InjectModel("Item") private readonly itemModel: Model<Item>){}

    async createItem(createItemDto: CreateItemDto, userId: string): Promise<Item> {
        const Item = await new this.itemModel({...createItemDto,userId});
        return Item.save();
    }
    
    async getItemById(id: string): Promise<Item>{
        const item = await this.itemModel.findById(id).populate([{
            path: 'category',
            select: 'name',
        },{
           path: 'userId',
           select: 'first_name last_name', 
        }]).exec();
        if(!item){
            throw new NotFoundException('Item not found');
        }
        return item;
    }

    async getItemsByUserId(userId: string): Promise<Item[]>{

        const items = await this.itemModel.find({userId}).populate({
            path: 'category',
            select: 'name',
        }).exec();
        if(!items || items.length == 0){
            throw new NotFoundException('No items found');
        }
        return items;
    }

    async getAllItems(page: number = 1, limit: number = 10) : Promise<{ items: Item[], total: number, totalPages: number }>{

        const skip = (page - 1) * limit;

        const total = await this.itemModel.countDocuments();

        const items = await this.itemModel.find().populate({
            path: 'category',
            select: 'name',
        })
        .skip(skip)
        .limit(limit)
        .exec();


        if(!items || items.length == 0){
            throw new NotFoundException('No item found');
        }
        return {
            items,       
            total,       
            totalPages: Math.ceil(total / limit) 
          };

    }

    async getRecentItems(){
        const items= await this.itemModel.find().sort({createdAt: -1}).limit(5).exec();
        return items;
    }   

    async updateItem(id: string, updateItemDto: UpdateItemDto): Promise<Item>{
        await this.getItemById(id);
        return await this.itemModel.findByIdAndUpdate(id,updateItemDto,{new: true}).exec();
    }

    async deleteItem(id: string): Promise<Item>{
        await this.getItemById(id);
        return await this.itemModel.findByIdAndDelete(id).exec();
    }

}
