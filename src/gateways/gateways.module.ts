import { forwardRef, Module } from '@nestjs/common';
import { MessagesModule } from 'src/messages/messages.module';
import { EventsGateway } from './events.gateway';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { RequestsModule } from 'src/requests/requests.module';

@Module({
    imports: [MessagesModule, EventEmitter2, forwardRef(() => RequestsModule)],
    providers: [EventsGateway],
    exports: [EventsGateway]
})
export class GatewaysModule {}
