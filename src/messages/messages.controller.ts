import { Body, Controller, Param, Patch, Post } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { CreateMessageDto } from './dtos/create-messages.dto';
import { UpdateMessageDto } from './dtos/update-messages.dto';

@Controller('messages')
export class MessagesController {

    constructor(private readonly messagesService: MessagesService){}

    @Post()
    async create(@Body() createMessageDto: CreateMessageDto){
        return this.messagesService.create(createMessageDto);
    }

    @Patch('/:id')
    async update(@Param('id') id: string, @Body() updateMessageDto: UpdateMessageDto ){
        return this.messagesService.update(id, updateMessageDto);
    }
}
