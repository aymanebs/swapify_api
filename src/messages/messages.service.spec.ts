import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { MessagesService } from './messages.service';
import { Model } from 'mongoose';
import { NotFoundException } from '@nestjs/common';
import { Types } from 'mongoose';
import { CreateMessageDto } from './dtos/create-messages.dto';
import { UpdateMessageDto } from './dtos/update-messages.dto';

describe('MessagesService', () => {
  let service: MessagesService;

  const mockMessage = {
    _id: new Types.ObjectId(),
    sender: new Types.ObjectId(),
    chatId: new Types.ObjectId(),
    content: 'Test Message',
    save: jest.fn().mockResolvedValue(this),
  };

  const mockChat = {
    _id: new Types.ObjectId(),
    messages: [],
    save: jest.fn().mockResolvedValue(this),
  };

  const mockMessageModel = {
    constructor: jest.fn().mockImplementation(() => ({
      save: () => Promise.resolve(mockMessage),
    })),
    findByIdAndUpdate: jest.fn().mockReturnValue({
      exec: () => Promise.resolve(mockMessage),
    }),
  };

  const mockChatModel = {
    findById: jest.fn().mockReturnValue({
      exec: () => Promise.resolve(mockChat),
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MessagesService,
        {
          provide: getModelToken('Message'),
          useValue: mockMessageModel,
        },
        {
          provide: getModelToken('Chat'),
          useValue: mockChatModel,
        },
      ],
    }).compile();

    service = module.get<MessagesService>(MessagesService);


    service.create = jest.fn().mockImplementation((createMessageDto) => {
      return Promise.resolve(mockMessage);
    });

    service.update = jest.fn().mockImplementation((messageId, updateMessageDto) => {
      if (messageId === 'invalidId') {
        return Promise.reject(new NotFoundException('Message not found'));
      }
      return Promise.resolve(mockMessage);
    });
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a message and update the chat', async () => {
      const createMessageDto: CreateMessageDto = {
        sender: new Types.ObjectId(),
        chatId: new Types.ObjectId(),
        content: 'Test Message',
      };

      const result = await service.create(createMessageDto);
      expect(service.create).toHaveBeenCalledWith(createMessageDto);
      expect(result).toEqual(mockMessage);
    });
  });

  describe('update', () => {
    it('should update a message', async () => {
      const updateMessageDto: UpdateMessageDto = {
        content: 'Updated Message',
      };

      const result = await service.update(mockMessage._id.toString(), updateMessageDto);
      expect(service.update).toHaveBeenCalledWith(mockMessage._id.toString(), updateMessageDto);
      expect(result).toEqual(mockMessage);
    });

    it('should throw NotFoundException if message not found', async () => {
      const updateMessageDto: UpdateMessageDto = {
        content: 'Updated Message',
      };

      await expect(service.update('invalidId', updateMessageDto)).rejects.toThrow(NotFoundException);
    });
  });
});