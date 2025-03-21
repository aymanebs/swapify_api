import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { Category } from './categories.schema';
import { CategoriesService } from './categories.service';
import { UpdateCategoryDto } from './dto/update-category';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';

@ApiTags('categories')
@Controller('categories')
export class CategoriesController {
    constructor(private readonly categoriesService: CategoriesService){}

    @Post()
    @ApiOperation({ summary: 'Create a new category' })
    @ApiBody({ type: CreateCategoryDto })
    @ApiResponse({ status: 201, description: 'Category created successfully.' })
    async create(@Body() createCategoryDto: CreateCategoryDto): Promise<Category>{
        return await this.categoriesService.createCategory(createCategoryDto);
    }

    @Get()
    @ApiOperation({ summary: 'Get all categories' })
    @ApiResponse({ status: 200, description: 'Returns a list of categories.' })
    async getAll(){
        return await this.categoriesService.getAllCategories();
    }

    @Put('/:id')
    @ApiOperation({ summary: 'Update a category' })
    @ApiParam({ name: 'id', description: 'Category ID' })
    @ApiBody({ type: UpdateCategoryDto })
    @ApiResponse({ status: 200, description: 'Category updated successfully.' })
    async update(@Param('id') id: string,@Body() updateCategoryDto: UpdateCategoryDto){
        return await this.categoriesService.updateCategory(id, updateCategoryDto);
    }

    @Delete('/:id')
    @ApiOperation({ summary: 'Delete a category' })
    @ApiParam({ name: 'id', description: 'Category ID' })
    @ApiResponse({ status: 200, description: 'Category deleted successfully.' })
    async delete(@Param('id') id: string){
        return await this.categoriesService.delete(id);
    }
}
