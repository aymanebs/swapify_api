import { Module } from '@nestjs/common';
import { ItemsService } from './items.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Item, ItemSchema} from './items.schema';
import { ItemsController } from './items.controller';


@Module({

    imports : [MongooseModule.forFeature([{name: "Item", schema: ItemSchema}])],
    providers: [ItemsService],
    controllers: [ItemsController], 
})
export class ItemsModule {};

