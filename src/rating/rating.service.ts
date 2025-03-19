import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Rating } from './rating.schema';
import { CreateRatingDto } from './dtos/create-rating.dto';


@Injectable()
export class RatingService {
  constructor(@InjectModel(Rating.name) private ratingModel: Model<Rating>) {}

  async create(createRatingDto: CreateRatingDto) {
    const existingRating = await this.ratingModel.findOne({
      raterUser: createRatingDto.raterUser,
      ratedUser: createRatingDto.ratedUser,
      request: createRatingDto.request,
    });

    if (existingRating) {
      throw new BadRequestException('You have already rated this request.');
    }

    const newRating = new this.ratingModel(createRatingDto);
    return newRating.save();
  }

  async findAll() {
    return this.ratingModel.find().populate('ratedUser raterUser request');
  }

  async findOne(id: string) {
    const rating = await this.ratingModel.findById(id).populate('ratedUser raterUser request');
    if (!rating) {
      throw new NotFoundException('Rating not found.');
    }
    return rating;
  }

  async getUserAverageRating(userId: string) {
    const ratings = await this.ratingModel.find({ ratedUser: userId });
  
    if (ratings.length === 0) {
      return { averageRating: 0, totalRatings: 0 };
    }
  
    const totalScore = ratings.reduce((sum, rating) => sum + rating.score, 0);
    const averageRating = totalScore / ratings.length;
  
    return {
      averageRating: parseFloat(averageRating.toFixed(2)), 
      totalRatings: ratings.length,
    };
  }
  
}
