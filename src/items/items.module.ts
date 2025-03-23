import { forwardRef, Module } from '@nestjs/common';
import { ItemsService } from './items.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Item, ItemSchema} from './items.schema';
import { ItemsController } from './items.controller';
import { categorySchema } from 'src/categories/categories.schema';
import { User, UserSchema } from 'src/users/users.schema';
import { EventsGateway } from 'src/gateways/events.gateway';
import { ChatsModule } from 'src/chats/chats.module';
import { RequestsModule } from 'src/requests/requests.module';
import { MessagesModule } from 'src/messages/messages.module';


@Module({

    imports: [
        MongooseModule.forFeature([
          { name: 'Item', schema: ItemSchema },
          { name: 'Category', schema: categorySchema },
          { name: User.name, schema: UserSchema },
        ]),
        forwardRef(() => ChatsModule), 
        forwardRef(() => RequestsModule),
        forwardRef(() => MessagesModule),
        forwardRef(() => RequestsModule)
      ],  
    providers: [ItemsService,EventsGateway],
    controllers: [ItemsController], 
})
export class ItemsModule {};

