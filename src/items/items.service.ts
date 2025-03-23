import { forwardRef, Inject, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Item } from './items.schema';
import { Model } from 'mongoose';
import { CreateItemDto } from './dtos/create-items.dto';
import { UpdateItemDto } from './dtos/update-items.dto';
import { EventsGateway } from 'src/gateways/events.gateway';
import { ChatsService } from 'src/chats/chats.service';
import { RequestsService } from 'src/requests/requests.service';
import { RequestStatus } from 'src/enums/request-status.enum';

@Injectable()
export class ItemsService {
    constructor(@InjectModel("Item") private readonly itemModel: Model<Item>,
        @Inject(forwardRef(() => ChatsService)) private readonly chatsService: ChatsService,
        @Inject(forwardRef(() => EventsGateway)) private readonly eventsGateway: EventsGateway,
        @Inject(forwardRef(() => RequestsService)) private readonly requestService: RequestsService
    ) {}

    async createItem(createItemDto: CreateItemDto, userId: string): Promise<Item> {
        const Item = await new this.itemModel({ ...createItemDto, userId });
        return Item.save();
    }

    async getItemById(id: string): Promise<Item> {
        const item = await this.itemModel.findById(id).populate([{
            path: 'category',
            select: 'name',
        }, {
            path: 'userId',
            select: 'first_name last_name',
        }]).exec();
        if (!item) {
            throw new NotFoundException('Item not found');
        }
        return item;
    }

    async getItemsByUserId(userId: string): Promise<Item[]> {
        const items = await this.itemModel.find({ userId, isAvailable: true }).populate({
            path: 'category',
            select: 'name',
        }).exec();
        if (!items || items.length == 0) {
            throw new NotFoundException('No items found');
        }
        return items;
    }

    async getAllItems(page: number = 1, limit: number = 10): Promise<{ items: Item[], total: number, totalPages: number }> {
        const skip = (page - 1) * limit;
        const total = await this.itemModel.countDocuments({ isAvailable: true });
        const items = await this.itemModel.find({ isAvailable: true }).populate({
            path: 'category',
            select: 'name',
        })
            .skip(skip)
            .limit(limit)
            .exec();

        if (!items || items.length == 0) {
            throw new NotFoundException('No item found');
        }
        return {
            items,
            total,
            totalPages: Math.ceil(total / limit),
        };
    }

    async getRecentItems() {
        const items = await this.itemModel.find({ isAvailable: true }).sort({ createdAt: -1 }).limit(5).exec();
        return items;
    }

    async updateItem(id: string, updateItemDto: UpdateItemDto & { photos?: string[] }): Promise<Item> {
        const updateData: any = { ...updateItemDto };
        if (updateItemDto.photos) {
            updateData.photos = updateItemDto.photos;
        }
        return await this.itemModel.findByIdAndUpdate(id, updateData, { new: true }).exec();
    }

    async deleteItem(id: string): Promise<Item> {
        try {
          console.log('Deleting item:', id);
      
          const item = await this.getItemById(id);
      
          // Mark the item as unavailable
          const updatedItem = await this.itemModel.findByIdAndUpdate(id, { isAvailable: false }, { new: true }).exec();
          console.log('Updated item:', updatedItem);
      
          // Notify chat participants if the item is part of an active exchange
          const chats = await this.chatsService.getChatsByItemId(id);
          console.log('Chats:', chats);
      
          for (const chat of chats) {
            this.eventsGateway.server.to(chat._id.toString()).emit('itemDeleted', {
              chatId: chat._id,
              itemId: id,
              message: 'The item in this exchange has been deleted.',
            });
          }
      
          // Fetch all requests associated with the item
          const requests = await this.requestService.findByItemId(id).catch(() => []); // Return an empty array if no requests are found
          console.log('Requests associated with the item:', requests);
      
          // Cancel or delete the requests
          for (const request of requests) {
            console.log('Processing request:', request._id.toString(), 'with status:', request.status);
      
            if (request.status !== RequestStatus.COMPLETED) {
              console.log('Canceling request:', request._id.toString());
              await this.requestService.update(request._id.toString(), { status: RequestStatus.CANCELED });
              console.log('Request canceled:', request._id.toString());
            }
          }
      
          return updatedItem;
        } catch (error) {
          console.error('Failed to delete item:', error);
          throw new InternalServerErrorException('Failed to delete item');
        }
      }

}
