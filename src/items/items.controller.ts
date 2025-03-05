import { Body, Controller, Delete, Get, Param, Post, Put, Req, UseGuards } from '@nestjs/common';
import { ItemsService } from './items.service';
import { CreateItemDto } from './dtos/create-items.dto';
import { Item } from './items.schema';
import { UpdateItemDto } from './dtos/update-items.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('items')
export class ItemsController {

    constructor(private readonly itemService: ItemsService){}

    @Post()
    @UseGuards(JwtAuthGuard)
    async create(@Body() createItemDto: CreateItemDto, @Req() req: any): Promise<Item>{
        const userId = req.user.userId;
        return await this.itemService.createItem(createItemDto, userId);
    }

    @Get('/me')
    @UseGuards(JwtAuthGuard)
    async getUserItems(@Req() req: any): Promise<Item[]>{
        return await this.itemService.getItemsByUserId(req.user.userId);
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
