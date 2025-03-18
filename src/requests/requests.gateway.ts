import { WebSocketGateway, WebSocketServer, SubscribeMessage, MessageBody, OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { RequestsService } from './requests.service';
import { forwardRef, Inject } from '@nestjs/common';

@WebSocketGateway({ cors: true }) // Enables CORS for WebSocket server
export class RequestGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {

  constructor(@Inject(forwardRef(() => RequestsService))
  private readonly requestsService: RequestsService) { }

  @WebSocketServer() server: Server;  // WebSocket server instance
  userSockets: Map<string, string> = new Map(); // To store userId and their socket ID

  // Called when WebSocket server is initialized
  afterInit(server: Server) {
    console.log('WebSocket server initialized');
  }

// Called when a client connects
handleConnection(client: Socket) {
  console.log('Client connected:', client.id);

  client.on('leaveAllRooms', () => {
      console.log(`🚪 Removing user ${client.id} from all rooms`);
      for (const room of Array.from(client.rooms)) {
          if (room !== client.id) {
              client.leave(room);
          }
      }
  });

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

      // Leave all old rooms except the user-specific room
      for (const room of Array.from(client.rooms)) {
          if (room !== client.id) {
              client.leave(room);
          }
      }

      // Ensure user joins their own room
      client.join(userId);
      console.log(`🏠 User ${userId} joined room: ${userId}`);

      // Emit room update
      this.server.to(client.id).emit('updatedRooms', Array.from(client.rooms));
      client.emit('roomJoined', userId);

      // Send pending requests
      const pendingRequests = await this.requestsService.getPendingRequests(userId);
      for (const request of pendingRequests) {
          this.server.to(client.id).emit('tradeRequestCreated', {
              ...request,
              message: "You have got a new exchange request",
          });
      }

      console.log('🔵 Current rooms:', Array.from(this.server.sockets.adapter.rooms.keys()));
  });
}

// Called when a client disconnects
handleDisconnect(client: Socket) {
  console.log('Client disconnected:', client.id);

  for (const [userId, socketId] of this.userSockets.entries()) {
      if (socketId === client.id) {
          this.userSockets.delete(userId);
          console.log(`🛑 User ${userId} removed from userSockets`);
          break;
      }
  }

  // Leave all rooms safely
  for (const room of Array.from(client.rooms)) {
      if (room !== client.id) {
          client.leave(room);
      }
  }

  console.log('🟡 Active sockets:', this.userSockets);
}



  // Handling trade request creation event
  handleTradeRequest(payload: any): void {
    console.log('📡 Processing trade request in gateway...', payload);
    console.log('this.userSockets: ', this.userSockets);
    console.log('receiver id', payload.receiverId);
    console.log('!!!!!!!!! receiver id', this.userSockets.get(payload.receiverId));

    const receiverSocketId = this.userSockets.get(payload.receiverId);
    if (receiverSocketId) {
      this.server.to(receiverSocketId).emit('tradeRequestCreated', { ...payload, message: "You have got a new exchange request" });
    }
  }

}
