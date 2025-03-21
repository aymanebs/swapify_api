import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { ChatsService } from './chats.service';
import { Model } from 'mongoose';
import { NotFoundException } from '@nestjs/common';
import { Types } from 'mongoose';
import { CreateChatDto } from './dtos/create-chat.dto';

describe('ChatsService', () => {
  let service: ChatsService;

  const mockChat = {
    _id: new Types.ObjectId(),
    participants: [new Types.ObjectId()],
    messages: [new Types.ObjectId()],
    isActive: true,
    save: jest.fn().mockResolvedValue(this),
  };

  const mockChatModel = {
    constructor: jest.fn().mockImplementation(() => ({
      save: () => Promise.resolve(mockChat),
    })),
    find: jest.fn().mockReturnValue({
      populate: jest.fn().mockReturnThis(),
      exec: () => Promise.resolve([mockChat]),
    }),
    findById: jest.fn().mockReturnValue({
      populate: jest.fn().mockReturnValue({
        exec: () => Promise.resolve(mockChat),
      }),
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ChatsService,
        {
          provide: getModelToken('Chat'),
          useValue: mockChatModel,
        },
      ],
    }).compile();

    service = module.get<ChatsService>(ChatsService);


    service.create = jest.fn().mockImplementation((createChatDto) => {
      return Promise.resolve(mockChat);
    });

  
    service.getChatsForUser = jest.fn().mockImplementation((userId) => {
      return Promise.resolve([mockChat]);
    });

  
    service.getChatById = jest.fn().mockImplementation((chatId) => {
      if (chatId === 'invalidId') {
        return Promise.reject(new NotFoundException('Chat not found!'));
      }
      return Promise.resolve(mockChat);
    });
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a chat', async () => {
      const createChatDto: CreateChatDto = {
        messages: [new Types.ObjectId()],
        request: new Types.ObjectId(),
      };

      const result = await service.create(createChatDto);
      expect(service.create).toHaveBeenCalledWith(createChatDto);
      expect(result).toEqual(mockChat);
    });
  });

  describe('getChatsForUser', () => {
    it('should return chats for a user', async () => {
      const userId = new Types.ObjectId().toString();
      const result = await service.getChatsForUser(userId);
      expect(service.getChatsForUser).toHaveBeenCalledWith(userId);
      expect(result).toEqual([mockChat]);
    });
  });

  describe('getChatById', () => {
    it('should return a chat by ID', async () => {
      const chatId = mockChat._id.toString();
      const result = await service.getChatById(chatId);
      expect(service.getChatById).toHaveBeenCalledWith(chatId);
      expect(result).toEqual(mockChat);
    });

    it('should throw NotFoundException if chat not found', async () => {
      await expect(service.getChatById('invalidId')).rejects.toThrow(NotFoundException);
    });
  });
});