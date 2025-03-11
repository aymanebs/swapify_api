import { WebSocketGateway, WebSocketServer, SubscribeMessage, MessageBody, OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({ cors: true }) // Enables CORS for WebSocket server
export class RequestGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  
  @WebSocketServer() server: Server;  // WebSocket server instance
 userSockets: Map<string, string> = new Map(); // To store userId and their socket ID

  // Called when WebSocket server is initialized
  afterInit(server: Server) {
    console.log('WebSocket server initialized');
  }

  // Called when a client connects
  handleConnection(client: Socket) {
    console.log('Client connected:', client.id);

    // Listen for user identification (user sends their ID after connecting)
    client.on('identify', (userId: string) => {
      this.userSockets.set(userId, client.id);
      console.log(`User ${userId} connected with socket ID: ${client.id}`);
    });
  }

  // Called when a client disconnects
  handleDisconnect(client: Socket) {
    console.log('Client disconnected:', client.id);

    // Clean up userSockets when a client disconnects
    this.userSockets.forEach((value, key) => {
      if (value === client.id) {
        this.userSockets.delete(key);
        console.log(`User ${key} disconnected`);
      }
    });
  }

  // Handling trade request creation event
  handleTradeRequest(payload: any): void {
    console.log('📡 Processing trade request in gateway...', payload);

    const receiverSocketId = this.userSockets.get(payload.receiverId);
    if (receiverSocketId) {
      this.server.to(receiverSocketId).emit('tradeRequestCreated', {...payload, message: "You have got a new exchange request"});
    } else {
      console.log('⚠️ Receiver is offline. Consider storing the request for later.');
    }
  }

}
