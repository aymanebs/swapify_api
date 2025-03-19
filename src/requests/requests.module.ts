import { forwardRef, Module } from '@nestjs/common';
import { RequestsService } from './requests.service';
import { RequestsController } from './requests.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { RequestSchema } from './requests.schema';
import { UserSchema } from 'src/users/users.schema';
import { ItemSchema } from 'src/items/items.schema';
import { ChatSchema } from 'src/chats/chats.schema';
import { EventsGateway } from 'src/gateways/events.gateway';
import { GatewaysModule } from 'src/gateways/gateways.module';

@Module({
  imports: [MongooseModule.forFeature([{name: "Request", schema: RequestSchema}, {name: "User", schema: UserSchema}, {name: "Item", schema: ItemSchema}, {name: "Chat", schema: ChatSchema}, {name: "Item", schema: ItemSchema}]),  forwardRef(() => GatewaysModule),],
  controllers: [RequestsController],
  providers: [RequestsService],
  exports: [RequestsService],
})
export class RequestsModule {}
