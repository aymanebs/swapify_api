import { Test, TestingModule } from '@nestjs/testing';
import { MessagesController } from './messages.controller';
import { MessagesService } from './messages.service';
import { Types } from 'mongoose';
import { getModelToken } from '@nestjs/mongoose';

describe('MessagesController', () => {
  let controller: MessagesController;
  let service: MessagesService;

  const mockMessage = {
    _id: new Types.ObjectId().toHexString(), // Valid ObjectId string
    sender: new Types.ObjectId(), // Valid ObjectId
    chatId: new Types.ObjectId(), // Valid ObjectId
    content: 'Test message',
    createdAt: new Date(),
  };

  const mockMessagesService = {
    create: jest.fn().mockResolvedValue(mockMessage),
    update: jest.fn().mockResolvedValue(mockMessage),
  };

  const mockMessageModel = {
    // Mock the Mongoose model methods used by MessagesService
    create: jest.fn().mockResolvedValue(mockMessage),
    findByIdAndUpdate: jest.fn().mockResolvedValue(mockMessage),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MessagesController],
      providers: [
        MessagesService,
        {
          provide: getModelToken('Message'), // Use getModelToken to mock the Mongoose model
          useValue: mockMessageModel,
        },
      ],
    })
      .overrideProvider(MessagesService) // Override MessagesService with the mock
      .useValue(mockMessagesService)
      .compile();

    controller = module.get<MessagesController>(MessagesController);
    service = module.get<MessagesService>(MessagesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a message', async () => {
    const createMessageDto = {
      sender: new Types.ObjectId(), // Use ObjectId instead of string
      chatId: new Types.ObjectId(), // Use ObjectId instead of string
      content: 'Test message',
    };

    expect(await controller.create(createMessageDto)).toEqual(mockMessage);
    expect(service.create).toHaveBeenCalledWith(createMessageDto);
  });

  it('should update a message', async () => {
    const updateMessageDto = { content: 'Updated message' };

    expect(await controller.update(mockMessage._id, updateMessageDto)).toEqual(mockMessage);
    expect(service.update).toHaveBeenCalledWith(mockMessage._id, updateMessageDto);
  });
});