import { Module } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { MessagesController } from './messages.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { MessageSchema } from './messages.schema';
import { UserSchema } from 'src/users/users.schema';

@Module({
  imports: [MongooseModule.forFeature([{name: "Message", schema: MessageSchema}, {name: "User", schema: UserSchema}])],
  providers: [MessagesService],
  controllers: [MessagesController]
})
export class MessagesModule {}
