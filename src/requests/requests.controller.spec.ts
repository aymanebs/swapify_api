import { Test, TestingModule } from '@nestjs/testing';
import { RequestsController } from './requests.controller';
import { RequestsService } from './requests.service';

enum RequestStatus {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  REJECTED = 'rejected',
  COMPLETED = 'completed',
}

describe('RequestsController', () => {
  let controller: RequestsController;
  let service: RequestsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RequestsController],
      providers: [
        {
          provide: RequestsService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findByReceiverId: jest.fn(),
            findBySenderId: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<RequestsController>(RequestsController);
    service = module.get<RequestsService>(RequestsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should call the service to create a request', async () => {
      const createRequestDto = {
        receiver: 'receiver-id',
        itemOffered: 'item-offered-id',
        itemRequested: 'item-requested-id',
      };
      const req = { user: { userId: 'sender-id' } };

      await controller.create(createRequestDto, req);

      expect(service.create).toHaveBeenCalledWith(createRequestDto, 'sender-id');
    });
  });

  describe('findAll', () => {
    it('should call the service to get all requests', async () => {
      await controller.findAll();
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('findByReceiverId', () => {
    it('should call the service to get requests by receiver ID', async () => {
      const req = { user: { userId: 'receiver-id' } };
      await controller.findByReceiverId(req);
      expect(service.findByReceiverId).toHaveBeenCalledWith('receiver-id');
    });
  });

  describe('findBySenderId', () => {
    it('should call the service to get requests by sender ID', async () => {
      const req = { user: { userId: 'sender-id' } };
      await controller.ffindBySenderId(req);
      expect(service.findBySenderId).toHaveBeenCalledWith('sender-id');
    });
  });

  describe('findOne', () => {
    it('should call the service to get a request by ID', async () => {
      const requestId = 'request-id';
      await controller.findOne(requestId);
      expect(service.findOne).toHaveBeenCalledWith(requestId);
    });
  });

  describe('update', () => {
    it('should call the service to update a request', async () => {
      const requestId = 'request-id';
      const updateRequestDto = {
        status: RequestStatus.ACCEPTED, // Use the enum value
      };

      await controller.update(requestId, updateRequestDto);
      expect(service.update).toHaveBeenCalledWith(requestId, updateRequestDto);
    });
  });
});