import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Item } from './items.schema';
import { Model } from 'mongoose';
import { CreateItemDto } from './dtos/create-items.dto';
import { UpdateItemDto } from './dtos/update-items.dto';

@Injectable()
export class ItemsService {
    constructor(@InjectModel("Item") private readonly itemModel: Model<Item>){}

    async createItem(createItemDto: CreateItemDto): Promise<Item> {
        const Item = await new this.itemModel({...createItemDto});
        return Item.save();
    }
    
    async getItemById(id: string): Promise<Item>{
        const item = await this.itemModel.findById(id).exec();
        if(!item){
            throw new NotFoundException('Item not found');
        }
        return item;
    }

    async getAllItems() : Promise<Item[]>{
        const items = await this.itemModel.find().exec();
        if(!items || items.length == 0){
            throw new NotFoundException('No item found');
        }
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
