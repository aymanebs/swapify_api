import { Body, Controller, Delete, Get, Param, Post, Put, Req, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { ItemsService } from './items.service';
import { CreateItemDto } from './dtos/create-items.dto';
import { Item } from './items.schema';
import { UpdateItemDto } from './dtos/update-items.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { multerConfig } from 'src/config/multerConfig';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('items')
export class ItemsController {

    constructor(private readonly itemService: ItemsService){}

    @Post()
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(FileInterceptor('image',multerConfig()))
    async create(@Body() createItemDto: CreateItemDto, @UploadedFile() photo: Express.Multer.File, @Req() req: any): Promise<Item>{
        console.log('photo: ',photo);
        console.log('body: ', createItemDto);
        const photoPath = photo.path;
        const userId = req.user.userId;
        return await this.itemService.createItem({...createItemDto,photos: photoPath}, userId);
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
