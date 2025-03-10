import { Module } from '@nestjs/common';
import { ItemsService } from './items.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Item, ItemSchema} from './items.schema';
import { ItemsController } from './items.controller';
import { categorySchema } from 'src/categories/categories.schema';
import { User, UserSchema } from 'src/users/users.schema';


@Module({

    imports : [MongooseModule.forFeature([{name: "Item", schema: ItemSchema}, {name: "Category", schema: categorySchema}, {name: User.name, schema: UserSchema} ])],
    providers: [ItemsService],
    controllers: [ItemsController], 
})
export class ItemsModule {};

