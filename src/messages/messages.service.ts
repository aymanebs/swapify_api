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

    async create(createMessageDto: CreateMessageDto) {
        console.log('... messages are about to be created');
        const message = new this.messageModel(createMessageDto);
        const newMessage = await message.save();
        console.log('the message sender: ', createMessageDto.sender);
    
        const chat = await this.chatModel.findById(createMessageDto.chatId).exec();
        console.log('Is the corresponding chat found?: ', chat);
    
        if (chat) {
          console.log('saving the messages inside the chat');
          chat.messages.push(new Types.ObjectId(newMessage._id.toString())); 
          await chat.save();
        }
    
        return newMessage;
      }

    async update(messageId: string, updateMessageDto: UpdateMessageDto){

        const updatedMessage = await this.messageModel.findByIdAndUpdate(messageId,updateMessageDto,{new:true}).exec();
        return updatedMessage;
    }


}
