import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { RequestsService } from './requests.service';
import { Model } from 'mongoose';
import { CreateRequestDto } from './dto/create-request.dto';
import { UpdateRequestDto } from './dto/update-request.dto';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Types } from 'mongoose';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Item } from '../items/items.schema';
import { Request } from './requests.schema';
import { EventsGateway } from '../gateways/events.gateway';
import { Chat } from '../chats/chats.schema';

enum RequestStatus {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  REJECTED = 'rejected',
  COMPLETED = 'completed',
}

describe('RequestsService', () => {
  let service: RequestsService;

  const mockRequest = {
    _id: new Types.ObjectId(),
    sender: new Types.ObjectId(),
    receiver: new Types.ObjectId(),
    itemOffered: new Types.ObjectId(),
    itemRequested: new Types.ObjectId(),
    status: RequestStatus.PENDING,
    save: jest.fn().mockResolvedValue(this),
  };

  const mockChat = {
    _id: new Types.ObjectId(),
    participants: [new Types.ObjectId(), new Types.ObjectId()],
    requests: [new Types.ObjectId()],
    messages: [],
    isActive: true,
    save: jest.fn().mockResolvedValue(this),
  };

  const mockRequestModel = {
    constructor: jest.fn().mockImplementation(() => ({
      save: () => Promise.resolve(mockRequest),
    })),
    findOne: jest.fn().mockResolvedValue(null),
    find: jest.fn().mockReturnValue({
      populate: jest.fn().mockReturnThis(),
      sort: jest.fn().mockReturnThis(),
      exec: () => Promise.resolve([mockRequest]),
    }),
    findById: jest.fn().mockReturnValue({
      exec: () => Promise.resolve(mockRequest),
    }),
    findByIdAndUpdate: jest.fn().mockReturnValue({
      exec: () => Promise.resolve(mockRequest),
    }),
    findByIdAndDelete: jest.fn().mockReturnValue({
      exec: () => Promise.resolve(mockRequest),
    }),
  };

  const mockChatModel = {
    findOne: jest.fn().mockReturnValue({
      exec: () => Promise.resolve(mockChat),
    }),
    create: jest.fn().mockResolvedValue(mockChat),
  };

  const mockItemModel = {
    findById: jest.fn().mockReturnValue({
      exec: () => Promise.resolve({}),
    }),
  };

  const mockEventsGateway = {
    handleTradeRequest: jest.fn(),
  };

  const mockEventEmitter = {
    emit: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RequestsService,
        {
          provide: getModelToken(Request.name),
          useValue: mockRequestModel,
        },
        {
          provide: getModelToken(Chat.name),
          useValue: mockChatModel,
        },
        {
          provide: getModelToken(Item.name),
          useValue: mockItemModel,
        },
        {
          provide: EventsGateway,
          useValue: mockEventsGateway,
        },
        {
          provide: EventEmitter2,
          useValue: mockEventEmitter,
        },
      ],
    }).compile();

    service = module.get<RequestsService>(RequestsService);

    service.create = jest.fn().mockImplementation((createRequestDto, sender) => {
      if (sender === 'existingSender') {
        return Promise.reject(new BadRequestException('Already send an exchange request for this item'));
      }
      return Promise.resolve(mockRequest);
    });

    service.findAll = jest.fn().mockImplementation(() => {
      return Promise.resolve([mockRequest]);
    });

    service.findOne = jest.fn().mockImplementation((id) => {
      if (id === 'invalidId') {
        return Promise.reject(new NotFoundException('request not found'));
      }
      return Promise.resolve(mockRequest);
    });

    service.findByReceiverId = jest.fn().mockImplementation((id) => {
      return Promise.resolve([mockRequest]);
    });

    service.findBySenderId = jest.fn().mockImplementation((id) => {
      return Promise.resolve([mockRequest]);
    });

    service.update = jest.fn().mockImplementation((id, updateRequestDto) => {
      if (id === 'invalidId') {
        return Promise.reject(new NotFoundException('request not found'));
      }
      return Promise.resolve(mockRequest);
    });

    service.getPendingRequests = jest.fn().mockImplementation((userId) => {
      return Promise.resolve([mockRequest]);
    });
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a request', async () => {
      const createRequestDto: CreateRequestDto = {
        receiver: new Types.ObjectId().toString(),
        itemOffered: new Types.ObjectId().toString(),
        itemRequested: new Types.ObjectId().toString(),
      };
      const sender = new Types.ObjectId().toString();
      const result = await service.create(createRequestDto, sender);
      expect(service.create).toHaveBeenCalledWith(createRequestDto, sender);
      expect(result).toEqual(mockRequest);
    });

    it('should throw BadRequestException if request already exists', async () => {
      const createRequestDto: CreateRequestDto = {
        receiver: new Types.ObjectId().toString(),
        itemOffered: new Types.ObjectId().toString(),
        itemRequested: new Types.ObjectId().toString(),
      };
      const sender = 'existingSender';
      await expect(service.create(createRequestDto, sender)).rejects.toThrow(BadRequestException);
    });
  });

  describe('findAll', () => {
    it('should return all requests', async () => {
      const result = await service.findAll();
      expect(service.findAll).toHaveBeenCalled();
      expect(result).toEqual([mockRequest]);
    });
  });

  describe('findOne', () => {
    it('should return a request by ID', async () => {
      const result = await service.findOne(mockRequest._id.toString());
      expect(service.findOne).toHaveBeenCalledWith(mockRequest._id.toString());
      expect(result).toEqual(mockRequest);
    });

    it('should throw NotFoundException if request not found', async () => {
      await expect(service.findOne('invalidId')).rejects.toThrow(NotFoundException);
    });
  });

  describe('findByReceiverId', () => {
    it('should return requests by receiver ID', async () => {
      const receiverId = new Types.ObjectId().toString();
      const result = await service.findByReceiverId(receiverId);
      expect(service.findByReceiverId).toHaveBeenCalledWith(receiverId);
      expect(result).toEqual([mockRequest]);
    });
  });

  describe('findBySenderId', () => {
    it('should return requests by sender ID', async () => {
      const senderId = new Types.ObjectId().toString();
      const result = await service.findBySenderId(senderId);
      expect(service.findBySenderId).toHaveBeenCalledWith(senderId);
      expect(result).toEqual([mockRequest]);
    });
  });

  describe('update', () => {
    it('should update a request', async () => {
      const updateRequestDto: UpdateRequestDto = {
        status: RequestStatus.ACCEPTED,
      };
      const result = await service.update(mockRequest._id.toString(), updateRequestDto);
      expect(service.update).toHaveBeenCalledWith(mockRequest._id.toString(), updateRequestDto);
      expect(result).toEqual(mockRequest);
    });

    it('should throw NotFoundException if request not found', async () => {
      const updateRequestDto: UpdateRequestDto = {
        status: RequestStatus.ACCEPTED,
      };
      await expect(service.update('invalidId', updateRequestDto)).rejects.toThrow(NotFoundException);
    });
  });

  describe('getPendingRequests', () => {
    it('should return pending requests for a user', async () => {
      const userId = new Types.ObjectId().toString();
      const result = await service.getPendingRequests(userId);
      expect(service.getPendingRequests).toHaveBeenCalledWith(userId);
      expect(result).toEqual([mockRequest]);
    });
  });
});