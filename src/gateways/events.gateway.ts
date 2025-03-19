// src/gateways/events.gateway.ts
import {
    WebSocketGateway,
    WebSocketServer,
    SubscribeMessage,
    MessageBody,
    ConnectedSocket,
    OnGatewayInit,
    OnGatewayConnection,
    OnGatewayDisconnect,
  } from '@nestjs/websockets';
  import { Server, Socket } from 'socket.io';
  import { Inject, forwardRef } from '@nestjs/common';
  import { RequestsService } from '../requests/requests.service';
  import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
  
  @WebSocketGateway({ cors: true })
  export class EventsGateway
    implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
  {
    @WebSocketServer() server: Server;
    userSockets: Map<string, string> = new Map(); // Maps userId to socketId
  
    constructor(
      @Inject(forwardRef(() => RequestsService)) private readonly requestsService: RequestsService,
      private readonly eventEmitter: EventEmitter2,
    ) {}
  
    // Called when WebSocket server is initialized
    afterInit(server: Server) {
      console.log('WebSocket server initialized');
    }
  
    // Called when a client connects
    handleConnection(client: Socket) {
      console.log('Client connected:', client.id);
  
      // Listen for user identification
      client.on('identify', async (userId: string) => {
        if (!userId) {
          console.log('⚠️ Identify event received without userId!');
          return;
        }
  
        // Remove old socket reference if it exists
        if (this.userSockets.has(userId)) {
          const oldSocketId = this.userSockets.get(userId);
          if (oldSocketId && oldSocketId !== client.id) {
            console.log(`⚠️ Removing old socket ID ${oldSocketId} for user ${userId}`);
            const oldSocket = this.server.sockets.sockets.get(oldSocketId);
            if (oldSocket) {
              oldSocket.disconnect(true);
            }
            this.userSockets.delete(userId);
          }
        }
  
        // Store new socket ID
        this.userSockets.set(userId, client.id);
        console.log(`✅ User ${userId} connected with socket ID: ${client.id}`);
  
        // Join user-specific room
        client.join(userId);
        console.log(`🏠 User ${userId} joined room: ${userId}`);
  
        // Send pending requests to the user
        const pendingRequests = await this.requestsService.getPendingRequests(userId);
        for (const request of pendingRequests) {
          this.server.to(client.id).emit('tradeRequestCreated', {
            ...request,
            message: 'You have a new exchange request',
          });
        }
      });
  
      // Listen for leaving all rooms
      client.on('leaveAllRooms', () => {
        console.log(`🚪 Removing user ${client.id} from all rooms`);
        for (const room of Array.from(client.rooms)) {
          if (room !== client.id) {
            client.leave(room);
          }
        }
      });
    }
  
    // Called when a client disconnects
    handleDisconnect(client: Socket) {
      console.log('Client disconnected:', client.id);
  
      // Remove user from userSockets map
      for (const [userId, socketId] of this.userSockets.entries()) {
        if (socketId === client.id) {
          this.userSockets.delete(userId);
          console.log(`🛑 User ${userId} removed from userSockets`);
          break;
        }
      }
    }
  
    // Handle trade request creation
    handleTradeRequest(payload: { senderId: string; receiverId: string }): void {
      const receiverSocketId = this.userSockets.get(payload.receiverId);
      if (receiverSocketId) {
        this.server.to(receiverSocketId).emit('tradeRequestCreated', {
          ...payload,
          message: 'You have a new exchange request',
        });
      }
    }
  
    // Handle chat creation
    @OnEvent('chat.created')
    handleChatCreated(chat: any) {
      console.log('⚡ Emitting chat creation event to participants:', chat.participants);
      chat.participants.forEach((participant: string) => {
        this.server.to(participant.toString()).emit('chatCreated', chat);
      });
    }
  
    // Handle joining a chat room
    @SubscribeMessage('joinChat')
    handleJoinChat(@MessageBody() chatId: string, @ConnectedSocket() client: Socket) {
      client.join(chatId);
      console.log(`🔵 User ${client.id} joined chat room: ${chatId}`);
    }
  
    // Handle sending a message
    @SubscribeMessage('sendMessage')
    async handleSendMessage(
      @MessageBody() data: { chatId: string; sender: string; content: string },
      @ConnectedSocket() client: Socket,
    ) {
      const { chatId, sender, content } = data;
      const message = { sender, content, timestamp: new Date() };
      this.server.to(chatId).emit('newMessage', message);
    }
  }