import { Module } from '@nestjs/common';
import { RequestsService } from './requests.service';
import { RequestsController } from './requests.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { RequestSchema } from './requests.schema';
import { UserSchema } from 'src/users/users.schema';
import { ItemSchema } from 'src/items/items.schema';

@Module({
  imports: [MongooseModule.forFeature([{name: "Request", schema: RequestSchema}, {name: "User", schema: UserSchema}, {name: " Item", schema: ItemSchema}])],
  controllers: [RequestsController],
  providers: [RequestsService],
})
export class RequestsModule {}
