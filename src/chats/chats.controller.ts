import { Body, Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { ChatsService } from './chats.service';
import { CreateChatDto } from './dtos/create-chat.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('chats')
export class ChatsController {
    constructor(private readonly chatSerive: ChatsService){}

    @Post()
    async create(@Body() createChatDto: CreateChatDto){

        return await this.chatSerive.create(createChatDto);
    }

   
    @Get('/me')
    @UseGuards(JwtAuthGuard)
    async getByParticipantId( @Req() req ){
        const id = req.user.userId;
        console.log("ùùùù id", id);
        return await this.chatSerive.getChatByParticipantId(id);
    }

    @Get('/:id')
    async getChatById(@Param('id') id: string){

        return await this.chatSerive.getChatById(id);
    }
}
