import { Body, Controller, Param, Patch, Post } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { CreateMessageDto } from './dtos/create-messages.dto';
import { UpdateMessageDto } from './dtos/update-messages.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiParam } from '@nestjs/swagger';

@ApiTags('messages')
@Controller('messages')
export class MessagesController {

    constructor(private readonly messagesService: MessagesService){}

    @Post()
    @ApiOperation({ summary: 'Create a new message' })
    @ApiBody({ type: CreateMessageDto })
    @ApiResponse({ status: 201, description: 'Message created successfully.' })  
    async create(@Body() createMessageDto: CreateMessageDto){
        return this.messagesService.create(createMessageDto);
    }

    @Patch('/:id')
    @ApiOperation({ summary: 'Update a message' })
    @ApiParam({ name: 'id', description: 'Message ID' })
    @ApiBody({ type: UpdateMessageDto })
    @ApiResponse({ status: 200, description: 'Message updated successfully.' })
    async update(@Param('id') id: string, @Body() updateMessageDto: UpdateMessageDto ){
        return this.messagesService.update(id, updateMessageDto);
    }
}
