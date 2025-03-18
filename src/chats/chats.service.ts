import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { Chat } from './chats.schema';
import { CreateChatDto } from './dtos/create-chat.dto';

@Injectable()
export class ChatsService {
    constructor(@InjectModel("Chat") private readonly chatModel: Model<Chat>){}

    async create(createChatDto: CreateChatDto){
        
        const chat = await new this.chatModel({...createChatDto});
        return chat.save();
    }

    async getChatByParticipantId(participantId){

        const id = new mongoose.Types.ObjectId(participantId);
        const chat = await this.chatModel.find({participants: participantId }).populate([
            {
                path: 'participants',
                select: 'first_name last_name avatar'
            },
            {
                path: 'messages',
                select: 'content'
            },
            {
                path: 'request',
                select: 'itemRequested itemOffered'
            }
        ]).exec();

        return chat;
    } 

    async getChatById(chatId){
        const chat = await this.chatModel.findById(chatId).exec();
        if(!chat){
            throw new NotFoundException('Chat not found!');
        }
        return chat;
    }

}
