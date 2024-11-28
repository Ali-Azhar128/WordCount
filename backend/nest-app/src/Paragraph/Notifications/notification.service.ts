import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Notification, NotificationDocument } from './notification.schema.js';

@Injectable()
export class NotificationService {
  constructor(
    @InjectModel(Notification.name) private notificationModel: Model<NotificationDocument>
  ) {}

  async createNotification(userId: string, message: string, paragraphId: string): Promise<Notification> {
    const notification = new this.notificationModel({ userId, message, paragraphId });
    return notification.save();
  }

  async getNotificationsForUser(userId: string): Promise<Notification[]> {
    return this.notificationModel.find({ userId }).exec();
  }

  async deleteNotificationsForUser(userId: string): Promise<void> {
    await this.notificationModel.deleteMany({ userId }).exec();
  }
}