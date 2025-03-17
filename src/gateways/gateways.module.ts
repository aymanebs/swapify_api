import { Module } from '@nestjs/common';
import { MessagesModule } from 'src/messages/messages.module';
import { ChatGateway } from './chat.gateway';

@Module({
    imports: [MessagesModule],
    providers: [ChatGateway],
    exports: [ChatGateway]
})
export class GatewaysModule {}
