import { WebSocketGateway, WebSocketServer, SubscribeMessage, MessageBody } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { NotificationService } from './Notifications/notification.service.js';

@WebSocketGateway({
  cors: {
    origin: '*', 
  },
})
export class NotificationGateway {
  @WebSocketServer()
  server: Server;

  constructor(private readonly notificationService: NotificationService) {}

  @SubscribeMessage('join')
  async handleJoin(client: Socket, userId: string) {
    client.join(userId);
    console.log(`User ${userId} joined their room`);
    const notifications = await this.notificationService.getNotificationsForUser(userId);
    console.log(notifications, 'notifications')
    notifications.forEach(notification => {
      this.server.to(userId).emit('notification', {
        message: notification.message,
        id: notification.paragraphId
      })}
    )

    await this.notificationService.deleteNotificationsForUser(userId);
  }

  

  @SubscribeMessage('sendNotification')
  async sendNotification( payload: { userId: string; message: string, id: string }) {
    const { userId, message, id } = payload;
    console.log('Paragraph flagged with id: ', id.toString());

    const clients = this.server.sockets.adapter.rooms.get(userId);
    const isUserConnected = clients && clients.has(userId);
    console.log(clients, 'clients')
    console.log(isUserConnected, 'user connected');
    if(clients && clients.size > 1) {
      console.log('here')
      this.server.to(userId).emit('notification', {message, id});
    } else {
      console.log('there')
      await this.notificationService.createNotification(userId, message, id)
    }
      

   
  }
}