import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { ItemsService } from './items.service';
import { Model } from 'mongoose';
import { Item } from './items.schema';
import { CreateItemDto } from './dtos/create-items.dto';
import { UpdateItemDto } from './dtos/update-items.dto';
import { NotFoundException } from '@nestjs/common';
import { Types } from 'mongoose';

describe('ItemsService', () => {
  let service: ItemsService;

  const mockItem = {
    _id: new Types.ObjectId(),
    name: 'Test Item',
    description: 'Test Description',
    condition: 'New',
    category: new Types.ObjectId(),
    photos: ['photo1.jpg', 'photo2.jpg'],
    userId: new Types.ObjectId(),
    save: jest.fn().mockResolvedValue(this),
  };

  const mockItemModel = {
    constructor: jest.fn().mockImplementation(() => ({
      save: () => Promise.resolve(mockItem),
    })),
    findById: jest.fn().mockReturnValue({
      populate: jest.fn().mockReturnValue({
        exec: () => Promise.resolve(mockItem),
      }),
    }),
    find: jest.fn().mockReturnValue({
      populate: jest.fn().mockReturnThis(),
      skip: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      sort: jest.fn().mockReturnThis(),
      exec: () => Promise.resolve([mockItem]),
    }),
    countDocuments: jest.fn().mockResolvedValue(10),
    findByIdAndUpdate: jest.fn().mockReturnValue({
      exec: () => Promise.resolve(mockItem),
    }),
    findByIdAndDelete: jest.fn().mockReturnValue({
      exec: () => Promise.resolve(mockItem),
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ItemsService,
        {
          provide: getModelToken('Item'),
          useValue: mockItemModel,
        },
      ],
    }).compile();

    service = module.get<ItemsService>(ItemsService);

    service.createItem = jest.fn().mockImplementation((createItemDto, userId) => {
      return Promise.resolve(mockItem);
    });

    service.getItemById = jest.fn().mockImplementation((id) => {
      if (id === 'invalidId') {
        return Promise.reject(new NotFoundException('Item not found'));
      }
      return Promise.resolve(mockItem);
    });

    service.getItemsByUserId = jest.fn().mockImplementation((userId) => {
      return Promise.resolve([mockItem]);
    });

    service.getAllItems = jest.fn().mockImplementation(() => {
      return Promise.resolve({
        items: [mockItem],
        total: 10,
        totalPages: 1,
      });
    });

    service.getRecentItems = jest.fn().mockImplementation(() => {
      return Promise.resolve([mockItem]);
    });

    service.updateItem = jest.fn().mockImplementation((id, updateItemDto) => {
      if (id === 'invalidId') {
        return Promise.reject(new NotFoundException('Item not found'));
      }
      return Promise.resolve(mockItem);
    });

    service.deleteItem = jest.fn().mockImplementation((id) => {
      if (id === 'invalidId') {
        return Promise.reject(new NotFoundException('Item not found'));
      }
      return Promise.resolve(mockItem);
    });
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createItem', () => {
    it('should create an item', async () => {
      const createItemDto: CreateItemDto = {
        name: 'Test Item',
        description: 'Test Description',
        condition: 'New',
        category: new Types.ObjectId(),
        photos: ['photo1.jpg', 'photo2.jpg'],
      };
      const userId = new Types.ObjectId().toString();
      const result = await service.createItem(createItemDto, userId);
      expect(service.createItem).toHaveBeenCalledWith(createItemDto, userId);
      expect(result).toEqual(mockItem);
    });
  });

  describe('getItemById', () => {
    it('should return an item by ID', async () => {
      const result = await service.getItemById(mockItem._id.toString());
      expect(service.getItemById).toHaveBeenCalledWith(mockItem._id.toString());
      expect(result).toEqual(mockItem);
    });

    it('should throw NotFoundException if item not found', async () => {
      await expect(service.getItemById('invalidId')).rejects.toThrow(NotFoundException);
    });
  });

  describe('getItemsByUserId', () => {
    it('should return items for a user', async () => {
      const userId = new Types.ObjectId().toString();
      const result = await service.getItemsByUserId(userId);
      expect(service.getItemsByUserId).toHaveBeenCalledWith(userId);
      expect(result).toEqual([mockItem]);
    });
  });

  describe('getAllItems', () => {
    it('should return all items with pagination', async () => {
      const result = await service.getAllItems(1, 10);
      expect(service.getAllItems).toHaveBeenCalled();
      expect(result).toEqual({
        items: [mockItem],
        total: 10,
        totalPages: 1,
      });
    });
  });

  describe('getRecentItems', () => {
    it('should return recent items', async () => {
      const result = await service.getRecentItems();
      expect(service.getRecentItems).toHaveBeenCalled();
      expect(result).toEqual([mockItem]);
    });
  });

  describe('updateItem', () => {
    it('should update an item', async () => {
      const updateItemDto: UpdateItemDto = {
        name: 'Updated Item',
      };
      const result = await service.updateItem(mockItem._id.toString(), updateItemDto);
      expect(service.updateItem).toHaveBeenCalledWith(mockItem._id.toString(), updateItemDto);
      expect(result).toEqual(mockItem);
    });

    it('should throw NotFoundException if item not found', async () => {
      const updateItemDto: UpdateItemDto = {
        name: 'Updated Item',
      };
      await expect(service.updateItem('invalidId', updateItemDto)).rejects.toThrow(NotFoundException);
    });
  });

  describe('deleteItem', () => {
    it('should delete an item', async () => {
      const result = await service.deleteItem(mockItem._id.toString());
      expect(service.deleteItem).toHaveBeenCalledWith(mockItem._id.toString());
      expect(result).toEqual(mockItem);
    });

    it('should throw NotFoundException if item not found', async () => {
      await expect(service.deleteItem('invalidId')).rejects.toThrow(NotFoundException);
    });
  });
});