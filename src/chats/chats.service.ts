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
      
        const query = { participants: userId,isActive: true,  };
     
      
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
          ])
          .exec();
         
        return chats;
      }
    

    async getChatById(chatId){
        const chat = await this.chatModel.findById(chatId).populate({path: 'messages',select: 'content'}).exec();
        if(!chat){
            throw new NotFoundException('Chat not found!');
        }
        return chat;
    }

    async getChatsByItemId(itemId: string) {
      const chats = await this.chatModel.find({ requests: { $in: [itemId] } }).exec();
      return chats;
  }

}
