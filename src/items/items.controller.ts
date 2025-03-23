import { Body, Controller, Delete, Get, Param, Post, Put, Query, Req, UploadedFile, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import { ItemsService } from './items.service';
import { CreateItemDto } from './dtos/create-items.dto';
import { Item } from './items.schema';
import { UpdateItemDto } from './dtos/update-items.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { multerConfig } from 'src/config/multerConfig';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody, ApiConsumes, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('items')
@Controller('items')
export class ItemsController {

    constructor(private readonly itemService: ItemsService){}

    @Post()
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Create a new item' })
    @ApiConsumes('multipart/form-data')
    @ApiBody({ type: CreateItemDto })
    @ApiResponse({ status: 201, description: 'Item created successfully.' })  
    @UseInterceptors(FilesInterceptor('images',5,multerConfig()))
    async create(@Body() createItemDto: CreateItemDto, @UploadedFiles() photos: Express.Multer.File[], @Req() req: any): Promise<Item>{
        const photoPaths = photos.map((photo) => photo.path);
        const userId = req.user.userId;
        return await this.itemService.createItem({...createItemDto,photos: photoPaths}, userId);
    }

    @Get('/me')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Get items of the logged-in user' })
    @ApiResponse({ status: 200, description: 'Returns a list of items.' })
    async getUserItems(@Req() req: any): Promise<Item[]>{
        return await this.itemService.getItemsByUserId(req.user.userId);
    }

    @Get('/recent')
    @ApiOperation({ summary: 'Get recently added items' })
    @ApiResponse({ status: 200, description: 'Returns a list of recent items.' })
    async getLastItems(): Promise<Item[]>{
        return await this.itemService.getRecentItems();
    }

    @Get('/:id')
    @ApiOperation({ summary: 'Get an item by ID' })
    @ApiParam({ name: 'id', description: 'Item ID' })
    @ApiResponse({ status: 200, description: 'Returns the item.' })  
    async getById(@Param('id') id: string): Promise<Item>{
        return  await this.itemService.getItemById(id);
    }

    @Get()
    @ApiOperation({ summary: 'Get all items' })
    @ApiResponse({ status: 200, description: 'Returns a list of items.' })
    async getAll(page: number = 1, @Query('limit') limit: number = 10){
        return await this.itemService.getAllItems();
    }



    @Put('/:id')
    @ApiOperation({ summary: 'Update an item' })
    @ApiParam({ name: 'id', description: 'Item ID' })
    @ApiConsumes('multipart/form-data')
    @ApiBody({ type: UpdateItemDto })
    @ApiResponse({ status: 200, description: 'Item updated successfully.' })
    @UseInterceptors(FilesInterceptor('images', 5, multerConfig()))
    async update(
      @Param('id') id: string,
      @Body() updateItemDto: UpdateItemDto,
      @UploadedFiles() photos: Express.Multer.File[],
    ): Promise<Item> {
      const photoPaths = photos ? photos.map((photo) => photo.path) : undefined;
      return await this.itemService.updateItem(id, { ...updateItemDto, photos: photoPaths });
    }

    @Delete('/:id')
    @ApiOperation({ summary: 'Delete an item' })
    @ApiParam({ name: 'id', description: 'Item ID' })
    @ApiResponse({ status: 200, description: 'Item deleted successfully.' })
    async delete(@Param('id') id: string): Promise<Item>{
        return await this.itemService.deleteItem(id);
    }

}
