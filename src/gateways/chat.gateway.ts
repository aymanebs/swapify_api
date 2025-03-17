import { OnEvent } from '@nestjs/event-emitter';
import {
    WebSocketGateway,
    WebSocketServer,
    SubscribeMessage,
    MessageBody,
    ConnectedSocket,
  } from '@nestjs/websockets';
  import { Server, Socket } from 'socket.io';

  
  @WebSocketGateway({ cors: { origin: '*' } }) 
  export class ChatGateway {
    @WebSocketServer()
    server: Server;
  
    constructor() {}

    @OnEvent('chat.created')
    handleChatCreated(chat) {
      // Notify both participants about the new chat
      chat.participants.forEach((participant) => {
        this.server.to(participant.toString()).emit('chatCreated', chat);
      });
    }
  
    // @SubscribeMessage('sendMessage')
    // async handleMessage(
    //   @MessageBody() createMessageDto: CreateMessageDto,
    //   @ConnectedSocket() client: Socket,
    // ) {
    //   const message = await this.messagesService.create(createMessageDto);
    //   this.server.to(createMessageDto.receiver.toString()).emit('newMessage', message);
    //   return message;
    // }
  
    @SubscribeMessage('joinChat')
    handleJoinChat(@MessageBody() chatId: string, @ConnectedSocket() client: Socket) {
      client.join(chatId);
    }
  }
  