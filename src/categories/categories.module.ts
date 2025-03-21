import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { categorySchema } from './categories.schema';
import { CategoriesService } from './categories.service';
import { CategoriesController } from './categories.controller';

@Module({
    imports: [MongooseModule.forFeature([{name: "Category", schema: categorySchema}])],
    providers: [CategoriesService],
    controllers: [CategoriesController],
})
export class CategoriesModule {}
