import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Category, categorySchema } from './categories.schema';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category';
import { Model } from 'mongoose';

@Injectable()
export class CategoriesService {

    constructor(@InjectModel("Category") private readonly categoryModel: Model<Category>){}

    async createCategory(createCategoryDto: CreateCategoryDto): Promise<Category>{
        const category = await new this.categoryModel({...createCategoryDto});
        return category.save();
    }

    async getAllCategories(): Promise<Category[]>{
        const categories = await this.categoryModel.find().exec();
        return categories;
    }

    async updateCategory(id: string, updateCategoryDto: UpdateCategoryDto): Promise<Category>{
        const category = await this.categoryModel.findById(id);
        if(!category){
            throw new NotFoundException('No category found');
        }
        return await this.categoryModel.findByIdAndUpdate(id,updateCategoryDto,{new: true}).exec();
    }

    async delete(id: string): Promise<Category>{
        const category = await this.categoryModel.findById(id);
        if(!category){
            throw new NotFoundException('No category found');
        }
        return await this.categoryModel.findByIdAndDelete(id).exec();
    }

}
