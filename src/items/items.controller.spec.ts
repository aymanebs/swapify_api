import { Test, TestingModule } from '@nestjs/testing';
import { ItemsController } from './items.controller';
import { ItemsService } from './items.service';
import { Types } from 'mongoose';
import { CreateItemDto } from './dtos/create-items.dto';
import { UpdateItemDto } from './dtos/update-items.dto';
import { NotFoundException } from '@nestjs/common';

jest.mock('../auth/guards/jwt-auth.guard', () => ({
  JwtAuthGuard: jest.fn().mockImplementation(() => ({
    canActivate: jest.fn().mockReturnValue(true),
  })),
}));

jest.mock('../config/multerConfig', () => ({
  multerConfig: jest.fn().mockReturnValue({}),
}));

describe('ItemsController', () => {
  let controller: ItemsController;
  let service: ItemsService;

 
  const validObjectId = '507f1f77bcf86cd799439011';

  const mockItem = {
    _id: 'testId',
    name: 'Test Item',
    description: 'Test Description',
    condition: 'New',
    category: new Types.ObjectId(validObjectId),
    photos: ['photo1.jpg', 'photo2.jpg'],
    userId: 'userId',
  };

  beforeEach(async () => {
    const mockItemsService = {
      createItem: jest.fn().mockResolvedValue(mockItem),
      getItemsByUserId: jest.fn().mockResolvedValue([mockItem]),
      getRecentItems: jest.fn().mockResolvedValue([mockItem]),
      getItemById: jest.fn().mockResolvedValue(mockItem),
      getAllItems: jest.fn().mockResolvedValue({
        items: [mockItem],
        total: 10,
        totalPages: 1
      }),
      updateItem: jest.fn().mockResolvedValue(mockItem),
      deleteItem: jest.fn().mockResolvedValue(mockItem)
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ItemsController],
      providers: [
        {
          provide: ItemsService,
          useValue: mockItemsService,
        },
      ],
    }).compile();

    controller = module.get<ItemsController>(ItemsController);
    service = module.get<ItemsService>(ItemsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create an item', async () => {
    const createItemDto = {
      name: 'Test Item',
      description: 'Test Description',
      condition: 'New',
      category: new Types.ObjectId(validObjectId),
      photos: ['photo1.jpg', 'photo2.jpg']
    };
    const mockPhotos = [{ path: 'path1.jpg' }, { path: 'path2.jpg' }] as Express.Multer.File[];
    const mockReq = { user: { userId: 'userId' } };
    
    expect(await controller.create(createItemDto, mockPhotos, mockReq)).toEqual(mockItem);
    expect(service.createItem).toHaveBeenCalledWith(
      { ...createItemDto, photos: ['path1.jpg', 'path2.jpg'] }, 
      'userId'
    );
  });

  it('should get user items', async () => {
    const mockReq = { user: { userId: 'userId' } };
    expect(await controller.getUserItems(mockReq)).toEqual([mockItem]);
    expect(service.getItemsByUserId).toHaveBeenCalledWith('userId');
  });

  it('should get recent items', async () => {
    expect(await controller.getLastItems()).toEqual([mockItem]);
    expect(service.getRecentItems).toHaveBeenCalled();
  });

  it('should get item by id', async () => {
    expect(await controller.getById('testId')).toEqual(mockItem);
    expect(service.getItemById).toHaveBeenCalledWith('testId');
  });

  it('should get all items', async () => {
    expect(await controller.getAll()).toEqual({
      items: [mockItem],
      total: 10,
      totalPages: 1
    });
    expect(service.getAllItems).toHaveBeenCalled();
  });

  describe('update', () => {
  
    it('should update an item with photos', async () => {
      const updateItemDto: UpdateItemDto = {
        name: 'Updated Item',
      };
      const photos = [
        { path: 'photo1.jpg' },
        { path: 'photo2.jpg' },
      ] as Express.Multer.File[];
      const result = await controller.update(mockItem._id.toString(), updateItemDto, photos);
      expect(service.updateItem).toHaveBeenCalledWith(mockItem._id.toString(), {
        ...updateItemDto,
        photos: ['photo1.jpg', 'photo2.jpg'],
      });
      expect(result).toEqual(mockItem);
    });
  
    it('should throw NotFoundException if item not found', async () => {
      jest.spyOn(service, 'updateItem').mockRejectedValue(new NotFoundException('Item not found'));
      const updateItemDto: UpdateItemDto = {
        name: 'Updated Item',
      };
      await expect(controller.update('invalidId', updateItemDto, [])).rejects.toThrow(NotFoundException);
    });
  });

  it('should delete an item', async () => {
    expect(await controller.delete('testId')).toEqual(mockItem);
    expect(service.deleteItem).toHaveBeenCalledWith('testId');
  });
});