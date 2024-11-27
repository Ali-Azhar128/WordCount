import { WebSocketGateway, WebSocketServer, SubscribeMessage, MessageBody } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*', // Adjust this to your frontend's URL
  }
})
export class NotificationGateway {
  @WebSocketServer()
  server: Server;

  @SubscribeMessage('join')
  handleJoin(client: Socket, userId: string) {
    client.join(userId);
    console.log(`User ${userId} joined their room`);
  }

  @SubscribeMessage('sendNotification')
  sendNotification( payload: { userId: string; message: string, id: string }) {
    const { userId, message, id } = payload;
    console.log('Paragraph flagged with id: ', id.toString())
    this.server.to(userId).emit('notification', {message, id});
  }
}