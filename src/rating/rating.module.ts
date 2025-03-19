import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RatingSchema } from './rating.schema';
import { RatingService } from './rating.service';
import { RatingController } from './rating.controller';

@Module({
    imports:[MongooseModule.forFeature([{name: "Rating", schema: RatingSchema}])],
    providers: [RatingService],
    controllers: [RatingController]
})
export class RatingModule {}
