import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { ItemsService } from './items.service';
import { Model } from 'mongoose';
import { Item } from './items.schema';
import { CreateItemDto } from './dtos/create-items.dto';
import { UpdateItemDto } from './dtos/update-items.dto';
import { NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { Types } from 'mongoose';
import { ChatsService } from '../chats/chats.service';
import { EventsGateway } from '../gateways/events.gateway';
import { RequestsService } from '../requests/requests.service';
import { RequestStatus } from '../enums/request-status.enum';

describe('ItemsService', () => {
  let service: ItemsService;
  let itemModel: Model<Item>;
  let chatsService: ChatsService;
  let eventsGateway: EventsGateway;
  let requestService: RequestsService;

  const mockItem = {
    _id: new Types.ObjectId(),
    name: 'Test Item',
    description: 'Test Description',
    condition: 'New',
    category: new Types.ObjectId(),
    photos: ['photo1.jpg', 'photo2.jpg'],
    userId: new Types.ObjectId(),
    isAvailable: true,
    save: jest.fn().mockResolvedValue(this),
  };

  const mockItemModel = {
    create: jest.fn().mockResolvedValue(mockItem),
    findById: jest.fn().mockReturnValue({
      populate: jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockItem),
      }),
    }),
    find: jest.fn().mockReturnValue({
      populate: jest.fn().mockReturnThis(),
      skip: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      sort: jest.fn().mockReturnThis(),
      exec: jest.fn().mockResolvedValue([mockItem]),
    }),
    countDocuments: jest.fn().mockResolvedValue(10),
    findByIdAndUpdate: jest.fn().mockReturnValue({
      exec: jest.fn().mockResolvedValue(mockItem),
    }),
    findByIdAndDelete: jest.fn().mockReturnValue({
      exec: jest.fn().mockResolvedValue(mockItem),
    }),
  };

  const mockChatsService = {
    getChatsByItemId: jest.fn().mockResolvedValue([]),
  };

  const mockEventsGateway = {
    server: {
      to: jest.fn().mockReturnThis(),
      emit: jest.fn(),
    },
  };

  const mockRequestsService = {
    findByItemId: jest.fn().mockResolvedValue([]),
    update: jest.fn().mockResolvedValue({}),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ItemsService,
        {
          provide: getModelToken('Item'),
          useValue: mockItemModel,
        },
        {
          provide: ChatsService,
          useValue: mockChatsService,
        },
        {
          provide: EventsGateway,
          useValue: mockEventsGateway,
        },
        {
          provide: RequestsService,
          useValue: mockRequestsService,
        },
      ],
    }).compile();

    service = module.get<ItemsService>(ItemsService);
    itemModel = module.get<Model<Item>>(getModelToken('Item'));
    chatsService = module.get<ChatsService>(ChatsService);
    eventsGateway = module.get<EventsGateway>(EventsGateway);
    requestService = module.get<RequestsService>(RequestsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });



  describe('getItemById', () => {
    it('should return an item by ID', async () => {
      const result = await service.getItemById(mockItem._id.toString());
      expect(itemModel.findById).toHaveBeenCalledWith(mockItem._id.toString());
      expect(result).toEqual(mockItem);
    });

    it('should throw NotFoundException if item not found', async () => {
      jest.spyOn(itemModel, 'findById').mockReturnValue({
        populate: jest.fn().mockReturnValue({
          exec: jest.fn().mockResolvedValue(null),
        }),
      } as any);
      await expect(service.getItemById('invalidId')).rejects.toThrow(NotFoundException);
    });
  });

  describe('getItemsByUserId', () => {
    it('should return items for a user', async () => {
      const userId = new Types.ObjectId().toString();
      const result = await service.getItemsByUserId(userId);
      expect(itemModel.find).toHaveBeenCalledWith({ userId, isAvailable: true });
      expect(result).toEqual([mockItem]);
    });

    it('should throw NotFoundException if no items found', async () => {
      jest.spyOn(itemModel, 'find').mockReturnValue({
        populate: jest.fn().mockReturnValue({
          exec: jest.fn().mockResolvedValue([]),
        }),
      } as any);
      const userId = new Types.ObjectId().toString();
      await expect(service.getItemsByUserId(userId)).rejects.toThrow(NotFoundException);
    });
  });


  describe('updateItem', () => {
    it('should update an item without photos', async () => {
      const updateItemDto: UpdateItemDto = {
        name: 'Updated Item',
      };
      const result = await service.updateItem(mockItem._id.toString(), updateItemDto);
      expect(itemModel.findByIdAndUpdate).toHaveBeenCalledWith(
        mockItem._id.toString(),
        updateItemDto,
        { new: true },
      );
      expect(result).toEqual(mockItem);
    });
  
    it('should update an item with photos', async () => {
      const updateItemDto: UpdateItemDto & { photos?: string[] } = {
        name: 'Updated Item',
        photos: ['photo1.jpg', 'photo2.jpg'],
      };
      const result = await service.updateItem(mockItem._id.toString(), updateItemDto);
      expect(itemModel.findByIdAndUpdate).toHaveBeenCalledWith(
        mockItem._id.toString(),
        updateItemDto,
        { new: true },
      );
      expect(result).toEqual(mockItem);
    });
  

  });

  describe('deleteItem', () => {
 
    it('should handle errors during deletion', async () => {
      jest.spyOn(itemModel, 'findByIdAndUpdate').mockRejectedValue(new Error('Test Error'));
      await expect(service.deleteItem(mockItem._id.toString())).rejects.toThrow(InternalServerErrorException);
    });
  });
});