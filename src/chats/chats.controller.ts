import { Body, Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { ChatsService } from './chats.service';
import { CreateChatDto } from './dtos/create-chat.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('chats')
export class ChatsController {
    constructor(private readonly chatService: ChatsService){}

    @Post()
    async create(@Body() createChatDto: CreateChatDto){
        return await this.chatService.create(createChatDto);
    }

   
    @Get('/user') 
    @UseGuards(JwtAuthGuard)
    async getUserChats(@Req() req) {
      console.log('Received request for /chats/user');
      const userId = req.user.userId;
      console.log('User ID from token:', userId);
      return await this.chatService.getChatsForUser(userId);
    }

    @Get('/:id')
    async getChatById(@Param('id') id: string){

        return await this.chatService.getChatById(id);
    }
}
