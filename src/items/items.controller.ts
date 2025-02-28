import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { ItemsService } from './items.service';
import { CreateItemDto } from './dtos/create-items.dto';
import { Item } from './items.schema';
import { UpdateItemDto } from './dtos/update-items.dto';

@Controller('items')
export class ItemsController {

    constructor(private readonly itemService: ItemsService){}

    @Post()
    async create(@Body() createItemDto: CreateItemDto): Promise<Item>{
        return await this.itemService.createItem(createItemDto);
    }

    @Get('/:id')
    async getById(@Param('id') id: string): Promise<Item>{
        return  await this.itemService.getItemById(id);
    }

    @Get()
    async getAll(): Promise<Item[]>{
        return await this.itemService.getAllItems();
    }

    @Put('/:id')
    async update(@Param('id') id: string, @Body() updateItemDto: UpdateItemDto): Promise<Item>{
        return await this.itemService.updateItem(id, updateItemDto);
    }

    @Delete('/:id')
    async delete(@Param('id') id: string): Promise<Item>{
        return await this.itemService.deleteItem(id);
    }

}
