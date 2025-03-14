import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Message } from './messages.schema';
import { Model, Types } from 'mongoose';
import { Chat } from 'src/chats/chats.schema';
import { CreateMessageDto } from './dtos/create-messages.dto';
import { UpdateMessageDto } from './dtos/update-messages.dto';

@Injectable()
export class MessagesService {
    constructor(    
        @InjectModel("Message") private readonly messageModel: Model<Message>,
        @InjectModel("Chat") private readonly chatModel: Model<Chat>
    ){}

    async create(createMessageDto: CreateMessageDto){
        const message = await new this.messageModel(createMessageDto);
        const newMessage = await message.save();
        const chat = await this.chatModel.findOne({participants:createMessageDto.sender, isActive: true}).exec();
        if(chat){
            chat.messages.push(newMessage._id as Types.ObjectId);
            await chat.save();
        }
        return newMessage;
    }

    async update(messageId: string, updateMessageDto: UpdateMessageDto){

        const updatedMessage = await this.messageModel.findByIdAndUpdate(messageId,updateMessageDto,{new:true}).exec();
        return updatedMessage;
    }


}
