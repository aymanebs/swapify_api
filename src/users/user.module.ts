import { Module } from '@nestjs/common';
import { UserService } from './users.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './users.schema';
import { UsersController } from './users.controller';

@Module({
  imports: [MongooseModule.forFeature([{name: User.name, schema: UserSchema}])],
  providers: [UserService],
  controllers: [UsersController],
  exports: [UserService],
})
export class UsersModule {}
