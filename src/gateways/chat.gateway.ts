import { Injectable } from '@nestjs/common';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import {
    WebSocketGateway,
    WebSocketServer,
    SubscribeMessage,
    MessageBody,
    ConnectedSocket,
  } from '@nestjs/websockets';
  import { Server, Socket } from 'socket.io';

  @Injectable()
  @WebSocketGateway({ cors: { origin: '*' } }) 
  export class ChatGateway {
    @WebSocketServer()
    server: Server;
  
    constructor(private readonly eventEmitter: EventEmitter2) {}

    @OnEvent('chat.created')
    handleChatCreated(chat) {
        console.log('⚡ Emitting event to:', chat.participants);
    
        chat.participants.forEach((participant) => {
            console.log(`🔵 Sending chat to participant: ${participant}`);
            this.server.to(participant.toString()).emit('chatCreated', chat);
        });
    
        console.log('⚡ Server rooms:', this.server.sockets.adapter.rooms);
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
  