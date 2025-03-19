import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './users.schema';
import { CreateUserDto } from './dtos/create-user.dto';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UserService {

    constructor(@InjectModel(User.name) private readonly userModel: Model<User>){}

    async findByEmail(email: string): Promise<User | null>{
        return this.userModel.findOne({email}).exec();
    }

    async createUser(createUserDto: CreateUserDto): Promise<User>{
        await this.checkEmailUnique(createUserDto.email);
        const hashedPassword = await bcrypt.hash(createUserDto.password,10);
        const user = new this.userModel({...createUserDto,password:hashedPassword});
        return await user.save();
    }

    async checkEmailUnique(email: string){
        const user = await this.findByEmail(email);
        if(user){
            throw new UnauthorizedException('Email already registred');
        }
    }

    async findAll(): Promise<Omit<User, 'password'>[]> {

        const users = await this.userModel.find({ email: { $not: /@admin\.com$/i } }).lean().exec();
        return users.map(({ password, ...user }) => user);
    }
    
}
