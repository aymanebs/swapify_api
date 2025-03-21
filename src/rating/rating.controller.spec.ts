import { Test, TestingModule } from '@nestjs/testing';
import { RatingController } from './rating.controller';
import { RatingService } from './rating.service';

describe('RatingController', () => {
  let controller: RatingController;
  let service: RatingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RatingController],
      providers: [
        {
          provide: RatingService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
            getUserAverageRating: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<RatingController>(RatingController);
    service = module.get<RatingService>(RatingService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should call the service to create a rating', async () => {
      const createRatingDto = {
        ratedUser: 'rated-user-id',
        raterUser: 'rater-user-id', 
        request: 'request-id', 
        score: 5, 
        comment: 'Great!',
      };
      const req = { user: { userId: 'rater-user-id' } };

      await controller.create(createRatingDto, req);

      expect(service.create).toHaveBeenCalledWith({
        ...createRatingDto,
        raterUser: 'rater-user-id', 
      });
    });
  });

  describe('findAll', () => {
    it('should call the service to get all ratings', async () => {
      await controller.findAll();
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should call the service to get a rating by ID', async () => {
      const ratingId = 'rating-id';
      await controller.findOne(ratingId);
      expect(service.findOne).toHaveBeenCalledWith(ratingId);
    });
  });

  describe('getUserAverageRating', () => {
    it('should call the service to get the average rating for a user', async () => {
      const userId = 'user-id';
      await controller.getUserAverageRating(userId);
      expect(service.getUserAverageRating).toHaveBeenCalledWith(userId);
    });
  });
});