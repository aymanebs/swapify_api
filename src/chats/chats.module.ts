import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ChatSchema } from './chats.schema';
import { UserSchema } from 'src/users/users.schema';
import { RequestSchema } from 'src/requests/requests.schema';
import { ChatsService } from './chats.service';
import { ChatsController } from './chats.controller';
import { MessageSchema } from 'src/messages/messages.schema';

@Module({
    imports : [MongooseModule.forFeature([{name: "Chat", schema: ChatSchema}, {name: "User", schema: UserSchema}, {name: "Request", schema: RequestSchema}, {name: "Message", schema: MessageSchema}])],
    providers: [ChatsService],
    controllers: [ChatsController],
})
export class ChatsModule {}
