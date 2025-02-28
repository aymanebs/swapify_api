import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { Category } from './categories.schema';
import { CategoriesService } from './categories.service';
import { UpdateCategoryDto } from './dto/update-category';

@Controller('categories')
export class CategoriesController {
    constructor(private readonly categoriesService: CategoriesService){}

    @Post()
    async create(@Body() createCategoryDto: CreateCategoryDto): Promise<Category>{
        return await this.categoriesService.createCategory(createCategoryDto);
    }

    @Get()
    async getAll(){
        return await this.categoriesService.getAllCategories();
    }

    @Put('/:id')
    async update(@Param('id') id: string,@Body() updateCategoryDto: UpdateCategoryDto){
        return await this.categoriesService.updateCategory(id, updateCategoryDto);
    }

    @Delete('/:id')
    async delete(@Param('id') id: string){
        return await this.categoriesService.delete(id);
    }
}
