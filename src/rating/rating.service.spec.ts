import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { RatingService } from './rating.service';
import { Model } from 'mongoose';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Types } from 'mongoose';
import { CreateRatingDto } from './dtos/create-rating.dto';
import { Rating } from './rating.schema';

describe('RatingService', () => {
  let service: RatingService;

  const mockRating = {
    _id: new Types.ObjectId(),
    ratedUser: new Types.ObjectId(),
    raterUser: new Types.ObjectId(),
    request: new Types.ObjectId(),
    score: 5,
    comment: 'Great service!',
    save: jest.fn().mockResolvedValue(this),
  };

  const mockRatingModel = {
    constructor: jest.fn().mockImplementation(() => ({
      save: () => Promise.resolve(mockRating),
    })),
    findOne: jest.fn().mockResolvedValue(null),
    find: jest.fn().mockReturnValue({
      populate: jest.fn().mockReturnThis(),
      exec: () => Promise.resolve([mockRating]),
    }),
    findById: jest.fn().mockReturnValue({
      populate: jest.fn().mockReturnValue({
        exec: () => Promise.resolve(mockRating),
      }),
    }),
    findByIdAndUpdate: jest.fn().mockReturnValue({
      exec: () => Promise.resolve(mockRating),
    }),
    findByIdAndDelete: jest.fn().mockReturnValue({
      exec: () => Promise.resolve(mockRating),
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RatingService,
        {
          provide: getModelToken(Rating.name),
          useValue: mockRatingModel,
        },
      ],
    }).compile();

    service = module.get<RatingService>(RatingService);

    service.create = jest.fn().mockImplementation((createRatingDto) => {
      if (createRatingDto.raterUser === 'existingRater') {
        return Promise.reject(new BadRequestException('You have already rated this request.'));
      }
      return Promise.resolve(mockRating);
    });

    service.findAll = jest.fn().mockImplementation(() => {
      return Promise.resolve([mockRating]);
    });

    service.findOne = jest.fn().mockImplementation((id) => {
      if (id === 'invalidId') {
        return Promise.reject(new NotFoundException('Rating not found.'));
      }
      return Promise.resolve(mockRating);
    });

    service.getUserAverageRating = jest.fn().mockImplementation((userId) => {
      if (userId === 'noRatingsUser') {
        return Promise.resolve({ averageRating: 0, totalRatings: 0 });
      }
      return Promise.resolve({ averageRating: 5, totalRatings: 1 });
    });
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a rating', async () => {
      const createRatingDto: CreateRatingDto = {
        ratedUser: new Types.ObjectId().toString(),
        raterUser: new Types.ObjectId().toString(),
        request: new Types.ObjectId().toString(),
        score: 5,
        comment: 'Great service!',
      };
      const result = await service.create(createRatingDto);
      expect(service.create).toHaveBeenCalledWith(createRatingDto);
      expect(result).toEqual(mockRating);
    });

    it('should throw BadRequestException if rating already exists', async () => {
      const createRatingDto: CreateRatingDto = {
        ratedUser: new Types.ObjectId().toString(),
        raterUser: 'existingRater',
        request: new Types.ObjectId().toString(),
        score: 5,
        comment: 'Great service!',
      };
      await expect(service.create(createRatingDto)).rejects.toThrow(BadRequestException);
    });
  });

  describe('findAll', () => {
    it('should return all ratings', async () => {
      const result = await service.findAll();
      expect(service.findAll).toHaveBeenCalled();
      expect(result).toEqual([mockRating]);
    });
  });

  describe('findOne', () => {
    it('should return a rating by ID', async () => {
      const result = await service.findOne(mockRating._id.toString());
      expect(service.findOne).toHaveBeenCalledWith(mockRating._id.toString());
      expect(result).toEqual(mockRating);
    });

    it('should throw NotFoundException if rating not found', async () => {
      await expect(service.findOne('invalidId')).rejects.toThrow(NotFoundException);
    });
  });

  describe('getUserAverageRating', () => {
    it('should return average rating for a user', async () => {
      const userId = new Types.ObjectId().toString();
      const result = await service.getUserAverageRating(userId);
      expect(service.getUserAverageRating).toHaveBeenCalledWith(userId);
      expect(result).toEqual({ averageRating: 5, totalRatings: 1 });
    });

    it('should return 0 average rating if no ratings found', async () => {
      const result = await service.getUserAverageRating('noRatingsUser');
      expect(service.getUserAverageRating).toHaveBeenCalledWith('noRatingsUser');
      expect(result).toEqual({ averageRating: 0, totalRatings: 0 });
    });
  });
});