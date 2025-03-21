import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { RatingService } from './rating.service';
import { CreateRatingDto } from './dtos/create-rating.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiBearerAuth, ApiParam } from '@nestjs/swagger';

@ApiTags('ratings')
@Controller('ratings')
export class RatingController {
  constructor(private readonly ratingService: RatingService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new rating' })
  @ApiBody({ type: CreateRatingDto })
  @ApiResponse({ status: 201, description: 'Rating created successfully.' })
  create(@Body() createRatingDto: CreateRatingDto, @Req() req) {
    const userId = req.user.userId;
    return this.ratingService.create({...createRatingDto, raterUser: userId});
  }

  @Get()
  @ApiOperation({ summary: 'Get all ratings' })
  @ApiResponse({ status: 200, description: 'Returns a list of ratings.' })
  findAll() {
    return this.ratingService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a rating by ID' })
  @ApiParam({ name: 'id', description: 'Rating ID' })
  @ApiResponse({ status: 200, description: 'Returns the rating.' })
  findOne(@Param('id') id: string) {
    return this.ratingService.findOne(id);
  }

  @Get('user/:userId/average')
  @ApiOperation({ summary: 'Get average rating for a user' })
  @ApiParam({ name: 'userId', description: 'User ID' })
  @ApiResponse({ status: 200, description: 'Returns the average rating.' })
    getUserAverageRating(@Param('userId') userId: string) {
    return this.ratingService.getUserAverageRating(userId);
  }

}

