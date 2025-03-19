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

    async getChatsForUser(userId: string) {
        console.log('Querying chats for user ID:', userId);
      
        // Match the user ID as a string
        const query = { participants: userId };
        console.log('Query:', query);
      
        const chats = await this.chatModel
          .find(query)
          .populate([
            {
              path: 'participants',
              select: 'first_name last_name avatar',
            },
            {
              path: 'messages',
              select: 'content',
            },
            {
              path: 'request',
              select: 'itemRequested itemOffered',
            },
          ])
          .exec();
      
        console.log('Found chats:', chats);
        console.log('Number of chats found:', chats.length);
      
        // Log the raw data from the database (without population)
        const rawChats = await this.chatModel.find(query).lean().exec();
        console.log('Raw chats from database:', rawChats);
      
        return chats;
      }
    

    async getChatById(chatId){
        const chat = await this.chatModel.findById(chatId).exec();
        if(!chat){
            throw new NotFoundException('Chat not found!');
        }
        return chat;
    }

}
