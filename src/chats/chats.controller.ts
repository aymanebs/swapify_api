import { Body, Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { ChatsService } from './chats.service';
import { CreateChatDto } from './dtos/create-chat.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiBearerAuth, ApiParam } from '@nestjs/swagger';

@ApiTags('chats')
@Controller('chats')
export class ChatsController {
    constructor(private readonly chatService: ChatsService){}

    @Post()
    @ApiOperation({ summary: 'Create a new chat' })
    @ApiBody({ type: CreateChatDto })
    @ApiResponse({ status: 201, description: 'Chat created successfully.' })
    async create(@Body() createChatDto: CreateChatDto){
        return await this.chatService.create(createChatDto);
    }

    @Get('/user') 
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Get chats for the logged-in user' })
    @ApiResponse({ status: 200, description: 'Returns a list of chats.' })
    async getUserChats(@Req() req) {
      console.log('Received request for /chats/user');
      const userId = req.user.userId;
      console.log('User ID from token:', userId);
      return await this.chatService.getChatsForUser(userId);
    }

    @Get('/:id')
    @ApiOperation({ summary: 'Get a chat by ID' })
    @ApiParam({ name: 'id', description: 'Chat ID' })
    @ApiResponse({ status: 200, description: 'Returns the chat.' })
    async getChatById(@Param('id') id: string){
        return await this.chatService.getChatById(id);
    }
}
